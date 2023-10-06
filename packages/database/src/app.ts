import { Logger } from "@adonisjs/logger";
import { Profiler } from "@adonisjs/profiler";
import { Emitter } from "@adonisjs/events/build/src/Emitter";
import { Database } from "@adonisjs/lucid/build/src/Database";
import type { DatabaseConfig } from "@ioc:Adonis/Lucid/Database";

const appRoot = "/home/gideaoms/Projects/ontasky/apps/api";
const database: DatabaseConfig = {
  connection: "sqlite",
  connections: {
    sqlite: {
      client: "sqlite",
      connection: {
        filename: "./db.sqlite",
      },
      useNullAsDefault: true,
      healthCheck: false,
      debug: false,
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
