import { UserModel } from "@/core/models/index.js";

export type Repository = {
  findById(userId: string): Promise<UserModel.Model | null>;
  findByEmail(email: string): Promise<UserModel.Model | null>;
  create(user: UserModel.Model): Promise<UserModel.Model>;
  update(user: UserModel.Model): Promise<UserModel.Model>;
  findOne(user: UserModel.Model): Promise<UserModel.Model | null>;
  joinTeam(user: UserModel.Model): Promise<UserModel.Model>;
};
