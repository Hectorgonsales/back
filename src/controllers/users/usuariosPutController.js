import { poolConection } from "../../connection/db.js";

export const updateUser = async (req, res) => {
  const { id_usuario } = req.params;
  const tokenUserId = req.user.id;

  if (parseInt(id_usuario) !== tokenUserId) {
    return res.status(403).json({
      error: "No autorizado",
      message: "No puedes actualizar el perfil de este usuario",
    });
  }

  const {
    nombre,
    apellido,
    correo_electronico,
    pais,
    imagen_perfil,
    anos_experiencia,
    lenguajes,
    enlace_portafolio,
    biografia,
  } = req.body;

  const connection = await poolConection.getConnection();
  await connection.beginTransaction();

  try {
    const [updateUser] = await connection.query(
      "UPDATE usuarios SET nombre = IFNULL(?, nombre), apellido = IFNULL(?, apellido), correo_electronico = IFNULL(?, correo_electronico), pais = IFNULL(?, pais) WHERE id_usuario = ?",
      [nombre, apellido, correo_electronico, pais, tokenUserId]
    );

    if (updateUser.affectedRows === 0) {
      throw new Error("No se pudo actualizar la información del usuario");
    }

    const [updateProfile] = await connection.query(
      "UPDATE perfiles SET imagen_perfil = IFNULL(?, imagen_perfil), anos_experiencia = IFNULL(?, anos_experiencia), lenguajes = IFNULL(?, lenguajes), enlace_portafolio = IFNULL(?, enlace_portafolio), biografia = IFNULL(?, biografia) WHERE id_usuario = ?",
      [
        imagen_perfil,
        anos_experiencia,
        JSON.stringify(lenguajes),
        enlace_portafolio,
        biografia,
        tokenUserId,
      ]
    );

    if (updateProfile.affectedRows === 0) {
      throw new Error(
        "No se pudo actualizar la información del perfil del usuario"
      );
    }

    await connection.commit();

    const [userProfile] = await connection.query(
      `SELECT 
            u.id_usuario,
            u.nombre,
            u.apellido,
            u.correo_electronico,
            u.tipo_cuenta,
            u.pais,
            p.id_perfil,
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
      [tokenUserId]
    );

    res.status(200).json({
      message: "Información del usuario actualizada exitosamente",
      ...userProfile[0],
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({
      message: "Error al actualizar la información del usuario",
      error: error.message,
    });
  } finally {
    connection.release();
  }
};
