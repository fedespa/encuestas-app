import { LogicRuleEntity } from "../src/domain/logic-rule/logic-rule.entity.js";
import type { QuestionEntity } from "../src/domain/question/question.entity.js";
import { SurveyResponseError } from "../src/domain/survey/survey.errors.js";
import { SurveyResponseValidator } from "../src/domain/survey/validation/survey-response.validator.js";
import { createAnswer, createQuestion, createRule } from "./helpers/survey.factories.js";

describe("SurveyResponseValidator.validateSurveyResponse", () => {
  test("Lanza error si hay respuestas duplicadas (q1)", () => {
    const questions: QuestionEntity[] = [
      createQuestion({ id: "q1", order: 1 }),
      createQuestion({ id: "q2", order: 2 }),
    ];

    const answers = [
      createAnswer("q1", "aaaa"),
      createAnswer("q2", "adads"),
      createAnswer("q3", "asdasda"),
      createAnswer("q1", "asdasda"),
    ];

    const rules: LogicRuleEntity[] = [];

    expect(() => {
      SurveyResponseValidator.validateSurveyResponse(questions, answers, rules);
    }).toThrow(SurveyResponseError);

    expect(() => {
      SurveyResponseValidator.validateSurveyResponse(questions, answers, rules);
    }).toThrow(/duplicadas/i);
  });

  test("Lanza error si hay tipos de respuestas que no coinciden con el tipo de preguntas", () => {
    const questions: QuestionEntity[] = [
      createQuestion({ id: "q1", order: 1 }),
      createQuestion({ id: "q2", order: 2 }),
      createQuestion({ id: "q3", order: 3 }),
      createQuestion({
        id: "q4",
        order: 4,
        type: "date",
        options: { type: "date" },
      }),
    ];

    const answers = [
      createAnswer("q1", "aaaa"),
      createAnswer("q2", "adads"),
      createAnswer("q3", "asdasda"),
      createAnswer("q4", "no-date"),
    ];

    const rules: LogicRuleEntity[] = [];

    expect(() => {
      SurveyResponseValidator.validateSurveyResponse(questions, answers, rules);
    }).toThrow(SurveyResponseError);

    expect(() => {
      SurveyResponseValidator.validateSurveyResponse(questions, answers, rules);
    }).toThrow(/tipo/i);
  });

  test("Lanza error si hay respuestas a preguntas que no existen", () => {
    const questions: QuestionEntity[] = [
      createQuestion({ id: "q1", order: 1 }),
      createQuestion({ id: "q2", order: 2 }),
      createQuestion({ id: "q3", order: 3 }),
    ];

    const answers = [
      createAnswer("q1", "aaaa"),
      createAnswer("q2", "adads"),
      createAnswer("q3", "asdasda"),
      createAnswer("q4", "no-date"),
    ];

    const rules: LogicRuleEntity[] = [];

    expect(() => {
      SurveyResponseValidator.validateSurveyResponse(questions, answers, rules);
    }).toThrow(SurveyResponseError);

    expect(() => {
      SurveyResponseValidator.validateSurveyResponse(questions, answers, rules);
    }).toThrow(/inexistente/i);
  });

  test("Lanza error si una pregunta evitada por un jump_to es respondida (q2)", () => {
    const questions: QuestionEntity[] = [
      createQuestion({ id: "q1", order: 1 }),
      createQuestion({ id: "q2", order: 2 }),
      createQuestion({ id: "q3", order: 3 }),
    ];

    const answers = [
      createAnswer("q1", "yes"),
      createAnswer("q2", "adads"),
      createAnswer("q3", "asdasda"),
    ];

    const rules: LogicRuleEntity[] = [
      createRule({ sourceQuestionId: "q1", targetQuestionId: "q3" }),
    ];

    expect(() => {
      SurveyResponseValidator.validateSurveyResponse(questions, answers, rules);
    }).toThrow(SurveyResponseError);
  });

  test("Lanza error si responde una pregunta marcada como hide (q2)", () => {
    const questions: QuestionEntity[] = [
      createQuestion({ id: "q1", order: 1 }),
      createQuestion({ id: "q2", order: 2 }),
      createQuestion({ id: "q3", order: 3 }),
      createQuestion({ id: "q4", order: 4 }),
    ];

    const answers = [
      createAnswer("q1", "yes"),
      createAnswer("q2", "adads"),
      createAnswer("q3", "asdasda"),
      createAnswer("q4", "asdasda"),
    ];

    const rules: LogicRuleEntity[] = [
      createRule({
        sourceQuestionId: "q1",
        targetQuestionId: "q2",
        action: "hide",
      }),
    ];

    expect(() => {
      SurveyResponseValidator.validateSurveyResponse(questions, answers, rules);
    }).toThrow(SurveyResponseError);
  });

  test("Lanza error si no responde una pregunta marcada como show (q4)", () => {
     const questions: QuestionEntity[] = [
      createQuestion({ id: "q1", order: 1 }),
      createQuestion({ id: "q2", order: 2 }),
      createQuestion({ id: "q3", order: 3 }),
      createQuestion({ id: "q4", order: 4 }),
    ];

    const answers = [
      createAnswer("q1", "abc"),
      createAnswer("q2", "abcd"),
      createAnswer("q3", "yes"),
    ];

    const rules: LogicRuleEntity[] = [
      createRule({
        sourceQuestionId: "q3",
        targetQuestionId: "q4",
        action: "show",
        value: "yes"
      }),
      createRule({
        sourceQuestionId: "q3",
        targetQuestionId: "q4",
        action: "hide",
        value: "no"
      })
    ];

    expect(() => {
      SurveyResponseValidator.validateSurveyResponse(questions, answers, rules);
    }).toThrow(SurveyResponseError);
  })
});
