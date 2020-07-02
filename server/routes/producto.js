const express = require('express');
//destructuracion
const { verificaToken } = require('../middlewares/autenticacion');
//let
const app = express();
//let
const Producto = require('../models/producto');


//=============================
// Mostrar todas los producto
//=============================
app.get('/producto', verificaToken, (req, res) => {
    // usuario y categoria paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productosDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.count({}, (err, conteo) => {

                res.json({
                    ok: true,
                    productos: productosDB,
                    tam: conteo
                });
            });

        });
});

//=============================
// Busca un producto por ID
//=============================
app.get('/producto/:id', verificaToken, (req, res) => {
    //Categoria.findById()

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Id de producto no encontrado'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });

});

//=============================
// Busca productos
//=============================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            /* if (productosDB.length == 0) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Id de producto no encontrado'
                    }
                });
            } */

            res.json({
                ok: true,
                producto: productosDB
            });
        });
});

//=============================
// Crear un producto
//=============================
app.post('/producto', verificaToken, (req, res) => {

    //graba user y categoria

    let body = req.body; //bodyParser
    //console.log(body);
    //console.log(req);

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        categoria: body.idCategoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });

});

//=============================
// Actualiza un producto por ID
//=============================
app.put('/producto/:id', verificaToken, (req, res) => {
    //grabar user y categoria
    //Categoria.findById()

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    err,
                    message: 'Error al buscar producto'
                }
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Id de producto no encontrado'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precio;
        productoDB.categoria = body.idCategoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        err,
                        message: 'Error al guardar producto'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado
            });

        });
    });

    /* Producto.findByIdAndUpdate(id, descProducto, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    err,
                    message: 'Error al actualizar producto'
                }
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Id de producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    }); */

});

//=============================
// Borrar producto logicamente
//=============================
app.delete('/producto/:id', verificaToken, (req, res) => {
    //disponible to false
    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    err,
                    message: 'Error al buscar producto'
                }
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Id de producto no encontrado'
                }
            });
        }

        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        err,
                        message: 'Error al eliminar producto'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                message: 'Producto borrado'
            });

        });
    });

    /* //eliminacion logica
    let cambiaEstado = {
        disponible: false
    };

    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, productoDelete) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    err,
                    message: 'Error al borrar producto'
                }
            });
        }

        if (!productoDelete) {
            return res.status(400).json({
                ok: false,
                err: { message: 'Id de producto no encontrado' }
            });
        }

        res.json({
            ok: true,
            producto: productoDelete
        });
    }); */
});

module.exports = app;