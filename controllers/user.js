const User = require("../models/user");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                ok: false,
                message: "Usuario no encontrado"
            });
        }
        req.profile = user;
        next();
    });
};

//===========================
// Obtener todos los usuarios
//===========================
exports.listUsers = (req, res) => {

    User.find({}, 'name email img role google')
        .exec((err, users) => {
            if (err || !users) {
                return res.status(400).json({
                    ok: false,
                    message: 'Usuarios no encontrados',
                    erorors: errorHandler(err)
                });
            }
            // Agregar contador de usuarios
            User.countDocuments({}, (error, count) => {
                if (error) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error al contar usuarios',
                        errors: errorHandler(error)
                    });
                }
                res.status(200).json({
                    ok: true,
                    total: count,
                    users: users.sort((a, b) => a.name.localeCompare(b.name))
                });
            });
        });
};

//============================
// Eliminar usuario por el id
//============================
exports.deleteUser = (req, res) => {
    // console.log(req);
    const user = req.params.deleteUserId;
    User.findByIdAndRemove(user, (err, deleteUser) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al eliminar usuario',
                errors: errorHandler(err)
            });
        }

        res.status(200).json({
            ok: true,
            message: "Usuario eliminado exitósamente"
        });
    });
}

//========================
// Actualizar usuario       
//========================
exports.updateUser = (req, res) => {
    User.findOneAndUpdate({ _id: req.profile._id }, { $set: req.body }, { new: true },
        (err, user) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: "No estás autorizado para realizar esta acción",
                    error: errorHandler(err)
                });
            }
            user.hashed_password = undefined;
            user.salt = undefined;
            res.json({
                ok: true,
                user
            });
        }
    );
}