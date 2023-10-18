import { BadRequestError, UnauthorizedError } from "@/core/errors/index.js";
import { AnswerModel } from "@/core/models/index.js";
import { SessionOnTeamProvider } from "@/core/providers/index.js";
import { TodoRepository } from "@/core/repositories/index.js";

export class Service {
  constructor(
    private readonly sessionOnTeamProvider: SessionOnTeamProvider.Provider,
    private readonly todoRepository: TodoRepository.Repository
  ) {}

  async exec(
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
    const todo1 = await this.todoRepository.findById(todoId);
    if (!todo1 || todo1.userId !== user1.id) {
      return new BadRequestError.Error("Todo not found.");
    }
    if (!AnswerModel.isAwaiting(todo1)) {
      return new BadRequestError.Error("You have already answered this todo.");
    }
    const todo2 = AnswerModel.build({
      id: todoId,
      status: "approved",
      description,
      answeredAt: new Date(),
    });
    const todo3 = await this.todoRepository.update(todo2);
    //
    return todo3;
  }
}
