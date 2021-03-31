const router = require("express").Router();
import userRoute from "./user.route";


router.use("/v1", userRoute);


export default router;