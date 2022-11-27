import express from 'express';

import { DisplayHomePage } from '../Controllers/index';

const router = express.Router();

/* Display home page. */
router.get('/', DisplayHomePage);

export default router;
