import { TeamQuery } from "@/core/queries";

export class Query implements TeamQuery.Query {
  async findMany() {
    // console.log({ userId });
    // const teams = await prisma.team.findMany({
    //   where: {
    //     users_on_teams: {
    //       every: {
    //         user_id: userId,
    //       },
    //     },
    //   },
    //   // include: {
    //   //   users_on_teams: {
    //   //     where: {
    //   //       user_id: userId,
    //   //     },
    //   //   },
    //   // },
    // });
    // return teams;
    return [];
  }
}
