import { UnauthorizedError } from "@/core/errors/index.js";
import { TeamModel } from "@/core/models/index.js";
import { SessionProvider } from "@/core/providers/index.js";

export class UseCase {
  constructor(private readonly sessionProvider: SessionProvider.Provider) {}

  async exec(authorization: string, teamId: string) {
    const currentUser = await this.sessionProvider.findOne(
      authorization,
      teamId
    );
    if (!currentUser) {
      return new UnauthorizedError.Error();
    }
    const team = currentUser.team ?? TeamModel.empty();
    return TeamModel.json({
      id: team.id,
      name: team.name,
      role: team.role,
    });
  }
}
