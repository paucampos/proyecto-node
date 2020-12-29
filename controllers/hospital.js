const Hospital = require("../models/hospital");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.hospitalById = (req, res, next, id) => {
    Hospital.findById(id).exec((err, hospital) => {
        if (err || !hospital) {
            return res.status(404).json({
                ok: false,
                error: "El hospital no existe"
            });
        }
        req.hospital = hospital;
        next();
    });
};

//=============================
// Crear hospital
//=============================
exports.create = (req, res) => {
    const hospital = new Hospital({
        name: req.body.name,
        user: req.profile._id
    });
    hospital.save((err, data) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error creando hospital',
                error: errorHandler(err)
            });
        }
        res.json({
            ok: true,
            data
        });
    });
};

//=============================
// Obtener todos los hospitales
//=============================
exports.list = (req, res, next) => {
    Hospital.find({})
        .populate('users', 'name email')
        .exec(
            (err, hospitales) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error cargando hospitales',
                        errors: errorHandler(err)
                    });
                }

                Hospital.countDocuments({}, (err, conteo) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            message: 'Error al contar hospitales',
                            errors: errorHandler(err)
                        })
                    }
                    res.status(200).json({
                        ok: true,
                        total: conteo,
                        hospitales: hospitales
                    });
                });
            }
        )
}

//============================
// Eliminar hospital por el id
//============================
exports.remove = (req, res) => {
    const id = req.hospital._id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al borrar un hospital',
                errors: errorHandler(err)
            });
        }

        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                message: `El hospital con el id ${id} no existe`,
                errors: {
                    message: 'No existe un hospital con ese ID'
                }
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });
    });
}

//========================
// Actualizar hospital       
//========================
exports.updateHospital = (req, res) => {
    const id = req.hospital._id;
    const body = req.body;

    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar hospital',
                errors: errorHandler(err)
            });
        }
        if (!hospital) {
            return res.status(400).json({
                ok: false,
                message: `El hospital con el id ${id} no existe`,
                errors: {
                    message: 'No existe un hospital con ese ID'
                }
            });
        }

        hospital.name = body.name;
        hospital.user = req.profile._id;

        hospital.save((err, savedHospital) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar hospital',
                    errors: errorHandler(err)
                });
            }
            res.status(200).json({
                ok: true,
                hospital: savedHospital
            });
        })
    })
}

// ==========================================
// Obtener Hospital por ID
// ==========================================
exports.getById = (req, res) => {
    const id = req.hospital._id;

    Hospital.findById(id)
        .populate('user', 'name img email')
        .exec((err, hospital) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error al buscar hospital',
                    errors: errorHandler(err)
                });
            }
            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    message: 'El hospital con el id ' + id + ' no existe',
                    errors: {
                        message: 'No existe un hospital con ese ID'
                    }
                });
            }
            res.status(200).json({
                ok: true,
                hospital: hospital
            });
        })
}