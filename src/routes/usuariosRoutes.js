import { Router } from "express";
import { todosUsuarios } from "../controllers/users/UsersControllersGet.js";
import { updateUser } from "../controllers/users/usuariosPutController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { getUserById } from "../controllers/users/userControllerGet.js";

const router = Router();

// TODO: Rutas de apís de USUARIOS
router.get("/get/usuarios", todosUsuarios);
router.put("/put/update-user/:id_usuario", authenticateToken, updateUser);
router.get("/get/id/:id_usuario", authenticateToken, getUserById);

export default router;
