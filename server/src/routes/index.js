const { Router } = require('express');
const { register, login, logout } = require("../controllers/authController");
const authMiddleware = require('../middlewares/authMiddleware');
const { allTasks, createTasks, deleteTasks } = require('../controllers/trasksController');

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Ruta protegida de ejemplo y validación
router.get("/me", authMiddleware, (req, res) => {
  try {
      res.json({ user: req.user, authenticated: true, });
    } catch (err) {
      res.status(401).json({ error: `${err}` });
    }
});

//rutas protegidas
router.get('/tasks', authMiddleware, allTasks);
router.post('/createtask', authMiddleware, createTasks);
router.delete('/tasks/:id', authMiddleware, deleteTasks);

module.exports = router;