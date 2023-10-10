import { BadRequestError, UnauthorizedError } from "@/core/errors";
import { UserModel } from "@/core/models";
import { UserObject } from "@/core/objects";
import { CryptoProvider, SessionOnTeamProvider } from "@/core/providers";
import {
  TeamRepository,
  UserOnTeamRepository,
  UserRepository,
} from "@/core/repositories";
import { invariant } from "@/utils";
import crypto from "node:crypto";

export class Service {
  constructor(
    private readonly sessionOnTeamProvider: SessionOnTeamProvider.Provider,
    private readonly userRepository: UserRepository.Repository,
    private readonly cryptoProvider: CryptoProvider.Provider,
    private readonly teamRepository: TeamRepository.Repository,
    private readonly userOnTeamRepository: UserOnTeamRepository.Repository
  ) {}

  async create(authorization: string, teamId: string, email: string) {
    const user1 = await this.sessionOnTeamProvider.findOne(
      authorization,
      teamId
    );
    if (!user1) {
      return new UnauthorizedError.Error();
    }
    const team = await this.teamRepository.findById(teamId);
    invariant(team);
    const user2 = await this.userRepository.findByEmail(email);
    if (!user2) {
      const plainPassword = crypto.randomBytes(3).toString("hex");
      const hashedPassword = await this.cryptoProvider.hash(plainPassword);
      const user3 = UserModel.build({
        email,
        password: hashedPassword,
        isEmailActivated: true,
      });
      const user4 = await this.userRepository.create(user3, team);
      const user5 = UserModel.build({
        ...user3,
        id: user4.id,
        password: plainPassword,
      });
      UserModel.subscribers.addedOnTeam.notify({
        user: user5,
        team,
        isNew: true,
      });
      return UserObject.build({
        id: user4.id,
        email: user4.email,
      });
    }
    const userOnTeamExists = await this.userOnTeamRepository.userOnTeamExists(
      user2.id,
      teamId
    );
    console.log({ userOnTeamExists });
    if (userOnTeamExists) {
      return new BadRequestError.Error("User is already part of the team.");
    }
    const user3 = UserModel.build({
      ...user2,
      role: "common",
    });
    await this.userOnTeamRepository.create(user3, team);
    UserModel.subscribers.addedOnTeam.notify({
      user: user3,
      team,
      isNew: false,
    });
    return UserObject.build({
      id: user3.id,
      email: user3.email,
    });
  }
}
