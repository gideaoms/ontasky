import * as AnswerModel from "../answer";
import * as UserModel from "../user";

export type Status = "awaiting" | "approved" | "disapproved";

export type Model = {
  readonly id: string;
  readonly ownerId: string;
  readonly teamId: string;
  readonly title: string;
  readonly description: string;
  readonly status: Status;
  readonly approvers?: UserModel.Model[];
  readonly answers?: AnswerModel.Model[];
};

export type Json = {
  readonly id?: string;
  readonly title?: string;
  readonly description?: string;
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
  } satisfies Model;
}

export function empty() {
  return {
    id: "",
    ownerId: "",
    teamId: "",
    title: "",
    description: "",
    status: "awaiting",
  } satisfies Model;
}

export function toJson(task: Json) {
  return task;
}
