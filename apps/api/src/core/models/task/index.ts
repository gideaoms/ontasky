import { Observer } from '@ontasky/observer';
import * as AnswerModel from '../answer/index.js';
import * as TeamModel from '../team/index.js';
import * as UserModel from '../user/index.js';

export type Status = 'awaiting' | 'approved' | 'disapproved';

export type Model = {
  readonly id: string;
  readonly ownerId: string;
  readonly teamId: string;
  readonly title: string;
  readonly description: string;
  readonly status: Status;
  readonly approvers?: UserModel.Model[];
  readonly answers?: AnswerModel.Model[];
  readonly team?: TeamModel.Model;
  readonly approver?: UserModel.Model;
};

export type Json = {
  readonly id?: string;
  readonly owner_id?: string;
  readonly title?: string;
  readonly description?: string;
  readonly status?: string;
  readonly owner?: UserModel.Json;
  readonly approvers?: UserModel.Json[];
  readonly answers?: AnswerModel.Json[];
};

export function build(task: Partial<Model>) {
  const { id, ownerId, teamId, title, description, status } = empty();
  return {
    id: task.id ?? id,
    ownerId: task.ownerId ?? ownerId,
    teamId: task.teamId ?? teamId,
    title: task.title ?? title,
    description: task.description ?? description,
    status: task.status ?? status,
    approvers: task.approvers,
    answers: task.answers,
    team: task.team,
    approver: task.approver,
  } satisfies Model;
}

export function empty() {
  return {
    id: '',
    ownerId: '',
    teamId: '',
    title: '',
    description: '',
    status: 'awaiting',
  } satisfies Model;
}

export function json(task: Json) {
  return task;
}

export const subscribers = {
  approved: new Observer<Model>(),
};

export function statusByAnswers(answers: AnswerModel.Model[]) {
  if (answers.every((answer) => answer.status === 'approved')) {
    return 'approved';
  }
  if (answers.some((answer) => answer.status === 'disapproved')) {
    return 'disapproved';
  }
  return 'awaiting';
}
