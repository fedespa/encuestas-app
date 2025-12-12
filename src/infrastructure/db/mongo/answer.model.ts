import mongoose, { Schema } from "mongoose";

const AnswerSchema = new Schema({
    _id: { type: String, required: true },            
    sessionId: { type: String, required: true, index: true },
    questionId: { type: String, required: true, index: true },
    value: { type: Schema.Types.Mixed, required: true }, 
});

export type IAnswerDocument =
    mongoose.InferSchemaType<typeof AnswerSchema> & {
        _id: string;
    };

export const AnswerModel = mongoose.model<IAnswerDocument>(
    "Answer",
    AnswerSchema
);
