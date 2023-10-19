import { TeamModel, UserModel } from "@/core/models";

export type Repository = {
  create(email: string, password: string): Promise<UserModel.Model | Error>;
  activate(
    email: string,
    validationCode: string
  ): Promise<UserModel.Model | Error>;
  findMany(teamId: string): Promise<UserModel.Model[]>;
  joinTeam(user: UserModel.Model): Promise<UserModel.Model | Error>;
  findTeam(user: UserModel.Model): Promise<TeamModel.Model | Error>;
};
