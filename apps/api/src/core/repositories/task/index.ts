import { AnswerModel, TaskModel } from "@/core/models";

export type Repository = {
  create(
    task: TaskModel.Model,
    answers: AnswerModel.Model[]
  ): Promise<TaskModel.Model>;
  findById(taskId: string): Promise<TaskModel.Model | null>;
  update(
    task: TaskModel.Model,
    addedAnswers: AnswerModel.Model[],
    removedAnswers: AnswerModel.Model[]
  ): Promise<TaskModel.Model>;
};
