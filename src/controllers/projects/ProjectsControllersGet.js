import { poolConection } from "../../connection/db.js";

export const getAllProjects = async (req, res) => {
  const connection = await poolConection.getConnection();
  try {
    const [projects] = await connection.query(`
      SELECT 
        p.id_proyecto,
        p.nombre_proyecto,
        p.descripcion,
        p.fecha_publicacion,
        p.precio,
        p.estado,
        p.caracteristicas,
        p.lenguajes,
        u.id_usuario,
        u.nombre AS nombre_usuario,
        u.apellido,
        u.correo_electronico,
        u.pais,
        u.tipo_cuenta,
        pf.imagen_perfil,
        (
          SELECT AVG(c.calificacion)
          FROM calificaciones c
          WHERE c.id_proyecto = p.id_proyecto
        ) AS calificacion_promedio,
        (
          SELECT COUNT(c.id_comentario)
          FROM comentarios c
          WHERE c.id_proyecto = p.id_proyecto
        ) AS cantidad_comentarios,
        m.imagenes,
        m.video,
        m.url
      FROM 
        proyectos p
      JOIN 
        usuarios u ON p.id_usuario_freelancer = u.id_usuario
      LEFT JOIN 
        perfiles pf ON u.id_usuario = pf.id_usuario
      LEFT JOIN 
        multimedia m ON p.id_proyecto = m.id_proyecto
      ORDER BY 
        p.fecha_publicacion DESC
    `);
    res.status(200).json({
      message: "Proyectos obtenidos exitosamente",
      projects,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los proyectos",
      error: error.message,
    });
  } finally {
    connection.release();
  }
};
