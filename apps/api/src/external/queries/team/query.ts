import { Queries } from "@/core/module";
import { prisma } from "@/libs/prisma";

export class Query implements Queries.Team.Query {
  async findMany(userId: string) {
    console.log({ userId });
    const teams = await prisma.team.findMany({
      where: {
        users_on_teams: {
          every: {
            user_id: userId,
          },
        },
      },
      // include: {
      //   users_on_teams: {
      //     where: {
      //       user_id: userId,
      //     },
      //   },
      // },
    });
    return teams;
  }
}
