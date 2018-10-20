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
    urlDB = 'mongodb://coffee-user:Coffee-123@ds137483.mlab.com:37483/coffee';
}
process.env.URLDB = urlDB;