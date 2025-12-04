import { UserNotVerifiedError } from "../../../domain/user/user.errors.js";
import { AppError } from "../../../shared/errors/app-error.js";

export function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode || 400).json({
      error: err.message,
      name: err.name,
      ...(err instanceof UserNotVerifiedError && {
        verificationUrl: err.verificationUrl,
      }),
    });
  }

  return res.status(500).json({
    error: "Error interno del servidor",
  });
}
