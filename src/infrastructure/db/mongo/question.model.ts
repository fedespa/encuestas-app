import mongoose, { Schema } from "mongoose";

const QuestionSchema = new Schema({
  _id: { type: String, required: true },
  surveyId: { type: String, required: true },
  type: {
    type: String,
    enum: [
      "text",
      "number",
      "date",
      "single_choice",
      "multiple_choice",
      "rating",
      "file",
    ],
    required: true,
  },
  questionText: { type: String, required: true },
  required: { type: Boolean, required: true },
  options: { type: Schema.Types.Mixed, required: true },
  order: { type: Number, required: true },
});

export type IQuestionDocument =
    mongoose.InferSchemaType<typeof QuestionSchema> & {
        _id: string;
    };

export const QuestionModel = mongoose.model<IQuestionDocument>(
    "Question",
    QuestionSchema
);