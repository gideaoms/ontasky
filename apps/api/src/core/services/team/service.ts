import { Providers, Queries, Errors } from "@/core/module";

export class Service {
  constructor(
    private readonly sessionProvider: Providers.Session.Provider,
    private readonly teamQuery: Queries.Team.Query
  ) {}

  async index(authorization: string) {
    const user = await this.sessionProvider.findOne(authorization);
    if (!user) {
      return new Errors.Unauthorized.Error();
    }
    return this.teamQuery.findMany(user.id);
  }
}
