import { Observer } from "@ontasky/observer";
import * as TeamModel from "../team/index.js";

export type Model = {
  readonly id: string;
  readonly email: string;
  readonly password: string;
  readonly isEmailActivated: boolean;
  readonly validationCode: string;
  readonly token: string;
  readonly team?: TeamModel.Model;
};

export type Json = {
  readonly id?: string;
  readonly email?: string;
  readonly token?: string;
};

export function build(user: Partial<Model>) {
  const { id, email, password, isEmailActivated, token, validationCode } =
    empty();
  return {
    id: user.id ?? id,
    email: user.email ?? email,
    password: user.password ?? password,
    isEmailActivated: user.isEmailActivated ?? isEmailActivated,
    validationCode: user.validationCode ?? validationCode,
    token: user.token ?? token,
    team: user.team,
  } satisfies Model;
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

export function json(user: Json) {
  return user;
}

export function isValidationCodeCorrect(user: Model, validationCode: string) {
  return user.validationCode === validationCode;
}

export const subscribers = {
  created: new Observer<Model>(),
};
