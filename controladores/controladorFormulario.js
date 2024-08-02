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
    ], (err, result) => { })
    const NuevoEstadoCamion = ultimoEstadoCamion + prensadas;
    const sql2 = `INSERT INTO Camion (TotalCamion) VALUES (?)`;
    connection.query(sql2, [ajustarValorDecimal(NuevoEstadoCamion)], (err, result) => { });
    return res.status(201).send();



};
const actualizarFormulario = async (req, res) => {
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


    try {
        // Primero, determina si ya existe un registro para el día y usuario específico
        const verificaExistenciaSQL = `SELECT * FROM Datos_Turno WHERE DiaTurno = ? AND usuario = ?`;
        connection.query(verificaExistenciaSQL, [diaTurno, usuario], async (err, result) => {
            
            const resultado = JSON.parse(JSON.stringify(result[0]));
            console.log(resultado)
            if (err) {
                return res.status(500).json({ message: 'Error al conectar con la base de datos', error: err.message });
            }

            if (result.length === 0) {
                // Si no hay registros, devuelve un error indicando que no se puede actualizar porque no existe
                return res.status(404).json({ message: 'No existe un registro para actualizar' });
            }

            // Si existe, procede con la actualización
            const actualizarSQL = `
                UPDATE Datos_Turno SET
                M3_Tratadas_Turno = ?, Horas_Tratadas_Turno = ?, Horas_Turno = ?, Prensadas = ?,
                PH_Salida = ?, CL_Salida = ?, PH_Decantador = ?, CL_Decantador = ?, PH_Oxidacion = ?, PH_Laboratorio = ?,
                Zinc = ?, Hierro = ?, Cobre = ?, Horas_8h = ?, Horas_10h = ?, Horas_13h = ?, Horas_15h = ?, Horas_18h = ?, Horas_21h = ?,
                Prensada_SI = ?, M3_Principio_Turno = ?, M3_Final_Turno = ?, M3_h = ?, Recogida_Camion = ?
                WHERE DiaTurno = ? AND usuario = ?
            `;
            const params = [
                ajustarValorNumerico(m3TratadasTurno), ajustarValorNumerico(horasTratadasTurno), ajustarValorNumerico(horasTurno),
                ajustarValorDecimal(prensadas), ajustarValorDecimal(phSalida), ajustarValorDecimal(clSalida), ajustarValorDecimal(phDecantador), ajustarValorDecimal(clDecantador), ajustarValorDecimal(phOxidacion), ajustarValorDecimal(phLaboratorio),
                ajustarValorDecimal(zinc), ajustarValorDecimal(hierro), ajustarValorDecimal(cobre), Horas_8h, Horas_10h, Horas_13h, Horas_15h, Horas_18h, Horas_21h,
                Prensada_SI, ajustarValorNumerico(M3_Principio_Turno), ajustarValorNumerico(M3_Final_Turno), ajustarValorNumerico(M3_h), Recogida_Camion,
                diaTurno, usuario
            ];

            connection.query(actualizarSQL, params, (err, result) => {
                if (err) {
                    return res.status(500).json({ message: 'Error al actualizar el formulario', error: err.message });
                }

                // Actualización exitosa
                return res.status(200).json({ message: 'Formulario actualizado exitosamente' });
            });
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error en el servidor', error: error.message });
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

};
const obtenerJson =(datos)=>{
    const result = {
        diaTurno: datos.DiaTurno,
        usuario: datos.Usuario,
        m3TratadasTurno: datos.M3_Tratadas_Turno,
        horasTratadasTurno: datos.Horas_Tratadas_Turno,
        horasTurno: datos.Horas_Turno,
        prensadas: datos.Prensadas,
        phSalida: datos.PH_Salida,
        clSalida: datos.CL_Salida,
        phDecantador: datos.PH_Decantador,
        clDecantador: datos.CL_Decantador,
        phOxidacion: datos.PH_Oxidacion,
        phLaboratorio: datos.PH_Laboratorio,
        zinc: datos.Zinc,
        hierro: datos.Hierro,
        cobre: datos.Cobre,
        
        Horas_8h: datos.Horas_8h,
        Horas_10h: datos.Horas_10h,
        Horas_13h: datos.Horas_13h,
        Horas_15h: datos.Horas_15h,
        Horas_18h: datos.Horas_18h,
        Horas_21h: datos.Horas_21h,


        Prensada_SI: datos.Prensada_SI,
        M3_Principio_Turno: datos.M3_Principio_Turno,
        M3_Final_Turno: datos.M3_Final_Turno,
        M3_h: datos.M3_h,
        camion: datos.Camion,
        Recogida_Camion: datos.Recogida_Camion,

    }
    return result

}
const obtenerFormulario = async (req, res) => {
    const { fecha, turno } = req.params;
    const diaTurno = `${fecha} ${turno}`;
    const sql = `SELECT * FROM datos_turno WHERE diaTurno = ?`;

    connection.query(sql, [diaTurno], (error, results) => {
        if (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).send({ message: 'Error interno del servidor', error: error.message });
            return;
        }

        if (results.length > 0) {
            const cleanResult = JSON.parse(JSON.stringify(results[0]));  // Convertir el RowDataPacket en un objeto JSON puro
            res.json(obtenerJson(results[0]));  // Envía el objeto JSON limpio
        } else {
            res.status(404).send({ message: 'Formulario no encontrado' });
        }
    });
};





module.exports = {
    insertarFormulario,
    actualizarFormulario,
    obtenerFormulario
}



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

