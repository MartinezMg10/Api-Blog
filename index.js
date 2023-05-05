import express, { urlencoded } from "express";
import conexion from "./basedatos/conexion.js";
import cors from "cors";
import router from "./routes/article.js";

//Conexion a la base de datos
conexion();
const puerto = 3000;

//Crear servidor de node
const app = express();

//configurar el cors
app.use(cors());

//convertiti body a objeto js
app.use(express.json());
app.use(urlencoded({ extended: true }));

//crear rutas
app.get("/probando", (req, res) => {
  console.log("Probando");

  return res.status(200).send({
    curso: "Master en react",
    author: "Miguel Martinez",
    fecha: "12/06/2003",
  });
});

app.use("/api", router);

//crear servidor
app.listen(puerto, () => {
  console.log(`Servidor corriendo en el puerto: ${puerto}`);
});
