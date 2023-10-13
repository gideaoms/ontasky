import * as UserObject from "../user";

export type Object = Partial<{
  id: string;
  team_id: string;
  title: string;
  description: string;
  by: "owner" | "approver";
  approvers: UserObject.Object[];
}>;

export function build(task: Object) {
  return task;
}
