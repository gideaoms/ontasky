import { BadRequestError } from "@/core/errors";
import { UserModel } from "@/core/models";
import { UserRepository } from "@/core/repositories";

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
    return this.userRepository.update(user2);
  }
}
