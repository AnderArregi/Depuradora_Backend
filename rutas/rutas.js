const express = require('express')
const router = express.Router();


const { obtenerLogin, obtenerUsuario  } = require('../controladores/controladorUsuario');
const { nuevoPass } = require('../controladores/controladorPass');
const { depuradora } = require('../controladores/controladorDepuradora');
const { obtenerTurnos, obtenerTurnosDia, obtenerTurnosDiaUsuario } = require('../controladores/controladorTurno');
const { insertarFormulario } = require('../controladores/controladorFormulario');
const { obtenerPowerBI } = require('../controladores/controladorPowerBI.js');


router.post('/login', obtenerLogin);
router.post('/nuevoPass', nuevoPass);
router.get('/depuradora/actual', depuradora);
router.get('/usuario/:usuarioId', obtenerUsuario);
router.get('/turno/:ano/:mes', obtenerTurnos);//Pongo año y mes para que no sea igual que la BBDD y tenga mas seguridad
router.get('/turno/:ano/:mes/:dia', obtenerTurnosDia);
router.get('/turno/:ano/:mes/:dia/:usuarioId', obtenerTurnosDiaUsuario);
router.post('/formulario', insertarFormulario);

router.get('/powerbi-token', obtenerPowerBI);


module.exports = router