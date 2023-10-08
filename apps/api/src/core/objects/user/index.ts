type Role = {
  name: string;
};

export type Object = Partial<{
  id: string;
  email: string;
  token: string;
  roles: Role[];
}>;
