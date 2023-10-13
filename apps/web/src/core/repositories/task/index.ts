import { TaskModel, UserModel } from "@/core/models";

export type Repository = {
  findMany(teamId: string): Promise<TaskModel.Model[] | Error>;
  findById(taskId: string, teamId: string): Promise<TaskModel.Model | Error>;
  create(
    task: TaskModel.Model,
    approvers: UserModel.Model[]
  ): Promise<TaskModel.Model | Error>;
  update(
    task: TaskModel.Model,
    approvers: UserModel.Model[]
  ): Promise<TaskModel.Model | Error>;
};
