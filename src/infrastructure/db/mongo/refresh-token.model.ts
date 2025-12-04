import mongoose, { Schema } from "mongoose";

const RefreshTokenSchema = new Schema({
  _id: { type: String, required: true },
  userId: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});


export type IRefreshTokenDocument =
    mongoose.InferSchemaType<typeof RefreshTokenSchema> & {
        _id: string;
    };

export const RefreshTokenModel = mongoose.model<IRefreshTokenDocument>(
    "RefreshToken",
    RefreshTokenSchema
);