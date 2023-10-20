import { AnswerModel } from "@/core/models";

export type Repository = {
  findMany(teamId: string): Promise<AnswerModel.Model[] | Error>;
  findOne(answerId: string, teamId: string): Promise<AnswerModel.Model | Error>;
  approve(answer: AnswerModel.Model): Promise<void | Error>;
  disapprove(answer: AnswerModel.Model): Promise<void | Error>;
};
