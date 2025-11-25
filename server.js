// Importar dependencias necesarias
const express = require('express');

const jwt = require('jsonwebtoken');

// Crear instancia de Express
const app = express();

//Lu 
app.use(express.json()); // leer JSON del body
//

// Clave secreta para firmar tokens JWT (en un entorno real, usar variable de entorno)
const SECRET_KEY = "ClaveSecretaMuySegura";



// Ruta POST /login para autenticar usuario
app.post('/login', (req, res) => {
  // Extraer usuario y contraseña del cuerpo de la petición
  const { username, password } = req.body;

  // Validar credenciales (para demo, comparar con valores hardcoded)
  if (username === "usuario" && password === "contraseña") {
    // Generar token JWT con el username como payload
    const token = jwt.sign({ username }, SECRET_KEY);

    // Enviar respuesta con el token generado
    return res.status(200).json({ token });
  } else {
    // Credenciales inválidas: enviar error 401 Unauthorized con mensaje
    return res.status(401).json({ message: "Usuario y/o contraseña inválidas" });
  }
});


//Lu middleware para verificar 
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization']; //obtener el header de autorización

  if (!authHeader) {  //validar que exista
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Token inválido" });
  }

  //verificar token
  jwt.verify(token, SECRET_KEY, (err, userData) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido o expirado" });
    }

    req.user = userData;
    next();
  });
}

// Ruta GET /productos protegida por middleware de autenticación:

app.get('/productos', authMiddleware, (req, res) => {
  res.json({
    message: "Acceso autorizado",
    usuario: req.user.username
  });
});
//



// Definir puerto donde correrá el servidor
const PORT = 3000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
