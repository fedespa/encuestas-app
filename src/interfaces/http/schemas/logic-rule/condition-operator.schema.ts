import { z } from "zod";

export const ConditionOperatorSchema = z.enum([
  "equals",
  "not_equals",
  "greater_than",
  "less_than",
  "includes",
  "not_includes",
]);
