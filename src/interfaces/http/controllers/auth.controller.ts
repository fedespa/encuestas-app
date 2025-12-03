
import type { Request, Response } from "express";
import { EmailAlreadyExistsError } from "../../../domain/user/user.errors.js";
import type { RegisterUseCase } from "../../../application/use-cases/auth/register.usecase.js";

export class AuthController {
  constructor(
    private readonly deps: {
      registerUseCase: RegisterUseCase;
    }
  ) {}

  public async register(req: Request, res: Response) {
    try {
      const registerResponse = await this.deps.registerUseCase.execute({
        email: req.body.email,
        password: req.body.password,
      });

      return res.status(201).json(registerResponse);
    } catch (error: any) {
      if (error instanceof EmailAlreadyExistsError) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}
