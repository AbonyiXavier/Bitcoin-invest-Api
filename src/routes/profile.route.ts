import {
  addProfile,
  getProfile,
  editProfile,
  getCountries,
} from './../controllers/profile.controller';
import { validateProfile } from './../helpers/validation';
const router = require('express').Router();
import { validateUserToken } from './../middleware/auth';
import { upload } from '../middleware/upload';

router.post('/profile', [validateUserToken, upload.single('image'), validateProfile], addProfile);
router.get('/profile', validateUserToken, getProfile);
router.get('/Countries', getCountries);
router.patch('/profile/:id', [upload.single('image'), validateUserToken], editProfile);

export default router;
