import { UserModel } from "@/core/models/index.js";
import { Model } from "@/core/models/team/index.js";
import { UserOnTeamRepository } from "@/core/repositories/index.js";
import { db } from "@/libs/knex.js";
import crypto from "node:crypto";

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

  async create(user: UserModel.Model, team: Model) {
    await db
      .insert({
        id: crypto.randomUUID(),
        user_id: user.id,
        team_id: team.id,
        role: "common",
        created_at: new Date(),
      })
      .into("users_on_teams");
    const [row] = await db.from("users").where("id", user.id);
    return UserModel.build({
      id: row.id,
      email: row.email,
    });
  }
}
