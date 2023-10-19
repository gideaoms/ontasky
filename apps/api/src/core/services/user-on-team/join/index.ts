import { BadRequestError, UnauthorizedError } from "@/core/errors/index.js";
import { TeamModel, UserModel } from "@/core/models/index.js";
import { SessionProvider } from "@/core/providers/index.js";
import {
  UserOnTeamRepository,
  UserRepository,
} from "@/core/repositories/index.js";

export class UseCase {
  constructor(
    private readonly sessionProvider: SessionProvider.Provider,
    private readonly userRepository: UserRepository.Repository,
    private readonly userOnTeamRepository: UserOnTeamRepository.Repository
  ) {}

  async exec(authorization: string, teamId: string, email: string) {
    const currentUser = await this.sessionProvider.findOne(
      authorization,
      teamId
    );
    if (!currentUser) {
      return new UnauthorizedError.Error();
    }
    const user1 = await this.userRepository.findByEmail(email);
    if (!user1) {
      return new BadRequestError.Error("Email has not signed up yet.");
    }
    const user2 = await this.userOnTeamRepository.findByPk(user1.id, teamId);
    if (user2) {
      return new BadRequestError.Error(
        "This email is already part of this team."
      );
    }
    const team = currentUser.team ?? TeamModel.empty();
    const user3 = await this.userOnTeamRepository.create(user1, team);
    return UserModel.json({
      id: user3.id,
      email: user3.email,
    });
  }
}
