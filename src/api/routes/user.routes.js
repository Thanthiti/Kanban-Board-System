const express = require("express");
const router = express.Router();
const { registerUser, loginUser, ProfileUser } = require("../controllers/user.controller");
const validate = require("../middlewares/validator.middleware");
const { registerSchema, loginSchema } = require("../../schemas/auth.schema");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);

router.get("/profile",  authMiddleware, ProfileUser);

module.exports = router;
    