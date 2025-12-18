import { RefreshTokenEntity } from "../../../domain/refresh-token/refresh-token.entity.js";
import type { IRefreshTokenRepository } from "../../../domain/refresh-token/refresh-token.repository.js";
import {
  InvalidCredentialsError,
  UserNotFoundError,
  UserNotVerifiedError,
} from "../../../domain/user/user.errors.js";
import type { IUserRepository } from "../../../domain/user/user.repository.js";
import { VerificationTokenEntity } from "../../../domain/verification-token/verification-token.entity.js";
import type { IVerificationTokenRepository } from "../../../domain/verification-token/verification-token.repository.js";
import type { LoginVm } from "../../view-models/auth/login.vm.js";
import { UserMapper } from "../../mappers/user/user.vm.mapper.js";
import type { HashService } from "../../services/hash.service.js";
import type { JwtService } from "../../services/jwt.service.js";
import type { TokenService } from "../../services/token.service.js";
import type { ILoggerService } from "../../services/logger.service.js";
import { envConfig } from "../../../infrastructure/config/env.js";

export class LoginUseCase {
  constructor(
    private readonly hashService: HashService,
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly tokenService: TokenService,
    private readonly verificationTokenRepository: IVerificationTokenRepository,
    private readonly logger: ILoggerService
  ) {}

  async execute(input: { email: string; password: string }): Promise<LoginVm> {
    const { email, password } = input;

    this.logger.info("Intento de login", { email });

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      this.logger.warn("Usuario no encontrado", { email });
      throw new UserNotFoundError();
    }

    const isValid = await this.hashService.compare(password, user.password);

    if (!isValid) {
      this.logger.warn("Credenciales inválidas", { email });
      throw new InvalidCredentialsError();
    }

    if (!user.isVerified) {
      this.logger.info("Usuario no verificado, generando token", { email });
      await this.verificationTokenRepository.deleteAllByUserId(user.id);

      const token = await this.tokenService.generate();

      const verificationToken = VerificationTokenEntity.create({
        id: this.tokenService.generateUUID(),
        userId: user.id,
        token: token,
      });

      await this.verificationTokenRepository.create(verificationToken);

      const verificationUrl = `${envConfig.corsOrigin}/auth/verify?token=${token}`;
      /**
       * 🔹 Nota de producción:
       * La URL de verificación se envia como parametro al error solo en demo.
       * En producción se enviaría por email.
       */
      this.logger.info("Token de verificación generado", { email, token }); // para demo, nunca en prod

      throw new UserNotVerifiedError(verificationUrl);
    }

    const refreshTokenId = this.tokenService.generateUUID();

    const accessToken = await this.jwtService.generateAccessToken({
      userId: user.id,
    });

    const refreshToken = await this.jwtService.generateRefreshToken({
      userId: user.id,
      jti: refreshTokenId,
    });

    const hashedRefreshToken = await this.hashService.hash(refreshToken);

    const refreshTokenEntity = RefreshTokenEntity.create({
      id: refreshTokenId,
      userId: user.id,
      token: hashedRefreshToken,
    });

    await this.refreshTokenRepository.create(refreshTokenEntity);

    this.logger.info("Login exitoso", {
      userId: user.id,
      email,
      refreshTokenId,
    });

    return {
      user: UserMapper.toVm(user),
      accessToken,
      refreshToken,
    };
  }
}
