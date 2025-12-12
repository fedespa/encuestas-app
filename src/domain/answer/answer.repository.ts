import type { AnswerEntity } from "./answer.entity.js";

export interface IAnswerRepository {
    create(answer: AnswerEntity): Promise<AnswerEntity>
    createMany(answers: AnswerEntity[]): Promise<AnswerEntity[]>;
}