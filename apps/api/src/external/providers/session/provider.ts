import { Models, Providers, Repositories } from "@/core/module";

export class Provider implements Providers.Session.Provider {
  constructor(
    private readonly tokenProvider: Providers.Token.Provider,
    private readonly userRepository: Repositories.User.Repository
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
    return Models.User.build({ ...user, token });
  }
}
