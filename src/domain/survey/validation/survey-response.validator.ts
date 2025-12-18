import type { LogicRuleEntity } from "../../logic-rule/logic-rule.entity.js";
import { QuestionEntity } from "../../question/question.entity.js";
import {
  InvalidAnswerTypeError,
  InvalidQuestionOptionsError,
} from "../../question/question.errors.js";
import type { QuestionOptions } from "../../question/question.types.js";
import {
  SurveyResponseError,
} from "../survey.errors.js";
import { SurveyAuxValidator } from "./survey-aux.validator.js";

export interface AnswerInterface {
  questionId: string;
  value: any;
}

export interface JumpInterface {
  from: string;
  to: string;
}

export class SurveyResponseValidator {
  static validateQuestionsExistInAnswers(
    questions: QuestionEntity[],
    answers: AnswerInterface[]
  ): void {
    const questionsIds = new Set(questions.map((q) => q.id));

    for (const ans of answers) {
      if (!questionsIds.has(ans.questionId)) {
        throw new SurveyResponseError(
          `Una de las respuestas enviada referencia una pregunta inexistente.`
        );
      }
    }
  }

  static validateAnswerTypesMatchSchema(
    questions: QuestionEntity[],
    answers: AnswerInterface[]
  ) {
    const questionMap = new Map(questions.map((q) => [q.id, q]));

    for (const ans of answers) {
      const question = questionMap.get(ans.questionId);
      if (!question) continue;

      const type = question.type;
      const options = question.options;

      switch (type) {
        case "text":
          this.validateTextAnswer(ans.value);
          break;

        case "number":
          this.validateNumberAnswer(ans.value);
          break;

        case "date":
          this.validateDateAnswer(ans.value);
          break;

        case "rating":
          if (options.type !== "rating") {
            throw new InvalidQuestionOptionsError();
          }
          this.validateRatingAnswer(ans.value, options);
          break;

        case "single_choice":
          if (options.type !== "single_choice") {
            throw new InvalidQuestionOptionsError();
          }
          this.validateSingleChoiceAnswer(ans.value, options);
          break;

        case "multiple_choice":
          if (options.type !== "multiple_choice") {
            throw new InvalidQuestionOptionsError();
          }
          this.validateMultipleChoiceAnswer(ans.value, options);
          break;

        default:
          throw new InvalidAnswerTypeError();
      }
    }
  }

  static validateJumpRuleIntermediateQuestions(
    questions: QuestionEntity[],
    answers: AnswerInterface[],
    rules: LogicRuleEntity[]
  ) {
    const answersMap = new Map(answers.map((a) => [a.questionId, a.value]));

    const activeJumps = this.getActiveJumps(rules, answersMap);

    for (const question of questions) {
      const isSkipped = this.isJumpSkipped(question.id, questions, activeJumps);
      if (isSkipped && answersMap.has(question.id)) {
        throw new SurveyResponseError(
          `Una de las preguntas no debe haber sido contestada debido a jump_to. `
        );
      }
    }
  }

  static validateNoDuplicateAnswers(answers: AnswerInterface[]) {
    const seen = new Set<string>();
    for (const ans of answers) {
      if (seen.has(ans.questionId)) {
        throw new SurveyResponseError(`Hay respuestas duplicadas. `);
      }
      seen.add(ans.questionId);
    }
  }

  static validateSurveyResponse(
    questions: QuestionEntity[],
    answers: AnswerInterface[],
    rules: LogicRuleEntity[]
  ): void {
    const orderedQuestions = [...questions].sort((a, b) => a.order - b.order);
    const orderedRules = SurveyAuxValidator.getNormalizedRules(
      rules,
      orderedQuestions
    );

    // Valida que no haya respuestas duplicadas.
    this.validateNoDuplicateAnswers(answers);

    // Valida que existan todas las preguntas que se respondieron.
    this.validateQuestionsExistInAnswers(orderedQuestions, answers);

    // Valida tipos.
    this.validateAnswerTypesMatchSchema(orderedQuestions, answers);

    // Validar que jump to no tenga respuestas intermedias
    this.validateJumpRuleIntermediateQuestions(
      orderedQuestions,
      answers,
      orderedRules
    );

    this.validateFlow(orderedQuestions, answers, rules);

    this.validateCompletion(orderedQuestions, answers, rules);
  }

