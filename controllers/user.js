const User = require("../models/user");

exports.users = (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    User.find({}, 'name email img role google')
        .skip(desde)
        .limit(5)
        .exec((err, users) => {
            if (err || !users) {
                return res.status(400).json({
                    ok: false,
                    message: 'Usuarios no encontrados',
                    erorors: err
                });
            }
            User.countDocuments({}, (error, count) => {
                if (error) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error al contar usuarios',
                        errors: error
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