export type Object = Partial<{
  id: string;
  name: string;
}>;

export function build(team: Object) {
  return team;
}
