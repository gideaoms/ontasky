import { TeamModel, UserModel } from "@/core/models";

export type Repository = {
  create(
    team: TeamModel.Model,
    user: UserModel.Model
  ): Promise<TeamModel.Model>;
  findById(teamId: string): Promise<TeamModel.Model | null>;
  update(team: TeamModel.Model): Promise<TeamModel.Model>;
};
