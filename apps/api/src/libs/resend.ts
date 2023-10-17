import { MAIL_KEY } from "@/envs";
import { Resend } from "resend";

export const resend = new Resend(MAIL_KEY);
