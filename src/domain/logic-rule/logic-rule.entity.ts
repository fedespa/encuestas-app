import type { ConditionOperator, LogicAction } from "./logic-rule.types.js";

export class LogicRuleEntity {
  private constructor(
    public readonly id: string,
    public surveyId: string,
    public sourceQuestionId: string,
    public operator: ConditionOperator,
    public value: any,
    public action: LogicAction,
    public targetQuestionId: string
  ) {}

  static create(props: {
    id: string;
    surveyId: string;
    sourceQuestionId: string;
    operator: ConditionOperator;
    value: any;
    action: LogicAction;
    targetQuestionId: string;
  }) {
    return new LogicRuleEntity(
      props.id,
      props.surveyId,
      props.sourceQuestionId,
      props.operator,
      props.value,
      props.action,
      props.targetQuestionId
    );
  }
}
