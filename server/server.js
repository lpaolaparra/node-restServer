require('./config/config');

const express = require('express');
const app = express();

const bodyParser = require('body-parser');

//middleware, estas dos lineas se va a ejecutar
//cada vez que se llame este archivo
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// 4 tipos de peticiones basicas
app.get('/usuario', function (req, res) {
  res.json('get usuario')
})
//crea registros
app.post('/usuario', function (req, res) {

    let body = req.body;

    if(body.nombre === undefined) {

        res.status(400).json({
            ok:false,
            mensaje: ' El nombre en necesario'
        })

    }else{
        res.json({
            persona:body,
        })
    }
    
  })
//actualizar datos
//actualizar un elementos en especifico
app.put('/usuario/:id', function (req, res) {

    let id = req.params.id;
    res.json({
        id,
    })
  })
//eliminar
app.delete('/usuario', function (req, res) {
    res.json('delete usuario')
  })
app.listen(process.env.PORT,()=>{
    console.log('Escuchando puerto',process.env.PORT);
})