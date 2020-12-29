const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const hospitalSchema = new mongoose.Schema({
        name: { type: String, trim: true, required: [true, 'El nombre es necesario'] },
        img: { type: String, required: false },
        user: { type: ObjectId, ref: 'User', required: true }
    }, { timestamps: true }, // Agrega fecha creacion y actualización
    { collection: 'hospitales' }
);

module.exports = mongoose.model("Hospital", hospitalSchema);