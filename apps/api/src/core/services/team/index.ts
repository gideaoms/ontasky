import { UnauthorizedError } from "@/core/errors";
import { SessionProvider } from "@/core/providers";
import { TeamQuery } from "@/core/queries";

export class Service {
  constructor(
    private readonly sessionProvider: SessionProvider.Provider,
    private readonly teamQuery: TeamQuery.Query
  ) {}

  async index(authorization: string) {
    const user = await this.sessionProvider.findOne(authorization);
    if (!user) {
      return new UnauthorizedError.Error();
    }
    return this.teamQuery.findMany(user.id);
  }
}
