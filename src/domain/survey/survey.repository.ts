import type { SurveyEntity } from "./survey.entity.js";

export interface ISurveyRepository {

    create(survey: SurveyEntity): Promise<SurveyEntity>;
    findByOwnerId(ownerId: string) : Promise<SurveyEntity | null>;
    findById(id: string) : Promise<SurveyEntity | null>;
    delete(id: string): Promise<void>;

}