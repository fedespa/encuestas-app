import { AppError } from "../../shared/errors/app-error.js";

export class RefreshTokenNotFoundError extends AppError {
  constructor() {
    super("El token no existe!. ", 404);
    this.name = "RefreshTokenNotFoundError";
  }
}

export class RefreshTokenExpiredError extends AppError {
  constructor() {
    super("El token está expirado!. ");
    this.name = "RefreshTokenExpiredError";
  }
}

export class RefreshTokenInvalidPayloadError extends AppError {
  constructor() {
    super("El payload del token es incorrecto!. ", 400);
    this.name = "RefreshTokenInvalidPayloadError";
  }
}

export class RefreshTokenInvalidError extends AppError {
  constructor (){
    super("El token es inválido. ");
    this.name = "RefreshTokenInvalidError"
  }
}