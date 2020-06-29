const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');

const app = express();

app.get('/', (req, res) => {
    res.json('Hola mundo');
});

app.get('/usuario', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 0;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email img role estado goggle')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios: usuarios,
                    tam: conteo
                });
            });

        });

    //res.json('get usuario LOCAL');
});

app.post('/usuario', (req, res) => {

    let body = req.body; //bodyParser

    //Usuario.createCollection()

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

    /*  if (body.nombre === undefined) {
         res.status(400).json({
             ok: false,
             mensaje: "El nombre es necesario"
         });
     } else {
         res.json({ persona: body });
     } */

});

app.put('/usuario/:id', (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });


    /* Usuario.findById(id, (err, usuarioDB) => {
        usuarioDB.save;
    }); */

    /* res.json({
        id
    }); */
});

app.delete('/usuario/:id', (req, res) => {

    let id = req.params.id;

    //eliminacion logica
    let cambiaEstado = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioDelete) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioDelete) {
            return res.status(400).json({
                ok: false,
                err: { message: 'Usuario no encontrado' }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDelete
        });
    });

    //eliminacion fisica
    /* Usuario.findByIdAndRemove(id, (err, usuarioDelete) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioDelete) {
            return res.status(400).json({
                ok: false,
                err: { message: 'Usuario no encontrado' }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDelete
        });

    }); */

    //res.json('delete usuario');
});

module.exports = app;