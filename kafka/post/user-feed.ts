import { Post } from "./Post";
import { User } from "./User";
import { Folowing } from "./Folowing";
import mongoose, { Types } from "mongoose";
import { writeFileSync } from "fs";

export const handler = async ({
  topic,
  partition,
  message,
}: {
  topic: string;
  partition: number;
  message: any;
}) => {
  const body = message?.value?.toString();

  if (!body) return;

  const data = JSON.parse(body) as unknown as {
    userId: string;
    postId: string;
  };

  if (!data) return;

  const post = await Post.findById(data.postId);

  if (!post) return;
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 15);
  const users = await Folowing.aggregate([
    {
      $match: {
        to: new mongoose.Types.ObjectId(data.userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "from",
        foreignField: "_id",
        as: "user",
        let: { updatedAt: "$updatedAt" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $gt: ["$$updatedAt", currentDate] }],
              },
            },
          },
        ],
      },
    },
  ]);

  // console.log(JSON.stringify(users), "users");

  const followHasMap = new Map<string, number>();

  const userIds: any[] = [];

  users.forEach((val) => {
    const user = val.user[0];
    followHasMap.set(user._id.toString(), 1);
    userIds.push(user._id);
  });

  await User.updateMany(
    {
      _id: {
        $in: userIds,
      },
    },
    {
      $push: {
        feed: {
          $each: [new mongoose.Types.ObjectId(data.postId)],
          $position: 0,
        },
      },
    }
  );

  const taggedUsers = post?.tagged;

  if (!taggedUsers.length) return;
  // 6495621c395577a2ede16ea9
  const otherUsers = await Folowing.aggregate([
    {
      $match: {
        to: {
          $in: taggedUsers,
        },
      },
    },
    {
      $match: {
        from: {
          $nin: [new mongoose.Types.ObjectId(data.userId)],
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "from",
        foreignField: "_id",
        as: "user",
        let: { updatedAt: "$updatedAt" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $gt: ["$$updatedAt", currentDate] }],
              },
            },
          },
        ],
      },
    },
  ]);

  console.log(otherUsers.length, "otherUsers");

  writeFileSync("./follow.json", JSON.stringify(otherUsers));

  const taggedUserIds: any[] = [];

  otherUsers.forEach((val) => {
    const _id = val.from;
    if (_id) {
      const isFollow = followHasMap.get(_id.toString());
      if (!isFollow) taggedUserIds.push(_id);
    }
  });
  console.log(taggedUserIds.length, "taggedUserIds");
  await User.updateMany(
    {
      _id: {
        $in: taggedUserIds,
      },
    },
    {
      $push: {
        feed: {
          $each: [new mongoose.Types.ObjectId(data.postId)],
          $position: 0,
        },
      },
    }
  );
};
