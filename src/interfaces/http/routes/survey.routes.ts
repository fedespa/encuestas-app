import type { SurveyController } from "../controllers/survey.controller.js";
import { Router } from "express";
import { validateSchema } from "../middlewares/validate-schema.middleware.js";
import { CreateSurveySchema } from "../schemas/survey/create-survey.schema.js";
import type { JwtService } from "../../../application/services/jwt.service.js";
import { optionalAuth } from "../middlewares/optional-auth.js";

const createSurveyRoutes = (
  surveyController: SurveyController,
  jwtService: JwtService
) => {
  const router = Router();

  router.post(
    "/",
    optionalAuth(jwtService),
    validateSchema(CreateSurveySchema),
    (req, res) => surveyController.create(req, res)
  );

  return router;
};

export default createSurveyRoutes;
