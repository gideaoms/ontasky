import { AnswerModel } from "@/core/models/index.js";

export type Repository = {
  findManyNotIn(
    taskId: string,
    approvers: Array<{ id: string }>
  ): Promise<AnswerModel.Model[]>;
  findById(answerId: string): Promise<AnswerModel.Model | null>;
  findByPk(
    approverId: string,
    taskId: string
  ): Promise<AnswerModel.Model | null>;
  update(answer: AnswerModel.Model): Promise<AnswerModel.Model>;
};
