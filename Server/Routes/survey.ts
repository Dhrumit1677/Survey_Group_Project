import express from 'express';

import {
  DisplaySurveysPage,
  DisplaySurveyCreatePage,
  ProcessSurveyCreatePage,
  DisplaySurveyDetailsPage,
  DisplaySurveyEditPage,
  ProcessSurveyEditPage,
  ProcessSurveyDeletePage,
} from '../Controllers/survey';

import { AuthGuard } from '../Util';

const router = express.Router();

/* Display Surveys Page. */
router.get('/', AuthGuard, DisplaySurveysPage);

/* Display Survey Create Page. */
router.get('/create', AuthGuard, DisplaySurveyCreatePage);

/* Process Survey Create Page */
router.post('/create', AuthGuard, ProcessSurveyCreatePage);

/* Display Survey Details Page. */
router.get('/:id', AuthGuard, DisplaySurveyDetailsPage);

/* Display Survey Edit Page. */
router.get('/:id/edit', AuthGuard, DisplaySurveyEditPage);

/* Process Survey Edit Page */
router.post('/:id/edit', AuthGuard, ProcessSurveyEditPage);

/* Process Survey Delete Page */
router.get('/:id/delete', AuthGuard, ProcessSurveyDeletePage);

export default router;
