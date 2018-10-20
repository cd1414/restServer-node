//===================
// Port
//===================
process.env.PORT = process.env.PORT || 3000;

//===================
// Environment
//===================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===================
// DATABASE
//===================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/coffee';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

//===================
// Token expires 
//===================
// 60 sec
// 60 min
// 24 hours
// 30 days
process.env.EXPIRES_TOKEN = 60 * 60 * 24 * 30;

//===================
// SEED of authentication
//=================== 

process.env.SEED = process.env.SEED || 'seed-development-expires';