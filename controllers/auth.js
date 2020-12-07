const User = require("../models/user");
const jwt = require("jsonwebtoken"); // to generate signed token
const expressJwt = require("express-jwt"); // for authorization check
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.signup = (req, res) => {
    const user = new User(req.body);
    user.save((err, saveUser) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                ok: false,
                message: 'Error creando usuario',
                error: errorHandler(err)
            });
        }
        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({
            ok: true,
            user: saveUser
        });
    });
};