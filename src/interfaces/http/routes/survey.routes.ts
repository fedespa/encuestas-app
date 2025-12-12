import type { SurveyController } from "../controllers/survey.controller.js";
import { Router } from "express";
import { validateSchema } from "../middlewares/validate-schema.middleware.js";
import { CreateSurveySchema } from "../schemas/survey/create-survey.schema.js";
import type { JwtService } from "../../../application/services/jwt.service.js";
import { optionalAuth } from "../middlewares/optional-auth.js";
import { SubmitResponseSessionSchema } from "../schemas/response-session/submit-response-session.schema.js";

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

  router.post("/:id/start", optionalAuth(jwtService), (req, res) =>
    surveyController.start(req, res)
  );

  router.post(
    "/:id/submit",
    optionalAuth(jwtService),
    validateSchema(SubmitResponseSessionSchema),
    (req, res) => surveyController.submit(req, res)
  );

  router.post("/:id/abandon", optionalAuth(jwtService), (req, res) =>
    surveyController.abandon(req, res)
  );

  return router;
};

export default createSurveyRoutes;
