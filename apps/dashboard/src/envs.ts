import { z } from 'zod';

export const API_URL = z.string().parse(process.env.NEXT_PUBLIC_API_URL);
