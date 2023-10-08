import { UserModel } from "@/core/models";

export type Repository = {
  findById(userId: string): Promise<UserModel.Model | null>;
  findByEmail(email: string): Promise<UserModel.Model | null>;
};
