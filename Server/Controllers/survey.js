"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessSurveyDeletePage = exports.ProcessSurveyEditPage = exports.DisplaySurveyEditPage = exports.DisplaySurveyDetailsPage = exports.ProcessSurveyCreatePage = exports.DisplaySurveyCreatePage = exports.DisplaySurveysPage = void 0;
const mongoose_1 = require("mongoose");
const survey_1 = __importDefault(require("../Models/survey"));
const question_1 = __importDefault(require("../Models/question"));
const Util_1 = require("../Util");
function DisplaySurveysPage(req, res, next) {
    const authUser = (0, Util_1.AuthUser)(req);
    survey_1.default.find(authUser.isAdmin ? {} : { OwnerID: authUser.id }, (err, surveys) => {
        if (err) {
            console.error(err);
            res.end(err);
        }
        res.render('index', {
            title: 'Surveys',
            page: 'survey-list',
            surveys,
            user: authUser,
        });
    });
}
exports.DisplaySurveysPage = DisplaySurveysPage;
function DisplaySurveyCreatePage(req, res, next) {
    res.render('index', {
        title: 'Create Survey',
        page: 'survey-create',
        survey: {},
        messages: req.flash("surveyCreateMessage"),
        user: (0, Util_1.AuthUser)(req),
    });
}
exports.DisplaySurveyCreatePage = DisplaySurveyCreatePage;
function ProcessSurveyCreatePage(req, res, next) {
    const authUser = (0, Util_1.AuthUser)(req);
    const newSurvey = new survey_1.default({
        OwnerID: authUser.id,
        Name: req.body.Name,
        Description: req.body.Description,
        StartDate: req.body.StartDate,
        EndDate: req.body.EndDate,
        IsPublished: req.body.IsPublished !== undefined,
    });
    survey_1.default.create(newSurvey, (err, result) => {
        if (err) {
            console.error(err);
            res.end(err);
        }
        res.redirect(`/survey/${result.id}`);
    });
}
exports.ProcessSurveyCreatePage = ProcessSurveyCreatePage;
function DisplaySurveyDetailsPage(req, res, next) {
    const authUser = (0, Util_1.AuthUser)(req);
    const id = req.params.id;
    const filter = { _id: id, OwnerID: authUser.id };
    if (authUser.isAdmin)
        delete filter.OwnerID;
    survey_1.default.findOne(filter, {}, {}, (err, survey) => {
        if (err) {
            console.error(err);
            res.end(err);
        }
        question_1.default.find({ SurveyID: survey?.id }, (err, questions) => {
            if (err) {
                console.error(err);
                res.end(err);
            }
            res.render('index', {
                title: 'Survey Details',
                page: 'survey-details',
                survey,
                questions,
                messages: req.flash("surveyDetailsMessage"),
                user: (0, Util_1.AuthUser)(req),
            });
        });
    });
}
exports.DisplaySurveyDetailsPage = DisplaySurveyDetailsPage;
function DisplaySurveyEditPage(req, res, next) {
    const authUser = (0, Util_1.AuthUser)(req);
    const id = req.params.id;
    const filter = { _id: id, OwnerID: authUser.id };
    if (authUser.isAdmin)
        delete filter.OwnerID;
    survey_1.default.findOne(filter, {}, {}, (err, survey) => {
        if (err) {
            console.error(err);
            res.end(err);
        }
        res.render('index', {
            title: 'Edit Survey',
            page: 'survey-create',
            survey,
            messages: req.flash("surveyEditMessage"),
            user: (0, Util_1.AuthUser)(req),
        });
    });
}
exports.DisplaySurveyEditPage = DisplaySurveyEditPage;
function ProcessSurveyEditPage(req, res, next) {
    const authUser = (0, Util_1.AuthUser)(req);
    const id = req.params.id;
    const filter = { _id: id, OwnerID: authUser.id };
    if (authUser.isAdmin)
        delete filter.OwnerID;
    const updatedSurvey = new survey_1.default({
        Name: req.body.Name,
        Description: req.body.Description,
        StartDate: req.body.StartDate,
        EndDate: req.body.EndDate,
        IsPublished: req.body.IsPublished !== undefined,
    });
    updatedSurvey._id = new mongoose_1.Types.ObjectId(id);
    survey_1.default.updateOne(filter, updatedSurvey, (err) => {
        if (err) {
            console.error(err);
            res.end(err);
        }
        res.redirect('/survey');
    });
}
exports.ProcessSurveyEditPage = ProcessSurveyEditPage;
function ProcessSurveyDeletePage(req, res, next) {
    const authUser = (0, Util_1.AuthUser)(req);
    const id = req.params.id;
    const filter = { _id: id, OwnerID: authUser.id };
    if (authUser.isAdmin)
        delete filter.OwnerID;
    survey_1.default.remove(filter, (err) => {
        if (err) {
            console.error(err);
            res.end(err);
        }
        question_1.default.remove({ SurveyID: id }, (err) => {
            if (err) {
                console.error(err);
                res.end(err);
            }
            res.redirect('/survey');
        });
    });
}
exports.ProcessSurveyDeletePage = ProcessSurveyDeletePage;
//# sourceMappingURL=survey.js.map