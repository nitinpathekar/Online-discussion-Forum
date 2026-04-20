const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userControllers");
const { verifyToken } = require("../middleware/auth");

router.post("/register", userControllers.register);
router.post("/login", userControllers.login);
// Removed getRandomUsers route as it is not part of the core student forum features

router.get("/:username", userControllers.getUser);
router.patch("/:id", verifyToken, userControllers.updateUser);

module.exports = router;
