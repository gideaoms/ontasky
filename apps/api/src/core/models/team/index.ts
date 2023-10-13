import { z } from "zod";

export type Model = Readonly<{
  id: string;
  name: string;
}>;

export function build(team: Partial<Model>) {
  const parsed = z
    .object({
      id: z.string().default(""),
      name: z.string().default(""),
    })
    .parse(team);
  return parsed satisfies Model;
}
