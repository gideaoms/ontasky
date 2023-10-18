import { BadRequestError } from "@/core/errors/index.js";
import { UserModel } from "@/core/models/index.js";
import { UserObject } from "@/core/objects/index.js";
import { UserRepository } from "@/core/repositories/index.js";

export class Service {
  constructor(private readonly userRepository: UserRepository.Repository) {}

  async update(email: string, validationCode: string) {
    const errorMessage = "Invalid credentials";
    const user1 = await this.userRepository.findByEmail(email);
    if (!user1) {
      return new BadRequestError.Error(errorMessage);
    }
    if (!UserModel.isValidationCodeCorrect(user1, validationCode)) {
      return new BadRequestError.Error(errorMessage);
    }
    const user2 = UserModel.build({
      ...user1,
      validationCode: "",
      isEmailActivated: true,
    });
    const user3 = await this.userRepository.update(user2);
    return UserObject.build({
      id: user3.id,
      email: user3.email,
    });
  }
}
