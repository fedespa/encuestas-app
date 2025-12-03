import { RegisterUseCase } from "../../../application/auth/register.usecase.js";
import type { Request, Response } from "express";
import { EmailAlreadyExistsError } from "../../../domain/user/user.errors.js";

export class AuthController {

  constructor(private readonly deps: {
    registerUseCase: RegisterUseCase
  }){}

  public async register(req: Request, res: Response) {
    try {
      const user = await this.deps.registerUseCase.execute({
        email: req.body.email,
        password: req.body.password,
      });

      return res.status(201).json(user);
    } catch (error: any) {
      if (error instanceof EmailAlreadyExistsError) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}
