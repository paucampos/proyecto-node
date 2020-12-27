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

//======================
// Autenticación normal
//======================
exports.signin = (req, res) => {
    // Buscar por email
    const { email, password } = req.body;
    User.findOne({ email }, (err, userDb) => {
        if (err || !userDb) {
            return res.status(400).json({
                ok: false,
                error: "Usuario no existe. Por favor registrate"
            });
        }
        // Verificar que email y password sean correctos
        if (!userDb.authenticate(password)) {
            return res.status(401).json({
                error: "Email y password no coinciden"
            });
        }
        // Crear un JWT
        const token = jwt.sign({ _id: userDb._id }, process.env.JWT_SECRET);
        // setear el token en una cookie con fecha de expiración
        res.cookie("t", token, { expire: new Date() + 14400 }); // 4 horas
        // devuelvo usuario, token y menú segun rol
        const { _id, name, email, role } = userDb;
        return res.json({
            ok: true,
            token,
            user: { _id, name, email, role },
            menu: obtenerMenu(userDb.role)
        });
    });
};

function obtenerMenu(ROLE) {
    let menu = [{
            titulo: "Principal",
            icono: "mdi mdi-gauge",
            submenu: [
                { titulo: "Dashboard", url: "/dashboard" },
                { titulo: "ProgressBar", url: "/progress" },
                { titulo: "Gráficas", url: "/graficas" },
                { titulo: "Promesas", url: "/promesas" },
                { titulo: "Rxjs", url: "/rxjs" }
            ]
        },
        {
            titulo: "Mantenimientos",
            icono: "mdi mdi-folder-lock-open",
            submenu: [
                { titulo: "Hospitales", url: "/hospitales" },
                { titulo: "Doctor", url: "/doctores" }
            ]
        }
    ];
    if (ROLE === 'ADMIN_ROLE') {
        menu[1].submenu.unshift({ titulo: "Usuarios", url: "/usuarios" });
    }
    return menu;
}

exports.signout = (req, res) => {
    res.clearCookie("t");
    res.json({ message: "Cerraste sesión exitosamente" });
};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
});

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!user) {
        return res.status(403).json({
            error: "Acceso denegado"
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if (req.profile.role !== 'ADMIN_ROLE') {
        return res.status(403).json({
            error: "Acceso denegado, necesita permisos de Administrador"
        });
    }
    next();
};