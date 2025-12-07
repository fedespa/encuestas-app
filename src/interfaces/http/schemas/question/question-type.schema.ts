import { z } from "zod";

export const QuestionTypeSchema = z.enum([
  "text",
  "number",
  "date",
  "single_choice",
  "multiple_choice",
  "rating",
]);
