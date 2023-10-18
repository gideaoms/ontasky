import * as RoleModel from "../role/index.js";

export type Model = {
  readonly id: string;
  readonly name: string;
  readonly role?: RoleModel.Model;
};

export type Json = {
  readonly id?: string;
  readonly name?: string;
  readonly role?: RoleModel.Json;
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
    role: "common",
  } satisfies Model;
}

export function json(team: Json) {
  return team;
}
