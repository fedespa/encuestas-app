import type { SurveyController } from "../controllers/survey.controller.js";
import { Router } from "express";
import { validateSchema } from "../middlewares/validate-schema.middleware.js";
import { CreateSurveySchema } from "../dtos/survey/create-survey.schema.js";

const createSurveyRoutes = (surveyController: SurveyController) => {
  const router = Router();

  router.post("/", validateSchema(CreateSurveySchema), (req, res) =>
    surveyController.create(req, res)
  );

  return router;
};

export default createSurveyRoutes;
