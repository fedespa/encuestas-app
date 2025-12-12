import type { LogicRuleEntity } from "../../logic-rule/logic-rule.entity.js";
import type { QuestionEntity } from "../../question/question.entity.js";

export class SurveyAuxValidator {
  static evaluateRuleCondition(
    rule: LogicRuleEntity,
    answerMap: Map<string, any>
  ): boolean {
    const questionId = rule.sourceQuestionId;

    if (!answerMap.has(questionId)) return false;

    const sourceValue = answerMap.get(questionId);
    const value = rule.value;

    switch (rule.operator) {
      case "equals":
        return sourceValue === value;
      case "not_equals":
        return sourceValue !== value;
      case "greater_than":
        return typeof sourceValue === "number" && sourceValue > value;
      case "less_than":
        return typeof sourceValue === "number" && sourceValue < value;
      case "includes":
        if (Array.isArray(sourceValue)) return sourceValue.includes(value);
        if (typeof sourceValue === "string") return sourceValue.includes(value);
        return false;
      case "not_includes":
        if (Array.isArray(sourceValue)) return !sourceValue.includes(value);
        if (typeof sourceValue === "string")
          return !sourceValue.includes(value);
        return false;
      default:
        return false;
    }
  }

  static isQuestionHiddenByRules(
    rules: LogicRuleEntity[],
    answerMap: Map<string, any>,
    questionId: string
  ): boolean {
    const rulesAffectingQuestion = rules.filter(
      (rule) => rule.targetQuestionId === questionId
    );

    for (const rule of rulesAffectingQuestion) {
      if (rule.action === "hide") {
        const triggered = this.evaluateRuleCondition(rule, answerMap);
        if (triggered) return true;
      }
    }

    return false;
  }

  static isQuestionShownByRules(
    rules: LogicRuleEntity[],
    answerMap: Map<string, any>,
    questionId: string
  ): boolean {
    const rulesAffectingQuestion = rules.filter(
      (rule) => rule.targetQuestionId === questionId
    );

    for (const rule of rulesAffectingQuestion) {
      if (rule.action === "show") {
        const triggered = this.evaluateRuleCondition(rule, answerMap);
        if (triggered) return true;
      }
    }

    return false;
  }

  static getQuestionOrderMap(questions: QuestionEntity[]): Map<string, number> {
    const map = new Map();

    for (const question of questions) {
      map.set(question.id, question.order);
    }

    return map;
  }

  static getNormalizedRules(
    rules: LogicRuleEntity[],
    questions: QuestionEntity[]
  ): LogicRuleEntity[] {
    const orderMap = new Map(questions.map((q) => [q.id, q.order]));
    return rules
      .slice()
      .sort(
        (a, b) =>
          orderMap.get(a.sourceQuestionId)! - orderMap.get(b.sourceQuestionId)!
      );
  }
}
