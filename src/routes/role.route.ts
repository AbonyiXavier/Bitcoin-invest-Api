import {
  createRole,
  getRoles,
  getPermissions,
  editRole,
  deleteRole,
} from './../controllers/role.controller';
const router = require('express').Router();
import { validateUserToken } from './../middleware/auth';
import { validatePermission } from './../helpers/validation';
import { permit } from './../middleware/permit';

router.post('/roles', [validateUserToken, validatePermission, permit('role.manage')], createRole);
router.get('/getroles', [validateUserToken, permit('role.view')], getRoles);
router.get('/permissions', [validateUserToken, permit('role.view')], getPermissions);
router.patch('/editrole/:id', [validateUserToken, permit('role.manage')], editRole);
router.delete('/role/:id', [validateUserToken, permit('role.manage')], deleteRole);
export default router;
