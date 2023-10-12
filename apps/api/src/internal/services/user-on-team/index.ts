import { BadRequestError, UnauthorizedError } from "@/internal/errors";
import { RoleModel, UserModel } from "@/internal/models";
import { UserObject } from "@/internal/objects";
import { CryptoProvider, SessionOnTeamProvider } from "@/internal/providers";
import {
  TeamRepository,
  UserOnTeamRepository,
  UserRepository,
} from "@/internal/repositories";
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
      // const user5 = UserModel.build({
      //   ...user3,
      //   id: user4.id,
      //   password: plainPassword,
      // });
      return UserObject.build({
        id: user4.id,
        email: user4.email,
      });
    }
    const userOnTeam = await this.userOnTeamRepository.findByPk(
      user2.id,
      teamId
    );
    if (userOnTeam) {
      return new BadRequestError.Error("User is already part of the team.");
    }
    const role = RoleModel.build({ name: "common" });
    await this.userOnTeamRepository.create(user2, team, role);
    return UserObject.build({
      id: user2.id,
      email: user2.email,
    });
  }
}
