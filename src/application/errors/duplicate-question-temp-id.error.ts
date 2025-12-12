import { SurveyCreationError } from "../../domain/survey/survey.errors.js";


export class DuplicateQuestionTempIdError extends SurveyCreationError {
  constructor(tempId: string) {
    super(`El tempId '${tempId}' está repetido en las preguntas.`);
    this.name = "DuplicateQuestionTempIdError";
  }
}
