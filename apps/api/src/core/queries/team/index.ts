import { TeamObject, RoleObject } from "@/core/objects";

export type Query = {
  findMany(
    userId: string
  ): Promise<(TeamObject.Object & { role: RoleObject.Object })[]>;
};
