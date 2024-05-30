const express = require('express')
const router = express.Router();


const { obtenerLogin, obtenerUsuario  } = require('../controladores/controladorUsuario');
const { nuevoPass } = require('../controladores/controladorPass');
const { depuradora } = require('../controladores/controladorDepuradora');
const { obtenerTurnos, obtenerTurnosDia } = require('../controladores/controladorTurno');
const { obtenerFormulario } = require('../controladores/controladorFormulario');


router.post('/login', obtenerLogin);
router.post('/nuevoPass', nuevoPass);
router.get('/depuradora/actual', depuradora);
router.get('/usuario/:usuarioId', obtenerUsuario);
router.get('/turno/:ano/:mes', obtenerTurnos);//Pongo año y mes para que no sea igual que la BBDD y tenga mas seguridad
router.get('/turno/:ano/:mes/:dia', obtenerTurnosDia);
router.post('/formulario', obtenerFormulario);

module.exports = router