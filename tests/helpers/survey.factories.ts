import { LogicRuleEntity } from "../../src/domain/logic-rule/logic-rule.entity.js";
import type { ConditionOperator, LogicAction } from "../../src/domain/logic-rule/logic-rule.types.js";
import { QuestionEntity } from "../../src/domain/question/question.entity.js";
import type { QuestionOptions, QuestionType } from "../../src/domain/question/question.types.js";
import type { AnswerInterface } from "../../src/domain/survey/validation/survey-response.validator.js";


interface QuestionProps {
  id: string;
  surveyId?: string;
  type?: QuestionType;
  questionText?: string;
  required?: boolean;
  options?: QuestionOptions;
  order: number;
}

interface RuleProps {
  id?: string;
  surveyId?: string;
  sourceQuestionId: string;
  operator?: ConditionOperator;
  value?: any;
  action?: LogicAction;
  targetQuestionId: string;
}

export const createQuestion = ({
  id,
  surveyId,
  type,
  questionText,
  required,
  options,
  order,
}: QuestionProps): QuestionEntity => {
  return QuestionEntity.create({
    id,
    surveyId: surveyId ?? "abc",
    type: type ?? "text",
    questionText: questionText ?? "how are you?",
    required: required ?? true,
    options: options ?? { type: "text" },
    order,
  });
};

export const createAnswer = (
  questionId: string,
  value: any
): AnswerInterface => {
  return {
    questionId,
    value,
  };
};

export const createRule = ({
  id = "ab-12",
  surveyId = "abc",
  sourceQuestionId,
  operator = "equals",
  value = "yes",
  action = "jump_to",
  targetQuestionId,
}: RuleProps): LogicRuleEntity => {
  return LogicRuleEntity.create({
    id,
    surveyId,
    sourceQuestionId,
    operator,
    value,
    action,
    targetQuestionId,
  });
};