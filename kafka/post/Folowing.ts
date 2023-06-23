import mongoose from "mongoose";

const Schema = mongoose.Schema;

interface UserAttrs {
  from: string;
  to: string;
}

interface UserModule extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

interface UserDoc extends mongoose.Document {
  form: string;
  to: string;
}

const UserScheam = new Schema(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    to: {
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

UserScheam.statics.build = (attrs: UserAttrs) => {
  return new Folowing(attrs);
};

const Folowing = mongoose.model<UserDoc, UserModule>("folowing", UserScheam);

export { Folowing };
