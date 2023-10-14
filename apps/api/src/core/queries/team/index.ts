import { TeamModel } from "@/core/models";

export type Query = {
  findMany(userId: string): Promise<TeamModel.Json[]>;
};
