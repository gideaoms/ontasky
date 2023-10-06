import "dotenv/config";
import { z } from "zod";

export const APP_NODE_ENV = z
  .enum(["development", "test", "production"])
  .parse(process.env.APP_NODE_ENV);
export const APP_PORT = z.coerce.number().parse(process.env.APP_PORT);
export const APP_HOST = z.string().optional().parse(process.env.APP_HOST);
export const APP_TOKEN_SECRET = z.string().parse(process.env.APP_TOKEN_SECRET);
export const DATABASE_URL = z.string().parse(process.env.DATABASE_URL);
export const MAIL_HOST = z.string().parse(process.env.MAIL_HOST);
export const MAIL_PORT = z.coerce.number().parse(process.env.MAIL_PORT);
export const MAIL_USER = z.string().parse(process.env.MAIL_USER);
export const MAIL_PASS = z.string().parse(process.env.MAIL_PASS);
export const WEB_URL = z.string().parse(process.env.WEB_URL);
