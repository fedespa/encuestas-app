import mongoose, { Schema } from "mongoose";

const LogicRuleSchema = new Schema({
  _id: { type: String, required: true },
  surveyId: { type: String, required: true },
  sourceQuestionId: { type: String, required: true },
  operator: {
    type: String,
    enum: [
      "equals",
      "not-equals",
      "greater-than",
      "less-than",
      "includes",
      "not-includes",
    ],
    required: true,
  },
  value: { type: Schema.Types.Mixed, required: true },
  action: {
    type: String,
    enum: ["show", "hide", "jump-to"],
    required: true,
  },
  targetQuestionId: { type: String, required: true }
});

export type ILogicRuleDocument =
    mongoose.InferSchemaType<typeof LogicRuleSchema> & {
        _id: string;
    };

export const LogicRuleModel = mongoose.model<ILogicRuleDocument>(
    "LogicRule",
    LogicRuleSchema
);