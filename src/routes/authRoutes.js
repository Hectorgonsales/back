import { Router } from "express";
import {
  login,
  register,
  verifyToken,
} from "../controllers/auth/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = Router();

// TODO: Rutas de autenticación
router.post("/post/register", register);
router.post("/post/login", login);
router.get("/get/verify-token", authenticateToken, verifyToken);

export default router;
