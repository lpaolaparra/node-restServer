
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
    urlDB = 'mongodb+srv://strider:j5ttlnBkN40ynohw@cluster0-q8c1j.mongodb.net/cafe';
}

process.env.URLDB = urlDB;
