import { NotFoundError, UnauthorizedError } from "@/internal/errors";
import { RoleModel, TeamModel } from "@/internal/models";
import { TeamObject } from "@/internal/objects";
import { SessionOnTeamProvider, SessionProvider } from "@/internal/providers";
import { TeamQuery } from "@/internal/queries";
import { TeamRepository } from "@/internal/repositories";

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
    const team = TeamModel.build({
      name,
    });
    const role = RoleModel.build({ name: "admin" });
    const createdTeam = await this.teamRepository.create(team, user, role);
    return TeamObject.build({
      id: createdTeam.id,
      name: createdTeam.name,
    });
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
    return TeamObject.build({
      id: team.id,
      name: team.name,
    });
  }

  async update(authorization: string, teamId: string, name: string) {
    const role = RoleModel.build({ name: "admin" });
    const user = await this.sessionOnTeamProvider.findOne(
      authorization,
      teamId,
      role
    );
    if (!user) {
      return new UnauthorizedError.Error();
    }
    const team = await this.teamRepository.findById(teamId);
    if (!team) {
      return new NotFoundError.Error("Team not found.");
    }
    const teamToUpdate = TeamModel.build({
      id: team.id,
      name,
    });
    const updatedTeam = await this.teamRepository.update(teamToUpdate);
    return TeamObject.build({
      id: updatedTeam.id,
      name: updatedTeam.name,
    });
  }
}
