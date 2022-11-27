import mongoose, { Schema, Document } from 'mongoose';

export const AnswerTypes = {
    'binary': 'Two options, yes or no',
    'one-of-the-list': 'One option from the list',
    'few-from-the-list': 'Multiple choices from the list',
    'free': 'Text field for free text input',
};

export type TAnswerType = keyof typeof AnswerTypes;

export interface IAnswerVariant extends Document {
    Id: Number,
    Answer: String,
    Order: Number,
}

export interface IQuestion extends Document {
    SurveyID: String,
    Type: TAnswerType,
    Question: String,
    Answers: IAnswerVariant[],
    Order: Number,
}

const AnswerVariantSchema = new Schema<IAnswerVariant>(
    {
        Id: Number,
        Answer: String,
        Order: Number,
    }
);

const QuestionSchema = new Schema<IQuestion>(
    {
        SurveyID: { type: Schema.Types.ObjectId, ref: 'Survey' },
        Type: String,
        Question: String,
        Answers: [AnswerVariantSchema],
        Order: Number,
    },
    {
        collection: "questions"
    }
);

const Model = mongoose.model<IQuestion>("Question", QuestionSchema);

export default Model;