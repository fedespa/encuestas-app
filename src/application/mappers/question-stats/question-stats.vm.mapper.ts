import type { QuestionStatsEntity } from "../../../domain/question-stats/question-stats.entity.js";
import type { QuestionStatsVm } from "../../view-models/question-stats/questions-stats.vm.js";

export class QuestionStatsVmMapper {
    static toQuestionStatsVm(entity: QuestionStatsEntity): QuestionStatsVm {
        return {
            questionId: entity.questionId,
            totalResponses: entity.answerCount,
            totalAbandoned: entity.abandonCount,
            distribution: Object.fromEntries(entity.optionCounts)
        }
    }
}