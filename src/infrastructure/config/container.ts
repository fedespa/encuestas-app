import { RegisterUseCase } from "../../application/use-cases/auth/register.usecase.js";
import { VerifyEmailUseCase } from "../../application/use-cases/auth/verify-email.usecase.js";
import { AuthController } from "../../interfaces/http/controllers/auth.controller.js";
import { MongoRefreshTokenRepository } from "../repositories/refresh-token/mongo-refresh-token.repository.js";
import { MongoUserRepository } from "../repositories/user/mongo-user.repository.js";
import { MongoVerificationTokenRepository } from "../repositories/verification-token/mongo-verification-token.repository.js";
import { BcryptService } from "../services/bcrypt.service.js";
import { CryptoService } from "../services/crypto.service.js";
import { JwtTokenService } from "../services/jwt-token.service.js";

// 1. Instanciar implementaciones (Clases de bajo nivel)
// REPOSITORIOS
const userRepository = new MongoUserRepository();
const verificationTokenRepository = new MongoVerificationTokenRepository();
const refreshTokenRepository = new MongoRefreshTokenRepository()

// SERVICIOS
const bcryptService = new BcryptService();
const cryptoService = new CryptoService();
const jwtTokenService = new JwtTokenService("LLAVESECRETAACCEESS", "REFRESHCLAVESECRETA"); // cambiar por ENV

// 2. Inyectar dependencias en los Casos de Uso
const registerUseCase = new RegisterUseCase(
  userRepository,
  bcryptService,
  cryptoService,
  verificationTokenRepository
);

const verifyEmailUseCase = new VerifyEmailUseCase(
  userRepository,
  verificationTokenRepository,
  jwtTokenService,
  refreshTokenRepository,
  cryptoService
);

// 3. Inyectar Casos de Uso en los Controladores
export const authController = new AuthController({
  registerUseCase,
  verifyEmailUseCase
});
