import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { validateSchema } from "../middlewares/validate-schema.middleware.js";
import { LoginSchema } from "../dtos/auth/login.schema.js";
import { RegisterSchema } from "../dtos/auth/register.schema.js";

const createAuthRoutes = (authController: AuthController) => {
    const router = Router();

    router.post(
        "/register",
        validateSchema(RegisterSchema),
        (req,res) => authController.register(req,res)
    );

    router.post("/verify", (req, res) => authController.verify(req,res))

    router.post("/login",
        validateSchema(LoginSchema),
        (req, res) => authController.login(req, res)
    )

    return router;
};

export default createAuthRoutes;