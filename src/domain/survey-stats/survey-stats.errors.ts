import { AppError } from "../../shared/errors/app-error.js";

export class SurveyStatsNotFoundError extends AppError {
    constructor () {
        super(
            "Las estadisticas sobre la encuesta no existen. ",
            404
        )
        this.name = "SurveyStatsNotFoundError"
    }
}

export class InconsistentSurveyStatsError extends AppError {
  constructor() {
    super(`Estadisticas de la encuesta son inconsistente. `);
  }
}

export class PrivateSurveyStatsError extends AppError {
  constructor() {
    super(`Las estadísticas de la encuesta son privadas. `);
  }
}
