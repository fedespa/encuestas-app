import type { QuestionEntity } from "../../../domain/question/question.entity.js";
import type { QuestionVm } from "../../view-models/question/question.vm.js";

export class QuestionVmMapper {
    static toQuestionVm (entity: QuestionEntity): QuestionVm {
        return {
            id: entity.id,
            type: entity.type,
            questionText: entity.questionText,
            required: entity.required,
            options: entity.options,
            order: entity.order
        }
    }
}