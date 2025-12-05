import { z } from "zod";

export const QuestionTypeSchema = z.enum([
  "text",
  "number",
  "date",
  "single-choice",
  "multiple-choice",
  "rating",
  "file",
]);
