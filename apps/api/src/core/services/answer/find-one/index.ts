import { NotFoundError, UnauthorizedError } from "@/core/errors/index.js";
import { SessionOnTeamProvider } from "@/core/providers/index.js";
import { AnswerQuery } from "@/core/queries/index.js";

export class Service {
  constructor(
    private readonly sessionOnTeamProvider: SessionOnTeamProvider.Provider,
    private readonly answerQuery: AnswerQuery.Query
  ) {}

  async exec(authorization: string, teamId: string, answerId: string) {
    const user = await this.sessionOnTeamProvider.findOne(
      authorization,
      teamId
    );
    if (!user) {
      return new UnauthorizedError.Error();
    }
    const answer = await this.answerQuery.findOne({
      answerId,
      teamId,
      userId: user.id,
    });
    if (!answer) {
      return new NotFoundError.Error("Answer not found.");
    }
    return answer;
  }
}
