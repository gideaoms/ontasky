import * as UserModel from "../user/index.js";
import * as TaskModel from "../task/index.js";

export type Status = "awaiting" | "approved" | "disapproved" | (string & {});

export type Model = {
  readonly id: string;
  readonly userId: string;
  readonly taskId: string;
  readonly description: string;
  readonly status: Status;
  readonly answeredAt?: string | Date;
  readonly task?: TaskModel.Model;
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
    task: answer.task,
  } satisfies Model;
}

export function empty() {
  return {
    id: "",
    userId: "",
    taskId: "",
    description: "",
    status: "",
    answeredAt: "",
  } satisfies Model;
}

export function json(answer: Json) {
  return answer;
}

export function isAwaiting(answer: Model) {
  return answer.status === "awaiting";
}

export function isApproved(answer: Model) {
  return answer.status === "approved";
}
