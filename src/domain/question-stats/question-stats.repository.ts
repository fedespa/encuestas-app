import type { QuestionStatsEntity } from "./question-stats.entity.js";

export interface IQuestionStatsRepository {
    createMany(stats: QuestionStatsEntity[]): Promise<QuestionStatsEntity[]>
    findByQuestionIds(questionIds: string[]): Promise<QuestionStatsEntity[]>;
    updateMany(stats: QuestionStatsEntity[]): Promise<void>;
}