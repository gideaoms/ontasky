import { UserModel } from "@/core/models";
import { UserObject } from "@/core/objects";

export function toObject(user: UserModel.Model) {
  return {
    id: user.id,
    email: user.email,
    token: user.token,
    roles: user.roles,
  } satisfies UserObject.Object;
}
