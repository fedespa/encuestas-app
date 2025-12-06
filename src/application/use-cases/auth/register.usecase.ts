import { UserEntity } from "../../../domain/user/user.entity.js";
import { EmailAlreadyExistsError } from "../../../domain/user/user.errors.js";
import type { IUserRepository } from "../../../domain/user/user.repository.js";
import { VerificationTokenEntity } from "../../../domain/verification-token/verification-token.entity.js";
import type { IVerificationTokenRepository } from "../../../domain/verification-token/verification-token.repository.js";
import type { RegisterVm } from "../../../interfaces/http/view-models/auth/register.vm.js";
import { UserMapper } from "../../mappers/user/user.vm.mapper.js";
import type { HashService } from "../../services/hash.service.js";
import type { TokenService } from "../../services/token.service.js";

export class RegisterUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
    private readonly verificationTokenRepository: IVerificationTokenRepository
  ) {}

  async execute(input: {
    email: string;
    password: string;
  }): Promise<RegisterVm> {
    const existingUser = await this.userRepository.findByEmail(input.email);

    if (existingUser) {
      throw new EmailAlreadyExistsError(input.email);
    }

    const hashedPassword = await this.hashService.hash(input.password);

    const user = UserEntity.create({
      id: this.tokenService.generateUUID(),
      email: input.email,
      password: hashedPassword,
      isVerified: false,
    });

    const newUser = await this.userRepository.create(user);

    const newToken = await this.tokenService.generate();

    const verificationToken = VerificationTokenEntity.create({
      id: this.tokenService.generateUUID(),
      userId: user.getId(),
      token: newToken,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      createdAt: new Date(),
    });

    try {
      await this.verificationTokenRepository.create(verificationToken);
    } catch (error) {
      await this.userRepository.delete(newUser.getId())
      throw error
    }

    return {
      user: UserMapper.toVm(newUser),
      verificationUrl: `http://localhost:3000/auth/verify?token=${newToken}`,
    };
  }
}
