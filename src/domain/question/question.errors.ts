import { AppError } from "../../shared/errors/app-error.js";

export class QuestionDoesNotBelongToSurveyError extends AppError {
  constructor() {
    super(
      `Una pregunta no pertenece a esta encuesta.`,
      400
    );
    this.name = "QuestionDoesNotBelongToSurveyError";
  }
}

export class RequiredQuestionNotAnsweredError extends AppError {
  constructor() {
    super(
      `Una pregunta es requerida y no fue respondida.`,
      400
    );
    this.name = "RequiredQuestionNotAnsweredError";
  }
}


export class InvalidAnswerTypeError extends AppError {
  constructor() {
    super(
      `Una pregunta tiene un tipo de respuesta inválido.`,
      400
    );
    this.name = "InvalidAnswerTypeError";
  }
}

export class InvalidQuestionOptionsError extends AppError {
  constructor() {
    super(
      `Las opciones de una de las preguntas son inválidas para su tipo.`,
      500
    );
    this.name = "InvalidQuestionOptionsError";
  }
}

export class InvalidRatingAnswerError extends AppError {
  constructor() {
    super(
      `La pregunta del rating debe estar dentro del rango.`,
      400
    );
    this.name = "InvalidRatingAnswerError";
  }
}

export class InvalidSingleChoiceAnswerError extends AppError {
  constructor() {
    super(
      `La opción elegida no es válida para una de las preguntas.`,
      400
    );
    this.name = "InvalidSingleChoiceAnswerError";
  }
}

export class InvalidMultipleChoiceAnswerError extends AppError {
  constructor() {
    super(
      `La opción enviada no es válida para la pregunta. `,
      400
    );
    this.name = "InvalidMultipleChoiceAnswerError";
  }
}

