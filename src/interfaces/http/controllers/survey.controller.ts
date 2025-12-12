import type { Request, Response } from "express";
import type { CreateSurveyUseCase } from "../../../application/use-cases/survey/create-survey.usecase.js";
import type { StartResponseSessionUseCase } from "../../../application/use-cases/response-session/start-response-session.usecase.js";
import type { SubmitSurveyUseCase } from "../../../application/use-cases/survey/submit-survey.usecase.js";
import type { AbandonSurveyUseCase } from "../../../application/use-cases/survey/abandon-survey.usecase.js";

export class SurveyController {
  constructor(
    private readonly deps: {
      createSurveyUseCase: CreateSurveyUseCase;
      startResponseSessionUseCase: StartResponseSessionUseCase;
      submitSurveyUseCase: SubmitSurveyUseCase;
      abandonSurveyUseCase: AbandonSurveyUseCase;
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
    const surveyId = req.params.id;
    const userId = req.user?.userId ?? null;

    if (!surveyId) {
      return res.status(400).json({ error: "Falta el párametro surveyId." });
    }

    const sessionId = await this.deps.startResponseSessionUseCase.execute({
      surveyId,
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
    const { sessionId, answers } = req.body;

    await this.deps.abandonSurveyUseCase.execute({
      sessionId,
      answers,
      user: req.user,
    });

    return res.status(204).send();
  }
}
