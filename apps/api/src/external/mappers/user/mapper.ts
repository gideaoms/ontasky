import { Models } from "@/core/module";
import { User } from "@prisma/client";

export function fromRecord(user: User) {
  return Models.User.build({
    id: user.id,
    email: user.email,
    password: user.password ?? "",
    isEmailActivated: user.is_email_activated,
    validationCode: user.validation_code ?? "",
    token: "",
    roles: [],
  });
}
