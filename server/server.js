require('./config/config');
require('./routes/usuario');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');

//middleware, estas dos lineas se va a ejecutar
//cada vez que se llame este archivo
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//habilitar la carpeta public
app.use( express.static(path.resolve(__dirname, '../public')) );



//configuracion global de rutas
app.use(  require('./routes'));

//establecer la conexion ala base de datos
mongoose.connect(process.env.URLDB,
                  { useNewUrlParser:true, 
                    useCreateIndex:true
                  },
                  (err,res)=>{

    if( err ) throw new err;

    console.log('Base de datos Conectada');
});


app.listen(process.env.PORT,()=>{
    console.log('Escuchando puerto',process.env.PORT);
})