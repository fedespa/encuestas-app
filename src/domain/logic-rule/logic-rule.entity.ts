import type { ConditionOperator, LogicAction } from "./logic-rule.types.js";

export interface LogicRuleProps {
  id: string;
  surveyId: string;
  sourceQuestionId: string;
  operator: ConditionOperator;
  value: any;
  action: LogicAction;
  targetQuestionId: string;
}

export class LogicRuleEntity {
  private constructor(
    private readonly id: string,
    private surveyId: string,
    private sourceQuestionId: string,
    private operator: ConditionOperator,
    private value: any,
    private action: LogicAction,
    private targetQuestionId: string
  ) {}

  getId() {
    return this.id;
  }

  getSurveyId() {
    return this.surveyId;
  }

  getSourceQuestionId() {
    return this.sourceQuestionId;
  }

  getOperator() {
    return this.operator;
  }

  getValue() {
    return this.value;
  }

  getAction() {
    return this.action;
  }

  getTargetQuestionId() {
    return this.targetQuestionId;
  }

  private static validate(props: LogicRuleProps) {
    if (!props.id) {
      throw new Error("La regla debe tener un ID.");
    }

    if (!props.surveyId) {
      throw new Error("La regla debe pertenecer a una encuesta (surveyId).");
    }

    if (!props.sourceQuestionId) {
      throw new Error("Debe indicar la pregunta origen (sourceQuestionId).");
    }

    if (!props.operator) {
      throw new Error("Debe especificar un operador de condición.");
    }

    if (props.value === undefined || props.value === null) {
      throw new Error("La regla debe incluir un valor para evaluar.");
    }

    if (!props.action) {
      throw new Error("Debe indicar una acción lógica (action).");
    }

    if (!props.targetQuestionId) {
      throw new Error("Debe indicar la pregunta destino (targetQuestionId).");
    }
  }

  static create(props: LogicRuleProps) {
    LogicRuleEntity.validate(props);

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
