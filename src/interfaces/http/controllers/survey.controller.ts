import type { Request, Response } from "express";
import type { CreateSurveyUseCase } from "../../../application/use-cases/survey/create-survey.usecase.js";

export class SurveyController {
  constructor(
    private readonly deps: {
      createSurveyUseCase: CreateSurveyUseCase;
    }
  ) {}

  public async create(req: Request, res: Response) {
    const { survey, questions, logicRules } = req.body;

    await this.deps.createSurveyUseCase.execute({
      survey,
      questions,
      logicRules,
      user: req.null
    });

    return res.status(200).json({ message: "Gracias" });
  }
}
