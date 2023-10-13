import { UserModel } from "@/core/models";

export type Repository = {
  create(email: string, password: string): Promise<UserModel.Model | Error>;
  activate(
    email: string,
    validationCode: string
  ): Promise<UserModel.Model | Error>;
  findMany(teamId: string): Promise<UserModel.Model[]>;
};
