const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


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

//configuraciones de google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        nombre:payload.name,
        email: payload.email,
        img: payload.picture,
        google:true
    }
  }


app.post('/google', async (req,res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
            .catch(err => {
                return res.status(403).
                json({
                    ok:false,
                    err,
                })
            })
            
    //Validaciones

    Usuario.findOne({email: googleUser.email}, (err,usuarioDB)=>{

        if( err ){
            return res.status(500).json({
                ok:false,
                err,
            });
        }

        if( usuarioDB) {
            
            if(usuarioDB.google === false){

                
                    return res.status(400).json({
                        ok:false,
                        err:{
                            message: 'Debe de usar su atenticacion normal'
                        }
                    });
            }else{

                let token = jwt.sign({
                    //payload
                    usuario:usuarioDB
                }, process.env.SEED ,{ expiresIn: process.env.CADUCIDAD_TOKEN });
        
                return res.json({
                        ok:true,
                        usuario:usuarioDB,
                        token,
                    })
            }
        }else{
            // si el usuario no existe en nuestra base de datos

            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) =>{

                if( err ){
                    return res.status(500).json({
                        ok:false,
                        err,
                    });
                };

                let token = jwt.sign({
                    //payload
                    usuario:usuarioDB
                }, process.env.SEED ,{ expiresIn: process.env.CADUCIDAD_TOKEN });
        
                return res.json({
                        ok:true,
                        usuario:usuarioDB,
                        token,
                    })

            } )
        }
    })


});




module.exports = app;