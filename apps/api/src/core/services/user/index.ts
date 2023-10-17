import { BadRequestError, UnauthorizedError } from "@/core/errors";
import { UserModel } from "@/core/models";
import { UserObject } from "@/core/objects";
import { CryptoProvider, SessionOnTeamProvider } from "@/core/providers";
import { UserQuery } from "@/core/queries";
import { UserRepository } from "@/core/repositories";
import { resend } from "@/libs/resend";
import { UserCreatedEmail } from "@ontasky/mailer";
import crypto from "node:crypto";
import { render } from "@react-email/render";

async function sendEmail(user: UserModel.Model) {
  const rendered = UserCreatedEmail({ validationCode: user.validationCode });
  const html = render(rendered);
  const text = render(rendered, { plainText: true });
  await resend.emails.send({
    from: "Ontasky <no-replay@emails.ontasky.com>",
    to: [user.email], // `${name} <${email}>`
    subject: "Activate your account",
    html,
    text,
  });
}

export class Service {
  constructor(
    private readonly cryptoProvider: CryptoProvider.Provider,
    private readonly userRepository: UserRepository.Repository,
    private readonly sessionOnTeamProvider: SessionOnTeamProvider.Provider,
    private readonly userQuery: UserQuery.Query
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
      await sendEmail(user3);
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
    await sendEmail(user3);
    return UserObject.build({
      id: user3.id,
      email: user3.email,
    });
  }

  async index(authorization: string, teamId: string) {
    const user = await this.sessionOnTeamProvider.findOne(
      authorization,
      teamId
    );
    if (!user) {
      return new UnauthorizedError.Error();
    }
    return this.userQuery.findMany(teamId, user.id);
  }
}
