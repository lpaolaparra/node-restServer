const express = require('express');

const fileUpload = require('express-fileupload');

const  app = express();

const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

//middleware
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req,res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if(!req.files){

        return res.status(400)
                    .json({
                        ok:false,
                        err:{
                            message:'No se ha seleccionado ningun archivo'
                        }
                    });

    }

    //validar tipo
    let tiposValidos = ['productos','usuarios'];
    if(tiposValidos.indexOf(tipo) < 0){

        return res.status(400).json({
            ok:false,
            err: {
                message: 'Los tipos permitidos son: ' + tiposValidos.join(','),
            }
        })
    }


    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length -1];
    //extensiones permitidad
    let extensionesValidas = ['png','jpg','gif','jpeg'];

    if(extensionesValidas.indexOf( extension) < 0){

        return res.status(400).json({
            ok:false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(','),
                ext: extension
            }
        })
    }

    //cambiar nombre al archivo 
    let nombreArchivo = `${ id }-${new Date().getMilliseconds()}.${extension}`;



    archivo.mv(`uploads/${ tipo }/${nombreArchivo}`,(err) =>{

        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        //Aqui, imagen cargada

        /* res.json({
            ok:true,
            message:'Imagen Subida correctamente'
        })
    }) */
        if(tipo === 'usuario'){
            imagenUsuario(id,res,nombreArchivo)
        }else{
            imagenProducto(id,res,nombreArchivo)
        }

        
    });
});

function imagenUsuario(id,res,nombreArchivo){

    Usuario.findById(id, (err,usuarioDB) =>{
        if(err){

            borrarArchivo(nombreArchivo,'usuarios');
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(!usuarioDB){

            if(err){
                borrarArchivo(nombreArchivo,'usuarios');
                return res.status(400).json({
                    ok:false,
                    err:{
                        message:'Usuario no existe'
                    }
                })
            }

        }

        //verificar la ruta del archivo 
        borrarArchivo(usuarioDB.img,'usuarios');


        usuarioDB.img = nombreArchivo;
        usuarioDB.save(  (err,usuarioSave) =>{

            res.json({
                ok:true,
                usuario:usuarioSave,
                img: nombreArchivo
            })
        })


    })
}

function imagenProducto(id,res,nombreArchivo){

    Producto.findById(id, (err,productoDB) =>{
        if(err){

            borrarArchivo(nombreArchivo,'productos');
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(!productoDB){

            if(err){
                borrarArchivo(nombreArchivo,'productos');
                return res.status(400).json({
                    ok:false,
                    err:{
                        message:'producto no existe'
                    }
                })
            }

        }

        //verificar la ruta del archivo 
        borrarArchivo(productoDB.img,'productos');


        productoDB.img = nombreArchivo;
        productoDB.save(  (err,productoSave) =>{

            res.json({
                ok:true,
                producto:productoSave,
                img: nombreArchivo
            })
        })


    })
}
function borrarArchivo (nombreImagen,tipo){

    let pathImagen = path.resolve( __dirname, `../../uploads/${tipo}/${nombreImagen}`);

        if( fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen);
        }
}


module.exports = app;