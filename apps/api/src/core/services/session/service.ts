import { UserMapper } from "@/core/mappers/module";
import { Models } from "@/core/module";
import { Providers, Repositories, Errors } from "@/core/module";

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
      return new Errors.BadRequest.Error(errorMessage);
    }
    if (!user.isEmailActivated) {
      return new Errors.BadRequest.Error(
        "You have to activate your account before signing in."
      );
    }
    const isPasswordCorrect = await this.cryptoProvider.compare(
      password,
      user.password
    );
    if (!isPasswordCorrect) {
      return new Errors.BadRequest.Error(errorMessage);
    }
    const token = this.tokenProvider.generate(user.id);
    const userWithToken = Models.User.build({ ...user, token });
    return UserMapper.toObject(userWithToken);
  }

  async show(authorization: string) {
    const user = await this.sessionProvider.findOne(authorization);
    if (!user) {
      return new Errors.Unauthorized.Error();
    }
    return UserMapper.toObject(user);
  }
}