  static validatePartialResponse(
    questions: QuestionEntity[],
    answers: AnswerInterface[],
    rules: LogicRuleEntity[]
  ): void {
    const orderedQuestions = [...questions].sort((a, b) => a.order - b.order);

    const orderedRules = SurveyAuxValidator.getNormalizedRules(
      rules,
      orderedQuestions
    );

    this.validateNoDuplicateAnswers(answers);

    this.validateQuestionsExistInAnswers(orderedQuestions, answers);

    this.validateAnswerTypesMatchSchema(orderedQuestions, answers);

    this.validateJumpRuleIntermediateQuestions(
      orderedQuestions,
      answers,
      orderedRules
    );

    this.validateFlow(orderedQuestions, answers, rules);
  
  }

  static getActiveJumps(
    rules: LogicRuleEntity[],
    answerMap: Map<string, any>
  ): JumpInterface[] {
    return rules
      .filter(
        (r) =>
          r.action === "jump_to" &&
          SurveyAuxValidator.evaluateRuleCondition(r, answerMap)
      )
      .map((r) => ({
        from: r.sourceQuestionId,
        to: r.targetQuestionId,
      }));
  }

  static isJumpSkipped(
    questionId: string,
    questions: QuestionEntity[],
    activeJumps: JumpInterface[]
  ): boolean {
    for (const jump of activeJumps) {
      const sourcePosition = questions.find((q) => q.id === jump.from)!.order;
      const targetPosition = questions.find((q) => q.id === jump.to)!.order;

      const questionPosition = questions.find(
        (q) => q.id === questionId
      )!.order;

      if (
        questionPosition > sourcePosition &&
        questionPosition < targetPosition
      ) {
        return true;
      }
    }

    return false;
  }

  static getShowHideState(
    questionId: string,
    rules: LogicRuleEntity[],
    answerMap: Map<string, any>
  ): "show" | "hide" | "none" {
    const affecting = rules.filter((r) => r.targetQuestionId === questionId);

    let show = false;
    let hide = false;

    for (const rule of affecting) {
      const triggered = SurveyAuxValidator.evaluateRuleCondition(
        rule,
        answerMap
      );
      if (!triggered) continue;

      if (rule.action === "hide") hide = true;
      if (rule.action === "show") show = true;
    }

    if (hide) return "hide";
    if (show) return "show";

    return "none";
  }

  static isBlockedByPrevious(
    questionIndex: number,
    questions: QuestionEntity[],
    rules: LogicRuleEntity[],
    answerMap: Map<string, any>,
    activeJumps: JumpInterface[]
  ): boolean {
    for (let i = 0; i < questionIndex; i++) {
      const prev = questions[i]!;

      // Si está saltada por jump_to → NO bloquea el flujo
      const skippedByJump = this.isJumpSkipped(prev.id, questions, activeJumps);
      if (skippedByJump) continue;

      // Si está oculta por reglas show/hide → NO bloquea el flujo
      const visibilityState = this.getShowHideState(prev.id, rules, answerMap);
      const hiddenByRules = visibilityState === "hide";
      if (hiddenByRules) continue;

      if (!prev.required) continue;

      // Si está respondida → NO bloquea
      const prevAnswered = answerMap.has(prev.id);
      if (prevAnswered) continue;

      return true; // Esta bloqueada
    }

    return false; // NO ESTA BLOQUEDA
  }

  static getFinalVisibility(
    questionId: string,
    questions: QuestionEntity[],
    rules: LogicRuleEntity[],
    answerMap: Map<string, any>
  ): boolean {
    const questionIndex = questions.findIndex((q) => q.id === questionId);

    const activeJumps = this.getActiveJumps(rules, answerMap);

    // 1) Si está saltada por un jump_to → NO visible
    const skipped = this.isJumpSkipped(questionId, questions, activeJumps);
    if (skipped) return false;

    // 2) Si el flujo está bloqueado por una pregunta anterior visible y no respondida → NO visible
    const blocked = this.isBlockedByPrevious(
      questionIndex,
      questions,
      rules,
      answerMap,
      activeJumps
    );
    if (blocked) return false;

    const showHideState = this.getShowHideState(questionId, rules, answerMap);

    if (showHideState === "hide") return false;
    if (showHideState === "show") return true;

    return true;
  }

