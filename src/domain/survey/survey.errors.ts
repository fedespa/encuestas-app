import { AppError } from "../../shared/errors/app-error.js";

export class PrivateSurveyRequiresLoginError extends AppError {
  constructor() {
    super(
      "Para crear una encuesta privada debes iniciar sesión.",
      401
    );
    this.name = "PrivateSurveyRequiresLoginError";
  }
}

export class SurveyNotFoundError extends AppError {
  constructor() {
    super(
      "La encuesta solicitada no existe.",
      404
    );
    this.name = "SurveyNotFoundError";
  }
}

export class SurveyCreationError extends AppError {
  constructor (message: string){
    super(
      `Error en la creación de la encuesta: ${message}`,
      400
    )
    this.name = "SurveyCreationError"
  }
}

export class SurveyResponseError extends AppError {
  constructor(message: string) {
    super(`Error en la respuesta de la encuesta: ${message}`);
    this.name = "SurveyResponseError";
  }
}

export class SurveyWithoutQuestions extends AppError {
  constructor() {
    super(
      `La encuesta no tiene preguntas. `,
      500
    );
    this.name = "SurveyWithoutQuestions";
  }
}
