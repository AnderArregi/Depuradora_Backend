const express = require('express')
const cors = require("cors")
const app = express()
const port = 3006
const router = require('./rutas/rutas')
require('dotenv').config()
const connection = require('./config/bbdd')

// Configuraciones básicas
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(express.json());

app.use('/api', router)

app.listen(port, () => {
  
  console.log(`Servidor levantado y escuchando en el puerto ${port}`);
})