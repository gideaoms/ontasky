import * as TaskModel from "../task";

export type Status = "awaiting" | "approved" | "disapproved";

export type Model = Readonly<{
  id: string;
  description: string;
  status: Status;
  answeredAt: string;
  task?: TaskModel.Model;
}>;

export function build(todo: Partial<Model>) {
  const { id, description, status, answeredAt } = empty();
  return {
    id: todo.id ?? id,
    description: todo.description ?? description,
    status: todo.status ?? status,
    answeredAt: todo.answeredAt ?? answeredAt,
    task: todo.task,
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

export function isAwaiting(todo: Model) {
  return todo.status === "awaiting";
}
