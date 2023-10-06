import { Models } from "@/core/module";

export type Provider = {
  findOne(
    authorization: string,
    teamId: string
  ): Promise<Models.User.Model | null>;
};
