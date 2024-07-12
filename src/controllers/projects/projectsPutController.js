import { poolConection } from "../../connection/db.js";

export const updateProject = async (req, res) => {
  const { id_proyecto } = req.params;
  const id_usuario = req.user.id;
  const {
    nombre_proyecto,
    descripcion,
    precio,
    estado,
    caracteristicas,
    lenguajes,
    imagenes,
    video,
    url,
  } = req.body;

  const connection = await poolConection.getConnection();
  await connection.beginTransaction();

  try {
    const [projectOwner] = await connection.query(
      "SELECT id_usuario_freelancer FROM proyectos WHERE id_proyecto = ?",
      [id_proyecto]
    );

    if (projectOwner.length === 0) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    if (projectOwner[0].id_usuario_freelancer !== id_usuario) {
      return res.status(403).json({
        error: "No autorizado",
        message: "No puedes actualizar este proyecto",
      });
    }

    await connection.query(
      `UPDATE proyectos SET 
        nombre_proyecto = IFNULL(?, nombre_proyecto), 
        descripcion = IFNULL(?, descripcion), 
        precio = IFNULL(?, precio), 
        estado = IFNULL(?, estado),
        caracteristicas = IFNULL(?,caracteristicas),
        lenguajes = IFNULL(?,lenguajes)
      WHERE id_proyecto = ?`,
      [
        nombre_proyecto,
        descripcion,
        precio,
        estado,
        caracteristicas,
        lenguajes,
        id_proyecto,
      ]
    );

    await connection.query(
      `UPDATE multimedia SET 
        imagenes = IFNULL(?, imagenes), 
        video = IFNULL(?, video), 
        url = IFNULL(?, url) 
      WHERE id_proyecto = ?`,
      [JSON.stringify(imagenes), video, url, id_proyecto]
    );

    await connection.commit();

    const [updatedProject] = await connection.query(
      `SELECT 
        u.id_usuario,
        u.nombre AS nombre_usuario,
        u.apellido,
        u.correo_electronico,
        u.pais,
        u.tipo_cuenta,
        p.id_proyecto,
        p.nombre_proyecto,
        p.descripcion,
        p.fecha_publicacion,
        p.precio,
        p.estado AS estado_proyecto,
        p.caracteristicas,
        p.lenguajes,
        m.id_multimedia,
        m.imagenes,
        m.video,
        m.url
      FROM 
        usuarios u
      JOIN 
        proyectos p ON u.id_usuario = p.id_usuario_freelancer
      LEFT JOIN 
        multimedia m ON p.id_proyecto = m.id_proyecto
      WHERE 
        p.id_proyecto = ?`,
      [id_proyecto]
    );

    res.status(200).json({
      message: "Proyecto actualizado exitosamente",
      ...updatedProject[0],
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({
      message: "Error al actualizar el proyecto",
      error: error.message,
    });
  } finally {
    connection.release();
  }
};
