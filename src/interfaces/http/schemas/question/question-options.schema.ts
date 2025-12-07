import { z } from "zod";

export const QuestionOptionsSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("text") }),
  z.object({ type: z.literal("number") }),
  z.object({ type: z.literal("date") }),
  z.object({
    type: z.literal("rating"),
    scale: z.number().min(1),
  }),
  z.object({
    type: z.literal("single_choice"),
    options: z.array(z.string()).min(1),
  }),
  z.object({
    type: z.literal("multiple_choice"),
    options: z.array(z.string()).min(1),
  }),
]);
