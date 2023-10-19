import { TeamModel, UserModel } from "@/core/models/index.js";

export type Repository = {
  findByPk(userId: string, teamId: string): Promise<UserModel.Model | null>;
  create(
    user: UserModel.Model,
    team: TeamModel.Model
  ): Promise<UserModel.Model>;
};
