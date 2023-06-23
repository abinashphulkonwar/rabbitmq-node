import mongoose from "mongoose";

const Schema = mongoose.Schema;

interface Attrs {
  userId: string;
  postId: string;
  authorId: string;
}

interface UserModule extends mongoose.Model<Doc> {
  build(attrs: Attrs): Doc;
}

interface Doc extends mongoose.Document {
  userId: string;
  postId: string;
  authorId: string;
}

const Scheam = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
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

Scheam.statics.build = (attrs: Attrs) => {
  return new Like(attrs);
};

const Like = mongoose.model<Doc, UserModule>("Like", Scheam);

export { Like };
