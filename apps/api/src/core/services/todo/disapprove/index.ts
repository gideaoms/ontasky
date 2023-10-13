import { BadRequestError, UnauthorizedError } from "@/core/errors";
import { TodoModel } from "@/core/models";
import { SessionOnTeamProvider } from "@/core/providers";
import { TodoRepository } from "@/core/repositories";

export class Service {
  constructor(
    private readonly sessionOnTeamProvider: SessionOnTeamProvider.Provider,
    private readonly answerRepository: TodoRepository.Repository
  ) {}

  async create(
    authorization: string,
    teamId: string,
    todoId: string,
    description: string
  ) {
    const user1 = await this.sessionOnTeamProvider.findOne(
      authorization,
      teamId
    );
    if (!user1) {
      return new UnauthorizedError.Error();
    }
    const todo1 = await this.answerRepository.findById(todoId);
    if (!todo1 || todo1.userId !== user1.id) {
      return new BadRequestError.Error("Todo not found.");
    }
    if (!TodoModel.isAwaiting(todo1)) {
      return new BadRequestError.Error("You have already answered this todo.");
    }
    const todo2 = TodoModel.build({
      id: todoId,
      status: "disapproved",
      description,
      answeredAt: new Date(),
    });
    return this.answerRepository.update(todo2);
  }
}
