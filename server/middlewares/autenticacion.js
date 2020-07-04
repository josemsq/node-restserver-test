const jwt = require('jsonwebtoken');
const usuario = require('../models/usuario');

//===================================
//verificacion del token
//===================================
// next : continua la ejecucion del programa
let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: { err, message: 'Token no valido' }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};

//===================================
//verificacion de rol
//===================================
let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
};

//===================================
//verificacion del token para Imagen
//===================================
// next : continua la ejecucion del programa
let verificaTokenImg = (req, res, next) => {

    let token = req.query.token; //lo que se define en la url ? token=sdad

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: { err, message: 'Token no valido' }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};


module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
}