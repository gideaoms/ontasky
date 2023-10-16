import { NotFoundError, UnauthorizedError } from "@/core/errors";
import { RoleModel, TeamModel } from "@/core/models";
import { SessionOnTeamProvider, SessionProvider } from "@/core/providers";
import { TeamQuery } from "@/core/queries";
import { TeamRepository } from "@/core/repositories";

export class Service {
  constructor(
    private readonly sessionProvider: SessionProvider.Provider,
    private readonly teamQuery: TeamQuery.Query,
    private readonly teamRepository: TeamRepository.Repository,
    private readonly sessionOnTeamProvider: SessionOnTeamProvider.Provider
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
    const team1 = TeamModel.build({ name });
    const role = RoleModel.build("admin");
    const team2 = await this.teamRepository.create(team1, user, role);
    return TeamModel.json({ id: team2.id, name: team2.name });
  }

  async show(authorization: string, teamId: string) {
    const user = await this.sessionOnTeamProvider.findOne(
      authorization,
      teamId
    );
    if (!user) {
      return new UnauthorizedError.Error();
    }
    const team = await this.teamRepository.findById(teamId);
    if (!team) {
      return new NotFoundError.Error("Team not found.");
    }
    return TeamModel.json({ id: team.id, name: team.name });
  }

  async update(authorization: string, teamId: string, name: string) {
    const role = RoleModel.build("admin");
    const user = await this.sessionOnTeamProvider.findOne(
      authorization,
      teamId,
      role
    );
    if (!user) {
      return new UnauthorizedError.Error();
    }
    const team1 = await this.teamRepository.findById(teamId);
    if (!team1) {
      return new NotFoundError.Error("Team not found.");
    }
    const team2 = TeamModel.build({ id: team1.id, name });
    const team3 = await this.teamRepository.update(team2);
    return TeamModel.json({ id: team3.id, name: team3.name });
  }
}
