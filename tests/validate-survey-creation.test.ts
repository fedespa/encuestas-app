import { LogicRuleEntity } from "../src/domain/logic-rule/logic-rule.entity.js";
import type { QuestionEntity } from "../src/domain/question/question.entity.js";
import { SurveyCreationError } from "../src/domain/survey/survey.errors.js";
import { SurveyCreationValidator } from "../src/domain/survey/validation/survey-creation.validator.js";
import { createQuestion, createRule } from "./helpers/survey.factories.js";

describe("SurveyCreationValidator.validateSurveyCreation", () => {
  test("Lanza error si envio 2 preguntas con el mismo orden. ", () => {
    const questions: QuestionEntity[] = [
      createQuestion({ id: "q1", order: 1 }),
      createQuestion({ id: "q2", order: 2 }),
      createQuestion({ id: "q3", order: 3 }),
      createQuestion({ id: "q4", order: 2 }),
    ];

    expect(() => {
      SurveyCreationValidator.validateSurveyCreation(questions, []);
    }).toThrow(SurveyCreationError);
  });

  test("Lanza error si envio 2 reglas exactamente iguales. ", () => {
    const questions: QuestionEntity[] = [
      createQuestion({ id: "q1", order: 1 }),
      createQuestion({ id: "q2", order: 2 }),
      createQuestion({ id: "q3", order: 3 }),
      createQuestion({ id: "q4", order: 4 }),
    ];

    const rules: LogicRuleEntity[] = [
      createRule({ sourceQuestionId: "ab", targetQuestionId: "ac" }),
      createRule({ sourceQuestionId: "ab", targetQuestionId: "ac" }),
    ];

    expect(() => {
      SurveyCreationValidator.validateSurveyCreation(questions, rules);
    }).toThrow(SurveyCreationError);
  });

  test("Lanza error si el target y el source de una regla es el mismo. ", () => {
    const questions: QuestionEntity[] = [
      createQuestion({ id: "q1", order: 1 }),
      createQuestion({ id: "q2", order: 2 }),
      createQuestion({ id: "q3", order: 3 }),
    ];

    const rules: LogicRuleEntity[] = [
      createRule({ sourceQuestionId: "q1", targetQuestionId: "q2" }),
      createRule({ sourceQuestionId: "q3", targetQuestionId: "q3" }),
    ];

    expect(() => {
      SurveyCreationValidator.validateSurveyCreation(questions, rules);
    }).toThrow(SurveyCreationError);
  });

  test("Lanza error si una regla del tipo jump_to va hacia una pregunta anterior. ", () => {
    const questions: QuestionEntity[] = [
      createQuestion({ id: "q1", order: 1 }),
      createQuestion({ id: "q2", order: 2 }),
      createQuestion({ id: "q3", order: 3 }),
      createQuestion({ id: "q4", order: 4 }),
    ];

    const rules: LogicRuleEntity[] = [
      createRule({ sourceQuestionId: "q1", targetQuestionId: "q2" }),
      createRule({
        sourceQuestionId: "q3",
        targetQuestionId: "q1",
        action: "jump_to",
      }),
    ];

    expect(() => {
      SurveyCreationValidator.validateSurveyCreation(questions, rules);
    }).toThrow(SurveyCreationError);
  });

  test("Lanza error si no envío preguntas. ", () => {
    expect(() => {
      SurveyCreationValidator.validateSurveyCreation([], []);
    }).toThrow(SurveyCreationError);
  });

  test("Creo una encuesta correctamente. ", () => {
    const questions: QuestionEntity[] = [
      createQuestion({ id: "q1", order: 1 }),
      createQuestion({ id: "q2", order: 2 }),
      createQuestion({ id: "q3", order: 3 }),
      createQuestion({ id: "q4", order: 4 }),
    ];

    const rules: LogicRuleEntity[] = [
      createRule({ sourceQuestionId: "q1", targetQuestionId: "q3" }),
      createRule({ sourceQuestionId: "q3", targetQuestionId: "q4", action: "hide" }),
    ];

    expect(() => {
      SurveyCreationValidator.validateSurveyCreation(questions, rules);
    }).not.toThrow();
  });

  test("Lanza error si una regla referencia a una pregunta que no existe. ", () => {
    const questions: QuestionEntity[] = [
      createQuestion({ id: "q1", order: 1 }),
      createQuestion({ id: "q2", order: 2 }),
      createQuestion({ id: "q3", order: 3 }),
      createQuestion({ id: "q4", order: 4 }),
    ];

    const rules: LogicRuleEntity[] = [
      createRule({ sourceQuestionId: "q1", targetQuestionId: "q2" }),
      createRule({ sourceQuestionId: "q2", targetQuestionId: "q5" }),
    ];

    expect(() => {
      SurveyCreationValidator.validateSurveyCreation(questions, rules);
    }).toThrow(SurveyCreationError);
  });
});
