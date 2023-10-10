import { TeamModel, UserModel } from "@/core/models";
import { UserOnTeamRepository } from "@/core/repositories";
import { db } from "@/libs/knex";
import crypto from "node:crypto";

export class Repository implements UserOnTeamRepository.Repository {
  async userOnTeamExists(userId: string, teamId: string) {
    const [row] = await db
      .from("users_on_teams")
      .where("user_id", userId)
      .andWhere("team_id", teamId);
    if (!row) {
      return false;
    }
    return true;
  }

  async create(user: UserModel.Model, team: TeamModel.Model) {
    await db
      .insert({
        id: crypto.randomUUID(),
        user_id: user.id,
        team_id: team.id,
        role: user.role,
        created_at: new Date(),
      })
      .into("users_on_teams");
  }
}
