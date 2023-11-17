import * as RoleModel from "../role";
import * as TeamModel from "../team";

export type Model = {
  readonly id: string;
  readonly email: string;
  readonly token: string;
  readonly role?: RoleModel.Model;
  readonly team?: TeamModel.Model;
};

export type Json = {
  id?: string;
  email?: string;
  password?: string;
  validation_code?: string;
  team_id?: string;
};

export function build(user: Partial<Model>) {
  const { id, email, token } = empty();
  return {
    id: user.id ?? id,
    email: user.email ?? email,
    token: user.token ?? token,
    role: user.role,
    team: user.team,
  } satisfies Model;
}

export function empty() {
  return {
    id: "",
    email: "",
    token: "",
  } satisfies Model;
}

export function json(user: Json) {
  return user;
}
