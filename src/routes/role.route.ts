import { createRole  } from "./../controllers/role.controller";
const router = require("express").Router();
import { validateUserToken } from './../middleware/auth';
import { validatePermission } from "./../helpers/validation";


router.post("/roles", validateUserToken, validatePermission, createRole );


export default router;