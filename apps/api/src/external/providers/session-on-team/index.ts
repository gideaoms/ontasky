import { RoleModel, UserModel } from "@/core/models/index.js";
import {
  SessionOnTeamProvider,
  TokenProvider,
} from "@/core/providers/index.js";
import { db } from "@/libs/knex.js";

export class Provider implements SessionOnTeamProvider.Provider {
  constructor(private readonly tokenProvider: TokenProvider.Provider) {}

  async findOne(authorization: string, teamId: string, role?: RoleModel.Model) {
    const [, token] = authorization.split(" ");
    if (!token) {
      return null;
    }
    const userId = this.tokenProvider.verify(token);
    if (!userId) {
      return null;
    }
    const [row] = await db
      .select("users.*", "users_on_teams.role")
      .from("users")
      .where("users.id", userId)
      .limit(1)
      .innerJoin("users_on_teams", (query) => {
        query
          .on("users_on_teams.user_id", "=", "users.id")
          .andOn("users_on_teams.team_id", "=", db.raw("?", [teamId]));
        if (role && !RoleModel.isCommon(role)) {
          query.andOn("users_on_teams.role", "=", db.raw("?", [role]));
        }
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
