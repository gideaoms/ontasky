// src/app.ts
import { Logger } from "@adonisjs/logger";
import { Profiler } from "@adonisjs/profiler";
import { Emitter } from "@adonisjs/events/build/src/Emitter";
import { Database } from "@adonisjs/lucid/build/src/Database";
var appRoot = "/home/gideaoms/Projects/ontasky/apps/api";
var database = {
  connection: "sqlite",
  connections: {
    sqlite: {
      client: "sqlite",
      connection: {
        filename: "./db.sqlite"
      },
      useNullAsDefault: true,
      healthCheck: false,
      debug: false
    }
  }
};
var logger = new Logger({
  name: "app-name",
  enabled: true,
  level: "info",
  prettyPrint: true
});
var profiler = new Profiler(appRoot, logger, {
  enabled: true,
  blacklist: [],
  whitelist: []
});
var emitter = new Emitter();
var database2 = new Database(database, logger, profiler, emitter);
var app_default = database2;
export {
  app_default as default
};
