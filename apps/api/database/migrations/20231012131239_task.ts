import { Knex } from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("tasks", (table) => {
    table.uuid("id").primary();
    table.uuid("owner_id").references("id").inTable("users").notNullable();
    table.uuid("team_id").references("id").inTable("teams").notNullable();
    table.string("title").notNullable();
    table.text("description").notNullable();
    table.enum("status", ["awaiting", "approved", "disapproved"]).notNullable();
    table.timestamp("created_at").notNullable();
    table.timestamp("updated_at");
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("tasks");
}
