const express = require('express')
const router = express.Router();


const { obtenerLogin, obtenerUsuario  } = require('../controladores/controladorUsuario');
const { nuevoPass } = require('../controladores/controladorPass');
const { depuradora } = require('../controladores/controladorDepuradora');

router.post('/login', obtenerLogin);
router.post('/nuevoPass', nuevoPass);
router.get('/depuradora/actual', depuradora);
router.get('/usuario/:usuarioId', obtenerUsuario);

module.exports = router