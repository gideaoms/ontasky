import { z } from 'zod';

export function fromObject (data: unknown) {
  const parsed = z
    .object({
      message: z.string(),
    })
    .parse(data);
  return parsed;
}
