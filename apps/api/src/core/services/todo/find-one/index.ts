import { NotFoundError, UnauthorizedError } from "@/core/errors";
import { SessionOnTeamProvider } from "@/core/providers";
import { TodoQuery } from "@/core/queries";

export class Service {
  constructor(
    private readonly sessionOnTeamProvider: SessionOnTeamProvider.Provider,
    private readonly todoQuery: TodoQuery.Query
  ) {}

  async exec(authorization: string, teamId: string, todoId: string) {
    const user = await this.sessionOnTeamProvider.findOne(
      authorization,
      teamId
    );
    if (!user) {
      return new UnauthorizedError.Error();
    }
    const todo = await this.todoQuery.findOne({
      todoId,
      teamId,
      userId: user.id,
    });
    if (!todo) {
      return new NotFoundError.Error("Todo not found.");
    }
    return todo;
  }
}
