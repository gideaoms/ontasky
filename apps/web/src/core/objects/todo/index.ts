export type Object = Partial<{
  team_id: string;
  description: string;
}>;

export function build(todo: Object) {
  return todo;
}
