export type Model = "common" | "admin";

export function build(role: Model) {
  return role ?? empty();
}

export function empty() {
  return "common" as const satisfies Model;
}
