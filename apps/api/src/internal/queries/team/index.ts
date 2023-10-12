import { TeamObject, UserObject } from "@/internal/objects";

export type Query = {
  findMany(
    userId: string
  ): Promise<(TeamObject.Object & { user: UserObject.Object })[]>;
};
