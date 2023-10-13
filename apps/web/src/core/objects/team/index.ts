export type Object = Readonly<{
  id: string;
  name: string;
}>;

export function build(team: Partial<Object>) {
  return team;
}
