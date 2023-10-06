import { Models } from "@/core/module";

export type Provider = {
  findOne(authorization: string): Promise<Models.User.Model | null>;
};
