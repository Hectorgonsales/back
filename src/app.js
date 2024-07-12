import express from "express";
import cors from "cors";
import usuariosRoutes from "./routes/usuariosRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import projectsRoutes from "./routes/projectsRoutes.js";

const app = express();

// TODO : Pasamos los datos a JSON y ponemos CORS para la conexion con el front
app.use(express.json());
app.use(cors());

// TODO: IMPORTAMOS LAS RUTAS DE NUESTRAS APIs
app.use("/freematch/usuarios/api", usuariosRoutes);
app.use("/freematch/proyectos/api", projectsRoutes);
app.use("/freematch/auth/api", authRoutes);

// TODO:  VALIDADCION PARA UN ERROR 404 EN LAS RUTAS
app.use((req, res, next) => {
  res.status(404).json({ message: "Error de rutas" });
});

export default app;

//todo:prup
