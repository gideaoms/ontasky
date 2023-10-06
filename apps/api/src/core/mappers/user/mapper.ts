import { Models } from "@/core/module";
import { Objects } from "@/core/module";

export function toObject(user: Models.User.Model) {
  return {
    id: user.id,
    email: user.email,
    token: user.token,
    roles: user.roles,
  } satisfies Objects.User.Object;
}
