import { BadRequestError, UnauthorizedError } from "@/core/errors/module";
import { UserMapper } from "@/core/mappers/module";
import { Models } from "@/core/module";
import { Providers, Repositories } from "@/core/module";

export class Service {
  constructor(
    private readonly userRepository: Repositories.User.Repository,
    private readonly cryptoProvider: Providers.Crypto.Provider,
    private readonly tokenProvider: Providers.Token.Provider,
    private readonly sessionProvider: Providers.Session.Provider
  ) {}

  async create(email: string, password: string) {
    const errorMessage = "Invalid credentials";
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return new BadRequestError.Error(errorMessage);
    }
    if (!user.isEmailActivated) {
      return new BadRequestError.Error(
        "You have to activate your account before signing in."
      );
    }
    const isPasswordCorrect = await this.cryptoProvider.compare(
      password,
      user.password
    );
    if (!isPasswordCorrect) {
      return new BadRequestError.Error(errorMessage);
    }
    const token = this.tokenProvider.generate(user.id);
    const userWithToken = Models.User.build({ ...user, token });
    return UserMapper.toObject(userWithToken);
  }

  async show(authorization: string) {
    const user = await this.sessionProvider.findOne(authorization);
    if (!user) {
      return new UnauthorizedError.Error();
    }
    return UserMapper.toObject(user);
  }
}
