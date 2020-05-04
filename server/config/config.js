
//variables de entorno de forma global
// el process esta corriendo siempre de manera global
// en toda la aplicacion de node

// =======================
//  Puerto
// =======================

process.env.PORT = process.env.PORT || 3000

// =======================
//  Entorno
// =======================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// =======================
//  Vencimiento del Token
// =======================

process.env.CADUCIDAD_TOKEN = 60 *60*24*30;

// =======================
//  SEED de autenticacion
// =======================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';



// =======================
//  Base de Datos
// =======================

let urlDB;
 if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{ 
    urlDB = process.env.MONGO_URL;
}

process.env.URLDB = urlDB;

// =======================
//  google client-ID
// =======================
process.env.CLIENT_ID = process.env.CLIENT_ID || '218936594421-su7t9acdv2lit9grjr336jkgtte5ha7n.apps.googleusercontent.com';