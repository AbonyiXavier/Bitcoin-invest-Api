import {
  createRole,
  getRoles,
  getPermissions,
  editRole,
} from './../controllers/role.controller';
const router = require('express').Router();
import { validateUserToken } from './../middleware/auth';
import { validatePermission } from './../helpers/validation';

router.post('/roles', validateUserToken, validatePermission, createRole);
router.get('/getroles', validateUserToken, getRoles);
router.get('/permissions', validateUserToken, getPermissions);
router.patch('/editrole/:id', validateUserToken, editRole);
export default router;
