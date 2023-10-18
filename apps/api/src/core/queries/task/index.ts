import { TaskModel } from "@/core/models/index.js";

export type Query = {
  findMany(teamId: string, userId: string): Promise<TaskModel.Json[]>;
  findOne(
    taskId: string,
    teamId: string,
    userId: string
  ): Promise<TaskModel.Json | null>;
};
