import * as TaskObject from "../task/index.js";

export type Object = Partial<{
  id: string;
  status: string;
  description: string;
  answered_at: string;
  task: TaskObject.Object;
}>;

export function build(todo: Object) {
  return todo;
}
