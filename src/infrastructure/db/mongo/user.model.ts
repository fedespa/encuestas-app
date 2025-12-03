import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    _id: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
})

export type IUserDocument = mongoose.InferSchemaType<typeof UserSchema> &  {
    _id: string
}


export const UserModel = mongoose.model<IUserDocument>(
    "User",
    UserSchema
)