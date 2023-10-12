import { AnswerModel, TaskModel } from "@/internal/models";

export type Repository = {
  create(
    task: TaskModel.Model,
    answers: AnswerModel.Model[]
  ): Promise<TaskModel.Model>;
};
