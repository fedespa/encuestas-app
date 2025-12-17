import type { QuestionOptions, QuestionType } from "../../../domain/question/question.types.js";

export interface QuestionVm {
  id: string;
  type: QuestionType;
  questionText: string;
  required: boolean;
  options: QuestionOptions;
  order: number;
}