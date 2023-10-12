export type Object = Partial<{
  id: string;
  title: string;
  status: string;
  answeredAt: string;
}>;

export function build(task: Object) {
  return task;
}
