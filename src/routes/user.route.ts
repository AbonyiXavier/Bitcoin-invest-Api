import {
  signup,
  login,
  changePassword,
  forgetPassword,
  blockUser,
  getUsers,
  confirmEmail,
  editUser,
} from './../controllers/user.controller';
import {
  validateAuthDetails,
  validateLoginDetails,
  validatePassword,
  validateChangePassword,
  validateEmail,
} from './../helpers/validation';
const router = require('express').Router();
import { validateUserToken } from './../middleware/auth';
import { permit } from './../middleware/permit';

router.post('/signup', validateAuthDetails, signup);
router.post('/login', validateLoginDetails, validatePassword, login);
router.post('/changepassword/:id', validateChangePassword, changePassword);
router.post('/forgetpassword', validateEmail, forgetPassword);
router.post('/confirm/:token/:email', confirmEmail);
router.post('/users/:id', blockUser);
// router.get('/users', getUsers);
router.get('/users', validateUserToken, permit('role.view'), getUsers);
router.patch('/users', validateUserToken, editUser);

export default router;
