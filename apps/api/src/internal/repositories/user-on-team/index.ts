import { RoleModel, TeamModel, UserModel } from "@/internal/models";

export type Repository = {
  findByPk(userId: string, teamId: string): Promise<boolean>;
  create(
    user: UserModel.Model,
    team: TeamModel.Model,
    role: RoleModel.Model
  ): Promise<void>;
};
