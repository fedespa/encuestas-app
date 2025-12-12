import { AppError } from "../../shared/errors/app-error.js";

export class LogicRuleHideViolationError extends AppError {
  constructor() {
    super(
      `Una de las pregunta no debe responderse debido a una regla lógica (hide).`,
      400
    );
    this.name = "LogicRuleHideViolationError";
  }
}

export class LogicRuleShowViolationError extends AppError {
  constructor() {
    super(
      `Una de las preguntas no debe responderse debido a una regla lógica (show).`,
      400
    );
    this.name = "LogicRuleShowViolationError";
  }
}

export class LogicRuleJumpViolationError extends AppError {
  constructor() {
    super(
      `No deberías responder una de las preguntas porque existe una regla lógica 'jump_to' hacia otra pregunta.`,
      400
    );
    this.name = "LogicRuleJumpViolationError";
  }
}