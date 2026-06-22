import bcrypt from "bcryptjs";
import { User } from "@resourcevault/db";
import { avatarSeedUrl } from "../../lib/avatar.ts";
import { BadRequestError, UnauthorizedError } from "../../config/errors.ts";
import { signToken } from "../../lib/jwt.ts";
import { toPublicUser } from "../../lib/serialize.ts";
import type { LoginInput, RegisterInput } from "./auth.validators.ts";

export async function registerUser(input: RegisterInput) {
  const email = input.email.toLowerCase().trim();
  const existing = await User.findOne({ email }).lean();
  if (existing) {
    throw new BadRequestError("An account with that email already exists", {
      email: ["This email is already registered"],
    });
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const user = await User.create({
    name: input.name.trim(),
    email,
    passwordHash,
    role: "member",
    organisation: input.organisation?.trim(),
    avatarUrl: avatarSeedUrl(input.name),
    // Email verification is stubbed for the demo — accounts are usable immediately.
    isVerified: true,
  });

  const token = signToken({ sub: String(user._id), role: user.role, email });
  return { user: toPublicUser(user), token };
}

export async function loginUser(input: LoginInput) {
  const email = input.email.toLowerCase().trim();
  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user) throw new UnauthorizedError("Email or password is incorrect");

  const ok = await bcrypt.compare(input.password, user.passwordHash);
  if (!ok) throw new UnauthorizedError("Email or password is incorrect");

  user.lastActiveAt = new Date();
  await user.save();

  const token = signToken({ sub: String(user._id), role: user.role, email });
  return { user: toPublicUser(user), token };
}

export async function getMe(userId: string) {
  const user = await User.findById(userId).lean();
  if (!user) throw new UnauthorizedError();
  return toPublicUser(user);
}
