const Doctor = require("../models/doctor");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.doctorById = (req, res, next, id) => {
    Doctor.findById(id).exec((err, doc) => {
        if (err || !doc) {
            return res.status(404).json({
                ok: false,
                error: "Doctor no existe"
            });
        }
        req.doctor = doc;
        next();
    });
};

//========================
// Crear doctor       
//========================
exports.create = (req, res) => {
    const body = req.body;

    const doctor = new Doctor({
        name: body.name,
        user: req.profile._id,
        hospital: body.hospital
    });

    doctor.save((err, savedDoctor) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mesagge: 'Error creando doctor',
                errors: errorHandler(err)
            });
        }

        res.status(201).json({
            ok: true,
            doctor: savedDoctor,
        });
    })
};

//===========================
// Obtener todos los medicos
//===========================
exports.list = (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Doctor.find({})
        // Se salte la cantidad 'desde' que viene por la query
        .skip(desde)
        // Paginación limitada a 5
        .limit(5)
        .populate('user', 'name email')
        .populate('hospital')
        .exec(
            (err, docs) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mesagge: 'Error cargando medicos',
                        errors: errorHandler(err)
                    });
                }
                Doctor.countDocuments({}, (error, conteo) => {
                    if (error) {
                        return res.status(500).json({
                            ok: false,
                            mesagge: 'Error al contar medicos',
                            errors: errorHandler(error)
                        })
                    }
                    res.status(200).json({
                        ok: true,
                        total: conteo,
                        medicos: docs
                    });
                });
            }
        )
};

//========================
// Obtener un médico por Id       
//========================
exports.getById = (req, res) => {
    const id = req.doctor._id;

    Doctor.findById(id)
        .populate('user', 'name img email')
        .populate('hospital')
        .exec((err, doc) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mesagge: 'Error al buscar doctor',
                    errors: errorHandler(err)
                });
            }
            if (!doc) {
                return res.status(400).json({
                    ok: false,
                    mesagge: 'El doctor con el id ' + id + ' no existe',
                    errors: errorHandler(err)
                });
            }
            res.status(200).json({
                ok: true,
                doctor: doc
            });
        })
};

//========================
// Actualizar doctor       
//========================
exports.update = (req, res) => {
    const id = req.doctor._id;
    const body = req.body;

    Doctor.findById(id, (err, doctor) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mesagge: 'Error al buscar doctor',
                errors: errorHandler(err)
            });
        }
        if (!doctor) {
            return res.status(400).json({
                ok: false,
                mesagge: `El doctor con el id ${id} no existe`,
                errors: errorHandler(err)
            });
        }

        doctor.name = body.name;
        doctor.user = req.profile._id;
        doctor.hospital = body.hospital;

        doctor.save((err, savedDoctor) => {
            // console.error("ERROR::::", err);
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mesagge: 'Error al actualizar doctor',
                    errors: errorHandler(err)
                });
            }
            res.status(200).json({
                ok: true,
                doctor: savedDoctor,
            });
        })
    })

};

//============================
// Eliminar doctor por el id
//============================
exports.remove = (req, res) => {
    const id = req.doctor._id;

    Doctor.findByIdAndRemove(id, (err, deletedDoctor) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mesagge: 'Error al borrar un doctor',
                errors: errorHandler(err)
            });
        }

        if (!deletedDoctor) {
            return res.status(400).json({
                ok: false,
                mesagge: `El doctor con id ${id} no existe`,
                errors: errorHandler(err)
            });
        }

        res.status(200).json({
            ok: true,
            doctor: deletedDoctor,
        });
    });

};