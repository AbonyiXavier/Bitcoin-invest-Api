import { addProfile, getProfile, editProfile } from "./../controllers/profile.controller";
import { validateProfile } from "./../helpers/validation";
const router = require("express").Router();
import { validateUserToken } from './../middleware/auth';
import { upload } from "../upload-photo/upload"

router.post("/profile", validateUserToken, upload.single('image'), validateProfile, addProfile);
router.get("/profile", validateUserToken, getProfile);
router.patch("/editprofile/:id", upload.single('image'),  validateUserToken, editProfile);


export default router;