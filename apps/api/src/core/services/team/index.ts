import { NotFoundError, UnauthorizedError } from "@/core/errors";
import { TeamModel, UserModel } from "@/core/models";
import { TeamObject } from "@/core/objects";
import { SessionProvider } from "@/core/providers";
import { TeamQuery } from "@/core/queries";
import { TeamRepository } from "@/core/repositories";

export class Service {
  constructor(
    private readonly sessionProvider: SessionProvider.Provider,
    private readonly teamQuery: TeamQuery.Query,
    private readonly teamRepository: TeamRepository.Repository
  ) {}

  async index(authorization: string) {
    const user = await this.sessionProvider.findOne(authorization);
    if (!user) {
      return new UnauthorizedError.Error();
    }
    return this.teamQuery.findMany(user.id);
  }

  async create(authorization: string, name: string) {
    const user = await this.sessionProvider.findOne(authorization);
    if (!user) {
      return new UnauthorizedError.Error();
    }
    const team = TeamModel.build({
      name,
    });
    const admin = UserModel.build({
      id: user.id,
      role: "admin",
    });
    const createdTeam = await this.teamRepository.create(team, admin);
    return TeamObject.build({
      id: createdTeam.id,
      name: createdTeam.name,
    });
  }

  async show(authorization: string, teamId: string) {
    const user = await this.sessionProvider.findOne(authorization);
    if (!user) {
      return new UnauthorizedError.Error();
    }
    const team = await this.teamRepository.findById(teamId, user.id);
    if (!team) {
      return new NotFoundError.Error("Team not found.");
    }
    return TeamObject.build({
      id: team.id,
      name: team.name,
    });
  }
}