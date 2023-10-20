import { AnswerModel, UserModel } from "@/core/models";

export type Status = "awaiting" | "approved" | "disapproved";

export type Model = {
  readonly id: string;
  readonly ownerId: string;
  readonly teamId: string;
  readonly title: string;
  readonly description: string;
  readonly status: Status;
  readonly answeredAt: string;
  readonly owner?: UserModel.Model;
  readonly approvers?: UserModel.Model[];
  readonly answers?: AnswerModel.Model[];
};

export type Json = {
  team_id?: string;
  title?: string;
  description?: string;
  approvers?: UserModel.Json[];
};

export function build(task: Partial<Model>) {
  const { id, ownerId, teamId, title, description, status, answeredAt } =
    empty();
  return {
    id: task.id ?? id,
    ownerId: task.ownerId ?? ownerId,
    teamId: task.teamId ?? teamId,
    title: task.title ?? title,
    description: task.description ?? description,
    status: task.status ?? status,
    answeredAt: task.answeredAt ?? answeredAt,
    owner: task.owner,
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
    answeredAt: "",
  } satisfies Model;
}

export function json(task: Json) {
  return task;
}
