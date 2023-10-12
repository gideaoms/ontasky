import { TeamObject, UserObject } from "@/internal/objects";
import { TeamQuery } from "@/internal/queries";
import { db } from "@/libs/knex";

export class Query implements TeamQuery.Query {
  async findMany(userId: string) {
    const result = await db
      .select("teams.id", "teams.name", "users_on_teams.role")
      .from("teams")
      .innerJoin("users_on_teams", function (query) {
        query
          .on("users_on_teams.team_id", "=", "teams.id")
          .andOn("users_on_teams.user_id", "=", db.raw("?", [userId]));
      });
    return result.map((row) => ({
      ...TeamObject.build({
        id: row.id,
        name: row.name,
      }),
      user: UserObject.build({
        role: row.role,
      }),
    }));
  }
}
