import { AppError } from "../../shared/errors/app-error.js";

export class VerificationTokenNotFoundError extends AppError {
  constructor() {
    super(`El token de verificación no existe o es inválido.`, 404);
    this.name = "VerificationTokenNotFoundError";
  }
}

export class VerificationTokenExpiredError extends AppError {
  constructor() {
    super(`El token de verificación ha expirado.`, 410);
    this.name = "VerificationTokenExpiredError";
  }
}

export class VerificationTokenNotProvidedError extends AppError {
  constructor() {
    super("No se ha proporcionado el token de verificación.");
    this.name = "VerificationTokenNotProvidedError";
  }
}
