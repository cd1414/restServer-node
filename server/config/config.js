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
process.env.EXPIRES_TOKEN = '48h';

//===================
// SEED of authentication
//=================== 

process.env.SEED = process.env.SEED || 'seed-development-expires';

//===================
// Google Client ID
//=================== 
process.env.CLIENT_ID = process.env.CLIENT_ID || '316704028862-4vfda8remkl0vu26ehj1cucf8ami3hq7.apps.googleusercontent.com';