import { RegisterUseCase } from "../../application/auth/register.usecase.js";
import { AuthController } from "../../interfaces/http/controllers/auth.controller.js";
import { MongoUserRepository } from "../repositories/user/mongo-user.repository.js";
import { BcryptService } from "../services/bcrypt.service.js";

// 1. Instanciar implementaciones (Clases de bajo nivel)
const userRepository = new MongoUserRepository();
const bcryptService = new BcryptService();

// 2. Inyectar dependencias en los Casos de Uso 
const registerUseCase = new RegisterUseCase(userRepository, bcryptService);

// 3. Inyectar Casos de Uso en los Controladores 
export const authController = new AuthController({
    registerUseCase
});