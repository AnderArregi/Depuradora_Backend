const connection = require('../config/bbdd')

const nuevoPass = (req, res) => {
    const { correo, pass, newPass } = req.body;
    const sql = 'UPDATE Usuario SET pass = ?  WHERE correo = ? AND pass = ? ';
    connection.query(sql, [ newPass, correo, pass], (error, results) => {
        
        if (error) {
            return res.status(500).send({ message: 'Error al consultar la base de datos', error });
        }
        return res.status(204).send(results);
        if (results.length > 0) {
            res.send({ message: 'Login exitoso', user: results[0] });
        } else {
            res.status(401).send({ message: 'Usuario o contraseña incorrectos' });
        }
    })
    
};

module.exports = {
    nuevoPass
}