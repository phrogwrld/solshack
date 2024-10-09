import { z } from "zod";

export const scoreSchema = z.object({
  name: z.string().max(50),
  score: z.number().int().positive(),
});
