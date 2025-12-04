import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { validateSchema } from "../middlewares/validate-schema.middleware.js";
import { RegisterDto } from "../dtos/auth/register.dto.js";
import { LoginDto } from "../dtos/auth/login.dto.js";

const createAuthRoutes = (authController: AuthController) => {
    const router = Router();

    router.post(
        "/register",
        validateSchema(RegisterDto),
        (req,res) => authController.register(req,res)
    );

    router.post("/verify", (req, res) => authController.verify(req,res))

    router.post("/login",
        validateSchema(LoginDto),
        (req, res) => authController.login(req, res)
    )

    return router;
};

export default createAuthRoutes;