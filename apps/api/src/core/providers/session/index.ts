import { UserModel } from "@/core/models";

export type Provider = {
  findOne(authorization: string): Promise<UserModel.Model | null>;
};
