import mongoose from "mongoose";

const Schema = mongoose.Schema;

interface UserAttrs {
  Prefrence: string[];
  feed: [];
}

interface UserModule extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

interface UserDoc extends mongoose.Document {
  Prefrence: string[];
  feed: [];
}

const UserScheam = new Schema(
  {
    Prefrence: [String],
    feed: [],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
        ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

UserScheam.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModule>("User", UserScheam);

export { User };
