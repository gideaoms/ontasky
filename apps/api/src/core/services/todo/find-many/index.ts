import { UnauthorizedError } from "@/core/errors/index.js";
import { SessionOnTeamProvider } from "@/core/providers/index.js";
import { TodoQuery } from "@/core/queries/index.js";

export class Service {
  constructor(
    private readonly sessionOnTeamProvider: SessionOnTeamProvider.Provider,
    private readonly todoQuery: TodoQuery.Query
  ) {}

  async exec(authorization: string, teamId: string) {
    const user = await this.sessionOnTeamProvider.findOne(
      authorization,
      teamId
    );
    if (!user) {
      return new UnauthorizedError.Error();
    }
    return this.todoQuery.findMany(teamId, user.id);
  }
}
