import { createTransaction,  getTransaction, approveTransaction, checkInvestmentAndClose } from "./../controllers/transaction.controller";
// import { validateProfile } from "./../helpers/validation";
const router = require("express").Router();
import { validateUserToken } from './../middleware/auth';


router.post("/transaction", validateUserToken, createTransaction );
router.get("/transaction", validateUserToken, getTransaction );
router.patch("/transaction/approved/:id", validateUserToken, approveTransaction );
router.get("/transaction-check", checkInvestmentAndClose );



export default router;