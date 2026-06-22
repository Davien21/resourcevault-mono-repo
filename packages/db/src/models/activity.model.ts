import mongoose, { Schema, model, Types, type InferSchemaType, type Model } from "mongoose";

const activitySchema = new Schema(
  {
    type: { type: String, required: true },
    actor: { type: String, required: true },
    actorId: { type: Types.ObjectId, ref: "User" },
    target: { type: String },
    resourceId: { type: Types.ObjectId, ref: "Resource" },
  },
  { timestamps: true }
);

export type ActivityDocument = InferSchemaType<typeof activitySchema> & {
  _id: string;
};

export const Activity: Model<ActivityDocument> =
  (mongoose.models.Activity as Model<ActivityDocument>) ||
  model<ActivityDocument>("Activity", activitySchema);
