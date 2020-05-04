const express = require('express');

let { verificaToken} = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');


app.get('/productos',verificaToken, (req,res) =>{

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({disponible:true})
    .skip(desde)
    .limit(5)
    .populate('usuario','nombre email')
    .populate('categoria','descripcion')
    .exec( (err,productos) =>{

        if( err ){
            return res.status(500).json({
                ok:false,
                err,
            });
        }

        res.json({
            ok:true,
            productos
        })
    }) 
})

app.get('/productos/:id', verificaToken, (req,res) =>{
    
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario','nombre email')
        .populate('categoria','descripcion')
        .exec( (err,productoDB) =>{

            if( err ){
                return res.status(500).json({
                    ok:false,
                    err,
                });
            }

            if( !productoDB ){
                return res.status(400).json({
                    ok:false,
                    err:{
                        message: 'Producto no existente'
                    }
                });
            }

            res.json({
                ok:true,
                producto: productoDB
            })
        })
})
//Buscar productos

app.get('/productos/buscar/:termino', verificaToken,(req,res)=>{

    let termino = req.params.termino;

    //expresion regular
    let regex = new RegExp(termino,'i')

    Producto.find({ nombre: regex})
        .populate('categoria','descripcion')
        .exec( (err,productos) =>{

            if( err ){
                return res.status(500).json({
                    ok:false,
                    err,
                });
            }
            
            res.json({
                ok:true,
                productos
            })
        })
})


app.post('/productos', verificaToken, (req,res) =>{
    
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id,
    })

    producto.save((err,productoDB) =>{

        if( err ){
            return res.status(500).json({
                ok:false,
                err,
            });
        }

        if( !productoDB ){
            return res.status(400).json({
                ok:false,
                err,
            });
        }

        res.json({
            ok:true,
            producto: productoDB
        })
    })
})
app.put('/productos/:id', verificaToken, (req,res) =>{
    
    let id = req.params.id;
    let body = req.body;

    Producto.findById( id,(err,productoDB) =>{

        if( err ){
            return res.status(500).json({
                ok:false,
                err,
            });
        }

        if( !productoDB ){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'el Id no existe'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.descripcion = body.descripcion;
        productoDB.disponible = body.disponible;
        productoDB.categoria = body.categoria;

        productoDB.save( (err,productoSave) =>{

            if( err ){
                return res.status(500).json({
                    ok:false,
                    err,
                });
            }
            
            res.json({
                ok:true,
                producto:productoSave
            })

        })
    })
})
app.delete('/productos/:id', verificaToken, (req,res) =>{
    
    let id = req.params.id;

    Producto.findById( id, (err,productoDB) =>{

        if( err ){
            return res.status(500).json({
                ok:false,
                err,
            });
        }

        if( err ){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'ID no existe'
                },
            });
        }

        productoDB.disponible = false;
        productoDB.save( (err,productoSave)=>{

            if( err ){
                return res.status(500).json({
                    ok:false,
                    err,
                });
            }

            res.json({
                ok:true,
                producto:productoSave,
                message: 'Producto Eliminado'
            })
        })


    })
})
module.exports = app;