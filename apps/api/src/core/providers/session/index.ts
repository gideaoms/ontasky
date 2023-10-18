import { UserModel } from "@/core/models/index.js";

export type Provider = {
  findOne(authorization: string): Promise<UserModel.Model | null>;
};
