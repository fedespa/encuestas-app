import { QuestionStatsEntity } from "../../domain/question-stats/question-stats.entity.js";

export class QuestionStatsPersistenceMapper {
  static toEntity(doc: any): QuestionStatsEntity {
    const cleanMap = new Map<string, number>();

    if (doc.optionCounts) {
      for (const [key, value] of doc.optionCounts.entries()) {
        cleanMap.set(key, value);
      }
    }

    return QuestionStatsEntity.create({
      id: doc._id,
      questionId: doc.questionId,
      optionCounts: cleanMap,
      abandonCount: doc.abandonCount,
      answerCount: doc.answerCount,
    });
  }

  static toPersistence(entity: QuestionStatsEntity) {
    return {
      _id: entity.id,
      questionId: entity.questionId,
      optionCounts: Object.fromEntries(entity.optionCounts),
      abandonCount: entity.abandonCount,
      answerCount: entity.answerCount,
    };
  }
}
