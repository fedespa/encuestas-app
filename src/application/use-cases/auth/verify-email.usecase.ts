import { RefreshTokenEntity } from "../../../domain/refresh-token/refresh-token.entity.js";
import { AlreadyVerifiedUser, UserNotFoundError } from "../../../domain/user/user.errors.js";
import type { IUserRepository } from "../../../domain/user/user.repository.js";
import {
  VerificationTokenExpiredError,
  VerificationTokenNotFoundError,
} from "../../../domain/verification-token/verification-token.errors.js";
import type { IVerificationTokenRepository } from "../../../domain/verification-token/verification-token.repository.js";
import type { LoginVm } from "../../view-models/auth/login.vm.js";
import { UserMapper } from "../../mappers/user/user.vm.mapper.js";
import type { JwtService } from "../../services/jwt.service.js";
import type { TokenService } from "../../services/token.service.js";
import type { IUnitOfWork } from "../../services/unit-of-work.js";

export class VerifyEmailUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly verificationTokenRepository: IVerificationTokenRepository,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    private readonly unitOfWork: IUnitOfWork
  ) {}

  async execute(input: { token: string }): Promise<LoginVm> {
    const verificationToken =
      await this.verificationTokenRepository.findByToken(input.token);

    if (!verificationToken) {
      throw new VerificationTokenNotFoundError();
    }

    if (verificationToken.isExpired()) {
      await this.verificationTokenRepository.deleteByToken(input.token);
      throw new VerificationTokenExpiredError();
    }

    const user = await this.userRepository.findById(verificationToken.userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    if (user.isVerified) {
      throw new AlreadyVerifiedUser();
    }

    user.verifyEmail();

    const refreshTokenId = this.tokenService.generateUUID();

    const accessToken = await this.jwtService.generateAccessToken({
      userId: user.id,
    });

    const refreshToken = await this.jwtService.generateRefreshToken({
      userId: user.id,
      jti: refreshTokenId
    });

    const refreshTokenEntity = RefreshTokenEntity.create({
      id: refreshTokenId,
      userId: user.id,
      token: refreshToken,
    });

    await this.unitOfWork.execute(async (unitOfWork) => {
      await unitOfWork.auth.userRepository.update(user.id, user);
      await unitOfWork.auth.verificationTokenRepository.deleteByToken(input.token);
      await unitOfWork.auth.refreshTokenRepository.create(refreshTokenEntity);
    });

    return {
      user: UserMapper.toVm(user),
      accessToken,
      refreshToken,
    };
  }
}
