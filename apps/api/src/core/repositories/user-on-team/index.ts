import { UserModel } from "@/core/models";

export type Repository = {
  findByPk(userId: string, teamId: string): Promise<UserModel.Model | null>;
};
