import { openDatabaseSync } from "expo-sqlite";
import * as Crypto from "expo-crypto";

const db = openDatabaseSync("luminaDB.db");

/* -----------------------------------------
   CREAR TABLA
------------------------------------------ */
export const inicializarBaseDeDatos = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT,
      fechaNacimiento TEXT,
      email TEXT UNIQUE,
      universidad TEXT,
      password TEXT,
      tipoUsuario TEXT
    );
  `);

  console.log("📌 Base de datos lista");
};

/* -----------------------------------------
   ENCRIPTAR CONTRASEÑA
------------------------------------------ */
export const encriptarPassword = async (password) => {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
};

/* -----------------------------------------
   BUSCAR USUARIO POR EMAIL
------------------------------------------ */
export const buscarUsuarioPorEmail = async (email) => {
  try {
    const usuario = await db.getFirstAsync(
      `SELECT * FROM usuarios WHERE email = ?`,
      [email]
    );
    return usuario || null;
  } catch (error) {
    console.log("❌ Error buscando usuario:", error);
    return null;
  }
};

/* -----------------------------------------
   REGISTRAR USUARIO
------------------------------------------ */
export const registrarUsuario = async (usuario) => {
  try {
    const existente = await buscarUsuarioPorEmail(usuario.email);

    if (existente) {
      return { ok: false, mensaje: "El correo ya está registrado." };
    }

    const passwordEncriptada = await encriptarPassword(usuario.password);

    await db.runAsync(
      `INSERT INTO usuarios (nombre, fechaNacimiento, email, universidad, password, tipoUsuario)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        usuario.nombre,
        usuario.fechaNacimiento,
        usuario.email,
        usuario.universidad,
        passwordEncriptada,
        usuario.tipoUsuario,
      ]
    );

    return { ok: true };

  } catch (error) {
    console.log("❌ Error registrando usuario:", error);
    return { ok: false, mensaje: "Error interno al registrar" };
  }
};

/* -----------------------------------------
   LOGIN
------------------------------------------ */
export const verificarLogin = async (email, passwordIngresada) => {
  try {
    const usuario = await buscarUsuarioPorEmail(email);

    if (!usuario) {
      return { ok: false, mensaje: "No existe un usuario con este correo" };
    }

    const passwordHash = await encriptarPassword(passwordIngresada);

    if (passwordHash !== usuario.password) {
      return { ok: false, mensaje: "Contraseña incorrecta" };
    }

    return { ok: true, usuario };

  } catch (error) {
    console.log("❌ Error login:", error);
    return { ok: false, mensaje: "Error interno" };
  }
};
