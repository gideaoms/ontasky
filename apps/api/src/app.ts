import "@total-typescript/ts-reset";
import { APP_NODE_ENV } from "@/envs";
import { db } from "@/libs/knex";
import autoload from "@fastify/autoload";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import fastify from "fastify";
import path from "node:path";
import url from "node:url";

await db.raw("select 1");

const dirname = path.dirname(url.fileURLToPath(import.meta.url));

export const app = fastify({
  logger: APP_NODE_ENV === "development",
});

app.register(helmet);
app.register(cors);
app.register(autoload, {
  dir: path.join(dirname, "external", "controllers"),
  options: { prefix: "/v1" },
  dirNameRoutePrefix: false,
  forceESM: true,
});
