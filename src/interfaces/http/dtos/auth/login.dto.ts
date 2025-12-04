import { z } from "zod";

export const LoginDto = z.object({
  email: z.email(),
  password: z.string().min(4),
});

export type LoginInput = z.infer<typeof LoginDto>;