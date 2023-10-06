import { UnauthorizedError } from "@/core/errors/module";
import { Models } from "@/core/module";
import { Factories } from "@/external/module";
import { UserMapper } from "@/external/mappers/module";
import { prisma } from "@/libs/prisma";

export async function findUser(
  authorization: string,
  teamId: string | undefined
) {
  const [, token] = authorization.split(" ");
  if (!token) {
    return new UnauthorizedError.Error();
  }
  const userId = Factories.Providers.Token.Provider.verify(token);
  if (!userId) {
    return new UnauthorizedError.Error();
  }
  if (!teamId) {
    const user = await Factories.Repositories.User.Repository.findById(userId);
    if (!user) {
      return new UnauthorizedError.Error();
    }
    return Models.User.build({ ...user, token });
  }
  const userOnTeam = await prisma.userOnTeam.findUnique({
    where: {
      user_id_team_id: {
        team_id: teamId,
        user_id: userId,
      },
    },
    include: {
      user: true,
    },
  });
  if (!userOnTeam?.user) {
    return new UnauthorizedError.Error();
  }
  const user = UserMapper.fromRecord(userOnTeam.user);
  const { roles } = user;
  return Models.User.build({ ...user, token, roles });
}
