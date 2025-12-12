import type { LogicRuleEntity } from "../../../domain/logic-rule/logic-rule.entity.js";
import type { QuestionEntity } from "../../../domain/question/question.entity.js";
import type { SurveyVm } from "./survey.vm.js";

export interface CreatedSurveyVm {
  survey: SurveyVm;
  questions: QuestionEntity[];
  logicRules: LogicRuleEntity[];
}
