import { BadRequestError, UnauthorizedError } from "@/core/errors/index.js";
import { TeamModel, UserModel } from "@/core/models/index.js";
import { CryptoProvider, SessionProvider } from "@/core/providers/index.js";
import { UserRepository } from "@/core/repositories/index.js";
import { APP_NODE_ENV, WEB_URL } from "@/envs.js";
import { resend } from "@/libs/resend.js";
import { JoinedOnTeamEmail } from "@ontasky/mailer";
import { render } from "@react-email/render";
import crypto from "node:crypto";

export async function sendEmail(user: UserModel.Model) {
  const team = user.team ?? TeamModel.empty();
  const rendered = JoinedOnTeamEmail({
    password: user.password,
    teamName: team.name,
    webUrl: WEB_URL,
  });
  const html = render(rendered);
  const text = render(rendered, { plainText: true });
  if (APP_NODE_ENV === "development") {
    console.log(user);
    return;
  }
  await resend.emails.send({
    from: "Ontasky <no-replay@ontasky.com>",
    to: [user.email], // `${name} <${email}>`
    subject: `Welcome to ${team.name}`,
    html,
    text,
  });
}

export class UseCase {
  constructor(
    private readonly sessionProvider: SessionProvider.Provider,
    private readonly userRepository: UserRepository.Repository,
    private readonly cryptoProvider: CryptoProvider.Provider
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
      const plainPassword = crypto.randomBytes(3).toString("hex");
      const hashedPassword = await this.cryptoProvider.hash(plainPassword);
      const user2 = UserModel.build({
        email,
        password: hashedPassword,
        isEmailActivated: true,
        team: TeamModel.build({
          id: teamId,
          role: "common",
        }),
      });
      const user3 = await this.userRepository.create(user2);
      const user4 = UserModel.build({ ...user3, password: plainPassword });
      await sendEmail(user4);
      return UserModel.json({
        id: user4.id,
        email: user4.email,
      });
    }
    const user2 = UserModel.build({
      id: user1.id,
      team: TeamModel.build({
        id: teamId,
        role: "common",
      }),
    });
    const user3 = await this.userRepository.findOne(user2);
    if (user3) {
      return new BadRequestError.Error("User is already part of the team.");
    }
    const user4 = await this.userRepository.joinTeam(user2);
    await sendEmail(user4);
    return UserModel.json({
      id: user4.id,
      email: user4.email,
    });
  }
}
