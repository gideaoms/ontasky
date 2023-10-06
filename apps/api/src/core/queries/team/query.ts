import { Objects } from "@/core/module";

export type Query = {
  findMany(
    userId: string
  ): Promise<(Objects.Team.Object & { role: Objects.Role.Object })[]>;
};
