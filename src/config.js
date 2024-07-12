import { config } from "dotenv";

config();

export const PORT = process.env.PORT || 3000;
export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_PORT = process.env.DB_PORT || 3306;
export const DB_DATABASE = process.env.DB_DATABASE || "freematch";
export const DB_USER = process.env.DB_USER || "root";
export const DB_PASSWORD = process.env.DB_PASSWORD || "12345";
export const JWT_SECRET = process.env.JWT_SECRET || "tu_clave_secreta_para_jwt";
export const STRIPE_SECRET_KEY =
  process.env.STRIPE_SECRET_KEY || "tu_clave_secreta_de_stripe";
