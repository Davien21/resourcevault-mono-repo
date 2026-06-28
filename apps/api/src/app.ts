import "express-async-errors";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";

import { env, STORAGE_DIR } from "./config/env.ts";
import routes from "./config/routes.ts";
import { attachUser } from "./middlewares/auth.ts";
import { errorMiddleware } from "./middlewares/error.ts";
import { NotFoundError } from "./config/errors.ts";

export function createApp() {
  const app = express();

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );

  const allowedOrigins = [
    ...env.CLIENT_URL.split(",").map((o) => o.trim()),
    "http://localhost:3000",
  ].filter(Boolean);
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) callback(null, true);
        else if (env.NODE_ENV !== "production") callback(null, true);
        else callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
    })
  );

  app.use(compression());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  if (env.NODE_ENV !== "test") app.use(morgan("dev"));

  app.use(attachUser);

  // Static downloads (generated sample PDFs)
  app.use(
    "/files",
    express.static(STORAGE_DIR, {
      setHeaders: (res) => {
        res.setHeader("Cache-Control", "public, max-age=3600");
      },
    })
  );

  app.get("/health", (_req, res) => res.json({ status: "ok" }));
  app.get("/api/v1/health", (_req, res) => res.json({ status: "ok" }));
  app.use("/api/v1", routes);

  app.use((_req: Request, _res: Response, next: NextFunction) => {
    next(new NotFoundError("That endpoint does not exist"));
  });
  app.use(errorMiddleware);

  return app;
}
