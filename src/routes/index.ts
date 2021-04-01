const router = require("express").Router();
import userRoute from "./user.route";
import profileRoute from "./profile.route";


router.use("/v1", userRoute);
router.use("/v1", profileRoute);


export default router;