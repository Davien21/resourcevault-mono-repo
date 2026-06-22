import mongoose, { Schema, model, type InferSchemaType, type Model } from "mongoose";
import { USER_ROLES } from "@resourcevault/types";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: USER_ROLES, default: "member", index: true },
    title: { type: String, trim: true },
    bio: { type: String, trim: true },
    avatarUrl: { type: String },
    organisation: { type: String, trim: true },
    isVerified: { type: Boolean, default: false },
    lastActiveAt: { type: Date },
  },
  { timestamps: true }
);

export type UserDocument = InferSchemaType<typeof userSchema> & { _id: string };

export const User: Model<UserDocument> =
  (mongoose.models.User as Model<UserDocument>) ||
  model<UserDocument>("User", userSchema);
