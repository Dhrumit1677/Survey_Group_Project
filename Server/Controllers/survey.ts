import express from 'express';
import { Types, CallbackError } from 'mongoose';

import Survey, { ISurvey } from '../Models/survey';
import Question, { IQuestion } from '../Models/question';
import { AuthUser } from '../Util';

export function DisplaySurveysPage(req: express.Request, res: express.Response, next: express.NextFunction) 
{
  const authUser = AuthUser(req)!;

  Survey.find(
    authUser.isAdmin ? {} : { OwnerID: authUser.id },
    (err: CallbackError, surveys: ISurvey[]) => {
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
    },
  );
}

export function DisplaySurveyCreatePage(req: express.Request, res: express.Response, next: express.NextFunction) 
{
  res.render('index', {
    title: 'Create Survey',
    page: 'survey-create',
    survey: {},
    messages: req.flash("surveyCreateMessage"),
    user: AuthUser(req),
  });
}

export function ProcessSurveyCreatePage(req: express.Request, res: express.Response, next: express.NextFunction): void 
{
  const authUser = AuthUser(req)!;

  const newSurvey = new Survey(
    {
      OwnerID: authUser.id,
      Name: req.body.Name,
      Description: req.body.Description,
      StartDate: req.body.StartDate,
      EndDate: req.body.EndDate,
      IsPublished: req.body.IsPublished !== undefined,
    }
  );

  Survey.create(newSurvey, (err: CallbackError, result: ISurvey) => {
    if (err) {
      console.error(err);
      res.end(err);
    }

    res.redirect(`/survey/${result.id}`);
  });
}

export function DisplaySurveyDetailsPage(req: express.Request, res: express.Response, next: express.NextFunction): void
{
  const authUser = AuthUser(req)!;

  const id = req.params.id;

  const filter = { _id: id, OwnerID: authUser.id };
  if (authUser.isAdmin) delete filter.OwnerID;

  Survey.findOne(filter, {}, {}, (err: CallbackError, survey: ISurvey | null) => {
      if (err) {
        console.error(err);
        res.end(err);
      }

      Question.find({ SurveyID: survey?.id }, (err: CallbackError, questions: IQuestion[]) => {
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
          user: AuthUser(req),
        });
      });
    },
  );
}

export function DisplaySurveyEditPage(req: express.Request, res: express.Response, next: express.NextFunction): void
{
  const authUser = AuthUser(req)!;

  const id = req.params.id;

  const filter = { _id: id, OwnerID: authUser.id };
  if (authUser.isAdmin) delete filter.OwnerID;

  Survey.findOne(filter, {}, {}, (err: CallbackError, survey: ISurvey | null) => {
    if (err) {
      console.error(err);
      res.end(err);
    }

    res.render('index', {
      title: 'Edit Survey',
      page: 'survey-create',
      survey,
      messages: req.flash("surveyEditMessage"),
      user: AuthUser(req),
    });
  });
}

export function ProcessSurveyEditPage(req: express.Request, res: express.Response, next: express.NextFunction): void
{
  const authUser = AuthUser(req)!;

  const id = req.params.id;

  const filter = { _id: id, OwnerID: authUser.id };
  if (authUser.isAdmin) delete filter.OwnerID;

  const updatedSurvey = new Survey(
    {
      Name: req.body.Name,
      Description: req.body.Description,
      StartDate: req.body.StartDate,
      EndDate: req.body.EndDate,
      IsPublished: req.body.IsPublished !== undefined,
    }
  );

  updatedSurvey._id = new Types.ObjectId(id);

  Survey.updateOne(filter, updatedSurvey, (err: CallbackError) => {
    if (err) {
      console.error(err);
      res.end(err);
    }

    res.redirect('/survey');
  });
}

export function ProcessSurveyDeletePage(req: express.Request, res: express.Response, next: express.NextFunction): void
{
  const authUser = AuthUser(req)!;

  const id = req.params.id;

  const filter = { _id: id, OwnerID: authUser.id };
  if (authUser.isAdmin) delete filter.OwnerID;

  Survey.remove(filter, (err: CallbackError) => {
    if (err) {
      console.error(err);
      res.end(err);
    }

    Question.remove({ SurveyID: id }, (err: CallbackError) => {
      if (err) {
        console.error(err);
        res.end(err);
      }

      res.redirect('/survey');
    });
  });
}
