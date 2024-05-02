const express = require('express')
const router = express.Router();


const { obtenerLogin } = require('../controladores/controladorUsuario');


router.post('/login', obtenerLogin);


module.exports = router