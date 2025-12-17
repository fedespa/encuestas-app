import type { LogicRuleVm } from "../logic-rule/logic-rule.vm.js";
import type { QuestionVm } from "../question/question.vm.js";
import type { SurveyVm } from "./survey.vm.js";

export interface SurveyWithDetailsVm {
    survey: SurveyVm;
    questions: QuestionVm[];
    rules: LogicRuleVm[];
}