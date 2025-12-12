import { AppError } from "../../shared/errors/app-error.js";

export class QuestionStatsCountMismatchError extends AppError {
  constructor() {
    super(
      "El conteo de question stats no coincide con el conteo de preguntas enviadas.",
      500
    );
    this.name = "QuestionStatsCountMismatchError";
  }
}
