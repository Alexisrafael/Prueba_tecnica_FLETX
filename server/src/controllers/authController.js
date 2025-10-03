const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../../config/database.js");

// Registro
async function register(req, res) {
  try {
    const { name, lastname, email, password, age, address } = req.body;

    // Validar campos obligatorios
    if (!name || !lastname || !email || !password || !age || !address) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const normalizedEmail = email.toLowerCase();

    // Verificar si ya existe
    const existingUser = await db("users").where({ email: normalizedEmail }).first();
    if (existingUser) {
      return res.status(400).json({ error: `El correo ${normalizedEmail} ya está registrado` });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario
    const [id] = await db("users").insert({
      email: normalizedEmail,
      password: hashedPassword,
      name,
      lastname,
      age,
      address,
    });

    //Informacion que almacena el token
    const payload = {
      id,
      email: normalizedEmail,
      name: `${name} ${lastname}`,
      age,
      address,
    };

    //Crear token automáticamente
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "3h" });

    //Guardar token en cookie httpOnly
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 3 * 60 * 60 * 1000, // 3 horas
    });

    return res.status(201).json({
      message: "Usuario registrado y logueado con éxito",
      user: payload,
    });
  } catch (error) {
    console.error("Error en register:", error);
    return res.status(500).json({ error: "Error al registrarse" });
  }
}


// Login
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña son obligatorios" });
    }

    const normalizedEmail = email.toLowerCase();

    // Buscar usuario
    const user = await db("users").where({ email: normalizedEmail }).first();
    if (!user) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    // Comparar contraseñas
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    //Informacion que almacena el token
    const payload = {
      id: user.id,
      email: user.email,
      name: `${user.name} ${user.lastname}`,
      age: user.age,
      address: user.address,
    };

    // Crear token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "3h" });

    // Guardar en cookie segura
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 3 * 60 * 60 * 1000, // 3 horas
    });

    return res.json({
      message: "Inicio de sesión exitoso",
      user: payload,
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
}

// Logout
async function logout(req, res) {
  res.clearCookie("accessToken");
  return res.json({ message: "Sesión cerrada con éxito" });
}

module.exports = { register, login, logout };