import { TeamModel } from "@/core/models/index.js";

export type Query = {
  findMany(userId: string): Promise<TeamModel.Json[]>;
};
