import { withdrawCoin, approveWithdrawal } from './../controllers/withdraw.controller';
const router = require('express').Router();
import { validateUserToken } from './../middleware/auth';

router.post('/withdrawcoin', validateUserToken, withdrawCoin);
router.patch('/withdraw/approved/:id', validateUserToken, approveWithdrawal);

export default router;
