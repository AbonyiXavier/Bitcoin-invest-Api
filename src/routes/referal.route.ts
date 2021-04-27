import { createreferalLink, getReferalLink } from './../controllers/referal.controller';
import { validateReferalLink } from './../helpers/validation';
const router = require('express').Router();
import { validateUserToken } from './../middleware/auth';

router.post('/referal-link', validateUserToken, validateReferalLink, createreferalLink);
router.get('/referal-link', validateUserToken, getReferalLink);

export default router;
