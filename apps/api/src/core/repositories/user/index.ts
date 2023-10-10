import { TeamModel, UserModel } from "@/core/models";

export type Repository = {
  findById(userId: string): Promise<UserModel.Model | null>;
  findByEmail(email: string): Promise<UserModel.Model | null>;
  create(
    user: UserModel.Model,
    team?: TeamModel.Model
  ): Promise<UserModel.Model>;
  update(user: UserModel.Model): Promise<UserModel.Model>;
};
