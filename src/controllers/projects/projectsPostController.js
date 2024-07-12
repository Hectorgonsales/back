import { poolConection } from "../../connection/db.js";

export const createProject = async (req, res) => {
  //   console.log("User info in createProject:", req.user);
  //   const id_usuario = req.user?.id_usuario || req.user?.id || req.user?.userId;
  //   const { id_usuario } = req.user;

  const id_usuario = req.user.id;

  console.log("id_usuario extraído:", id_usuario);

  if (!id_usuario) {
    console.log("Error: id_usuario no disponible o es null/undefined");
    return res
      .status(400)
      .json({ message: "ID de usuario no disponible o inválido" });
  }

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
  const fecha_publicacion = new Date();
  const connection = await poolConection.getConnection();
  await connection.beginTransaction();

  try {
    const [projectResult] = await connection.query(
      "INSERT INTO proyectos (id_usuario_freelancer, nombre_proyecto, descripcion, precio, estado, caracteristicas, lenguajes, fecha_publicacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        id_usuario,
        nombre_proyecto,
        descripcion,
        precio,
        estado,
        caracteristicas,
        lenguajes,
        fecha_publicacion,
      ]
    );

    const id_proyecto = projectResult.insertId;

    await connection.query(
      "INSERT INTO multimedia (id_proyecto, imagenes, video, url) VALUES (?, ?, ?, ?)",
      [id_proyecto, JSON.stringify(imagenes), video, url]
    );

    // for (const item of multimedia) {
    //   await connection.query(
    //     "INSERT INTO multimedia (id_proyecto, tipo, url) VALUES (?, ?, ?)",
    //     [id_proyecto, item.tipo, item.url]
    //   );
    // }

    await connection.commit();

    const [consulResult] = await connection.query(
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
        u.id_usuario = ?
      ORDER BY 
        p.id_proyecto, m.id_multimedia`,
      [id_usuario]
    );

    res.status(201).json({
      message: "Proyecto creado exitosamente",
      id_proyecto,
      ...consulResult[0],
    });
  } catch (error) {
    await connection.rollback();
    res
      .status(500)
      .json({ message: "Error al crear el proyecto", error: error.message });
  } finally {
    connection.release();
  }
};
