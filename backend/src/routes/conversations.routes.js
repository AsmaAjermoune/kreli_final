const router = require("express").Router();
const { body } = require("express-validator");
const { verifyToken } = require("../middleware/auth.middleware");
const {
  getOrCreateConversation,
  getMyConversations,
  getMessages,
} = require("../controllers/conversations.controller");

router.use(verifyToken);


router.get("/", getMyConversations);


router.post(
  "/",
  [body("materielId").isMongoId().withMessage("ID matériel invalide")],
  getOrCreateConversation
);


router.get("/:id/messages", getMessages);

module.exports = router;
