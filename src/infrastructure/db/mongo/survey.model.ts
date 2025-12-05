import mongoose, { Schema } from "mongoose";

const SurveySchema = new Schema({
    _id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    isPublic: { type: Boolean, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
    ownerId: { type: String, required: false }
})

export type ISurveyDocument = mongoose.InferSchemaType<typeof SurveySchema> &  {
    _id: string
}


export const SurveyModel = mongoose.model<ISurveyDocument>(
    "Survey",
    SurveySchema
)