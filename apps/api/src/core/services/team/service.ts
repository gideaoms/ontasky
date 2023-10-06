import { UnauthorizedError } from "@/core/errors/module";
import { Providers, Queries } from "@/core/module";

export class Service {
  constructor(
    private readonly sessionProvider: Providers.Session.Provider,
    private readonly teamQuery: Queries.Team.Query
  ) {}

  async index(authorization: string) {
    const user = await this.sessionProvider.findOne(authorization);
    if (!user) {
      return new UnauthorizedError.Error();
    }
    return this.teamQuery.findMany(user.id);
  }
}
