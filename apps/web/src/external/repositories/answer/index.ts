import { AnswerModel, TaskModel, UserModel } from '@/core/models';
import { AnswerRepository } from '@/core/repositories';
import { api } from '@/external/libs/api';
import { isOkStatus } from '@/utils';
import { match, P } from 'ts-pattern';
import { z } from 'zod';

export class Repository implements AnswerRepository.Repository {
  async findMany(teamId: string) {
    const result = await api.get('answers', {
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
          status: z.enum(['awaiting', 'approved', 'disapproved']),
          answered_at: z.string().optional(),
          task: z.object({
            title: z.string(),
            owner: z.object({
              email: z.string(),
            }),
          }),
        }),
      )
      .parse(result.data);
    return parsed.map((answer) =>
      AnswerModel.build({
        id: answer.id,
        status: answer.status,
        answeredAt: answer.answered_at,
        task: TaskModel.build({
          title: match(answer.task.title.length)
            .with(P.number.gt(140), () =>
              answer.task.title.substring(0, 140).concat('...'))
            .otherwise(() =>
              answer.task.title
            ),
          owner: UserModel.build({
            email: answer.task.owner.email,
          }),
        }),
      })
    );
  }

  async findOne(answerId: string, teamId: string) {
    const result = await api.get(`answers/${answerId}`, {
      params: AnswerModel.json({ team_id: teamId }),
    });
    if (!isOkStatus(result.status)) {
      const parsed = z.object({ message: z.string() }).parse(result.data);
      return new Error(parsed.message);
    }
    const parsed = z
      .object({
        id: z.string(),
        status: z.enum(['awaiting', 'approved', 'disapproved']),
        description: z.string().optional(),
        answered_at: z.string().optional(),
        task: z.object({
          title: z.string(),
          description: z.string(),
          owner: z.object({
            id: z.string(),
            email: z.string(),
          }),
        }),
      })
      .parse(result.data);
    return AnswerModel.build({
      id: parsed.id,
      description: parsed.description,
      status: parsed.status,
      answeredAt: parsed.answered_at,
      task: TaskModel.build({
        title: parsed.task.title,
        description: parsed.task.description,
        owner: UserModel.build({
          id: parsed.task.owner.id,
          email: parsed.task.owner.email,
        }),
      }),
    });
  }

  async approve(answer: AnswerModel.Model) {
    const task = answer.task ?? TaskModel.empty();
    const result = await api.put(
      `answers/${answer.id}/approve`,
      AnswerModel.json({
        team_id: task.teamId,
        description: answer.description,
      }),
    );
    if (!isOkStatus(result.status)) {
      const parsed = z.object({ message: z.string() }).parse(result.data);
      return new Error(parsed.message);
    }
  }

  async disapprove(answer: AnswerModel.Model) {
    const task = answer.task ?? TaskModel.empty();
    const result = await api.put(
      `answers/${answer.id}/disapprove`,
      AnswerModel.json({
        team_id: task.teamId,
        description: answer.description,
      }),
    );
    if (!isOkStatus(result.status)) {
      const parsed = z.object({ message: z.string() }).parse(result.data);
      return new Error(parsed.message);
    }
  }
}
