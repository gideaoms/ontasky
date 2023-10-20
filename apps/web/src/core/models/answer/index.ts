import * as TaskModel from "../task";
import * as UserModel from "../user";

export type Status = "awaiting" | "approved" | "disapproved";

export type Model = {
  readonly id: string;
  readonly description: string;
  readonly status: Status;
  readonly answeredAt: string;
  readonly task?: TaskModel.Model;
  readonly approver?: UserModel.Model;
};

export type Json = {
  team_id?: string;
  description?: string;
};

export function build(answer: Partial<Model>) {
  const { id, description, status, answeredAt } = empty();
  return {
    id: answer.id ?? id,
    description: answer.description ?? description,
    status: answer.status ?? status,
    answeredAt: answer.answeredAt ?? answeredAt,
    task: answer.task,
    approver: answer.approver,
  } satisfies Model;
}

export function empty() {
  return {
    id: "",
    description: "",
    status: "awaiting",
    answeredAt: "",
  } satisfies Model;
}

export function isAwaiting(answer: Model) {
  return answer.status === "awaiting";
}

export function isDisapproved(answer: Model) {
  return answer.status === "disapproved";
}

export function isApproved(answer: Model) {
  return answer.status === "approved";
}

export function json(answer: Json) {
  return answer;
}
