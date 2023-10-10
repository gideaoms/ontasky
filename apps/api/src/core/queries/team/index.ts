import { TeamObject, UserObject } from "@/core/objects";

export type Query = {
  findMany(
    userId: string
  ): Promise<(TeamObject.Object & { user: UserObject.Object })[]>;
};
