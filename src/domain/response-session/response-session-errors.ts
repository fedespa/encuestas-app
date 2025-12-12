import { AppError } from "../../shared/errors/app-error.js";

export class ResponseSessionNotFoundError extends AppError {
  constructor() {
    super(
      "La sesión de respuestas no existe.",
      404
    );
    this.name = "ResponseSessionNotFoundError";
  }
}

export class SessionAlreadyFinishedError extends AppError {
  constructor() {
    super(
      "La sesión ya fue finalizada.",
      400
    );
    this.name = "SessionAlreadyFinishedError";
  }
}

export class SessionHasNoUserError extends AppError {
  constructor() {
    super(
      "La sesión no está asociada a ningún usuario.",
      400
    );
    this.name = "SessionHasNoUserError";
  }
}

export class SessionUserMismatchError extends AppError {
  constructor() {
    super(
      "El usuario autenticado no coincide con el usuario propietario de la sesión.",
      403
    );
    this.name = "SessionUserMismatchError";
  }
}

export class SessionDoesNotAllowAnonymousError extends AppError {
  constructor() {
    super(
      "Esta sesión pertenece a un usuario registrado. No se permite responder como usuario anónimo.",
      403
    );
    this.name = "SessionDoesNotAllowAnonymousError";
  }
}