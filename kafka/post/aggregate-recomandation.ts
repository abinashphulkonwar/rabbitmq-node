import mongoose from "mongoose";
import { Like } from "./like";
import { Folowing } from "./Folowing";
import { User } from "./User";
import { Post } from "./Post";

const onAggregateRecomandation = async ({
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
    lastTimeStemp: Date;
  };
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 30);
  const followers = await Folowing.aggregate([
    {
      $match: {
        to: new mongoose.Types.ObjectId(data.userId),
      },
    },
  ]);

  const followHasMap = new Map<string, number>();

  for (let follower of followers) {
    followHasMap.set(follower.from.toString(), 0);
  }

  const recentLikes = await Like.aggregate([
    {
      $match: {
        $and: [
          {
            userId: new mongoose.Types.ObjectId(data.userId),
          },
          {
            createdAt: {
              $gte: currentDate,
            },
          },
        ],
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
    {
      $unset: ["_id", "__v", "createdAt", "updatedAt", "postId", "userId"],
    },
    {
      $limit: 1500,
    },
  ]);

  const userToFetchData: string[] = [];
  for (let like of recentLikes) {
    if (!followHasMap.has(like.authorId.toString())) {
      userToFetchData.push(like.authorId.toString());
    }
  }

  const Posts = await Post.aggregate([
    {
      $match: {
        $and: [
          {
            userId: {
              $in: userToFetchData,
            },
          },
          {
            createdAt: {
              $gte: new Date(data.lastTimeStemp),
            },
          },
        ],
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);
};
