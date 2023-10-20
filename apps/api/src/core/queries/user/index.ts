import { UserModel } from "@/core/models/index.js";

export type Query = {
  findMany(teamId: string, userId: string): Promise<UserModel.Json[]>;
};
