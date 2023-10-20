import { AnswerModel } from "@/core/models/index.js";

export type Query = {
  findMany(teamId: string, userId: string): Promise<AnswerModel.Json[]>;
  findOne(by: {
    answerId: string;
    teamId: string;
    userId: string;
  }): Promise<AnswerModel.Json | null>;
};
