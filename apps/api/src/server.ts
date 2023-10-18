import { app } from "@/app.js";
import { APP_HOST, APP_PORT } from "@/envs.js";

try {
  await app.listen({ port: APP_PORT, host: APP_HOST });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
