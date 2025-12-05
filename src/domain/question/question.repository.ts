import type { QuestionEntity } from "./question.entity.js";

export interface IQuestionRepository {

    create(question: QuestionEntity): Promise<QuestionEntity>
    

}