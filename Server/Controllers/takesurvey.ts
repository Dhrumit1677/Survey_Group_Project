import express from 'express';
import { CallbackError } from 'mongoose';

import Survey, { ISurvey } from '../Models/survey';
import Question from '../Models/question';
import CompletedSurvey, { ICompletedSurvey } from '../Models/completedSurvey';

import { AuthUser } from '../Util';

export async function DisplayTakeSurveysPage(req: express.Request, res: express.Response, next: express.NextFunction)
{
  const authUser = AuthUser(req)!;

  try {
    const completedSurveys = await CompletedSurvey.find({ UserID: authUser.id, IsCompleted: true });

    const excludedSurveyIds = completedSurveys.map(x => x.SurveyID);

    const surveys = await Survey.find({
        IsPublished: true, // Show only published surveys,
        // TODO: and with one question and more,
        // TODO: and matched with current date
        _id: { $nin: excludedSurveyIds } // and not passed earlier
    });

    res.render('index', {
      title: 'Surveys',
      page: 'take-survey-list',
      surveys,
      user: authUser,
    });
  } catch (err) {
    if (err) {
      console.error(err);
      res.end(err);
    }
  }
}

export async function ProcessTakeSurveyPage(req: express.Request, res: express.Response, next: express.NextFunction)
{
  const authUser = AuthUser(req)!;

  const surveyId = req.params.sid;

  try {
    const completedSurvey = await CompletedSurvey.findOne({ UserID: authUser.id, SurveyID: surveyId });

    if (!completedSurvey) {
      const newCompletedSurvey = new CompletedSurvey({
        UserID: authUser.id,
        SurveyID: surveyId,
        Questions: [],
      });

      await CompletedSurvey.create(newCompletedSurvey);
    }

    const excludeCompletedQuestionIds = completedSurvey?.Questions.map(x => x.QuestionID) || [];

    const questions = await Question.find(
      {
        SurveyID: surveyId,
        _id: { $nin: excludeCompletedQuestionIds },
      },
      {},
      { sort: { Order: 1 } }
    );

    if (questions.length) {
      res.redirect(`/take-survey/${surveyId}/question/${questions[0].id}`);
    } else {
      await CompletedSurvey.findOneAndUpdate({ UserID: authUser.id, SurveyID: surveyId }, { IsCompleted: true });
      res.redirect(`/take-survey/${surveyId}/thanks`);
    }
  } catch (err) {
    if (err) {
      console.error(err);
      res.end(err);
    }
  }
}

export async function DisplayTakeSurveyQuestionPage(req: express.Request, res: express.Response, next: express.NextFunction)
{
  const surveyId = req.params.sid;
  const questionId = req.params.qid;

  try {
    const survey = await Survey.findById(surveyId);
    const question = await Question.findOne({ _id: questionId, SurveyID: surveyId });

    res.render('index', {
      title: 'Question',
      page: 'take-survey-question',
      survey,
      question,
      user: AuthUser(req),
    });
  } catch (err) {
    if (err) {
      console.error(err);
      res.end(err);
    }
  }
}

export async function ProcessTakeSurveyQuestionPage(req: express.Request, res: express.Response, next: express.NextFunction)
{
  const authUser = AuthUser(req)!;

  const surveyId = req.params.sid;
  const questionId = req.params.qid;

  try {
    if (!req.body.Answer) throw new Error('The "Answer" field is required.');

    const Answer = Array.isArray(req.body.Answer) ? req.body.Answer : [req.body.Answer];

    const question = await Question.findById(questionId);

    if (!question) throw new Error(`Question with id:"${questionId}" not found.`);

    const newCompletedQuestion = {
      QuestionID: questionId,
      Question: question.Question,
      Answer,
    };

    await CompletedSurvey.findOneAndUpdate(
      { UserID: authUser.id, SurveyID: surveyId },
      { $push: { Questions: newCompletedQuestion } },
    );

    res.redirect(`/take-survey/${surveyId}`);

  } catch (err) {
    if (err) {
      console.error(err);
      res.end(err);
    }
  }
}

export function DisplayTakeSurveyThanksPage(req: express.Request, res: express.Response, next: express.NextFunction)
{
  const authUser = AuthUser(req)!;

  const surveyId = req.params.sid;

  res.render('index', {
    title: 'Thanks',
    page: 'take-survey-thanks',
    user: authUser,
  });
}
