const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
        name: { type: String, trim: true, required: [true, 'El nombre es necesario'] },
        img: { type: String, required: false },
        user: { type: Schema.Types.ObjectId, ref: 'User' }
    }, { timestamps: true }, // Agrega fecha creacion y actualización
    { collection: 'hospitales' }
);

module.exports = mongoose.model("Hospital", hospitalSchema);