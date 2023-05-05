import { Schema, model } from "mongoose";

const ArticuloSchema = Schema({
    titulo: {
        type: String,
        require: true,
    },
    contenido: {
        type: String,
        require: true,
    },
    fecha: {
        type: String,
        default: new Date().toISOString().slice(0, 10),
    },
    imagen: {
        type: String,
        default: "default png",
    },
});

export default model("Article", ArticuloSchema);
