import * as UserModel from "../user";
import * as TaskModel from "../task";

export type Status = "awaiting" | "approved" | "disapproved";

export type Model = {
  readonly id: string;
  readonly userId: string;
  readonly taskId: string;
  readonly description: string;
  readonly status: Status;
  readonly answeredAt?: string;
};

export type Json = {
  readonly id?: string;
  readonly description?: string;
  readonly status?: string;
  readonly answered_at?: string;
  readonly task?: TaskModel.Json;
  readonly approver?: UserModel.Json;
};

export function build(answer: Partial<Model>) {
  const { id, userId, taskId, description, answeredAt, status } = empty();
  return {
    id: answer.id ?? id,
    userId: answer.userId ?? userId,
    taskId: answer.taskId ?? taskId,
    description: answer.description ?? description,
    status: answer.status ?? status,
    answeredAt: answer.answeredAt ?? answeredAt,
  } satisfies Model;
}

export function empty() {
  return {
    id: "",
    userId: "",
    taskId: "",
    description: "",
    status: "awaiting",
    answeredAt: "",
  } satisfies Model;
}

export function toJson(answer: Json) {
  return answer;
}

export function isAwaiting(answer: Model) {
  return answer.status === "awaiting";
}

export function isApproved(answer: Model) {
  return answer.status === "approved";
}