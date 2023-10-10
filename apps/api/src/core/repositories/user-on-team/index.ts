import { TeamModel, UserModel } from "@/core/models";

export type Repository = {
  userOnTeamExists(userId: string, teamId: string): Promise<boolean>;
  create(user: UserModel.Model, team: TeamModel.Model): Promise<void>;
};
