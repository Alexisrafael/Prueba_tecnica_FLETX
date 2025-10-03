require("dotenv").config();
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const routes = require('./routes/index.js');
const cors = require("cors");
const morgan = require('morgan');

const server = express();
server.name = 'API';

// Middlewares
server.use(express.json());
server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
server.use(bodyParser.json({ limit: '50mb' }));
server.use(cookieParser());
server.use(morgan('dev'));

// Configuración de CORS (para permitir cookies desde el frontend)
server.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:4200", 
  credentials: true,
}));

// Rutas
server.use('/', routes);

// Middleware de manejo de errores
server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
