import { TaskObject } from "@/internal/objects";

export type Query = {
  findMany(
    teamId: string,
    userId: string,
    by: "owner" | "approver"
  ): Promise<TaskObject.Object[]>;
};
