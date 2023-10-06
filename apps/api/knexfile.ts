import type { Knex } from "knex";

export default {
  client: "sqlite",
  connection: {
    filename: "./db.sqlite",
  },
  useNullAsDefault: true,
  migrations: {
    tableName: "knex_migrations",
    extension: "ts",
    directory: "database/migrations",
  },
} satisfies Knex.Config;
