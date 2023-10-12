import { z } from "zod";

export type Status = "awaiting" | "approved" | "disapproved";

export type Model = Readonly<{
  userId: string;
  taskId: string;
  description: string;
  status: Status;
  answeredAt?: Date;
}>;

export function build(answer: Partial<Model>) {
  const parsed = z
    .object({
      id: z.string().default(""),
      userId: z.string().default(""),
      taskId: z.string().default(""),
      description: z.string().default(""),
      status: z
        .enum(["awaiting", "approved", "disapproved"])
        .default("awaiting"),
      answeredAt: z.date().optional(),
    })
    .parse(answer);
  return parsed satisfies Model;
}
