import { TeamModel } from "@/core/models";
import { TeamQuery } from "@/core/queries";
import { db } from "@/libs/knex";

export class Query implements TeamQuery.Query {
  async findMany(userId: string) {
    const rows = await db
      .select("teams.id", "teams.name", "users_on_teams.role")
      .from("teams")
      .innerJoin("users_on_teams", function (query) {
        query
          .on("users_on_teams.team_id", "=", "teams.id")
          .andOn("users_on_teams.user_id", "=", db.raw("?", [userId]));
      });
    return rows.map((row) =>
      TeamModel.json({
        id: row.id,
        name: row.name,
        role: row.role,
      })
    );
  }
}
