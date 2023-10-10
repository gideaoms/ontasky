import { Knex } from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("users_on_teams", (table) => {
    table.uuid("id").primary();
    table.uuid("user_id").references("id").inTable("users").notNullable();
    table.uuid("team_id").references("id").inTable("teams").notNullable();
    table.enum("role", ["common", "admin"]).notNullable();
    table.timestamp("created_at").notNullable();
    table.timestamp("updated_at");
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("users_on_teams");
}
