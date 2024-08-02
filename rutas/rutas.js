const express = require('express')
const router = express.Router();


const { obtenerLogin, obtenerUsuario  } = require('../controladores/controladorUsuario');
const { nuevoPass } = require('../controladores/controladorPass');
const { depuradora } = require('../controladores/controladorDepuradora');
const { obtenerTurnos, obtenerTurnosDia, obtenerTurnosDiaUsuario } = require('../controladores/controladorTurno');

const { insertarFormulario, actualizarFormulario, obtenerFormulario } = require('../controladores/controladorFormulario');
const { insertarVacacion, actualizarVacacion, obtenerVacacionesMes, borrarVacacion} = require('../controladores/controladorVacacion');


const { obtenerPowerBI } = require('../controladores/controladorPowerBI.js');


router.post('/login', obtenerLogin);
router.post('/nuevoPass', nuevoPass);
router.get('/depuradora/actual', depuradora);
router.get('/usuario/:usuarioId', obtenerUsuario);
router.get('/turno/:ano/:mes', obtenerTurnos);//Pongo año y mes para que no sea igual que la BBDD y tenga mas seguridad
router.get('/turno/:ano/:mes/:dia', obtenerTurnosDia);
router.get('/turno/:ano/:mes/:dia/:usuarioId', obtenerTurnosDiaUsuario);


router.post('/formulario', insertarFormulario);
router.put('/formulario/:usuarioId/:ano/:mes/:dia/:turno', actualizarFormulario);
router.get('/formulario/:fecha', obtenerFormulario);
//router.delete('/formulario/:usuarioId/:ano/:mes/:dia/:turno', borrarFormulario);


router.post('/vacacion', insertarVacacion);
router.put('/vacacion/:IdVacacion', actualizarVacacion);
router.get('/vacacion/:anio/:mes', obtenerVacacionesMes);
router.delete('/vacacion/:IdVacacion', borrarVacacion);




router.get('/powerbi-token', obtenerPowerBI);


module.exports = router
