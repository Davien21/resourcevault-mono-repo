import mongoose, { Schema, model, type InferSchemaType, type Model } from "mongoose";

const tagSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true }
);

export type TagDocument = InferSchemaType<typeof tagSchema> & { _id: string };

export const Tag: Model<TagDocument> =
  (mongoose.models.Tag as Model<TagDocument>) ||
  model<TagDocument>("Tag", tagSchema);
