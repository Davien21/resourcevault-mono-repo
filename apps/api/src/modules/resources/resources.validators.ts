import { z } from "zod";
import { RESOURCE_TYPES } from "@resourcevault/types";

export const listQuerySchema = z.object({
  q: z.string().trim().max(120).optional(),
  category: z.string().trim().optional(),
  type: z.enum(RESOURCE_TYPES).optional(),
  tag: z.string().trim().optional(),
  status: z.enum(["draft", "pending", "published", "archived"]).optional(),
  sort: z.enum(["recent", "popular", "title", "featured"]).optional(),
  featured: z
    .union([z.literal("true"), z.literal("false")])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
  mine: z
    .union([z.literal("true"), z.literal("false")])
    .optional()
    .transform((v) => v === "true"),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
});

export const createResourceSchema = z.object({
  title: z.string().trim().min(4, "Give your resource a clear title").max(140),
  summary: z.string().trim().min(20, "Write a short summary").max(280),
  description: z.string().trim().min(40, "Add a fuller description"),
  type: z.enum(RESOURCE_TYPES),
  categoryId: z.string().trim().min(1, "Choose a category"),
  tags: z.array(z.string().trim().min(1)).max(8).default([]),
  version: z.string().trim().max(12).optional(),
  coverImageUrl: z.string().trim().optional(),
});

export const updateResourceSchema = createResourceSchema.partial();

export const reviewSchema = z.object({
  decision: z.enum(["approve", "reject"]),
  note: z.string().trim().max(500).optional(),
});

export type CreateResourceInput = z.infer<typeof createResourceSchema>;
export type UpdateResourceInput = z.infer<typeof updateResourceSchema>;
