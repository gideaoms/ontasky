import { UserModel } from '@/core/models/index.js';

export type Query = {
  findMany(teamId: string): Promise<UserModel.Json[]>;
};
