export type Object = Partial<{
  id: string;
  name: string;
  role: string;
}>;

export function build(team: Object) {
  return team;
}
