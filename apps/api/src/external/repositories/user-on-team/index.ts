import { RoleModel, TeamModel, UserModel } from "@/internal/models";
import { UserOnTeamRepository } from "@/internal/repositories";
import { db } from "@/libs/knex";
import crypto from "node:crypto";

export class Repository implements UserOnTeamRepository.Repository {
  async findByPk(userId: string, teamId: string) {
    const [row] = await db
      .from("users_on_teams")
      .where("user_id", userId)
      .andWhere("team_id", teamId);
    if (!row) {
      return false;
    }
    return true;
  }

  async create(
    user: UserModel.Model,
    team: TeamModel.Model,
    role: RoleModel.Model
  ) {
    await db
      .insert({
        id: crypto.randomUUID(),
        user_id: user.id,
        team_id: team.id,
        role,
        created_at: new Date(),
      })
      .into("users_on_teams");
  }
}
