import { UserModel } from "@/core/models";

export type Status = "awaiting" | "approved" | "disapproved";

export type Model = Readonly<{
  id: string;
  ownerId: string;
  teamId: string;
  title: string;
  description: string;
  status: Status;
  answeredAt: string;
  approvers?: UserModel.Model[];
}>;

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
    approvers: task.approvers,
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
