const express = require("express");
const {
  register,
  login,
  logout,
  auth,
} = require("../controllers/authcontrollers");
const { authenticateToken } = require("../middlewares/authenticate");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/auth", authenticateToken, auth);

module.exports = router;
