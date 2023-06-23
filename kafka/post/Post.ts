import mongoose from "mongoose";

const Schema = mongoose.Schema;

interface Attrs {
  tags: string[];
  tagged: string[];
  userId: string;
}

interface UserModule extends mongoose.Model<Doc> {
  build(attrs: Attrs): Doc;
}

interface Doc extends mongoose.Document {
  tags: string[];
  tagged: string[];
  userId: string;
}

const Scheam = new Schema(
  {
    tags: [String],
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    tagged: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
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
  return new Post(attrs);
};

const Post = mongoose.model<Doc, UserModule>("Post", Scheam);

export { Post };
