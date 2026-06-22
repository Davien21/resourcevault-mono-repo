import type { Request, Response } from "express";
import { asyncHandler } from "../../lib/http.ts";
import * as service from "./resources.service.ts";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.listResources(req.query as any, req.user);
  res.json(result);
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const resource = await service.getResourceBySlug(req.params.slug, req.user);
  res.json({ resource });
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const resource = await service.createResource(req.body, req.user!);
  res.status(201).json({ resource });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const resource = await service.updateResource(
    req.params.slug,
    req.body,
    req.user!
  );
  res.json({ resource });
});

export const submit = asyncHandler(async (req: Request, res: Response) => {
  const resource = await service.submitForReview(req.params.slug, req.user!);
  res.json({ resource });
});

export const review = asyncHandler(async (req: Request, res: Response) => {
  const resource = await service.reviewResource(
    req.params.slug,
    req.body.decision,
    req.body.note,
    req.user!
  );
  res.json({ resource });
});

export const archive = asyncHandler(async (req: Request, res: Response) => {
  const resource = await service.archiveResource(req.params.slug, req.user!);
  res.json({ resource });
});

export const download = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.registerDownload(req.params.slug, req.user);
  res.json(result);
});
