import { UserObject } from "@/internal/objects";

export type Query = {
  findMany(teamId: string, userId: string): Promise<UserObject.Object[]>;
};
