import type { Request, Response, NextFunction } from "express";
import { UserNotVerifiedError } from "../../../domain/user/user.errors.js";
import { AppError } from "../../../shared/errors/app-error.js";
import type { ILoggerService } from "../../../application/services/logger.service.js";

export function errorHandler(logger: ILoggerService) {
  return (err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (!(err instanceof AppError)) {
      logger.error("Error inesperado capturado por middleware", {
        error: err instanceof Error ? err.stack : err,
        path: req.path,
        method: req.method,
      });

      return res.status(500).json({
        error: "Error interno del servidor",
      });
    }

    return res.status(err.statusCode || 400).json({
      error: err.message,
      name: err.name,
      ...(err instanceof UserNotVerifiedError && {
        verificationUrl: err.verificationUrl, // solo para demo
      }),
    });
  };
}
