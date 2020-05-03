const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const app = express();


//crear peticiones para una autentificacion
app.post('/login', (req,res) => {


    let body = req.body;

    Usuario.findOne({email: body.email},(err,usuarioDB) => {

        if( err ){
            return res.status(500).json({
                ok:false,
                err,
            });
        }
        //si el email no existe

        if( !usuarioDB ){
            return res.status(400).json({
                ok:false,
                message: 'Usuario (o Contraseña) incorrectos'
            });
        }
        // si la contraseña es incorrecta

        if ( !bcrypt.compareSync(body.password,usuarioDB.password ) ){
            return res.status(400).json({
                ok:false,
                message: '(usuario) Contraseña incorrectos'
            });
        }
        
        let token = jwt.sign({
            //payload
            usuario:usuarioDB
        }, process.env.SEED ,{ expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok:true,
            usuario:usuarioDB,
            token,
        })
    });
});






module.exports = app;