import mongoose, { Schema, model, type InferSchemaType, type Model } from "mongoose";

const categorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    icon: { type: String, default: "folder" },
    color: { type: String, default: "#6366f1" },
    coverImageUrl: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type CategoryDocument = InferSchemaType<typeof categorySchema> & {
  _id: string;
};

export const Category: Model<CategoryDocument> =
  (mongoose.models.Category as Model<CategoryDocument>) ||
  model<CategoryDocument>("Category", categorySchema);
