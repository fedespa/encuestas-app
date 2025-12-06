import { RefreshTokenEntity } from "../../../domain/refresh-token/refresh-token.entity.js";
import type { IRefreshTokenRepository } from "../../../domain/refresh-token/refresh-token.repository.js";
import { UserNotFoundError } from "../../../domain/user/user.errors.js";
import type { IUserRepository } from "../../../domain/user/user.repository.js";
import {
  VerificationTokenExpiredError,
  VerificationTokenNotFoundError,
} from "../../../domain/verification-token/verification-token.errors.js";
import type { IVerificationTokenRepository } from "../../../domain/verification-token/verification-token.repository.js";
import type { LoginVm } from "../../../interfaces/http/view-models/auth/login.vm.js";
import { UserMapper } from "../../mappers/user/user.vm.mapper.js";
import type { JwtService } from "../../services/jwt.service.js";
import type { TokenService } from "../../services/token.service.js";

export class VerifyEmailUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly verificationTokenRepository: IVerificationTokenRepository,
    private readonly jwtService: JwtService,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly tokenService: TokenService
  ) {}

  async execute(input: { token: string }): Promise<LoginVm> {
    const verificationToken = await this.verificationTokenRepository.findByToken(
      input.token
    );

    if (!verificationToken) {
      throw new VerificationTokenNotFoundError();
    }

    if (verificationToken.isExpired()) {
      await this.verificationTokenRepository.deleteByToken(input.token);
      throw new VerificationTokenExpiredError();
    }

    const user = await this.userRepository.findById(verificationToken.getUserId());

    if (!user) {
      throw new UserNotFoundError();
    }

    user.verifyEmail();

    const updatedUser = await this.userRepository.update(user.getId(), user);

    await this.verificationTokenRepository.deleteByToken(input.token);

    const accessToken = await this.jwtService.generateAccessToken({
      userId: updatedUser.getId(),
    });

    const refreshToken = await this.jwtService.generateRefreshToken({
      userId: updatedUser.getId(),
    });

    this.refreshTokenRepository.create(RefreshTokenEntity.create({
      id: this.tokenService.generateUUID(),
      userId: updatedUser.getId(),
      token: refreshToken,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
    }))

    return {
      user: UserMapper.toVm(updatedUser),
      accessToken,
      refreshToken
    };
  }
}
