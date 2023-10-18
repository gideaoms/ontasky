import { UserModel } from "@/core/models/index.js";
import { UserCreatedEmail } from "@ontasky/mailer";
import { Resend } from "resend";
import { MAIL_KEY } from "@/envs.js";

const resend = new Resend(MAIL_KEY);

UserModel.subscribers.created.subscribe((user) =>
  resend.emails.send({
    from: "Ontasky <no-replay@ontasky.com>",
    to: [user.email], // `${name} <${email}>`
    subject: "Activate your account",
    react: UserCreatedEmail({ validationCode: user.validationCode }),
  })
);
