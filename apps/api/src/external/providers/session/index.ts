import { UserModel } from "@/internal/models";
import { SessionProvider, TokenProvider } from "@/internal/providers";
import { UserRepository } from "@/internal/repositories";

export class Provider implements SessionProvider.Provider {
  constructor(
    private readonly tokenProvider: TokenProvider.Provider,
    private readonly userRepository: UserRepository.Repository
  ) {}

  async findOne(authorization: string) {
    const [, token] = authorization.split(" ");
    if (!token) {
      return null;
    }
    const userId = this.tokenProvider.verify(token);
    if (!userId) {
      return null;
    }
    const user = await this.userRepository.findById(userId);
    if (!user) {
      return null;
    }
    return UserModel.build({ ...user, token });
  }
}
