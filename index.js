const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./db/config');
require('dotenv').config();

// crear el servidor/aplicación express
const app = express();

// base de datos
dbConnection();

// directorio publico
app.use(express.static('public'));

// CORS
app.use(cors());

// lectura y parseo del body
app.use(express.json());

// rutas
app.use('/api/auth', require('./routes/auth'));

// estar escuchando cualquier información que venga desde un puerto en especifico
app.listen(process.env.PORT, () => {
    console.log(`Servidor en puerto ${process.env.PORT}`);
})