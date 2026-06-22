import mongoose, { Schema, model, Types, type InferSchemaType, type Model } from "mongoose";
import { RESOURCE_STATUSES, RESOURCE_TYPES } from "@resourcevault/types";

const assetSchema = new Schema(
  {
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, default: "application/pdf" },
    fileSize: { type: Number, default: 0 },
  },
  { _id: false }
);

const resourceSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    summary: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: RESOURCE_TYPES, required: true, index: true },
    status: {
      type: String,
      enum: RESOURCE_STATUSES,
      default: "draft",
      index: true,
    },
    category: { type: Types.ObjectId, ref: "Category", required: true, index: true },
    tags: { type: [String], default: [], index: true },
    coverImageUrl: { type: String, required: true },
    version: { type: String, default: "1.0" },
    owner: { type: Types.ObjectId, ref: "User", required: true, index: true },
    asset: { type: assetSchema },
    isFeatured: { type: Boolean, default: false, index: true },
    downloadCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    readTimeMinutes: { type: Number, default: 5 },
    reviewNote: { type: String },
    reviewedBy: { type: Types.ObjectId, ref: "User" },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

resourceSchema.index({ title: "text", summary: "text", description: "text" });

export type ResourceDocument = InferSchemaType<typeof resourceSchema> & {
  _id: string;
};

export const Resource: Model<ResourceDocument> =
  (mongoose.models.Resource as Model<ResourceDocument>) ||
  model<ResourceDocument>("Resource", resourceSchema);
