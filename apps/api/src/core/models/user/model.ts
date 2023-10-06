import { z } from "zod";

export type Role = Readonly<{
  name: string;
}>;

export type Model = Readonly<{
  id: string;
  email: string;
  password: string;
  isEmailActivated: boolean;
  validationCode: string;
  token: string;
  roles: Role[];
}>;

export function build(user: Model) {
  const parsed = z
    .object({
      id: z.string(),
      email: z.string().email(),
      password: z.string(),
      isEmailActivated: z.boolean(),
      validationCode: z.string(),
      token: z.string(),
      roles: z.array(z.object({ name: z.string() })),
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
    roles: [],
    token: "",
  } satisfies Model;
}
