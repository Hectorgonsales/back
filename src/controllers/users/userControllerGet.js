import { poolConection } from "../../connection/db.js";

export const getUserById = async (req, res) => {
  const { id_usuario } = req.params;
  const userIdFromToken = req.user.id;

  //   console.log(userIdFromToken);

  if (parseInt(id_usuario) !== userIdFromToken) {
    return res.status(403).json({
      error: "No autorizado",
      message: "No puedes acceder a la información de otro usuario",
    });
  }

  try {
    const [rows] = await poolConection.query(
      `SELECT 
            u.id_usuario,
            u.nombre,
            u.apellido,
            u.correo_electronico,
            u.tipo_cuenta,
            u.pais,
            p.imagen_perfil,
            p.anos_experiencia,
            p.lenguajes,
            p.enlace_portafolio,
            p.biografia
          FROM 
            usuarios u
          JOIN 
            perfiles p ON u.id_usuario = p.id_usuario
          WHERE 
            u.id_usuario = ?`,
      [id_usuario]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = rows[0];

    res.json({
      user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener la información del usuario", error });
  }
};
