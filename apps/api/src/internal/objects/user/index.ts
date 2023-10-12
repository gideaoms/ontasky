export type Object = Partial<{
  id: string;
  email: string;
  token: string;
  role: string;
}>;

export function build(user: Object) {
  return user;
}
