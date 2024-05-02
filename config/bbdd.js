const mysql = require('mysql')
require('dotenv').config()

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
})


connection.connect((err) => {
  
  if (err) {
    console.error('Error al conectar a la base de datos:', err)
    return
  }
  console.log('Conexión exitosa a la base de datos')
})

module.exports = connection