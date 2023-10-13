import { UserObject } from "@/core/objects";

export type Query = {
  findMany(teamId: string, userId: string): Promise<UserObject.Object[]>;
};
