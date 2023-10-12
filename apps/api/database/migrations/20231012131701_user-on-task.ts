import { Knex } from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("users_on_tasks", (table) => {
    table.uuid("id").primary();
    table.uuid("user_id").references("id").inTable("users").notNullable();
    table.uuid("task_id").references("id").inTable("tasks").notNullable();
    table.text("description");
    table.enum("status", ["awaiting", "approved", "disapproved"]).notNullable();
    table.timestamp("answered_at");
    table.timestamp("created_at").notNullable();
    table.timestamp("updated_at");
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("users_on_tasks");
}
