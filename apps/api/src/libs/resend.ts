import { MAIL_KEY } from "@/envs.js";
import { Resend } from "resend";

export const resend = new Resend(MAIL_KEY);
