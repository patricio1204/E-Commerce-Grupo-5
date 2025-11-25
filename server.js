// Importar dependencias necesarias
const express = require('express');

const jwt = require('jsonwebtoken');

// Crear instancia de Express
const app = express();

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

// Definir puerto donde correrá el servidor
const PORT = 3000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
