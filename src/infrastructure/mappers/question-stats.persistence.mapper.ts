import { QuestionStatsEntity } from "../../domain/question-stats/question-stats.entity.js";

export class QuestionStatsPersistenceMapper {
  static toEntity(doc: any): QuestionStatsEntity {
    return QuestionStatsEntity.create({
      id: doc._id,
      questionId: doc.questionId,
      optionCounts: doc.optionCounts,
      abandonCount: doc.abandonCount,
      answerCount: doc.answerCount,
    });
  }

  static toPersistence(entity: QuestionStatsEntity) {
    return {
      _id: entity.id,
      questionId: entity.questionId,
      optionCounts: entity.optionCounts,
      abandonCount: entity.abandonCount,
      answerCount: entity.answerCount,
    };
  }
}
