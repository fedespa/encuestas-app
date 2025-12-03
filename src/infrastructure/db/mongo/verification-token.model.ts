import mongoose, { Schema } from "mongoose";

const VerificationTokenSchema = new Schema({
  _id: { type: String, required: true },
  userId: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});


export type IVerificationTokenDocument =
    mongoose.InferSchemaType<typeof VerificationTokenSchema> & {
        _id: string;
    };

export const VerificationTokenModel = mongoose.model<IVerificationTokenDocument>(
    "VerificationToken",
    VerificationTokenSchema
);