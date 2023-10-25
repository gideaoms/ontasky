import { BadRequestError, UnauthorizedError } from '@/core/errors/index.js';
import { UserModel } from '@/core/models/index.js';
import {
  CryptoProvider,
  SessionOnTeamProvider,
} from '@/core/providers/index.js';
import { UserQuery } from '@/core/queries/index.js';
import { UserRepository } from '@/core/repositories/index.js';
import { APP_NODE_ENV } from '@/envs.js';
import { resend } from '@/libs/resend.js';
import { CreatedUserEmail } from '@ontasky/mailer';
import { render } from '@react-email/render';
import crypto from 'node:crypto';

async function sendEmail(user: UserModel.Model) {
  const rendered = CreatedUserEmail({ validationCode: user.validationCode });
  const html = render(rendered);
  const text = render(rendered, { plainText: true });
  if (APP_NODE_ENV === 'development') {
    console.log(user);
    return;
  }
  await resend.emails.send({
    from: 'Ontasky <no-replay@ontasky.com>',
    to: [user.email], // `${name} <${email}>`
    subject: 'Activate your account',
    html,
    text,
  });
}

export class Service {
  constructor(
    private readonly cryptoProvider: CryptoProvider.Provider,
    private readonly userRepository: UserRepository.Repository,
    private readonly sessionOnTeamProvider: SessionOnTeamProvider.Provider,
    private readonly userQuery: UserQuery.Query,
  ) {}

  async create(email: string, password: string) {
    const validationCode = crypto.randomBytes(3).toString('hex');
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
      return UserModel.json({
        id: user3.id,
        email: user3.email,
      });
    }
    if (user1.isEmailActivated) {
      return new BadRequestError.Error('This email is already being used.');
    }
    const user2 = UserModel.build({
      ...user1,
      password: hashedPassword,
      validationCode,
    });
    const user3 = await this.userRepository.update(user2);
    await sendEmail(user3);
    return UserModel.json({
      id: user3.id,
      email: user3.email,
    });
  }

  async index(authorization: string, teamId: string) {
    const user = await this.sessionOnTeamProvider.findOne(
      authorization,
      teamId,
    );
    if (!user) {
      return new UnauthorizedError.Error();
    }
    return this.userQuery.findMany(teamId);
  }
}
