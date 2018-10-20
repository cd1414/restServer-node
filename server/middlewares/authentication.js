const jwt = require('jsonwebtoken');


// ==================
// VERIFY TOKEN
// ==================
let verifyToken = (req, res, next) => {
    let token = req.get('token'); // GET HEADER token
    console.log(process.env.SEED);

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Invalid token'
                }
            });
        }
        req.user = decoded.user;
        next();
    });
};

// ==================
// VERIFY ADMIN ROLE
// ==================
let verifyAdmin_Role = (req, res, next) => {
    let loggedUser = req.user;
    console.log(loggedUser);
    if (!loggedUser) {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'User not logged'
            }
        });
    }

    if (loggedUser.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'User not have permission for this action'
            }
        });
    }

};

module.exports = {
    verifyToken,
    verifyAdmin_Role
};