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
