import * as UserObject from "../user";

export type Object = Partial<{
  id: string;
  title: string;
  description: string;
  status: string;
  answered_at: string;
  approvers?: UserObject.Object[];
}>;

export function build(task: Object) {
  return task;
}
