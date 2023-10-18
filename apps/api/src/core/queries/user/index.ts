import { UserObject } from "@/core/objects/index.js";

export type Query = {
  findMany(teamId: string, userId: string): Promise<UserObject.Object[]>;
};
