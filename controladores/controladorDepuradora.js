const connection = require('../config/bbdd')

const depuradora = (req, res) => {
    const sql = 'SELECT DiaTurno, PH_Salida, CL_Salida, PH_Decantador, CL_Decantador FROM datos_turno WHERE DiaTurno = (select max(DiaTurno) from datos_turno) ';
    connection.query(sql, [], (error, results) => {
        
        if (error) {
            return res.status(500).send({ message: 'Error al consultar la base de datos', error });
        }
        return res.status(200).header('Content-Type', 'applicacion/json').send(JSON.stringify(results[0]));// para tema seguridad que el formato siempre sea json y se ve mejor en postman.
            
    })
    
};

module.exports = {
    depuradora
}