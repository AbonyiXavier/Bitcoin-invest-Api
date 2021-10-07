import { createReceipt } from '../controllers/receipt.controller';
const router = require('express').Router();

router.post('/receipt', createReceipt);

export default router;
