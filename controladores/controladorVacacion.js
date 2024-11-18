const connection = require('../config/bbdd')
const { comprobarToken, obtenerUsuarioId } = require('./autentificacion');

// Función para insertar vacaciones
const insertarVacacion = async (req, res) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(401).json({ auth: false, message: 'No token provided.' });
    }
    const tokenValido = await comprobarToken(token);
    if(!tokenValido){
        return res.status(401).send({ auth: false, message: 'Fallo al autentificar el Token' });     
    }
    

    const { usuario, planta, fecha, turno } = req.body;
    const id = `${fecha} ${turno}`; 
    const sqlSeleccionar = 'SELECT * FROM vacaciones WHERE fecha = ?';
    connection.query(sqlSeleccionar, [fecha], (err, result) => {
        if (err) {
            console.error('Error al verificar la existencia de la vacación:', err);
            return res.status(500).json({ message: 'Error al conectar con la base de datos', error: err.message });
        }
        if (result.length !== 0) {
            return res.status(400).json({ message: 'La vacación para esa fecha y turno ya está registrada' });
        }

        const sqlInsertar = `
            INSERT INTO vacaciones (id, usuario, planta, fecha, turno)
            VALUES (?, ?, ?, ?, ?)`;
        connection.query(sqlInsertar, [id, usuario, planta, fecha, turno], (err, result) => {
            if (err) {
                console.error('Error al insertar vacaciones:', err);
                return res.status(500).json({ message: 'Error al conectar con la base de datos', error: err.message });
            }
            res.status(201).json({ message: 'Vacación registrada exitosamente' });
        });
    });
};


// Función para actualizar vacaciones
const actualizarVacacion = async (req, res) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(401).json({ auth: false, message: 'No token provided.' });
    }
    const tokenValido = await comprobarToken(token);
    if(!tokenValido){
        return res.status(401).send({ auth: false, message: 'Fallo al autentificar el Token' });    
    }
    

    const { id, usuario, planta, fecha, turno } = req.body;
    const sql = `
        UPDATE vacaciones
        SET usuario = ?, planta = ?, fecha = ?, turno = ?
        WHERE id = ?`;

    connection.query(sql, [usuario, planta, fecha, turno, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar vacaciones:', err);
            return res.status(500).json({ message: 'Error al actualizar los datos de vacaciones', error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'No se encontró la vacación con el ID proporcionado para actualizar' });
        }
        res.status(200).json({ message: 'Vacación actualizada exitosamente' });
    });
};

// Función para obtener vacaciones por año y mes
const obtenerVacacionesMes = async (req, res) => {

    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(401).json({ auth: false, message: 'No token provided.' });
    }
    const tokenValido = await comprobarToken(token);
    if(!tokenValido){
        return res.status(401).send({ auth: false, message: 'Fallo al autentificar el Token' });     
    }
    

    const { anio, mes } = req.params;
    const sql = `
        SELECT * FROM vacaciones 
        WHERE YEAR(fecha) = ? AND MONTH(fecha) = ?
        ORDER BY fecha ASC`;

    connection.query(sql, [anio, mes], (error, results) => {
        if (error) {
            console.error('Error al obtener vacaciones:', error);
            return res.status(500).send({ message: 'Error interno del servidor', error: error.message });
        }
        res.json(results); 
        
    });
};
const obtenerVacacion = async (req, res) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(401).json({ auth: false, message: 'No token provided.' });
    }
    const tokenValido = await comprobarToken(token);
    if(!tokenValido){
        return res.status(401).send({ auth: false, message: 'Fallo al autentificar el Token' });     
    }
    

    const {fecha } = req.params;
    const sql = `
        SELECT * FROM vacaciones
        WHERE fecha = ?`;

    connection.query(sql, [fecha], (error, results) => {
        if (error) {
            console.error('Error al obtener vacaciones:', error);
            return res.status(500).send({ message: 'Error interno del servidor', error: error.message });
        }
        if (results.length > 0) {
            res.json(results[0]); // Envía solo el primer objeto si existen resultados
        } else {
            res.status(404).send({ message: 'No se encontraron vacaciones para la fecha proporcionada' });
        }        
    });
};
const borrarVacacion = async (req, res) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(401).json({ auth: false, message: 'No token provided.' });
    }
    const tokenValido = await comprobarToken(token);
    
    if(!tokenValido){
        return res.status(401).send({ auth: false, message: 'Fallo al autentificar el Token' });    
    }
    const usuarioId = await obtenerUsuarioId(token);
    console.log(usuarioId)
    const { fecha } = req.params; // Asumiendo que el ID viene en la ruta del request

    const sql = 'DELETE FROM vacaciones WHERE fecha = ? and usuario= ?';

    connection.query(sql, [fecha, usuarioId], (err, result) => {
        if (err) {
            console.error('Error al borrar vacaciones:', err);
            return res.status(500).json({ message: 'Error al conectar con la base de datos', error: err.message });
        }
        if (result.affectedRows === 0) {
            // No se encontró el registro con ese ID, o no se borró ningún registro
            return res.status(404).json({ message: 'No se encontró la vacación con el ID proporcionado para borrar' });
        }
        res.status(200).json({ message: 'Vacación borrada exitosamente' });
    });
};

module.exports = {
    insertarVacacion,
    actualizarVacacion,
    obtenerVacacionesMes,
    obtenerVacacion,
    borrarVacacion 
};


