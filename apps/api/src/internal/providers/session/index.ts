import { UserModel } from "@/internal/models";

export type Provider = {
  findOne(authorization: string): Promise<UserModel.Model | null>;
};
