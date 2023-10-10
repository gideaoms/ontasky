import { TeamModel, UserModel } from "@/core/models";

export type Repository = {
  create(
    team: TeamModel.Model,
    user: UserModel.Model
  ): Promise<TeamModel.Model>;
  findById(teamId: string, userId: string): Promise<TeamModel.Model | null>;
};
