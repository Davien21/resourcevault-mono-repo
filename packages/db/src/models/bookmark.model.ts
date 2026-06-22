import mongoose, { Schema, model, Types, type InferSchemaType, type Model } from "mongoose";

const bookmarkSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true, index: true },
    resource: { type: Types.ObjectId, ref: "Resource", required: true, index: true },
  },
  { timestamps: true }
);

bookmarkSchema.index({ user: 1, resource: 1 }, { unique: true });

export type BookmarkDocument = InferSchemaType<typeof bookmarkSchema> & {
  _id: string;
};

export const Bookmark: Model<BookmarkDocument> =
  (mongoose.models.Bookmark as Model<BookmarkDocument>) ||
  model<BookmarkDocument>("Bookmark", bookmarkSchema);
