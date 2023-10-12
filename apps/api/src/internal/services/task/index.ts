import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "@/internal/errors";
import { AnswerModel, TaskModel } from "@/internal/models";
import { SessionOnTeamProvider } from "@/internal/providers";
import { TaskQuery } from "@/internal/queries";
import {
  AnswerRepository,
  TaskRepository,
  UserOnTeamRepository,
} from "@/internal/repositories";

type Approver = {
  id: string;
};

export class Service {
  constructor(
    private readonly sessionOnTeamProvider: SessionOnTeamProvider.Provider,
    private readonly userOnTeamRepository: UserOnTeamRepository.Repository,
    private readonly taskRepository: TaskRepository.Repository,
    private readonly answerRepository: AnswerRepository.Repository,
    private readonly taskQuery: TaskQuery.Query
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

  async update(
    authorization: string,
    teamId: string,
    taskId: string,
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
    const task1 = await this.taskRepository.findById(taskId);
    if (!task1) {
      return new BadRequestError.Error("Task not found.");
    }
    const removedAnswers = await this.answerRepository.findManyNotIn(
      taskId,
      approvers
    );
    for (const removedAnswer of removedAnswers) {
      if (!AnswerModel.isAwaiting(removedAnswer)) {
        return new BadRequestError.Error(
          "You can only remove approvers who has not answered yet."
        );
      }
    }
    const addedAnswers: AnswerModel.Model[] = [];
    for (const approver1 of approvers) {
      const approver2 = await this.userOnTeamRepository.findByPk(
        approver1.id,
        teamId
      );
      if (!approver2) {
        return new BadRequestError.Error("Approver not found.");
      }
      const answer1 = await this.answerRepository.findByPk(
        approver1.id,
        taskId
      );
      if (!answer1) {
        const answer2 = AnswerModel.build({
          userId: approver1.id,
          status: "awaiting",
        });
        addedAnswers.push(answer2);
      }
    }
    const task2 = TaskModel.build({ id: taskId, title, description });
    return this.taskRepository.update(task2, addedAnswers, removedAnswers);
  }

  async index(authorization: string, teamId: string, by: "owner" | "approver") {
    const user = await this.sessionOnTeamProvider.findOne(
      authorization,
      teamId
    );
    if (!user) {
      return new UnauthorizedError.Error();
    }
    return this.taskQuery.findMany(teamId, user.id, by);
  }

  async show(
    authorization: string,
    teamId: string,
    taskId: string,
    by: "owner" | "approver"
  ) {
    const user = await this.sessionOnTeamProvider.findOne(
      authorization,
      teamId
    );
    if (!user) {
      return new UnauthorizedError.Error();
    }
    const task = await this.taskQuery.findOne(taskId, teamId, user.id, by);
    if (!task) {
      return new NotFoundError.Error("Task not found.");
    }
    return task;
  }
}
