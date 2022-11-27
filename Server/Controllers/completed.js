"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisplayCompletedSurveyDetailsPage = exports.DisplayCompletedSurveysPage = void 0;
const survey_1 = __importDefault(require("../Models/survey"));
const question_1 = __importDefault(require("../Models/question"));
const completedSurvey_1 = __importDefault(require("../Models/completedSurvey"));
const Util_1 = require("../Util");
const getAnswersByType = (type, answers) => {
    if (type === 'binary') {
        return [
            { Answer: 'Yes' },
            { Answer: 'No' }
        ];
    }
    return answers;
};
async function DisplayCompletedSurveysPage(req, res, next) {
    const authUser = (0, Util_1.AuthUser)(req);
    try {
        const surveys = await survey_1.default.find(authUser.isAdmin ? {} : { OwnerID: authUser.id });
        const completedSurveys = await completedSurvey_1.default.find({
            SurveyID: { $in: surveys.map(x => x.id) },
            IsCompleted: true,
        });
        const completedSurveysGroupedById = completedSurveys.reduce((info, cs) => {
            const surveyId = cs.SurveyID.toString();
            const foundSurvey = info[surveyId];
            if (foundSurvey) {
                info[surveyId].count += 1;
            }
            else {
                info[surveyId] = {
                    survey: surveys.find(s => s.id === surveyId),
                    count: 1,
                };
            }
            return info;
        }, {});
        res.render('index', {
            title: 'Completed Surveys',
            page: 'completed-list',
            completedSurveysGroupedById,
            user: authUser,
        });
    }
    catch (err) {
        if (err) {
            console.error(err);
            res.end(err);
        }
    }
}
exports.DisplayCompletedSurveysPage = DisplayCompletedSurveysPage;
async function DisplayCompletedSurveyDetailsPage(req, res, next) {
    const authUser = (0, Util_1.AuthUser)(req);
    const surveyId = req.params.sid;
    try {
        const surveyFilter = { _id: surveyId, OwnerID: authUser.id };
        if (authUser.isAdmin)
            delete surveyFilter.OwnerID;
        const survey = await survey_1.default.findOne(surveyFilter);
        if (!survey)
            throw new Error(`Survey with id:"${surveyId}" not found.`);
        const questions = await question_1.default.find({ SurveyID: surveyId });
        const compiledQuestions = questions.map(q => {
            const answers = getAnswersByType(q.Type, q.Answers);
            return {
                QuestionID: q.id,
                Question: q.Question,
                Type: q.Type,
                Answers: answers.map(a => ({
                    Answer: a.Answer,
                    Count: 0,
                })),
            };
        });
        const completedSurveys = await completedSurvey_1.default.find({
            SurveyID: surveyId,
            IsCompleted: true,
        });
        const completedSurveyDetails = completedSurveys.reduce((compiledSurvey, { Questions }) => {
            compiledSurvey.Questions = compiledSurvey.Questions.map(q => {
                const completedQuestion = Questions.find(cq => cq.QuestionID.toString() === q.QuestionID);
                const complitedAnswers = completedQuestion?.Answer || [];
                if (q.Type === 'free') {
                    complitedAnswers.forEach(answer => {
                        q.Answers.push({
                            Answer: answer,
                            Count: 1,
                        });
                    });
                }
                else {
                    q.Answers = q.Answers.map(a => {
                        if (complitedAnswers.includes(a.Answer)) {
                            a.Count += 1;
                        }
                        return a;
                    });
                }
                return q;
            });
            return compiledSurvey;
        }, {
            SurveyID: survey.id,
            Name: survey.Name,
            Description: survey.Description,
            CompletedCount: completedSurveys.length,
            Questions: compiledQuestions,
        });
        res.render('index', {
            title: 'Completed Survey Details',
            page: 'completed-details',
            completedSurveyDetails,
            user: authUser,
        });
    }
    catch (err) {
        if (err) {
            console.error(err);
            res.end(err);
        }
    }
}
exports.DisplayCompletedSurveyDetailsPage = DisplayCompletedSurveyDetailsPage;
//# sourceMappingURL=completed.js.map