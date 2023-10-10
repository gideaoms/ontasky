import { z } from "zod";

export type Model = Readonly<{
  id: string;
  email: string;
  password: string;
  isEmailActivated: boolean;
  validationCode: string;
  token: string;
  role: "common" | "admin";
}>;

export function build(user: Partial<Model>) {
  const parsed = z
    .object({
      id: z.string().default(""),
      email: z.string().default(""),
      password: z.string().default(""),
      isEmailActivated: z.boolean().default(false),
      validationCode: z.string().default(""),
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
    role: "common",
    token: "",
  } satisfies Model;
}
