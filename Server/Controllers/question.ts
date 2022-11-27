import express from 'express';
import { Types, CallbackError } from 'mongoose';

import Question, { IQuestion } from '../Models/question';
import { AnswerTypes } from '../Models/question';
import { AuthUser } from '../Util';

export function DisplayQuestionCreatePage(req: express.Request, res: express.Response, next: express.NextFunction) 
{
  let surveyId = req.params.sid;

  res.render('index', {
    title: 'Create Question',
    page: 'question-create',
    survey: { id: surveyId },
    question: {},
    types: AnswerTypes,
    defaultSelectedType: 'binary',
    messages: req.flash("questionCreateMessage"),
    user: AuthUser(req),
  });
}

export function ProcessQuestionCreatePage(req: express.Request, res: express.Response, next: express.NextFunction): void 
{
  let surveyId = req.params.sid;

  let newQuestion = new Question(
    {
      SurveyID: surveyId,
      Type: req.body.AnswerType,
      Question: req.body.Question,
      Answers: req.body.AnswerVariants,
      Order: 0,
    }
  );

  Question.create(newQuestion, (err: CallbackError) => {
    if (err) {
      console.error(err);
      res.end(err);
    }

    res.redirect(`/survey/${surveyId}`);
  });
}

export function DisplayQuestionEditPage(req: express.Request, res: express.Response, next: express.NextFunction) 
{
  let surveyId = req.params.sid;
  let questionId = req.params.qid;

  Question.findById(questionId, {}, {}, (err: CallbackError, question: IQuestion | null) => {
    if (err) {
      console.error(err);
      res.end(err);
    }

    res.render('index', {
      title: 'Edit Question',
      page: 'question-create',
      survey: { id: surveyId },
      question,
      types: AnswerTypes,
      defaultSelectedType: 'binary',
      messages: req.flash("questionCreateMessage"),
      user: AuthUser(req),
    });
  });
}

export function ProcessQuestionEditPage(req: express.Request, res: express.Response, next: express.NextFunction) 
{
  let surveyId = req.params.sid;
  let questionId = req.params.qid;

  let updatedQuestion = new Question(
    {
      SurveyID: surveyId,
      Type: req.body.AnswerType,
      Question: req.body.Question,
      Answers: req.body.AnswerVariants,
      Order: 0,
    }
  );

  updatedQuestion._id = new Types.ObjectId(questionId);

  Question.updateOne({ _id: questionId, SurveyID: surveyId }, updatedQuestion, (err: CallbackError) => {
    if (err) {
      console.error(err);
      res.end(err);
    }

    res.redirect(`/survey/${surveyId}`);
  });
}

export function ProcessQuestionDeletePage(req: express.Request, res: express.Response, next: express.NextFunction): void
{
  let surveyId = req.params.sid;
  let questionId = req.params.qid;

  Question.remove({ _id: questionId, SurveyID: surveyId }, (err: CallbackError) => {
    if (err) {
      console.error(err);
      res.end(err);
    }

    res.redirect(`/survey/${surveyId}`);
  });
}
