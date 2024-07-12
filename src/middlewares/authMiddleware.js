import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "No autorizado",
      message: "No se proporcionó un token de autenticación",
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          error: "Token expirado",
          message: "El token de autenticación ha expirado",
        });
      } else if (err.name === "JsonWebTokenError") {
        return res.status(403).json({
          error: "Token inválido",
          message: "El token de autenticación es inválido",
        });
      } else {
        return res.status(403).json({
          error: "Error de autenticación",
          message: "No se pudo verificar el token de autenticación",
        });
      }
    }
    // if (err) {
    //   return res.senStatus(403);
    // }
    req.user = {
      id: decodedToken.id || decodedToken.userId || decodedToken.id_usuario,
      // Puedes agregar otros campos del token aquí si es necesario
    };
    next();
  });
};
