import { z } from "zod";

export type Model = {
  readonly id: string;
  readonly email: string;
  readonly password: string;
  readonly isEmailActivated: boolean;
  readonly validationCode: string;
  readonly token: string;
};

export type Json = {
  readonly id?: string;
  readonly email?: string;
};

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

export function toJson(user: Json) {
  return user;
}

export function isValidationCodeCorrect(user: Model, validationCode: string) {
  return user.validationCode === validationCode;
}
