import { UserModel, TeamModel } from "@/core/models";
import { TeamRepository } from "@/core/repositories";
import { db } from "@/libs/knex";
import crypto from "node:crypto";

export class Repository implements TeamRepository.Repository {
  create(team: TeamModel.Model, user: UserModel.Model) {
    return db.transaction(async (trx) => {
      const [createdTeam] = await trx
        .insert({
          id: crypto.randomUUID(),
          name: team.name,
          created_at: new Date(),
        })
        .into("teams")
        .returning("*");
      await trx
        .insert({
          id: crypto.randomUUID(),
          user_id: user.id,
          team_id: createdTeam.id,
          role: user.role,
          created_at: new Date(),
        })
        .into("users_on_teams");
      return TeamModel.build({
        id: createdTeam.id,
        name: createdTeam.name,
      });
    });
  }

  async findById(teamId: string, userId: string) {
    const [row] = await db
      .select("teams.*")
      .from("teams")
      .innerJoin("users_on_teams", (query) => {
        query
          .on("users_on_teams.team_id", "=", "teams.id")
          .andOn("users_on_teams.user_id", "=", db.raw("?", [userId]))
          .andOn("users_on_teams.team_id", "=", db.raw("?", [teamId]));
      });
    if (!row) {
      return null;
    }
    return TeamModel.build({
      id: row.id,
      name: row.name,
    });
  }

  async update(team: TeamModel.Model) {
    const [row] = await db
      .table("teams")
      .update({ name: team.name, updated_at: new Date() })
      .where("id", team.id)
      .returning("*");
    return TeamModel.build({
      id: row.id,
      name: row.name,
    });
  }
}
