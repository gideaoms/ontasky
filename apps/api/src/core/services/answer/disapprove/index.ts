import { BadRequestError, UnauthorizedError } from "@/core/errors/index.js";
import { AnswerModel } from "@/core/models/index.js";
import { SessionOnTeamProvider } from "@/core/providers/index.js";
import { AnswerRepository } from "@/core/repositories/index.js";

export class Service {
  constructor(
    private readonly sessionOnTeamProvider: SessionOnTeamProvider.Provider,
    private readonly answerRepository: AnswerRepository.Repository
  ) {}

  async create(
    authorization: string,
    teamId: string,
    answerId: string,
    description: string
  ) {
    const user1 = await this.sessionOnTeamProvider.findOne(
      authorization,
      teamId
    );
    if (!user1) {
      return new UnauthorizedError.Error();
    }
    const answer1 = await this.answerRepository.findById(answerId);
    if (!answer1 || answer1.userId !== user1.id) {
      return new BadRequestError.Error("Answer not found.");
    }
    if (!AnswerModel.isAwaiting(answer1)) {
      return new BadRequestError.Error("You have already answered it.");
    }
    const answer2 = AnswerModel.build({
      id: answerId,
      taskId: answer1.taskId,
      status: "disapproved",
      description,
      answeredAt: new Date(),
    });
    return this.answerRepository.update(answer2);
  }
}
