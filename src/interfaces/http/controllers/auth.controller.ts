import type { Request, Response } from "express";
import type { RegisterUseCase } from "../../../application/use-cases/auth/register.usecase.js";
import type { VerifyEmailUseCase } from "../../../application/use-cases/auth/verify-email.usecase.js";
import { VerificationTokenNotProvidedError } from "../../../domain/verification-token/verification-token.errors.js";
import type { LoginUseCase } from "../../../application/use-cases/auth/login.usecase.js";

export class AuthController {
  constructor(
    private readonly deps: {
      registerUseCase: RegisterUseCase;
      verifyEmailUseCase: VerifyEmailUseCase;
      loginUseCase: LoginUseCase;
    }
  ) {}

  public async register(req: Request, res: Response) {
    const { email, password } = req.body;
    const registerResponse = await this.deps.registerUseCase.execute({
      email,
      password,
    });

    return res.status(201).json(registerResponse);
  }

  public async verify(req: Request, res: Response) {
    const token = req.query.token;

    if (!token) {
      throw new VerificationTokenNotProvidedError();
    }

    const result = await this.deps.verifyEmailUseCase.execute({
      token: token.toString(),
    });

    const { user, accessToken, refreshToken } = result;

    return res.status(200).json({
      user,
      accessToken,
      refreshToken, // BORRAR DE ACA
    });
  }

  public async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const loginResponse = await this.deps.loginUseCase.execute({
      email,
      password,
    });

    const { user, accessToken, refreshToken } = loginResponse;

    return res.status(200).json({
      user,
      accessToken,
      refreshToken, // BORRAR DE ACA
    });
  }
}
