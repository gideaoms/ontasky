export type Provider = {
  generate(sub: string): string;
  verify(token: string): string | null;
};
