import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";

const createAuthRoutes = (authController: AuthController) => {
    const router = Router();

    router.post("/register", authController.register.bind(authController));

    return router;
};

export default createAuthRoutes;