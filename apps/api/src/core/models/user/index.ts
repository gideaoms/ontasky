import { z } from "zod";

export type Model = Readonly<{
  id: string;
  email: string;
  password: string;
  isEmailActivated: boolean;
  validationCode: string;
  token: string;
}>;

export function build(user: Partial<Model>) {
  const parsed = z
    .object({
      id: z.string().default(""),
      email: z.string().default(""),
      password: z.string().default(""),
      isEmailActivated: z.boolean().default(false),
      validationCode: z.coerce.string().default(""),
      token: z.string().default(""),
      role: z.enum(["common", "admin"]).default("common"),
    })
    .parse(user);
  return parsed satisfies Model;
}

export function empty() {
  return {
    id: "",
    email: "",
    password: "",
    isEmailActivated: false,
    validationCode: "",
    token: "",
  } satisfies Model;
}

export function isValidationCodeCorrect(user: Model, validationCode: string) {
  return user.validationCode === validationCode;
}