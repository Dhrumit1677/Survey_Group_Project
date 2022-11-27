"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessQuestionDeletePage = exports.ProcessQuestionEditPage = exports.DisplayQuestionEditPage = exports.ProcessQuestionCreatePage = exports.DisplayQuestionCreatePage = void 0;
const mongoose_1 = require("mongoose");
const question_1 = __importDefault(require("../Models/question"));
const question_2 = require("../Models/question");
const Util_1 = require("../Util");
function DisplayQuestionCreatePage(req, res, next) {
    let surveyId = req.params.sid;
    res.render('index', {
        title: 'Create Question',
        page: 'question-create',
        survey: { id: surveyId },
        question: {},
        types: question_2.AnswerTypes,
        defaultSelectedType: 'binary',
        messages: req.flash("questionCreateMessage"),
        user: (0, Util_1.AuthUser)(req),
    });
}
exports.DisplayQuestionCreatePage = DisplayQuestionCreatePage;
function ProcessQuestionCreatePage(req, res, next) {
    let surveyId = req.params.sid;
    let newQuestion = new question_1.default({
        SurveyID: surveyId,
        Type: req.body.AnswerType,
        Question: req.body.Question,
        Answers: req.body.AnswerVariants,
        Order: 0,
    });
    question_1.default.create(newQuestion, (err) => {
        if (err) {
            console.error(err);
            res.end(err);
        }
        res.redirect(`/survey/${surveyId}`);
    });
}
exports.ProcessQuestionCreatePage = ProcessQuestionCreatePage;
function DisplayQuestionEditPage(req, res, next) {
    let surveyId = req.params.sid;
    let questionId = req.params.qid;
    question_1.default.findById(questionId, {}, {}, (err, question) => {
        if (err) {
            console.error(err);
            res.end(err);
        }
        res.render('index', {
            title: 'Edit Question',
            page: 'question-create',
            survey: { id: surveyId },
            question,
            types: question_2.AnswerTypes,
            defaultSelectedType: 'binary',
            messages: req.flash("questionCreateMessage"),
            user: (0, Util_1.AuthUser)(req),
        });
    });
}
exports.DisplayQuestionEditPage = DisplayQuestionEditPage;
function ProcessQuestionEditPage(req, res, next) {
    let surveyId = req.params.sid;
    let questionId = req.params.qid;
    let updatedQuestion = new question_1.default({
        SurveyID: surveyId,
        Type: req.body.AnswerType,
        Question: req.body.Question,
        Answers: req.body.AnswerVariants,
        Order: 0,
    });
    updatedQuestion._id = new mongoose_1.Types.ObjectId(questionId);
    question_1.default.updateOne({ _id: questionId, SurveyID: surveyId }, updatedQuestion, (err) => {
        if (err) {
            console.error(err);
            res.end(err);
        }
        res.redirect(`/survey/${surveyId}`);
    });
}
exports.ProcessQuestionEditPage = ProcessQuestionEditPage;
function ProcessQuestionDeletePage(req, res, next) {
    let surveyId = req.params.sid;
    let questionId = req.params.qid;
    question_1.default.remove({ _id: questionId, SurveyID: surveyId }, (err) => {
        if (err) {
            console.error(err);
            res.end(err);
        }
        res.redirect(`/survey/${surveyId}`);
    });
}
exports.ProcessQuestionDeletePage = ProcessQuestionDeletePage;
//# sourceMappingURL=question.js.map