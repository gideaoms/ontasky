import "dotenv/config";
import { z } from "zod";

export const APP_NODE_ENV = z
  .enum(["development", "test", "production"])
  .parse(process.env.APP_NODE_ENV);
export const APP_PORT = z.coerce.number().parse(process.env.APP_PORT);
export const APP_HOST = z.string().optional().parse(process.env.APP_HOST);
export const APP_TOKEN_SECRET = z.string().parse(process.env.APP_TOKEN_SECRET);
export const MAIL_KEY = z.string().parse(process.env.MAIL_KEY);
export const WEB_URL = z.string().parse(process.env.WEB_URL);
export const DB_HOST = z.string().parse(process.env.DB_HOST);
export const DB_PORT = z.coerce.number().parse(process.env.DB_PORT);
export const DB_USER = z.string().parse(process.env.DB_USER);
export const DB_PASS = z.string().parse(process.env.DB_PASS);
export const DB_NAME = z.string().parse(process.env.DB_NAME);
