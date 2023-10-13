export type Object = Partial<{
  id: string;
  team_id: string;
  email: string;
  password: string;
  validation_code: string;
}>;

export function build(user: Object) {
  return user;
}
