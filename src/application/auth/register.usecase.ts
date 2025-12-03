import { UserEntity } from "../../domain/user/user.entity.js";
import { EmailAlreadyExistsError } from "../../domain/user/user.errors.js";
import type { IUserRepository } from "../../domain/user/user.repository.js";
import type { HashService } from "../services/hash.service.js";

export class RegisterUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: HashService
  ) {}

  async execute(input: { email: string; password: string }) {
    const existingUser = await this.userRepository.findByEmail(input.email);

    if (existingUser) {
      throw new EmailAlreadyExistsError(input.email);
    }

    const hashedPassword = await this.hashService.hash(input.password);

    const user = UserEntity.create({
      email: input.email,
      password: hashedPassword,
    });

    const newUser = await this.userRepository.create(user);

    return newUser;
  }
}
