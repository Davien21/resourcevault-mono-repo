import { Router } from "express";
import authRouter from "../modules/auth/auth.router.ts";
import resourcesRouter from "../modules/resources/resources.router.ts";
import categoriesRouter from "../modules/categories/categories.router.ts";
import tagsRouter from "../modules/tags/tags.router.ts";
import bookmarksRouter from "../modules/bookmarks/bookmarks.router.ts";
import usersRouter from "../modules/users/users.router.ts";
import adminRouter from "../modules/admin/admin.router.ts";
import metaRouter from "../modules/meta/meta.router.ts";

const routes = Router();

routes.use("/auth", authRouter);
routes.use("/resources", resourcesRouter);
routes.use("/categories", categoriesRouter);
routes.use("/tags", tagsRouter);
routes.use("/bookmarks", bookmarksRouter);
routes.use("/users", usersRouter);
routes.use("/admin", adminRouter);
routes.use("/meta", metaRouter);

export default routes;
