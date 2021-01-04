const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const doctorSchema = new mongoose.Schema({
        name: { type: String, trim: true, required: [true, 'El nombre es necesario'] },
        img: { type: String, required: false },
        user: { type: ObjectId, ref: 'User', required: true },
        hospital: { type: ObjectId, ref: 'Hospital', required: [true, 'El id hospital es un campo obligatorio'] }
    }, { timestamps: true } // Agrega fecha creacion y actualización
);


module.exports = mongoose.model("Doctor", doctorSchema);