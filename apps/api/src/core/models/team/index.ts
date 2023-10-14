import * as RoleModel from "../role";

export type Model = {
  readonly id: string;
  readonly name: string;
  readonly role?: RoleModel.Model;
};

export type Json = {
  readonly id?: string;
  readonly name?: string;
  readonly role?: RoleModel.Model;
};

export function build(team: Partial<Model>) {
  const { id, name } = empty();
  return {
    id: team.id ?? id,
    name: team.name ?? name,
    role: team.role,
  } satisfies Model;
}

export const empty = (): Model => ({
  id: "",
  name: "",
  role: "common",
});

export const toJson = (team: Json) => team;
