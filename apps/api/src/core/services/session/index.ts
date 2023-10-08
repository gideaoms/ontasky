import { UserMapper } from "@/core/mappers";
import { UserModel } from "@/core/models";
import { UserRepository } from "@/core/repositories";
import {
  CryptoProvider,
  TokenProvider,
  SessionProvider,
} from "@/core/providers";
import { BadRequestError, UnauthorizedError } from "@/core/errors";

export class Service {
  constructor(
    private readonly userRepository: UserRepository.Repository,
    private readonly cryptoProvider: CryptoProvider.Provider,
    private readonly tokenProvider: TokenProvider.Provider,
    private readonly sessionProvider: SessionProvider.Provider
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
    const userWithToken = UserModel.build({ ...user, token });
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
