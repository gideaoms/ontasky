import { AnswerModel } from "@/internal/models";

export type Repository = {
  findManyNotIn(
    taskId: string,
    approvers: Array<{ id: string }>
  ): Promise<AnswerModel.Model[]>;
  findByPk(userId: string, taskId: string): Promise<AnswerModel.Model | null>;
  update(answer: AnswerModel.Model): Promise<AnswerModel.Model>;
};
