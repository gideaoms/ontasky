import { UserRepository } from "@/core/repositories";
import { UserMapper } from "@/external/mappers";
import { prisma } from "@/libs/prisma";

export class Repository implements UserRepository.Repository {
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
