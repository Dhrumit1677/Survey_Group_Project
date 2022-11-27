import express from 'express';

import Survey, { ISurvey } from '../Models/survey';
import Question, { IAnswerVariant, IQuestion, TAnswerType } from '../Models/question';
import CompletedSurvey, { ICompletedSurvey } from '../Models/completedSurvey';

import { AuthUser } from '../Util';

type TCompletedSurveysInfo = {
  [key: string]: {
    survey?: ISurvey,
    count: number
  },
};

type TCompiledQuestion = {
  QuestionID: string,
  Question: string,
  Type: string,
  Answers: {
    Answer: string,
    Count: number,
  }[],
};

type TCompletedSurveyDetails = {
  SurveyID: string,
  Name: string,
  Description: string,
  CompletedCount: number,
  Questions: TCompiledQuestion[],
};

const getAnswersByType = (type: TAnswerType, answers: IAnswerVariant[]) => {
  if (type === 'binary') {
    return [
      { Answer: 'Yes' },
      { Answer: 'No' }
    ];
  }

  return answers;
};

export async function DisplayCompletedSurveysPage(req: express.Request, res: express.Response, next: express.NextFunction)
{
  const authUser = AuthUser(req)!;

  try {
    const surveys = await Survey.find(authUser.isAdmin ? {} : { OwnerID: authUser.id });
    
    const completedSurveys = await CompletedSurvey.find({
      SurveyID: { $in: surveys.map(x => x.id) },
      IsCompleted: true,
    });

    const completedSurveysGroupedById = completedSurveys.reduce<TCompletedSurveysInfo>((info, cs) => {
      const surveyId = cs.SurveyID.toString();
      const foundSurvey = info[surveyId];

      if (foundSurvey) {
        info[surveyId].count += 1;
      } else {
        
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
  } catch (err) {
    if (err) {
      console.error(err);
      res.end(err);
    }
  }
}

export async function DisplayCompletedSurveyDetailsPage(req: express.Request, res: express.Response, next: express.NextFunction)
{
  const authUser = AuthUser(req)!;

  const surveyId = req.params.sid;

  try {
    const surveyFilter = { _id: surveyId, OwnerID: authUser.id };
    if (authUser.isAdmin) delete surveyFilter.OwnerID;

    const survey = await Survey.findOne(surveyFilter);

    if (!survey) throw new Error(`Survey with id:"${surveyId}" not found.`);

    const questions = await Question.find({ SurveyID: surveyId });

    const compiledQuestions = questions.map<TCompiledQuestion>(q => {
      const answers = getAnswersByType(q.Type, q.Answers);
      
      return {
        QuestionID: q.id as string,
        Question: q.Question as string,
        Type: q.Type as string,
        Answers: answers.map(a => ({
          Answer: a.Answer as string,
          Count: 0,
        })),
      };
    });
    
    const completedSurveys = await CompletedSurvey.find({
      SurveyID: surveyId,
      IsCompleted: true,
    });

    const completedSurveyDetails = completedSurveys.reduce<TCompletedSurveyDetails>((compiledSurvey, { Questions }) => {
      compiledSurvey.Questions = compiledSurvey.Questions.map(q => {
        const completedQuestion = Questions.find(cq => cq.QuestionID.toString() === q.QuestionID);
        const complitedAnswers = completedQuestion?.Answer || [];

        if (q.Type === 'free') {
          complitedAnswers.forEach(answer => {
            q.Answers.push({
              Answer: answer as string,
              Count: 1,
            });
          });
        } else {
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
      Name: survey.Name as string,
      Description: survey.Description as string,
      CompletedCount: completedSurveys.length,
      Questions: compiledQuestions,
    });

    res.render('index', {
      title: 'Completed Survey Details',
      page: 'completed-details',
      completedSurveyDetails,
      user: authUser,
    });
  } catch (err) {
    if (err) {
      console.error(err);
      res.end(err);
    }
  }
}
