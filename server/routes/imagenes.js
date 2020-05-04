const express = require('express');
const fs = require('fs');
const  app = express();
const path = require('path');
const {verificaToken,verificaTokenImg} = require('../middlewares/autenticacion');
//desplegar informacion
app.get('/imagen/:tipo/:img', verificaTokenImg, (req,res)=>{

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve( __dirname, `../../uploads/${tipo}/${img}`);

    if(fs.existsSync( pathImagen)){
        res.sendFile( pathImagen )
    }else{

        let noImagePath = path.resolve(__dirname,'../assets/no-image.jpg')
        res.sendFile(noImagePath);
    }
    //validar el tipo y img
    
})


module.exports = app;