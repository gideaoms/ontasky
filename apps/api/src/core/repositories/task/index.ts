import { TodoModel, TaskModel } from "@/core/models";

export type Repository = {
  create(
    task: TaskModel.Model,
    answers: TodoModel.Model[]
  ): Promise<TaskModel.Model>;
  findById(taskId: string): Promise<TaskModel.Model | null>;
  update(
    task: TaskModel.Model,
    addedAnswers: TodoModel.Model[],
    removedAnswers: TodoModel.Model[]
  ): Promise<TaskModel.Model>;
};
