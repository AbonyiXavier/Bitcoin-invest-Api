import { createTransaction,  getTransaction, approveTransaction } from "./../controllers/transaction.controller";
// import { validateProfile } from "./../helpers/validation";
const router = require("express").Router();
import { validateUserToken } from './../middleware/auth';


router.post("/transaction", validateUserToken, createTransaction );
router.get("/transaction", validateUserToken, getTransaction );
router.patch("/transaction/approved/:id", validateUserToken, approveTransaction );



export default router;