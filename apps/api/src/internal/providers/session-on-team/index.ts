import { RoleModel, UserModel } from "@/internal/models";

export type Provider = {
  findOne(
    authorization: string,
    teamId: string,
    role?: RoleModel.Model
  ): Promise<UserModel.Model | null>;
};
