const router = require("express").Router();
const { verifyToken } = require("../middleware/auth.middleware");
const { getMyNotifications, markOneRead, markAllRead } = require("../controllers/notifications.controller");

router.use(verifyToken);


router.get("/", getMyNotifications);


router.patch("/read-all", markAllRead);


router.patch("/:id/read", markOneRead);

module.exports = router;
