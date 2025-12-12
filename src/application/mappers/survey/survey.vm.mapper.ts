import type { SurveyEntity } from "../../../domain/survey/survey.entity.js";
import type { SurveyVm } from "../../view-models/survey/survey.vm.js";

export class SurveyVmMapper {
    static toSurveyVm(entity: SurveyEntity): SurveyVm {
        return {
            id: entity.id,
            title: entity.title,
            description: entity.description,
            isPublic: entity.isPublic,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        }
    }
}