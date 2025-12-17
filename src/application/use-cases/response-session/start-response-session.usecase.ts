import { ResponseSessionEntity } from "../../../domain/response-session/response-session.entity.js";
import type { IResponseSessionRepository } from "../../../domain/response-session/response-session.repository.js";
import { SurveyNotFoundError } from "../../../domain/survey/survey.errors.js";
import type { ISurveyRepository } from "../../../domain/survey/survey.repository.js";
import type { ILoggerService } from "../../services/logger.service.js";
import type { TokenService } from "../../services/token.service.js";

export class StartResponseSessionUseCase {
  constructor(
    private readonly tokenService: TokenService,
    private readonly responseSessionRepository: IResponseSessionRepository,
    private readonly surveyRepository: ISurveyRepository,
    private readonly logger: ILoggerService
  ) {}

  async execute({ surveyId, userId }: { surveyId: string; userId: string }) {
    this.logger.info("Iniciando nueva sesión de respuesta", {
      surveyId,
      userId,
    });

    const survey = await this.surveyRepository.findById(surveyId);

    if (!survey) {
      this.logger.warn("Survey no encontrado", { surveyId, userId });
      throw new SurveyNotFoundError();
    }

    const session = ResponseSessionEntity.create({
      id: this.tokenService.generateUUID(),
      surveyId,
      userId,
      startedAt: new Date(),
      finishedAt: undefined,
      abandonedAtQuestionId: undefined,
    });

    await this.responseSessionRepository.create(session);

    this.logger.info("Sesión de respuesta creada", {
      sessionId: session.id,
      surveyId,
      userId,
    });

    return session.id;
  }
}
