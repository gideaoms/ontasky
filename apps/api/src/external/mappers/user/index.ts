import { UserModel } from "@/core/models";
import { User } from "@prisma/client";

export function fromRecord(user: User) {
  return UserModel.build({
    id: user.id,
    email: user.email,
    password: user.password ?? "",
    isEmailActivated: user.is_email_activated,
    validationCode: user.validation_code ?? "",
    token: "",
    roles: [],
  });
}
