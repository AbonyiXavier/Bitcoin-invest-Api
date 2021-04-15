const router = require("express").Router();
import userRoute from "./user.route";
import profileRoute from "./profile.route";
import transactionRoute from "./transaction.route";
import planRoute from "./plan.route";


router.use("/v1", userRoute);
router.use("/v1", profileRoute);
router.use("/v1", transactionRoute);
router.use("/v1", planRoute);


export default router;