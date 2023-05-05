import validator from "validator";

const validateArticle = (params) => {
        let validarTitulo =
            !validator.isEmpty(params.titulo) &&
            validator.isLength(params.titulo, { min: 5, max: undefined });
        let validarContenido = !validator.isEmpty(params.contenido);

        if (!validarTitulo || !validarContenido) {
            throw new Error("No se ha validado la informacion");
        }
};

export default validateArticle;
