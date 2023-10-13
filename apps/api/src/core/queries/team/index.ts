import { TeamObject } from "@/core/objects";

export type Query = {
  findMany(userId: string): Promise<TeamObject.Object[]>;
};
