import { UserModel } from "@/core/models";

export type Repository = {
  create(email: string, password: string): Promise<UserModel.Model | Error>;
  findOne(token: string): Promise<UserModel.Model | Error>;
};
