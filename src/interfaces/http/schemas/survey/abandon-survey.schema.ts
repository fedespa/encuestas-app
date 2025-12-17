import { z } from "zod";

export const AbandonSurveySchema = z.object({
    sessionId: z.string().min(1),
    answers: z.array(z.object({
        questionId: z.string().min(1),
        value: z.any()
    }))
})