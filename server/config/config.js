
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
//  Base de Datos
// =======================

let urlDB;
 if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{ 
    urlDB = process.env.MONGO_URL;
}

process.env.URLDB = urlDB;
