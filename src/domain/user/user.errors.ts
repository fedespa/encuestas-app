import { AppError } from "../../shared/errors/app-error.js";

export class EmailAlreadyExistsError extends AppError {
  constructor(email: string) {
    super(`El email ${email} ya está registrado.`);
    this.name = "EmailAlreadyExistsError";
  }
}

export class UserNotFoundError extends AppError {
  constructor(id: string) {
    super(`El usuario con ID ${id} no existe.`);
    this.name = "UserNotFoundError";
  }
}
