import { ResponseSessionEntity } from "../../../domain/response-session/response-session.entity.js";
import type { IResponseSessionRepository } from "../../../domain/response-session/response-session.repository.js";
import { SurveyNotFoundError } from "../../../domain/survey/survey.errors.js";
import type { ISurveyRepository } from "../../../domain/survey/survey.repository.js";
import type { TokenService } from "../../services/token.service.js";

export class StartResponseSessionUseCase {
  constructor(
    private readonly tokenService: TokenService,
    private readonly responseSessionRepository: IResponseSessionRepository,
    private readonly surveyRepository: ISurveyRepository
  ) {}

  async execute({ surveyId, userId }: { surveyId: string; userId: string }) {

    const survey = await this.surveyRepository.findById(surveyId);

    if (!survey) {
      throw new SurveyNotFoundError()
    }

    const session = ResponseSessionEntity.create({
      id: this.tokenService.generateUUID(),
      surveyId,
      userId,
      startedAt: new Date(),
      finishedAt: undefined,
      abandonedAtQuestionId: undefined
    })

    await this.responseSessionRepository.create(session)
    
    return session.id;

  }
}
