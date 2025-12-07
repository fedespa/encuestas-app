import type { QuestionEntity } from "./question.entity.js";

export interface IQuestionRepository {
  create(question: QuestionEntity): Promise<QuestionEntity>;
  createMany(questions: QuestionEntity[]): Promise<QuestionEntity[]>;

  delete(id: string): Promise<void>;
  deleteMany(ids: string[]): Promise<void>;
}
