import { BadRequestError } from "@/core/errors";
import { UserModel } from "@/core/models";
import { UserObject } from "@/core/objects";
import { CryptoProvider } from "@/core/providers";
import { UserRepository } from "@/core/repositories";
import crypto from "node:crypto";

export class Service {
  constructor(
    private readonly cryptoProvider: CryptoProvider.Provider,
    private readonly userRepository: UserRepository.Repository
  ) {}

  async create(email: string, password: string) {
    const validationCode = crypto.randomBytes(3).toString("hex");
    const hashedPassword = await this.cryptoProvider.hash(password);
    const user1 = await this.userRepository.findByEmail(email);
    if (!user1) {
      const user2 = UserModel.build({
        email,
        password: hashedPassword,
        validationCode,
      });
      const user3 = await this.userRepository.create(user2);
      // notify listeners
      return UserObject.build({
        id: user3.id,
        email: user3.email,
      });
    }
    if (user1.isEmailActivated) {
      return new BadRequestError.Error("This email is already being used.");
    }
    const user2 = UserModel.build({
      ...user1,
      password: hashedPassword,
      validationCode,
    });
    const user3 = await this.userRepository.update(user2);
    // notify listeners
    return UserObject.build({
      id: user3.id,
      email: user3.email,
    });
  }
}
