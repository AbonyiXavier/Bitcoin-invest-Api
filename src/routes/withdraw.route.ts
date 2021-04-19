import {
  withdrawCoin,
  approveWithdrawal,
} from './../controllers/withdraw.controller';
// import { validateProfile } from "./../helpers/validation";
const router = require('express').Router();
import { validateUserToken } from './../middleware/auth';

router.post('/withdrawcoin', validateUserToken, withdrawCoin);
router.patch('/withdraw/approved/:id', validateUserToken, approveWithdrawal);

export default router;
