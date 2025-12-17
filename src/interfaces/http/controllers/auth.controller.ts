import type { Request, Response } from "express";
import type { RegisterUseCase } from "../../../application/use-cases/auth/register.usecase.js";
import type { VerifyEmailUseCase } from "../../../application/use-cases/auth/verify-email.usecase.js";
import { VerificationTokenNotProvidedError } from "../../../domain/verification-token/verification-token.errors.js";
import type { LoginUseCase } from "../../../application/use-cases/auth/login.usecase.js";
import type { RefreshTokenUseCase } from "../../../application/use-cases/auth/refresh-token.usecase.js";

export class AuthController {
  constructor(
    private readonly deps: {
      registerUseCase: RegisterUseCase;
      verifyEmailUseCase: VerifyEmailUseCase;
      loginUseCase: LoginUseCase;
      refreshTokenUseCase: RefreshTokenUseCase;
    }
  ) {}

  public async register(req: Request, res: Response) {
    const { email, password } = req.body;
    const registerResponse = await this.deps.registerUseCase.execute({
      email,
      password,
    });

    const { verificationToken } = registerResponse;

    // En demo: construyo la URL para mostrar al usuario
    const verificationUrl = `http://localhost:3000/auth/verify?token=${verificationToken}`;

    /**
     * 🔹 Nota de producción:
     * En producción, la URL de verificación se enviaría por email y NO se incluiría
     * en el JSON de la respuesta HTTP.
     * El endpoint devuelve solo un mensaje de éxito.
     */
    return res.status(201).json({ message: "Se registró correctamente. Verifica tu email.", verificationUrl });
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

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/auth/refresh",
    });

    return res.status(200).json({
      user,
      accessToken,
    });
  }

  public async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const loginResponse = await this.deps.loginUseCase.execute({
      email,
      password,
    });

    const { user, accessToken, refreshToken } = loginResponse;

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/auth/refresh",
    });

    return res.status(200).json({
      user,
      accessToken,
    });
  }

  public async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: "Token no enviado. " });
    }

    const response = await this.deps.refreshTokenUseCase.execute(refreshToken);

    return res.json(response);
  }
}
