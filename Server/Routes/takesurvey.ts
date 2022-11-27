import express from 'express';

import {
  DisplayTakeSurveysPage,
  ProcessTakeSurveyPage,
  DisplayTakeSurveyQuestionPage,
  ProcessTakeSurveyQuestionPage,
  DisplayTakeSurveyThanksPage,
} from '../Controllers/takesurvey';

import { AuthGuard } from '../Util';

const router = express.Router();

/* Display Take Surveys Page. */
router.get('/', AuthGuard, DisplayTakeSurveysPage);

/* Process Take Survey. */
router.get('/:sid', AuthGuard, ProcessTakeSurveyPage);

/* Display Take Survey Question Page. */
router.get('/:sid/question/:qid', AuthGuard, DisplayTakeSurveyQuestionPage);

/* Process Take Survey Question Page */
router.post('/:sid/question/:qid', AuthGuard, ProcessTakeSurveyQuestionPage);

/* Display Take Survey Thanks Page. */
router.get('/:sid/thanks', AuthGuard, DisplayTakeSurveyThanksPage);

export default router;
