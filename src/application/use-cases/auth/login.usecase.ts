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
import type { LoginVm } from "../../../interfaces/http/view-models/auth/login.vm.js";
import { UserMapper } from "../../mappers/user/user.vm.mapper.js";
import type { HashService } from "../../services/hash.service.js";
import type { JwtService } from "../../services/jwt.service.js";
import type { TokenService } from "../../services/token.service.js";

export class LoginUseCase {
  constructor(
    private readonly hashService: HashService,
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly tokenService: TokenService,
    private readonly verificationTokenRepository: IVerificationTokenRepository
  ) {}

  async execute(input: { email: string; password: string }): Promise<LoginVm> {
    const { email, password } = input;

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UserNotFoundError();
    }

    const isValid = await this.hashService.compare(password, user.getPassword());

    if (!isValid) {
      throw new InvalidCredentialsError();
    }

    if (!user.getIsVerified()) {
      await this.verificationTokenRepository.deleteAllByUserId(user.getId());

      const token = await this.tokenService.generate();

      const verificationToken = VerificationTokenEntity.create({
        id: this.tokenService.generateUUID(),
        userId: user.getId(),
        token: token,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        createdAt: new Date(),
      });

      await this.verificationTokenRepository.create(verificationToken);

      const verificationUrl = `http://localhost:3000/auth/verify?token=${token}`;

      throw new UserNotVerifiedError(verificationUrl);
    }

    const accessToken = await this.jwtService.generateAccessToken({
      userId: user.getId(),
    });

    const refreshToken = await this.jwtService.generateRefreshToken({
      userId: user.getId(),
    });

    await this.refreshTokenRepository.create(
      RefreshTokenEntity.create({
        id: this.tokenService.generateUUID(),
        userId: user.getId(),
        token: refreshToken,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      })
    );

    return {
      user: UserMapper.toVm(user),
      accessToken,
      refreshToken,
    };
  }
}
