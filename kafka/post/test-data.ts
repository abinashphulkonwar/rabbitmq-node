import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import { User } from "./User";
import { Folowing } from "./Folowing";
import { Post } from "./Post";
import { handler } from "./user-feed";
import { Buffer } from "buffer";

const connect = async () => {
  await mongoose.connect("mongodb://localhost:27017/user-feed");
};

const createUsers = async () => {
  for (let i = 0; i < 100; i++) {
    const user = User.build({
      Prefrence: [faker.lorem.word(), faker.lorem.word()],
      feed: [],
    });
    await user.save();
  }
};

const buildConnection = async () => {
  const users = await User.find({}).skip(100);
  for (let i = 0; i < 1; i++) {
    for (let user of users) {
      const folowingDb = Folowing.build({
        from: user.id,
        to: "6495621c395577a2ede16e81",
      });

      await folowingDb.save();
    }
  }
};

const createPosts = async () => {
  const id = "6495621c395577a2ede16e5d";
  const Postdb = Post.build({
    tags: [faker.lorem.word(), faker.lorem.word()],
    userId: id,
    tagged: ["6495621c395577a2ede16e81", "6495621c395577a2ede16e61"],
  });
  await Postdb.save();
  return Postdb;
};

const setUp = async () => {
  console.log("connecting");
  await connect();
  console.log("connected");

  const Postdb = await createPosts();
  console.time("handler");
  await handler({
    topic: "user-feed",
    partition: 0,
    message: {
      value: Buffer.from(
        JSON.stringify({
          userId: Postdb.userId,
          postId: Postdb.id,
        })
      ),
    },
  });
  console.timeEnd("handler");
  await mongoose.disconnect();
};

setUp();
