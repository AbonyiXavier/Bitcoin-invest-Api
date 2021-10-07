const router = require('express').Router();
import userRoute from './user.route';
import profileRoute from './profile.route';
import transactionRoute from './transaction.route';
import planRoute from './plan.route';
import roleRoute from './role.route';
import withdrawRoute from './withdraw.route';
import referalRoute from './referal.route';
import receiptRoute from './receipt.route';

router.use('/v1', userRoute);
router.use('/v1', profileRoute);
router.use('/v1', transactionRoute);
router.use('/v1', planRoute);
router.use('/v1', roleRoute);
router.use('/v1', withdrawRoute);
router.use('/v1', referalRoute);
router.use('/v1', receiptRoute);

export default router;
