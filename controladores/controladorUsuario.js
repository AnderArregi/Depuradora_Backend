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
module.exports = {
    obtenerLogin
}