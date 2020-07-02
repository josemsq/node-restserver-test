const express = require('express');
//destructuracion
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
//let
const app = express();
//let
const Categoria = require('../models/categoria');
//let

/* app.get('/categoria', (req, res) => {
    res.json('Hola categoria sin token');
});

app.get('/categoria', [verificaToken], (req, res) => {
    res.json('Hola categoria con token');
});
 */

//=============================
// Mostrar todas las categorias
//=============================
app.get('/categoria', verificaToken, (req, res) => {

    /* Categoria.find({}, 'descripcion usuario', (err, categorias) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categorias: categorias
        });
    }); */

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        //.populate(//campos) //si tenemos mas esquemas
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuarios: categorias
            });
        });
});

//=============================
// Busca una categoria por ID
//=============================
app.get('/categoria/:id', verificaToken, (req, res) => {
    //Categoria.findById()

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Id de categoria no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuarios: categoriaDB
        });
    });

});

//=============================
// Actualiza una categoria por ID
//=============================
app.put('/categoria/:id', verificaToken, (req, res) => {
    //Categoria.findById()

    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

//=============================
// Crear nueva categoria
//=============================
app.post('/categoria', [verificaToken], (req, res) => {

    let body = req.body; //bodyParser
    //console.log(body);
    //console.log(req);

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

//=============================
// Borrar categoria fisicamente
//=============================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDelete) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaDelete) {
            return res.status(400).json({
                ok: false,
                err: { message: 'Categoria no encontrado' }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDelete
        });

    });
});

module.exports = app;