import { z } from "zod";

export type Status = "awaiting" | "approved" | "disapproved";

export type Model = Readonly<{
  id: string;
  ownerId: string;
  teamId: string;
  title: string;
  description: string;
  status: Status;
}>;

export function build(task: Partial<Model>) {
  const parsed = z
    .object({
      id: z.string().default(""),
      ownerId: z.string().default(""),
      teamId: z.string().default(""),
      title: z.string().default(""),
      description: z.string().default(""),
      status: z
        .enum(["awaiting", "approved", "disapproved"])
        .default("awaiting"),
    })
    .parse(task);
  return parsed satisfies Model;
}
