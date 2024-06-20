const connection = require('../config/bbdd')

// Función para ajustar valores numéricos, convertirá cadenas vacías en cero
const ajustarValorNumerico = (valor) => {
    return valor === '' ? 0 : parseInt(valor, 10);
};

// Función para ajustar valores decimales, convertirá cadenas vacías en 0.000
const ajustarValorDecimal = (valor) => {
    const num = parseFloat(valor);
    return isNaN(num) ? 0.000 : parseFloat(num.toFixed(3));
};



const insertarFormulario = async (req, res) => {

    const {
        diaTurno, usuario, m3TratadasTurno, horasTratadasTurno, horasTurno, prensadas,
        phSalida, clSalida, phDecantador, clDecantador, phOxidacion, phLaboratorio,
        zinc, hierro, cobre, Horas_8h, Horas_10h, Horas_13h, Horas_15h, Horas_18h, Horas_21h,
        Prensada_SI, M3_Principio_Turno, M3_Final_Turno, M3_h, Recogida_Camion
    } = req.body;
    let tablaCamionVacia = false;
    const ultimoEstadoCamionSQL = `SELECT TotalCamion FROM camion  WHERE id=(SELECT MAX(id) FROM camion)`;
    let ultimoEstadoCamion = 0;
    connection.query(ultimoEstadoCamionSQL, [], (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Error al conectar los datos en la base de datos', error: err.message });
            return
        }

        if (result.length === 0) {
            tablaCamionVacia = true;
        }
        ultimoEstadoCamion = result[0] ?? 0.0;

    })
    const sql = `
        INSERT INTO Datos_Turno
        (DiaTurno, usuario, M3_Tratadas_Turno, Horas_Tratadas_Turno, Horas_Turno, Prensadas,
        PH_Salida, CL_Salida, PH_Decantador, CL_Decantador, PH_Oxidacion, PH_Laboratorio,
        Zinc, Hierro, Cobre, Horas_8h, Horas_10h, Horas_13h, Horas_15h, Horas_18h, Horas_21h,
        Prensada_SI, M3_Principio_Turno, M3_Final_Turno, M3_h, Recogida_Camion)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                connection.query(sql, [
                    diaTurno, usuario, ajustarValorNumerico(m3TratadasTurno), ajustarValorNumerico(horasTratadasTurno), ajustarValorNumerico(horasTurno),
                    ajustarValorDecimal(prensadas), ajustarValorDecimal(phSalida), ajustarValorDecimal(clSalida), ajustarValorDecimal(phDecantador), ajustarValorDecimal(clDecantador), ajustarValorDecimal(phOxidacion), ajustarValorDecimal(phLaboratorio),
                    ajustarValorDecimal(zinc), ajustarValorDecimal(hierro), ajustarValorDecimal(cobre), Horas_8h, Horas_10h, Horas_13h, Horas_15h, Horas_18h, Horas_21h,
                    Prensada_SI, ajustarValorNumerico(M3_Principio_Turno), ajustarValorNumerico(M3_Final_Turno), ajustarValorNumerico(M3_h), Recogida_Camion
                ], (err, result) => {})
                const NuevoEstadoCamion = ultimoEstadoCamion + prensadas;
                const sql2 = `INSERT INTO Camion (TotalCamion) VALUES (?)`;
                connection.query(sql2, [ajustarValorDecimal(NuevoEstadoCamion)], (err, result) => {});
                res.status(201);


    /*try {
        connection.connect((error)=> {
            connection.beginTransaction((err) => {//para hacer transaccion por si hay un error
                if (err) throw err;
                const sql = `
        INSERT INTO Datos_Turno
        (DiaTurno, usuario, M3_Tratadas_Turno, Horas_Tratadas_Turno, Horas_Turno, Prensadas,
        PH_Salida, CL_Salida, PH_Decantador, CL_Decantador, PH_Oxidacion, PH_Laboratorio,
        Zinc, Hierro, Cobre, Horas_8h, Horas_10h, Horas_13h, Horas_15h, Horas_18h, Horas_21h,
        Prensada_SI, M3_Principio_Turno, M3_Final_Turno, M3_h, Recogida_Camion)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                connection.query(sql, [
                    diaTurno, usuario, ajustarValorNumerico(m3TratadasTurno), ajustarValorNumerico(horasTratadasTurno), ajustarValorNumerico(horasTurno),
                    ajustarValorDecimal(prensadas), ajustarValorDecimal(phSalida), ajustarValorDecimal(clSalida), ajustarValorDecimal(phDecantador), ajustarValorDecimal(clDecantador), ajustarValorDecimal(phOxidacion), ajustarValorDecimal(phLaboratorio),
                    ajustarValorDecimal(zinc), ajustarValorDecimal(hierro), ajustarValorDecimal(cobre), Horas_8h, Horas_10h, Horas_13h, Horas_15h, Horas_18h, Horas_21h,
                    Prensada_SI, ajustarValorNumerico(M3_Principio_Turno), ajustarValorNumerico(M3_Final_Turno), ajustarValorNumerico(M3_h), Recogida_Camion
                ], (err, result) => {
                    if (err) {
                        return connection.rollback(() => {
                            throw err;
                        });
                    }
                    const NuevoEstadoCamion = ultimoEstadoCamion + prensadas;
                    const sql2 = `INSERT INTO Camion (TotalCamion) VALUES (?)`;
                    
                    connection.query(sql2, [ajustarValorDecimal(NuevoEstadoCamion)], (err, result) => {
                        if (err) {
                            console.error('error al ejecutar sql2');
                            return connection.rollback(() => {
                                throw err;
                            });
                        }
                        console.log('empezar commit')
                        connection.commit((err) => {
                            
                            if (err) {
                                return connection.rollback(() => {
                                    throw err;
                                });
                            }
                            console.log('finalizar commit')
                            //connection.end();
                            console.log('finalizar despues de end')
                        })
                    })
                })
    
            })
            //connection.end();
        })
        console.log('finalizar ')
        res.status(201);
    } catch (err) {
        res.status(500).json({ message: 'Error al registrar los datos en la base de datos', error: err.message });

    }*/
};
module.exports = {
    insertarFormulario
}