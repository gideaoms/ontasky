import { BadRequestError, UnauthorizedError } from "@/internal/errors";
import { AnswerModel, TaskModel } from "@/internal/models";
import { SessionOnTeamProvider } from "@/internal/providers";
import { TaskRepository, UserOnTeamRepository } from "@/internal/repositories";

type Approver = {
  id: string;
};

export class Service {
  constructor(
    private readonly sessionOnTeamProvider: SessionOnTeamProvider.Provider,
    private readonly userOnTeamRepository: UserOnTeamRepository.Repository,
    private readonly taskRepository: TaskRepository.Repository
  ) {}

  async create(
    authorization: string,
    teamId: string,
    title: string,
    description: string,
    approvers: Approver[]
  ) {
    const user = await this.sessionOnTeamProvider.findOne(
      authorization,
      teamId
    );
    if (!user) {
      return new UnauthorizedError.Error();
    }
    const answers: AnswerModel.Model[] = [];
    for (const approver1 of approvers) {
      const approver2 = await this.userOnTeamRepository.findByPk(
        approver1.id,
        teamId
      );
      if (!approver2) {
        return new BadRequestError.Error("Approver not found.");
      }
      const answer = AnswerModel.build({
        userId: approver1.id,
        status: "awaiting",
      });
      answers.push(answer);
    }
    const task = TaskModel.build({
      ownerId: user.id,
      teamId,
      title,
      description,
      status: "awaiting",
    });
    return this.taskRepository.create(task, answers);
  }
}
