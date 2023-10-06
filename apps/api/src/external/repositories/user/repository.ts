import { Repositories } from "@/core/module";
import { UserMapper } from "@/external/mappers/module";
import { prisma } from "@/libs/prisma";

export class Repository implements Repositories.User.Repository {
  async findById(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return null;
    }
    return UserMapper.fromRecord(user);
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return null;
    }
    return UserMapper.fromRecord(user);
  }
}
