const express = require("express");
const { body, validationResult } = require("express-validator");

const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth.middleware");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });
  next();
};

const router = express.Router();




router.post("/register", ...authController.registerValidation, authController.register);


router.post("/login", ...authController.loginValidation, authController.login);


router.get("/me", verifyToken, authController.me);


router.put("/profile", verifyToken, authController.updateProfile);
router.post(
  "/forgot-password",
  body("email").isEmail().withMessage("Email invalide"),
  validate,
  authController.forgotPassword
);
router.post(
  "/reset-password",
  body("token").notEmpty().withMessage("Token requis"),
  body("newPassword").isLength({ min: 8 }).withMessage("Mot de passe trop court (8 caractères min)"),
  validate,
  authController.resetPassword
);

module.exports = router;
