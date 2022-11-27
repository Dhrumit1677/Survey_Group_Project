import express from 'express';

import {
  DisplayQuestionCreatePage,
  ProcessQuestionCreatePage,
  DisplayQuestionEditPage,
  ProcessQuestionEditPage,
  ProcessQuestionDeletePage,
} from '../Controllers/question';

import { AuthGuard } from '../Util';

const router = express.Router({ mergeParams: true });

/* Display Question Create Page. */
router.get('/create', AuthGuard, DisplayQuestionCreatePage);

/* Process Question Create Page */
router.post('/create', AuthGuard, ProcessQuestionCreatePage);

/* Display Question Edit Page. */
router.get('/:qid/edit', AuthGuard, DisplayQuestionEditPage);

/* Process Question Edit Page */
router.post('/:qid/edit', AuthGuard, ProcessQuestionEditPage);

/* Process Question Delete Page. */
router.get('/:qid/delete', AuthGuard, ProcessQuestionDeletePage);

export default router;
