import { Knex } from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("users", (table) => {
    table.uuid("id").primary();
    table.string("email").unique().notNullable();
    table.string("password");
    table.boolean("is_email_activated").notNullable();
    table.string("validation_code");
    table.timestamp("created_at");
    table.timestamp("updated_at");
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("users");
}
