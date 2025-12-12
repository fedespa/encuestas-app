import type { LogicRuleEntity } from "../../logic-rule/logic-rule.entity.js";
import type { QuestionEntity } from "../../question/question.entity.js";
import { SurveyCreationError } from "../survey.errors.js";
import { SurveyAuxValidator } from "./survey-aux.validator.js";

export class SurveyCreationValidator {
  static validateRuleQuestionReferences(
    rules: LogicRuleEntity[],
    questions: QuestionEntity[]
  ): void {
    const questionIds = new Set(questions.map((q) => q.id));

    for (const rule of rules) {
      const sourceId = rule.sourceQuestionId;
      const targetId = rule.targetQuestionId;

      if (!questionIds.has(sourceId) || !questionIds.has(targetId)) {
        throw new SurveyCreationError(
          `Una de las reglas hace referencia a una pregunta inexistente. `
        );
      }
    }
  }

  static validateNoSelfTargetRules(rules: LogicRuleEntity[]): void {
    for (const rule of rules) {
      if (rule.sourceQuestionId === rule.targetQuestionId) {
        throw new SurveyCreationError(
          `Una de las reglas tiene un destino igual a su origen.`
        );
      }
    }
  }

  static validateJumpTargetsAreForward(
    rules: LogicRuleEntity[],
    questions: QuestionEntity[]
  ): void {
    this.validateRuleQuestionReferences(rules, questions);
    this.validateNoSelfTargetRules(rules);

    const orderMap = SurveyAuxValidator.getQuestionOrderMap(questions);

    for (const rule of rules) {
      if (rule.action === "jump_to") {
        const sourceOrder = orderMap.get(rule.sourceQuestionId);
        const targetOrder = orderMap.get(rule.targetQuestionId);

        if (sourceOrder === undefined || targetOrder === undefined) {
          throw new SurveyCreationError(
            `Una de las reglas intenta saltar desde una pregunta sin orden definido.`
          );
        }

        if (sourceOrder >= targetOrder) {
          throw new SurveyCreationError(
            `Una de las reglas tiene un salto inválido: ` +
              `el orden de origen (${sourceOrder}) debe ser menor que el orden de destino (${targetOrder}).`
          );
        }
      }
    }
  }

  static assertNoAmbiguousRule(rules: LogicRuleEntity[]): void {
    const seen = new Set<string>();

    for (const rule of rules) {
      const key = [
        rule.sourceQuestionId,
        rule.operator,
        JSON.stringify(rule.value),
      ].join("|");

      if (seen.has(key)) {
        throw new SurveyCreationError(
          `Existen reglas ambiguas o duplicadas para la misma condición."`
        );
      }

      seen.add(key);
    }
  }

  static validateValidRuleActions(rules: LogicRuleEntity[]): void {
    for (const rule of rules) {
      if (
        rule.action !== "hide" &&
        rule.action !== "jump_to" &&
        rule.action !== "show"
      )
        throw new SurveyCreationError(
          "Una de las reglas tiene una acción inválida. "
        );
    }
  }

  static validateSurveyOrdering(questions: QuestionEntity[]): void {
    const orders = questions.map((q) => q.order);

    if (orders.some((o) => !Number.isInteger(o))) {
      throw new SurveyCreationError(
        "Todas las preguntas deben tener un orden entero."
      );
    }

    const unique = new Set(orders);
    if (unique.size !== orders.length) {
      throw new SurveyCreationError("Hay órdenes duplicados en las preguntas.");
    }

    const min = Math.min(...orders);
    const max = Math.max(...orders);

    if (min !== 1) {
      throw new SurveyCreationError("El orden debe comenzar en 1.");
    }

    if (max !== questions.length) {
      throw new SurveyCreationError("El orden debe ir de 1 a N sin huecos.");
    }

    for (let i = 1; i <= orders.length; i++) {
      if (!unique.has(i)) {
        throw new SurveyCreationError(`Falta el orden ${i}.`);
      }
    }
  }

  static validateSurveyCreation(
    questions: QuestionEntity[],
    logicRules: LogicRuleEntity[]
  ): LogicRuleEntity[] {
    // 1️⃣ Validar orden de preguntas
    this.validateSurveyOrdering(questions);

    // 5️⃣ Acciones válidas
    this.validateValidRuleActions(logicRules);

    // 2️⃣ Validar duplicados y reglas ambiguas
    this.assertNoAmbiguousRule(logicRules);

    // 3️⃣ Validar que reglas referencien preguntas válidas
    this.validateRuleQuestionReferences(logicRules, questions);

    // 4️⃣ Self-target no permitido
    this.validateNoSelfTargetRules(logicRules);

    // 6️⃣ Saltos hacia adelante
    this.validateJumpTargetsAreForward(logicRules, questions);

    // 7️⃣ Normalizar orden de reglas
    const orderedRules = SurveyAuxValidator.getNormalizedRules(
      logicRules,
      questions
    );

    return orderedRules;
  }
}
