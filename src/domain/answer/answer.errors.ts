import { AppError } from "../../shared/errors/app-error.js";

export class AnswerNotFoundForQuestionError extends AppError {
  constructor() {
    super("Respuesta no encontrada para una de las preguntas. ", 500);
    this.name = "AnswerNotFoundForQuestionError";
  }
}
