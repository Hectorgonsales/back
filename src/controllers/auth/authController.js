import bcrypt from "bcryptjs";
import { poolConection } from "../../connection/db.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config.js";

export const register = async (req, res) => {
  const {
    nombre,
    apellido,
    correo_electronico,
    contrasena,
    tipo_cuenta,
    pais,
    imagen_perfil,
    anos_experiencia,
    lenguajes,
    enlace_portafolio,
    biografia,
  } = req.body;

  // TODO: Hashear la contraseña
  const hashedPassword = await bcrypt.hash(contrasena, 10);

  const connection = await poolConection.getConnection();

  await connection.beginTransaction();

  try {
    const [existingUser] = await connection.query(
      "SELECT id_usuario FROM usuarios WHERE correo_electronico = ?",
      [correo_electronico]
    );

    if (existingUser.length > 0) {
      return res
        .status(409)
        .json({ message: "El correo electrónico ya está registrado" });
    }

    // TODO: Insertar en la tabla usuarios
    const [userResult] = await connection.query(
      "INSERT INTO usuarios (nombre, apellido, correo_electronico, contrasena_hash, tipo_cuenta, pais) VALUES (?, ?, ?, ?, ?, ?)",
      [nombre, apellido, correo_electronico, hashedPassword, tipo_cuenta, pais]
    );

    const id_usuario = userResult.insertId;

    await connection.query(
      "INSERT INTO perfiles (id_usuario, imagen_perfil, anos_experiencia, lenguajes, enlace_portafolio, biografia, verificado) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        id_usuario,
        imagen_perfil,
        anos_experiencia,
        JSON.stringify(lenguajes), // Convertir array a string JSON
        enlace_portafolio,
        biografia,
        false,
      ]
    );

    // TODO: Confirmar transacción
    await connection.commit();

    const [userProfile] = await connection.query(
      `SELECT 
          u.id_usuario,
          u.nombre,
          u.apellido,
          u.correo_electronico,
          u.fecha_registro,
          u.tipo_cuenta,
          u.pais,
          u.estado,
          p.id_perfil,
          p.imagen_perfil,
          p.anos_experiencia,
          p.lenguajes,
          p.enlace_portafolio,
          p.biografia,
          p.verificado
        FROM 
          usuarios u
        JOIN 
          perfiles p ON u.id_usuario = p.id_usuario
        WHERE 
          u.id_usuario = ?`,
      [id_usuario]
    );

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      ...userProfile[0],
      //   id_usuario,
      //   tipo_cuenta,
      //   estado: "activo",
      //   fecha_registro: new Date(),
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: "Error al registrar usuario", error });
  } finally {
    connection.release;
  }
};

export const login = async (req, res) => {
  const { correo_electronico, contrasena } = req.body;
  try {
    const [rows] = await poolConection.query(
      "SELECT * FROM usuarios WHERE correo_electronico = ?",
      [correo_electronico]
    );

    const user = rows[0];

    if (!user) {
      return res.status(401).json({
        error: "Correo incorrecto",
        message: "Verifica nuevamente tu correo",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      contrasena,
      user.contrasena_hash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Contraseña incorrecta",
        message: "Verifica nuevamente tu contraseña ",
      });
    }

    const token = jwt.sign(
      { id: user.id_usuario, nombre: user.nombre },
      JWT_SECRET,
      { expiresIn: "10m" }
    );

    console.log("Generated Token (Backend):", token);

    res.json({
      message: "Token creado exitosamente",
      message: "Login exitoso",
      user: {
        id_usuario: user.id_usuario,
        estado: user.estado,
        fecha_registro: user.fecha_registro,
        nombre: user.nombre,
        apellido: user.apellido,
        correo_electronico: user.correo_electronico,
        tipo_cuenta: user.tipo_cuenta,
        pais: user.pais,
      },
      token,
      // id_usuario: user.id_usuario,
      // estado: user.estado,
      // fecha_registro: user.fecha_registro,
      // nombre: user.nombre,
      // apellido: user.apellido,
      // correo_electronico: user.correo_electronico,
      // tipo_cuenta: user.tipo_cuenta,
      // pais: user.pais,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión", error });
  }
};

export const verifyToken = (req, res) => {
  try {
    console.log("Received token:", req.headers.authorization);
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Decoded token:", decoded);

    res.json({
      message: "Token válido",
      valid: true,
      user: req.user,
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({
      message: "Token inválido",
      valid: false,
      error: error.message,
    });
  }
};
