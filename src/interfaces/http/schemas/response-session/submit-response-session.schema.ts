import z from "zod";

export const SubmitResponseSessionSchema = z.object({
    sessionId: z.string().min(1),
    answers: z.array(
        z.object({
            questionId: z.string().min(1),
            value: z.any()
        })
    ).min(1)
}) 