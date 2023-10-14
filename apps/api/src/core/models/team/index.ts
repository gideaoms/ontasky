import * as RoleModel from "../role";

export type Model = {
  readonly id: string;
  readonly name: string;
  readonly role?: RoleModel.Model;
};

export type Json = {
  readonly id?: string;
  readonly name?: string;
};

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

export function toJson(team: Partial<Model>) {
  return {
    id: team.id,
    name: team.name,
  } satisfies Json;
}
