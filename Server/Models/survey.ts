import mongoose, { Schema, Document } from 'mongoose';

export interface ISurvey extends Document {
    Name: String,
    Description: String,
    StartDate: Date,
    EndDate: Date,
    IsPublished: Boolean,
    OwnerID: String,
}

const SurveySchema = new Schema<ISurvey>(
    {
        Name: String,
        Description: String,
        StartDate: String,
        EndDate: String,
        IsPublished: Boolean,
        OwnerID: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    {
        collection: "surveys",
        toJSON: { getters: true },
    }
);

const Model = mongoose.model<ISurvey>("Survey", SurveySchema);

export default Model;