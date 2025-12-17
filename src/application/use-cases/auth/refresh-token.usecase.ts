import {
  RefreshTokenExpiredError,
  RefreshTokenInvalidError,
  RefreshTokenInvalidPayloadError,
  RefreshTokenNotFoundError,
} from "../../../domain/refresh-token/refresh-token.errors.js";
import type { IRefreshTokenRepository } from "../../../domain/refresh-token/refresh-token.repository.js";
import type { HashService } from "../../services/hash.service.js";
import type { JwtService } from "../../services/jwt.service.js";
import type { ILoggerService } from "../../services/logger.service.js";

export class RefreshTokenUseCase {
  constructor(
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
    private readonly logger: ILoggerService
  ) {}

  async execute(refreshToken: string) {
    this.logger.info("Intento de refresh token");
    const payload = await this.jwtService.verifyRefreshToken(refreshToken);

    if (!payload.userId || !payload.jti) {
      this.logger.warn("Payload de refresh token inválido");
      throw new RefreshTokenInvalidPayloadError();
    }

    const tokenEntity = await this.refreshTokenRepository.findById(payload.jti);

    if (!tokenEntity) {
      this.logger.warn("Refresh token no encontrado", {
        refreshTokenId: payload.jti,
      });
      throw new RefreshTokenNotFoundError();
    }

    if (tokenEntity.isExpired()) {
      this.logger.warn("Refresh token expirado", {
        refreshTokenId: payload.jti,
        userId: payload.userId,
      });
      throw new RefreshTokenExpiredError();
    }

    const isValid = await this.hashService.compare(
      refreshToken,
      tokenEntity.token
    );

    if (!isValid) {
      this.logger.warn("Refresh token inválido", {
        refreshTokenId: payload.jti,
        userId: payload.userId,
      });
      throw new RefreshTokenInvalidError();
    }

    //todo. Rotar Token

    const newAccessToken = await this.jwtService.generateAccessToken({
      userId: payload.userId,
    });

    this.logger.info("Refresh token exitoso", {
      userId: payload.userId,
      refreshTokenId: payload.jti,
    });
    
    return {
      token: newAccessToken,
    };
  }
}
