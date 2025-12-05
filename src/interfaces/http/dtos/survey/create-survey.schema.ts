import { z } from "zod";
import { QuestionTypeSchema } from "../question/question-type.schema.js";
import { QuestionOptionsSchema } from "../question/question-options.schema.js";
import { ConditionOperatorSchema } from "../logic-rule/condition-operator.schema.js";
import { LogicActionSchema } from "../logic-rule/logic-action.schema.js";

export const CreateSurveySchema = z.object({
  survey: z.object({
    id: z.string().min(1),
    title: z.string(),
    description: z.string(),
    isPublic: z.boolean(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    ownerId: z.string().optional(),
  }),
  questions: z.array(
    z.object({
      id: z.string().min(1),
      surveyId: z.string().min(1),
      type: QuestionTypeSchema,
      questionText: z.string(),
      required: z.boolean(),
      options: QuestionOptionsSchema,
      order: z.number().int(),
    })
  ),
  logicRules: z.array(
    z.object({
      id: z.string().min(1),
      surveyId: z.string().min(1),
      sourceQuestionId: z.string().min(1),
      operator: ConditionOperatorSchema,
      value: z.any(),
      action: LogicActionSchema,
      targetQuestionId: z.string().min(1),
    })
  ),
});

export type CreateSurveyInput = z.infer<typeof CreateSurveySchema>;
