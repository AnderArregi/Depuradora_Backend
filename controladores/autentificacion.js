const jwt = require('jsonwebtoken')
const secretKey = 'secretKey';

const tokenInvalido = [];

const comprobarToken = async (token) => {
    if (tokenInvalido.includes(token)) {
        return false;
    }
    try {
        await jwt.verify(token, secretKey);
        return true;
    } catch (err) {
        return false;
    }
}

const obtenerToken = (correo, usuarioId) => {
    return jwt.sign({ id: correo, usuarioId: usuarioId}, secretKey, { expiresIn: 86400 })

}

const quitarToken = (token) => {
    tokenInvalido.push(token);

}
const obtenerUsuarioId = async (token) => {
    const datos = await jwt.decode(token, {complete: true});
    console.log(datos)
    return datos.payload.usuarioId;
}
module.exports = {
    comprobarToken,
    obtenerToken,
    quitarToken,
    obtenerUsuarioId
}
