export type Model = "common" | "admin";

export type Json = string;

export function build(role: Model) {
  return role ?? empty();
}

export function empty() {
  return "common" as const satisfies Model;
}

export function toJson(role: Json) {
  return role;
}

export function isCommon(role: Model) {
  return role === "common";
}
