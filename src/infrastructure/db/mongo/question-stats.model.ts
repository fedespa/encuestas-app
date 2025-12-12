import mongoose, { Schema } from "mongoose";

const QuestionStatsSchema = new Schema({
  _id: { type: String, required: true },
  questionId: { type: String, required: true },
  optionCounts: {
    type: Map,
    of: Number,
    required: false
  },
  abandonCount: { type: Number, required: true },
  answerCount: { type: Number, required: true }
});

export type IQuestionStatsDocument = mongoose.InferSchemaType<
  typeof QuestionStatsSchema
> & {
  _id: string;
};

export const QuestionStatsModel = mongoose.model<IQuestionStatsDocument>(
  "QuestionStats",
  QuestionStatsSchema
);
