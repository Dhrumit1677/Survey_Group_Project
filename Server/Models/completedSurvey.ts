import mongoose, { Schema, Document } from 'mongoose';

export interface ICompletedQuestion extends Document {
    QuestionID: String,
    Question: String,
    Answer: String[],
}

export interface ICompletedSurvey extends Document {
    SurveyID: String,
    UserID: String,
    Questions: ICompletedQuestion[],
    IsCompleted: Boolean,
}

const CompletedQuestionSchema = new Schema<ICompletedQuestion>(
    {
      QuestionID: { type: Schema.Types.ObjectId, ref: 'Question' },
      Question: String,
      Answer: [String],
    }
);

const CompletedSurveySchema = new Schema<ICompletedSurvey>(
    {
        SurveyID: { type: Schema.Types.ObjectId, ref: 'Survey' },
        UserID: { type: Schema.Types.ObjectId, ref: 'User' },
        Questions: [CompletedQuestionSchema],
        IsCompleted: { type: Boolean, default: false },
    },
    {
        collection: "completedsurveys"
    }
);

const Model = mongoose.model<ICompletedSurvey>("CompletedSurvey", CompletedSurveySchema);

export default Model;