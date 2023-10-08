import { UserModel } from "@/core/models";

export type Provider = {
  findOne(
    authorization: string,
    teamId: string
  ): Promise<UserModel.Model | null>;
};
