import { TeamModel } from "@/core/models";

export type Repository = {
  findMany(): Promise<TeamModel.Model[]>;
  findById(teamId: string): Promise<TeamModel.Model | Error>;
  create(team: TeamModel.Model): Promise<TeamModel.Model | Error>;
  update(team: TeamModel.Model): Promise<TeamModel.Model | Error>;
};
