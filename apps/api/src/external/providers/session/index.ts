import { TeamModel, UserModel } from "@/core/models/index.js";
import { SessionProvider, TokenProvider } from "@/core/providers/index.js";
import { UserRepository } from "@/core/repositories/index.js";
import { db } from "@/libs/knex.js";

export class Provider implements SessionProvider.Provider {
  constructor(
    private readonly tokenProvider: TokenProvider.Provider,
    private readonly userRepository: UserRepository.Repository
  ) {}

  async findOne(authorization: string, teamId?: string) {
    const [, token] = authorization.split(" ");
    if (!token) {
      return null;
    }
    const userId = this.tokenProvider.verify(token);
    if (!userId) {
      return null;
    }
    if (teamId) {
      const [row] = await db
        .select("users.*", "users_on_teams.role")
        .from("users")
        .where("users.id", userId)
        .limit(1)
        .innerJoin("users_on_teams", (query) => {
          query
            .on("users_on_teams.user_id", "=", "users.id")
            .andOn("users_on_teams.team_id", "=", db.raw("?", [teamId]));
        });
      if (!row) {
        return null;
      }
      const team = TeamModel.build({
        id: teamId,
      });
      return UserModel.build({
        id: row.id,
        email: row.email,
        team,
      });
    }
    const user = await this.userRepository.findById(userId);
    if (!user) {
      return null;
    }
    return UserModel.build({ ...user, token });
  }
}
