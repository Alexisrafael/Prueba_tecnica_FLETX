const db = require("../../config/database.js");

// Obtener todas las tareas del usuario autenticado
async function allTasks(req, res) {
  try {
    const user = req.user;
    const tasks = await db("tasks").where({ user_id: user.id }).orderBy("id", "desc");
    res.json(tasks);

  } catch (error) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener las tareas" });
  }
}

// Crear tarea
async function createTasks(req, res) {
  try {
    const { title, description } = req.body;
    const user = req.user;

    // Validar campos obligatorios
    if (!title || !description ) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const [id] = await db("tasks").insert({
      title,
      description,
      user_id: user.id,
    });

    res.status(201).json({ message: `Tarea creada con éxito`, taskId: id, title });

  } catch (error) {
    console.error(err);
    res.status(500).json({ error: "Error al crear la tareas" });
  }
}

// Eliminar tarea
async function deleteTasks(req, res) {
  try {
    const {id}  = req.params;
    const user = req.user;

    const task = await db("tasks").where({ id: id, user_id: user.id }).first();;

    if (!task) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    await db("tasks").where({ id: id }).del();

    res.json({ message: `Tarea eliminada con éxito`, title: task.title });
    
  } catch (error) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar la tarea" });
  }
}




module.exports = { allTasks, createTasks, deleteTasks };