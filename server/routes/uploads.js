const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

// default options
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        //return res.status(400).send('No files were uploaded.');
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningun archivo'
                }
            });
    }

    // Validar tipo
    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son: ' + tiposValidos.join(',')
            }
        });
    }

    //console.log(tiposValidos.find(x => x === tipo));

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let file = req.files.archivo;
    let nombreFile = file.name.split('.');
    //console.log(nombreFile);
    let extension = nombreFile[nombreFile.length - 1]

    //validacion de extensione
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg', 'docx'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son: ' + extensionesValidas.join(','),
                ext: extension
            }
        });
    }

    //cambiar nombre a archivo
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    // Use the mv() method to place the file somewhere on your server
    file.mv(`uploads/${tipo}/${ nombreArchivo }`, (err) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // aqui, imagen cargada
        //if (tiposValidos.find(x => x === tipo) === 'usuarios') {
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }

        //res.send('File uploaded!');
        /*  res.json({
             ok: true,
             message: 'Imagen subida correctamente'
         }); */
    });

});

// id: Usuario - res : pasa por referencia
function imagenUsuario(id, res, nombreF) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {

            borrarArchivo(nombreF, 'usuarios');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {

            borrarArchivo(nombreF, 'usuarios');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        borrarArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreF;

        usuarioDB.save((err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreF
            });
        });
    });
}

function imagenProducto(id, res, nombreF) {

    Producto.findById(id, (err, productoDB) => {

        if (err) {

            borrarArchivo(nombreF, 'productos');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {

            borrarArchivo(nombreF, 'productos');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }

        borrarArchivo(productoDB.img, 'productos');

        productoDB.img = nombreF;

        productoDB.save((err, productoGuardado) => {

            res.json({
                ok: true,
                usuario: productoGuardado,
                img: nombreF
            });
        });
    });

}

function borrarArchivo(nombreFile, tipo, ) {

    let pathFile = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreFile }`);

    if (fs.existsSync(pathFile)) {
        fs.unlinkSync(pathFile);
    }

}

module.exports = app;