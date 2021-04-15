import { createPlan } from "./../controllers/plan.controller";
// import { validateProfile } from "./../helpers/validation";
const router = require("express").Router();
import { validateUserToken } from './../middleware/auth';


router.post("/plan", createPlan );


export default router;