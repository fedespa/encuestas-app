import mongoose, { Schema } from "mongoose";

const ResponseSessionSchema = new Schema({
    _id: { type: String, required: true },
    surveyId: { type: String, required: true },
    userId: { type: String, required: false },
    startedAt: { type: Date, required: true },
    finishedAt: { type: Date, required: false },
    abandonedAtQuestionId: { type: String, required: false },
})

export type IResponseSessionDocument =
    mongoose.InferSchemaType<typeof ResponseSessionSchema> & {
        _id: string;
    };

export const ResponseSessionModel = mongoose.model<IResponseSessionDocument>(
    "ResponseSession",
    ResponseSessionSchema
);