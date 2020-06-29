// ===========
// Puerto
// ===========

process.env.PORT = process.env.PORT || 3000;

// ===========
// Entorno
// ===========

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===========
// Base de datos
// ===========

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://mongoDB:4FUd3smmf7TEokSq@cluster0-wtyz2.mongodb.net/cafe';
}

process.env.URLDB = urlDB;