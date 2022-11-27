import mongoose, { Schema, Document, PassportLocalSchema, PassportLocalDocument, PassportLocalModel } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

export interface IUserDocument extends Document {
    username: String,
    nickname: String,
    email: String,
    isAdmin: Boolean,
    Created?:  Date,
    Updated?: Date,
}

const UserSchema = new Schema<IUserDocument>(
    {
        username: String,
        nickname: String,
        email: String,
        isAdmin: { type: Boolean, default: false },
        Created: 
        {
            type: Date,
            default: Date.now(),
        },
        Updated: 
        {
            type: Date,
            default: Date.now()
        }
    },
    {
        collection: "users"
    }
);

UserSchema.plugin(passportLocalMongoose);

const Model = mongoose.model("User", UserSchema as PassportLocalSchema<{}, {}>);

export default Model;