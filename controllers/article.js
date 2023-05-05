import Article from "../models/Articles.js";
import validateArticle from "../helpers/article.js";
import fs from "fs"
import path from "path";

const test = (req, res) => {
    return res.status(200).json({
        mensaje: "Prueba de controlador",
    });
};

const create = (req, res) => {
    //recoger los datos de post
    let params = req.body;

    //validar datos
    try {
        validateArticle(params);
    } catch (error) {
        return res.status(400).json({
            status: "Error",
            mensaje: "Faltan datos por enviar",
        });
    }

    //crear objetos a guardar
    const articulo = new Article(parametros);

    //guardar el articulo en la base de datos
    articulo
        .save()
        .then((articuloSaved) => {
            return res.status(200).json({
                status: "success",
                Articulo: articuloSaved,
                mensaje: "Articulo creado con exito",
            });
        })
        .catch((error) => {
            return res.status(400).json({
                status: "error",
                mensaje: "No se ha guardado el articulo: " + error.message,
            });
        });
};

//devolver el resultado
const getItems = (req, res) => {
    const consultation = Article.find({});
    consultation.sort({ fecha: -1 });

    if (req.params.ultimos) {
        consultation.limit(3);
    }

    consultation
        .then((articles) => {
            if (!articles) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "No se han encontrado articulos",
                });
            }

            return res.status(200).send({
                status: "success",
                params_url: req.params.ultimos,
                articles,
            });
        })

        .catch((error) => {
            return res.status(500).json({
                status: "error",
                mensaje: "Ha ocurrido un error al listar los articulos",
                error: error.message,
            });
        });
};

const getItem = (req, res) => {
    //recoger un articulo por url
    const paramsUrl = req.params.id;

    //Buscar el articulo
    const consultation = Article.findById(paramsUrl);

    //si no existe devolver el error
    consultation
        .then((article) => {
            if (!article) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "No se han encontrado el articulo",
                });
            }
            //devolver resultado
            return res.status(200).send({
                status: "success",
                article,
            });
        })

        .catch((error) => {
            return res.status(500).json({
                status: "error",
                mensaje: "Ha ocurrido un error al Buscar el articulo",
                error: error.message,
            });
        });
};

const deleteItem = (req, res) => {
    //recoger un articulo por url
    const paramsUrl = req.params.id;

    //Buscar el articulo
    const consultation = Article.findByIdAndDelete(paramsUrl);

    //si no existe devolver el error
    consultation
        .then((articleDeleted) => {
            if (!articleDeleted) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "No se han encontrado el articulo",
                });
            }
            //devolver resultado
            return res.status(200).send({
                status: "success",
                message: "Articulo Actualizado",
                articleDeleted,
            });
        })

        .catch((error) => {
            return res.status(500).json({
                status: "error",
                mensaje: "Ha ocurrido un error al Actualizar el articulo",
                error: error.message,
            });
        });
};

const edit = (req, res) => {
    //recoger un articulo por url
    const paramsUrl = req.params.id;

    const params = req.body;

    //Buscar el articulo
    try {
        validateArticle( params);
    } catch (error) {
        return res.status(400).json({
            status: "Error",
            mensaje: "Faltan datos por enviar",
        });
    }

    const consultation = Article.findByIdAndUpdate({ _id: paramsUrl }, params, {
        new: true,
    });

    //si no existe devolver el error
    consultation
        .then((articleUpdated) => {
            if (!articleUpdated) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "No se han encontrado el articulo",
                });
            }
            //devolver resultado
            return res.status(200).send({
                status: "success",
                message: "Articulo Actualizado",
                articleUpdated,
            });
        })

        .catch((error) => {
            return res.status(500).json({
                status: "error",
                mensaje: "Ha ocurrido un error al Actualizar el articulo",
                error: error.message,
            });
        });
};

const increaseImage = (req,res)=>{

    if(!req.file  &&  !req.files){
        return res.status(400).json({
            status: "Error",
            mensaje:"Peticion invalida"
        });
    }

    let archive = req.file.originalname
    //Nombre del archivo
    let archive_split = archive.split("\.")
    let extension = archive_split[1]
    //Extension del archivo
    if(extension != "png" && extension != "jpg" && extension != "jpeg" && extension != "gif"){
        fs.unlink(req.file.path, (error)=>{
            return res.status(400).json({
                status: "Error",
                mensaje:"Imagen invalida"
            });
        })
    }else{

        //recoger un articulo por url
    const paramsUrl = req.params.id;

    const params = req.body;


    const consultation = Article.findByIdAndUpdate({ _id: paramsUrl }, {imagen:req.file.filename}, {
        new: true,
    });

    //si no existe devolver el error
    consultation
        .then((articleUpdated) => {
            if (!articleUpdated) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "No se han encontrado el articulo",
                });
            }
            //devolver resultado
            return res.status(200).send({
                status: "success",
                message: "Articulo Actualizado",
                articleUpdated,
            });
        })

        .catch((error) => {
            return res.status(500).json({
                status: "error",
                mensaje: "Ha ocurrido un error al Actualizar el articulo",
                error: error.message,
            });
        });
    }
}

const image =(req,res)=>{
    let file = req.params.file;
    let route = "./images/articles/"+file

    fs.stat(route,(error,exists)=>{
        if(exists){
            return res.sendFile(path.resolve(route))
        }else{
            return res.status(404).json({
                status: "error",
                mensaje: "La imagen no existe",
                exists,
                file,
                route
            });
        }
    })
}

    const searcher = (req,res)=>{

        let search = req.params.search

        Article.find({
            "$or":[
                {"titulo" : { "$regex" : search,"$options" : "i" } },
                {"contenido" : { "$regex" : search,"$options" : "i" } },
            ]})
        .sort({fecha: -1})
        .then((foundItems)=>{

            if( !foundItems  || foundItems.length <= 0){
                return res.status(404).json({
                    status: "error",
                    mensaje: "No se han encontrado articulos"
                });
            }

            return res.status(200).json({
                status: "sucess",
                foundItems
            });
        })
    }

export { test, create, getItems, getItem, deleteItem, edit ,increaseImage,image,searcher};
