const connection = require('../config/bbdd')

const obtenerLogin = (req, res) => {
    const { correo, pass } = req.body;
    if (!correo || !pass) {
        return res.status(400).send({ message: 'El Correo y la contraseña son necesarias' });
    }

    const sql = 'SELECT * FROM Usuario WHERE correo = ? AND pass = ?';
    connection.query(sql, [correo, pass], (error, results) => {
        if (error) {
            return res.status(500).send({ message: 'Error al consultar la base de datos', error });
        }

        if (results.length > 0) {
            res.send({ message: 'Login exitoso', user: results[0] });
        } else {
            res.status(401).send({ message: 'Usuario o contraseña incorrectos' });
        }
    });
};
const obtenerUsuario = (req, res) =>{
    const usuarioId = req.params.usuarioId;
    const sql = `SELECT nombre FROM usuario WHERE id = '${usuarioId}'`//comillas en la variable usuario porque es varchar(1) y se necesitan poruq es string
    connection.query(sql, [], (error, results) => {
        
        if (error) {
            return res.status(500).send({ message: 'Error al consultar la base de datos', error });
        }
        return res.status(200).header('Content-Type', 'applicacion/json').send(JSON.stringify(results[0]));// para tema seguridad que el formato siempre sea json y se ve mejor en postman.
            
    })
}

module.exports = {
    obtenerLogin,
    obtenerUsuario
}