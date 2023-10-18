import { RoleModel, TeamModel, UserModel } from "@/core/models/index.js";

export type Repository = {
  create(
    team: TeamModel.Model,
    user: UserModel.Model,
    role: RoleModel.Model
  ): Promise<TeamModel.Model>;
  findById(teamId: string): Promise<TeamModel.Model | null>;
  update(team: TeamModel.Model): Promise<TeamModel.Model>;
};
