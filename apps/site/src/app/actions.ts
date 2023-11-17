'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(email: string) {
  await resend.emails.send({
    from: 'contact@ontasky.com',
    to: 'gideaoms@gmail.com',
    subject: 'New Client',
    html: email,
    text: email,
  });
}
