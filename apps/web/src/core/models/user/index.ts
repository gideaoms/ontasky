import * as RoleModel from "../role";
import * as TeamModel from "../team";

export type Model = Readonly<{
  id: string;
  email: string;
  token: string;
  role?: RoleModel.Model;
  team?: TeamModel.Model;
}>;

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
