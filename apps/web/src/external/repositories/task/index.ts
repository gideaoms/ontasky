import { AnswerModel, TaskModel, UserModel } from '@/core/models';
import { TaskRepository } from '@/core/repositories';
import { api } from '@/external/libs/api';
import { isOkStatus } from '@/utils';
import { match, P } from 'ts-pattern';
import { z } from 'zod';

export class Repository implements TaskRepository.Repository {
  async findMany(teamId: string) {
    const result = await api.get('tasks', {
      params: TaskModel.json({ team_id: teamId }),
    });
    if (!isOkStatus(result.status)) {
      const parsed = z.object({ message: z.string() }).parse(result.data);
      return new Error(parsed.message);
    }
    const parsed = z
      .array(
        z.object({
          id: z.string(),
          title: z.string(),
          status: z.enum(['awaiting', 'approved', 'disapproved']),
          owner: z.object({
            email: z.string(),
          }),
        }),
      )
      .parse(result.data);
    return parsed.map((task) =>
      TaskModel.build({
        id: task.id,
        title: match(task.title.length)
          .with(P.number.gt(140), () =>
            task.title.substring(0, 140).concat('...'))
          .otherwise(() =>
            task.title
          ),
        status: task.status,
        owner: UserModel.build({
          email: task.owner.email,
        }),
      })
    );
  }

  async findById(taskId: string, teamId: string) {
    const result = await api.get(`tasks/${taskId}`, {
      params: TaskModel.json({ team_id: teamId }),
    });
    if (!isOkStatus(result.status)) {
      const parsed = z.object({ message: z.string() }).parse(result.data);
      return new Error(parsed.message);
    }
    const parsed = z
      .object({
        id: z.string(),
        owner_id: z.string(),
        title: z.string(),
        description: z.string(),
        owner: z.object({
          id: z.string(),
          email: z.string(),
        }),
        approvers: z.array(z.object({ id: z.string() })),
        answers: z.array(
          z.object({
            id: z.string(),
            description: z.string().optional(),
            status: z.enum(['awaiting', 'approved', 'disapproved']),
            approver: z.object({
              id: z.string(),
              email: z.string(),
            }),
          }),
        ),
      })
      .parse(result.data);
    return TaskModel.build({
      id: parsed.id,
      ownerId: parsed.owner_id,
      title: parsed.title,
      description: parsed.description,
      owner: UserModel.build({
        id: parsed.owner.id,
        email: parsed.owner.email,
      }),
      approvers: parsed.approvers.map((approver) =>
        UserModel.build({
          id: approver.id,
        })
      ),
      answers: parsed.answers.map((answer) =>
        AnswerModel.build({
          id: answer.id,
          description: answer.description,
          status: answer.status,
          approver: UserModel.build({
            id: answer.approver.id,
            email: answer.approver.email,
          }),
        })
      ),
    });
  }

  async create(task: TaskModel.Model, approvers: UserModel.Model[]) {
    const result = await api.post(
      'tasks',
      TaskModel.json({
        team_id: task.teamId,
        title: task.title,
        description: task.description,
        approvers: approvers.map((approver) =>
          UserModel.json({
            id: approver.id,
          })
        ),
      }),
    );
    if (!isOkStatus(result.status)) {
      const parsed = z.object({ message: z.string() }).parse(result.data);
      return new Error(parsed.message);
    }
    const parsed = z
      .object({
        id: z.string(),
        title: z.string(),
      })
      .parse(result.data);
    return TaskModel.build({
      id: parsed.id,
      title: parsed.title,
    });
  }

  async update(task: TaskModel.Model, approvers: UserModel.Model[]) {
    const result = await api.put(
      `tasks/${task.id}`,
      TaskModel.json({
        team_id: task.teamId,
        title: task.title,
        description: task.description,
        approvers: approvers.map((approver) =>
          UserModel.json({
            id: approver.id,
          })
        ),
      }),
    );
    if (!isOkStatus(result.status)) {
      const parsed = z.object({ message: z.string() }).parse(result.data);
      return new Error(parsed.message);
    }
    const parsed = z
      .object({
        id: z.string(),
        title: z.string(),
      })
      .parse(result.data);
    return TaskModel.build({
      id: parsed.id,
      title: parsed.title,
    });
  }
}
