import { z } from "zod";

export const RegisterDto = z.object({
  email: z.email(),
  password: z.string().min(4),
});

export type RegisterInput = z.infer<typeof RegisterDto>;