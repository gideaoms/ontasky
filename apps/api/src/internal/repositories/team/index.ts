import { RoleModel, TeamModel, UserModel } from "@/internal/models";

export type Repository = {
  create(
    team: TeamModel.Model,
    user: UserModel.Model,
    role: RoleModel.Model
  ): Promise<TeamModel.Model>;
  findById(teamId: string): Promise<TeamModel.Model | null>;
  update(team: TeamModel.Model): Promise<TeamModel.Model>;
};
