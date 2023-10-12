export type Model = Readonly<{
  name: string;
}>;

export function build(role: Model) {
  return role;
}

export function isCommon(role: Model) {
  return role.name === "common";
}
