import { Router } from "express";
import {
    test,
    create,
    getItems,
    getItem,
    deleteItem,
    edit,
    increaseImage,
    image,
    searcher,
} from "../controllers/article.js";
import multer from "multer";

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./images/articles/");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            "article" +
                new Date().toISOString().slice(0, 10) +
                file.originalname
        );
    },
});

const uploads = multer({ storage: storage });

router.get("/ruta_de_prueba", test);

router.post("/crear", create);

router.get("/articulos/:ultimos?", getItems);

router.get("/articulo/:id", getItem);

router.delete("/articulo/:id", deleteItem);

router.put("/articulo/:id", edit);

router.post("/subir_imagen/:id", uploads.single("fieldname"), increaseImage);

router.get("/imagen/:file", image);

router.get("/buscar/:search", searcher);

export default router;
