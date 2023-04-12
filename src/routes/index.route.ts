import * as express from 'express';

import userAuth from './user/auth.route';
import test from './test/test.route';

const router = express.Router();

router.use('/user/auth', userAuth);
router.use('/news', test);

export default router;
