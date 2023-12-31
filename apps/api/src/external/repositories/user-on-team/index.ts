import { UserModel } from "@/core/models/index.js";
import { UserOnTeamRepository } from "@/core/repositories/index.js";
import { db } from "@/libs/knex.js";

export class Repository implements UserOnTeamRepository.Repository {
  async findByPk(userId: string, teamId: string) {
    const [row] = await db
      .select("users.*")
      .from("users_on_teams")
      .where("user_id", userId)
      .andWhere("team_id", teamId)
      .innerJoin("users", (query) => {
        query.on("users.id", "=", "users_on_teams.user_id");
      });
    if (!row) {
      return null;
    }
    return UserModel.build({
      id: row.id,
      email: row.email,
    });
  }
}
