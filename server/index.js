const server = require('./src/app.js');
const db = require('./config/database.js');

const startServer = async () => {
  try {
    // Probar la conexión con una query rápida
    await db.raw('SELECT 1');
    console.log('✅ Conexión a MySQL exitosa.');

    server.listen(3001, () => {
      console.log('🚀 Servidor corriendo en http://localhost:3001');
    });
  } catch (err) {
    console.error('❌ Error al iniciar el servidor:', err);
  }
};

startServer();