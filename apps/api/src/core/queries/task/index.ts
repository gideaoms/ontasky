import { TaskObject } from "@/core/objects";

export type Query = {
  findMany(teamId: string, userId: string): Promise<TaskObject.Object[]>;
  findOne(
    taskId: string,
    teamId: string,
    userId: string
  ): Promise<TaskObject.Object | null>;
};
