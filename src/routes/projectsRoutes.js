import { Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { createProject } from "../controllers/projects/projectsPostController.js";
import { updateProject } from "../controllers/projects/projectsPutController.js";
import { getAllProjects } from "../controllers/projects/ProjectsControllersGet.js";

const router = Router();

// TODO: Rutas de apís de USUARIOS
router.get("/get/all-projects", authenticateToken, getAllProjects);
router.post("/post/create-project", authenticateToken, createProject);
router.put(
  "/put/update-project/:id_proyecto",
  authenticateToken,
  updateProject
);

export default router;
