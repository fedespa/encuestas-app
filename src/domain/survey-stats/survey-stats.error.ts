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