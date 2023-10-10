import { Observer } from "@/observer";
import { z } from "zod";
import * as TeamModel from "../team";

export const subscribers = {
  addedOnTeam: new Observer<{
    user: Model;
    team: TeamModel.Model;
    isNew: boolean;
  }>(),
  created: new Observer<{ user: Model }>(),
};

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
    role: "common",
    token: "",
  } satisfies Model;
}

export function isValidationCodeCorrect(user: Model, validationCode: string) {
  return user.validationCode === validationCode;
}

export function isAdmin(user: Model) {
  return user.role === "admin";
}
