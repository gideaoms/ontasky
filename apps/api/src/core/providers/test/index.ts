export type Provider = {
  find(id: string): Promise<void>;
};
