import express from 'express';

import {
  DisplayCompletedSurveysPage,
  DisplayCompletedSurveyDetailsPage,
} from '../Controllers/completed';

import { AuthGuard } from '../Util';

const router = express.Router({ mergeParams: true });

/* Display Completed Surveys Page. */
router.get('/', AuthGuard, DisplayCompletedSurveysPage);

/* Process Completed Survey Details Page */
router.get('/:sid', AuthGuard, DisplayCompletedSurveyDetailsPage);

export default router;
