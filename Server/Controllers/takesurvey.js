"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisplayTakeSurveyThanksPage = exports.ProcessTakeSurveyQuestionPage = exports.DisplayTakeSurveyQuestionPage = exports.ProcessTakeSurveyPage = exports.DisplayTakeSurveysPage = void 0;
const survey_1 = __importDefault(require("../Models/survey"));
const question_1 = __importDefault(require("../Models/question"));
const completedSurvey_1 = __importDefault(require("../Models/completedSurvey"));
const Util_1 = require("../Util");
async function DisplayTakeSurveysPage(req, res, next) {
    const authUser = (0, Util_1.AuthUser)(req);
    try {
        const completedSurveys = await completedSurvey_1.default.find({ UserID: authUser.id, IsCompleted: true });
        const excludedSurveyIds = completedSurveys.map(x => x.SurveyID);
        const surveys = await survey_1.default.find({
            IsPublished: true,
            _id: { $nin: excludedSurveyIds }
        });
        res.render('index', {
            title: 'Surveys',
            page: 'take-survey-list',
            surveys,
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
exports.DisplayTakeSurveysPage = DisplayTakeSurveysPage;
async function ProcessTakeSurveyPage(req, res, next) {
    const authUser = (0, Util_1.AuthUser)(req);
    const surveyId = req.params.sid;
    try {
        const completedSurvey = await completedSurvey_1.default.findOne({ UserID: authUser.id, SurveyID: surveyId });
        if (!completedSurvey) {
            const newCompletedSurvey = new completedSurvey_1.default({
                UserID: authUser.id,
                SurveyID: surveyId,
                Questions: [],
            });
            await completedSurvey_1.default.create(newCompletedSurvey);
        }
        const excludeCompletedQuestionIds = completedSurvey?.Questions.map(x => x.QuestionID) || [];
        const questions = await question_1.default.find({
            SurveyID: surveyId,
            _id: { $nin: excludeCompletedQuestionIds },
        }, {}, { sort: { Order: 1 } });
        if (questions.length) {
            res.redirect(`/take-survey/${surveyId}/question/${questions[0].id}`);
        }
        else {
            await completedSurvey_1.default.findOneAndUpdate({ UserID: authUser.id, SurveyID: surveyId }, { IsCompleted: true });
            res.redirect(`/take-survey/${surveyId}/thanks`);
        }
    }
    catch (err) {
        if (err) {
            console.error(err);
            res.end(err);
        }
    }
}
exports.ProcessTakeSurveyPage = ProcessTakeSurveyPage;
async function DisplayTakeSurveyQuestionPage(req, res, next) {
    const surveyId = req.params.sid;
    const questionId = req.params.qid;
    try {
        const survey = await survey_1.default.findById(surveyId);
        const question = await question_1.default.findOne({ _id: questionId, SurveyID: surveyId });
        res.render('index', {
            title: 'Question',
            page: 'take-survey-question',
            survey,
            question,
            user: (0, Util_1.AuthUser)(req),
        });
    }
    catch (err) {
        if (err) {
            console.error(err);
            res.end(err);
        }
    }
}
exports.DisplayTakeSurveyQuestionPage = DisplayTakeSurveyQuestionPage;
async function ProcessTakeSurveyQuestionPage(req, res, next) {
    const authUser = (0, Util_1.AuthUser)(req);
    const surveyId = req.params.sid;
    const questionId = req.params.qid;
    try {
        if (!req.body.Answer)
            throw new Error('The "Answer" field is required.');
        const Answer = Array.isArray(req.body.Answer) ? req.body.Answer : [req.body.Answer];
        const question = await question_1.default.findById(questionId);
        if (!question)
            throw new Error(`Question with id:"${questionId}" not found.`);
        const newCompletedQuestion = {
            QuestionID: questionId,
            Question: question.Question,
            Answer,
        };
        await completedSurvey_1.default.findOneAndUpdate({ UserID: authUser.id, SurveyID: surveyId }, { $push: { Questions: newCompletedQuestion } });
        res.redirect(`/take-survey/${surveyId}`);
    }
    catch (err) {
        if (err) {
            console.error(err);
            res.end(err);
        }
    }
}
exports.ProcessTakeSurveyQuestionPage = ProcessTakeSurveyQuestionPage;
function DisplayTakeSurveyThanksPage(req, res, next) {
    const authUser = (0, Util_1.AuthUser)(req);
    const surveyId = req.params.sid;
    res.render('index', {
        title: 'Thanks',
        page: 'take-survey-thanks',
        user: authUser,
    });
}
exports.DisplayTakeSurveyThanksPage = DisplayTakeSurveyThanksPage;
//# sourceMappingURL=takesurvey.js.map