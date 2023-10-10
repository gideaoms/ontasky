import { UserModel } from "@/core/models";
import { SessionOnTeamProvider, TokenProvider } from "@/core/providers";
import { db } from "@/libs/knex";

export class Provider implements SessionOnTeamProvider.Provider {
  constructor(private readonly tokenProvider: TokenProvider.Provider) {}

  async findOne(authorization: string, teamId: string) {
    const [, token] = authorization.split(" ");
    if (!token) {
      return null;
    }
    const userId = this.tokenProvider.verify(token);
    if (!userId) {
      return null;
    }
    const [row] = await db
      .select(["users.*", "users_on_teams.role"])
      .from("users")
      .innerJoin("users_on_teams", (query) => {
        query
          .on("users_on_teams.user_id", "=", "users.id")
          .andOn("users_on_teams.team_id", "=", db.raw("?", [teamId]));
      });
    if (!row) {
      return null;
    }
    return UserModel.build({
      id: row.id,
      email: row.email,
      role: row.role,
    });
  }
}
