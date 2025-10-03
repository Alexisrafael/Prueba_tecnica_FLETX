const { Router } = require('express');
const { register, login, logout } = require("../controllers/authController");
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Ruta protegida de ejemplo
router.get("/me", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;