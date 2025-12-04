import { AppError } from "../../shared/errors/app-error.js";

export class EmailAlreadyExistsError extends AppError {
  constructor(email: string) {
    super(`El email ${email} ya está registrado.`, 409);
    this.name = "EmailAlreadyExistsError";
  }
}

export class UserNotFoundError extends AppError {
  constructor() {
    super(`El usuario no existe.`, 404);
    this.name = "UserNotFoundError";
  }
}

export class InvalidCredentialsError extends AppError {
  constructor() {
    super("Credenciales incorrectas.", 401);
    this.name = "InvalidCredentialsError";
  }
}

export class UserNotVerifiedError extends AppError {
  public verificationUrl: string | undefined;

  constructor(verificationUrl?: string) {
    super("El usuario no está verificado. Se envió un nuevo token de verificación.", 403);
    this.name = "UserNotVerifiedError";
    this.verificationUrl = verificationUrl;
  }
}