  static validateFlow(
    questions: QuestionEntity[],
    answers: AnswerInterface[],
    rules: LogicRuleEntity[]
  ) {
    const answerMap = new Map(answers.map((a) => [a.questionId, a.value]));

    for (const q of questions) {
      const visible = this.getFinalVisibility(
        q.id,
        questions,
        rules,
        answerMap
      );
      const answered = answerMap.has(q.id);

      if (!visible && answered) {
        throw new SurveyResponseError(
          `Una pregunta estaba visible pero fue respondida.`
        );
      }
    }
  }

  static validateCompletion(
    questions: QuestionEntity[],
    answers: AnswerInterface[],
    rules: LogicRuleEntity[]
  ) {
    const answerMap = new Map(answers.map((a) => [a.questionId, a.value]));

    for (const q of questions) {
      const visible = this.getFinalVisibility(
        q.id,
        questions,
        rules,
        answerMap
      );
      const answered = answerMap.has(q.id);

      if (visible && q.required && !answered) {
        throw new SurveyResponseError(
          `Una de las preguntas es requerida y estaba visible, pero no fue respondida.`
        );
      }
    }
  }

  static getAbandonedQuestion(
    answers: AnswerInterface[],
    questions: QuestionEntity[],
    rules: LogicRuleEntity[]
  ): QuestionEntity | null {
    const answersMap = new Map(answers.map((a) => [a.questionId, a.value]));

    for (const question of questions) {
      const isVisible = this.getFinalVisibility(
        question.id,
        questions,
        rules,
        answersMap
      );
      const answered = answersMap.has(question.id);

      if (isVisible && !answered) return question;
    }

    return null;
  }

  // VALIDAR DATOS
  static validateDateAnswer(value: any) {
    const date = new Date(value);

    if (isNaN(date.getTime())) {
      throw new SurveyResponseError(
        "El tipo de la respuesta no coincide con el tipo de la pregunta. "
      );
    }
  }

  static validateNumberAnswer(value: any) {
    if (typeof value !== "number" || Number.isNaN(value)) {
      throw new SurveyResponseError(
        "El tipo de la respuesta no coincide con el tipo de la pregunta. "
      );
    }
  }

  static validateMultipleChoiceAnswer(
    value: any,
    options: Extract<QuestionOptions, { type: "multiple_choice" }>
  ) {
    if (!Array.isArray(value)) {
      throw new SurveyResponseError(
        "El tipo de la respuesta no coincide con el tipo de la pregunta. "
      );
    }

    for (const v of value) {
      if (!options.options.includes(v)) {
        throw new SurveyResponseError(
          "El tipo de la respuesta no coincide con el tipo de la pregunta. "
        );
      }
    }
  }

  static validateSingleChoiceAnswer(
    value: any,
    options: Extract<QuestionOptions, { type: "single_choice" }>
  ) {
    if (typeof value !== "string") {
      throw new SurveyResponseError(
        "El tipo de la respuesta no coincide con el tipo de la pregunta. "
      );
    }

    if (!options.options.includes(value)) {
      throw new SurveyResponseError(
        "El tipo de la respuesta no coincide con el tipo de la pregunta. "
      );
    }
  }

  static validateRatingAnswer(
    value: any,
    options: Extract<QuestionOptions, { type: "rating" }>
  ) {
    if (typeof value !== "number") {
      throw new SurveyResponseError(
        "El tipo de la respuesta no coincide con el tipo de la pregunta. "
      );
    }

    if (value < 1 || value > options.scale) {
      throw new SurveyResponseError(
        "El tipo de la respuesta no coincide con el tipo de la pregunta. "
      );
    }
  }

  static validateTextAnswer(value: any) {
    if (typeof value !== "string") {
      throw new SurveyResponseError(
        "El tipo de la respuesta no coincide con el tipo de la pregunta. "
      );
    }
  }
}