import { poolConection } from "../../connection/db.js";

export const todosUsuarios = async (req, res) => {
  try {
    const [respon] = await poolConection.query("SELECT * FROM usuarios");
    res.json(respon);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener datos" });
  }
};
