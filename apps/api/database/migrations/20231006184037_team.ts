import { Knex } from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("teams", (table) => {
    table.uuid("id").primary();
    table.string("name").notNullable();
    table.timestamp("created_at").notNullable();
    table.timestamp("updated_at");
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("teams");
}
