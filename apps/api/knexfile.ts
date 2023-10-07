import { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER } from "@/envs";
import type { Knex } from "knex";

export default {
  client: "pg",
  connection: {
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
  },
  migrations: {
    tableName: "knex_migrations",
    extension: "ts",
    directory: "database/migrations",
  },
} satisfies Knex.Config;
