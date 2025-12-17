import type { ConditionOperator, LogicAction } from "../../../domain/logic-rule/logic-rule.types.js";

export interface LogicRuleVm {
  id: string;
  sourceQuestionId: string;
  operator: ConditionOperator;
  value: any;
  action: LogicAction;
  targetQuestionId: string;
}
