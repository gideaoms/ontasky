export type Object = Partial<{
  id: string;
  title: string;
  status: string;
}>;

export function build(task: Object) {
  return task;
}
