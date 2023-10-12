import { BadRequestError, UnauthorizedError } from "@/internal/errors";
import { AnswerModel } from "@/internal/models";
import { SessionOnTeamProvider } from "@/internal/providers";
import { AnswerRepository, TaskRepository } from "@/internal/repositories";

export class Service {
  constructor(
    private readonly sessionOnTeamProvider: SessionOnTeamProvider.Provider,
    private readonly taskRepository: TaskRepository.Repository,
    private readonly answerRepository: AnswerRepository.Repository
  ) {}

  async create(
    authorization: string,
    teamId: string,
    taskId: string,
    description: string
  ) {
    const user1 = await this.sessionOnTeamProvider.findOne(
      authorization,
      teamId
    );
    if (!user1) {
      return new UnauthorizedError.Error();
    }
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      return new BadRequestError.Error("Task not found.");
    }
    const answer1 = await this.answerRepository.findByPk(user1.id, taskId);
    if (!answer1) {
      return new BadRequestError.Error("Your are not an approver.");
    }
    if (AnswerModel.isApproved(answer1)) {
      return new BadRequestError.Error("You have already answered this task.");
    }
    const answer2 = AnswerModel.build({
      userId: user1.id,
      taskId,
      status: "disapproved",
      description,
      answeredAt: new Date(),
    });
    await this.answerRepository.update(answer2);
    return task;
  }
}
