import { UserEntity } from "../../../domain/user/user.entity.js";
import { EmailAlreadyExistsError } from "../../../domain/user/user.errors.js";
import type { IUserRepository } from "../../../domain/user/user.repository.js";
import { VerificationTokenEntity } from "../../../domain/verification-token/verification-token.entity.js";
import type { RegisterVm } from "../../view-models/auth/register.vm.js";
import type { HashService } from "../../services/hash.service.js";
import type { TokenService } from "../../services/token.service.js";
import type { IUnitOfWork } from "../../services/unit-of-work.js";
import type { ILoggerService } from "../../services/logger.service.js";

export class RegisterUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
    private readonly unitOfWork: IUnitOfWork,
    private readonly logger: ILoggerService
  ) {}

  async execute(input: {
    email: string;
    password: string;
  }): Promise<RegisterVm> {
    this.logger.info("Intento de registro de usuario", {
      email: input.email,
    });
    const existingUser = await this.userRepository.findByEmail(input.email);

    if (existingUser) {
      this.logger.warn("Intento de registro con email existente", {
        email: input.email,
      });
      throw new EmailAlreadyExistsError(input.email);
    }

    const hashedPassword = await this.hashService.hash(input.password);

    const user = UserEntity.create({
      id: this.tokenService.generateUUID(),
      email: input.email,
      password: hashedPassword,
      isVerified: false,
    });

    const newToken = await this.tokenService.generate();

    const verificationToken = VerificationTokenEntity.create({
      id: this.tokenService.generateUUID(),
      userId: user.id,
      token: newToken,
    });

    await this.unitOfWork.execute(async (unitOfWork) => {
      await unitOfWork.auth.userRepository.create(user);
        await unitOfWork.auth.verificationTokenRepository.create(
          verificationToken
        );
    });

    this.logger.info("Usuario registrado correctamente", {
      userId: user.id,
      email: user.email,
    });

    /**
     * 🔹 Nota de producción:
     * El token se devuelve solo para demo.
     * En producción se enviaría por email.
     */

    return {
      verificationToken: newToken,
    };
  }
}
