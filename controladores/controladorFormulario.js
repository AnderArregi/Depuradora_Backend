const connection = require('../config/bbdd')

const obtenerFormulario = async(req, res) => {
    
    const {
        diaTurno, usuario, m3TratadasTurno, horasTratadasTurno, horasTurno, prensadas,
        phSalida, clSalida, phDecantador, clDecantador, phOxidacion, phLaboratorio,
        zinc, hierro, cobre
    } = req.body;

    const sql = `
    INSERT INTO Datos_Turno
    (DiaTurno, usuario, M3_Tratadas_Turno, Horas_Tratadas_Turno, Horas_Turno, Prensadas,
    PH_Salida, CL_Salida, PH_Decantador, CL_Decantador, PH_Oxidacion, PH_Laboratorio,
    Zinc, Hierro, Cobre)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`; 
    try {
        const results = await connection.query(sql, [
            diaTurno, usuario, m3TratadasTurno, horasTratadasTurno, horasTurno, prensadas,
            phSalida, clSalida, phDecantador, clDecantador, phOxidacion, phLaboratorio,
            zinc, hierro, cobre
        ]);

        res.status(201).json({ message: 'Datos registrados exitosamente', id: results.insertId });
    } catch (error) {
        console.error('Error al insertar datos: ', error);
        res.status(500).json({ message: 'Error al registrar los datos en la base de datos', error: error.message });
    }
    
};
module.exports = {
    obtenerFormulario
}