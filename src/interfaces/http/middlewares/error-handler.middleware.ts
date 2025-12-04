import { AppError } from "../../../shared/errors/app-error.js";

export function errorHandler(err, req, res, next) {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            error: err.message,
            name: err.name
        })
    }

    return res.status(500).json({
        error: "Error interno del servidor"
    })
}