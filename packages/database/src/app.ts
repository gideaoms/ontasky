import path from "node:path";
import { Logger } from "@adonisjs/logger";
import { Profiler } from "@adonisjs/profiler";
import { Emitter } from "@adonisjs/events/build/src/Emitter";
import { Database } from "@adonisjs/lucid/build/src/Database";
import type { DatabaseConfig } from "@ioc:Adonis/Lucid/Database";

const appRoot = "/home/gideaoms/Projects/ontasky/apps/api";
const { default: knexfile } = await import(path.join(appRoot, "knexfile.ts"));
const database: DatabaseConfig = {
  connection: knexfile.client,
  connections: {
    [knexfile.client]: {
      client: knexfile.client,
      healthCheck: false,
      debug: false,
      connection: knexfile.connection,
    },
  },
};
const logger = new Logger({
  name: "app-name",
  enabled: true,
  level: "info",
  prettyPrint: true,
});
const profiler = new Profiler(appRoot, logger, {
  enabled: true,
  blacklist: [],
  whitelist: [],
});
const emitter = new Emitter();

const database2 = new Database(database, logger, profiler, emitter);

export default database2;
