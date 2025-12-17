import type { Request, Response } from "express";
import type { CreateSurveyUseCase } from "../../../application/use-cases/survey/create-survey.usecase.js";
import type { StartResponseSessionUseCase } from "../../../application/use-cases/response-session/start-response-session.usecase.js";
import type { SubmitSurveyUseCase } from "../../../application/use-cases/survey/submit-survey.usecase.js";
import type { AbandonSurveyUseCase } from "../../../application/use-cases/survey/abandon-survey.usecase.js";
import type { GetSurveyByIdUseCase } from "../../../application/use-cases/survey/get-survey-by-id.usecase.js";
import type { GetSurveyStatsByIdUseCase } from "../../../application/use-cases/survey-stats/get-survey-stats-by-id.usecase.js";

export class SurveyController {
  constructor(
    private readonly deps: {
      createSurveyUseCase: CreateSurveyUseCase;
      startResponseSessionUseCase: StartResponseSessionUseCase;
      submitSurveyUseCase: SubmitSurveyUseCase;
      abandonSurveyUseCase: AbandonSurveyUseCase;
      getSurveyByIdUseCase: GetSurveyByIdUseCase;
      getSurveyStatsByIdUseCase: GetSurveyStatsByIdUseCase;
    }
  ) {}

  public async create(req: Request, res: Response) {
    const { survey, questions, logicRules } = req.body;

    const response = await this.deps.createSurveyUseCase.execute({
      survey,
      questions,
      logicRules,
      user: req.user,
    });

    return res.status(200).json(response);
  }

  public async start(req: Request, res: Response) {
    const id = req.params.id;
    const userId = req.user?.userId ?? null;

    if (!id) {
      return res.status(400).json({ error: "Falta el párametro surveyId." });
    }

    const sessionId = await this.deps.startResponseSessionUseCase.execute({
      surveyId: id,
      userId,
    });
    return res.status(201).json({ sessionId });
  }

  public async submit(req: Request, res: Response) {
    const { sessionId, answers } = req.body;

    await this.deps.submitSurveyUseCase.execute({
      sessionId,
      answers,
      user: req.user,
    });

    return res.status(201).json({ message: "Encuesta enviada correctamente!" });
  }

  public async abandon(req: Request, res: Response) {
    if (!req.body || !req.body?.sessionId) {
      return res.status(400).json({ message: "La sesión es requerida. " });
    }

    await this.deps.abandonSurveyUseCase.execute({
      sessionId: req.body.sessionId,
      answers: req.body.answers ?? [],
      user: req.user,
    });

    return res.status(204).send();
  }

  public async getById(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return res
        .status(404)
        .json({ message: "No se envio el ID de la encuesta. " });
    }

    const survey = await this.deps.getSurveyByIdUseCase.execute(id);

    if (!survey) {
      return res.status(400).json({ message: "Encuesta no encontrada. " });
    }

    return res.status(200).json(survey);
  }

  public async getStats(req: Request, res: Response) {
    const id = req.params.id;
    const user = req.user ?? null;

    if (!id) {
      return res
        .status(404)
        .json({ message: "No se envio el ID de la encuesta. " });
    }

    const surveyWithStats = await this.deps.getSurveyStatsByIdUseCase.execute(
      id,
      user
    );

    return res.json(surveyWithStats);
  }
}
