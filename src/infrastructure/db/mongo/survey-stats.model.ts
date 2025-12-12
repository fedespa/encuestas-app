import mongoose, { Schema } from "mongoose";

const SurveyStatsSchema = new Schema({
  _id: { type: String, required: true },
  surveyId: { type: String, required: true },
  avgCompletionTime: { type: Number, required: true },
  minCompletionTime: { type: Number, required: true },
  maxCompletionTime: { type: Number, required: true },
  abandonmentRate: { type: Number, required: true },
  totalResponses: { type: Number, required: true },
  totalAbandoned: { type: Number, required: true },
});

export type ISurveyStatsDocument = mongoose.InferSchemaType<
  typeof SurveyStatsSchema
> & {
  _id: string;
};

export const SurveyStatsModel = mongoose.model<ISurveyStatsDocument>(
  "SurveyStats",
  SurveyStatsSchema
);
