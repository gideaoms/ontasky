import * as RoleModel from "../role";

export type Model = Readonly<{
  id: string;
  name: string;
  role?: RoleModel.Model;
}>;

export function build(team: Partial<Model>) {
  const { id, name } = empty();
  return {
    id: team.id ?? id,
    name: team.name ?? name,
    role: team.role,
  } satisfies Model;
}

export function empty() {
  return {
    id: "",
    name: "",
  } satisfies Model;
}
