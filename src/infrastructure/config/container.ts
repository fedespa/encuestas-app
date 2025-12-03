
import { RegisterUseCase } from "../../application/use-cases/auth/register.usecase.js";
import { AuthController } from "../../interfaces/http/controllers/auth.controller.js";
import { MongoUserRepository } from "../repositories/user/mongo-user.repository.js";
import { MongoVerificationTokenRepository } from "../repositories/verification-token/mongo-verification-token.repository.js";
import { BcryptService } from "../services/bcrypt.service.js";
import { CryptoService } from "../services/crypto.service.js";

// 1. Instanciar implementaciones (Clases de bajo nivel)
const userRepository = new MongoUserRepository();
const bcryptService = new BcryptService();
const cryptoService = new CryptoService()
const verificationTokenRepository = new MongoVerificationTokenRepository()

// 2. Inyectar dependencias en los Casos de Uso 
const registerUseCase = new RegisterUseCase(
    userRepository,
    bcryptService,
    cryptoService,
    verificationTokenRepository
);

// 3. Inyectar Casos de Uso en los Controladores 
export const authController = new AuthController({
    registerUseCase
});