import { openDatabaseSync } from "expo-sqlite";
import * as Crypto from "expo-crypto";

const db = openDatabaseSync("luminaDB.db");

/* -----------------------------------------
   CREAR TABLA
------------------------------------------ */
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

  db.execSync(`
    CREATE TABLE IF NOT EXISTS tutorias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuarioId INTEGER,
      materia TEXT,
      categoria TEXT,
      nivel TEXT,
      descripcion TEXT,
      precio TEXT,
      modalidad TEXT,
      duracion TEXT,
      tutorNombre TEXT,
      fechaCreacion TEXT,
      ubicacion TEXT,
      FOREIGN KEY (usuarioId) REFERENCES usuarios(id)
    );
  `);

  db.execSync(`
    CREATE TABLE IF NOT EXISTS inscripciones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuarioId INTEGER,
      tutoriaId INTEGER,
      fecha TEXT,
      FOREIGN KEY (usuarioId) REFERENCES usuarios(id),
      FOREIGN KEY (tutoriaId) REFERENCES tutorias(id)
    );
  `);

  db.execSync(`
    CREATE TABLE IF NOT EXISTS notificaciones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuarioId INTEGER,
      titulo TEXT,
      mensaje TEXT,
      fecha TEXT,
      leida INTEGER DEFAULT 0,
      FOREIGN KEY (usuarioId) REFERENCES usuarios(id)
    );
  `);

  // Intentar agregar columna ubicacion si no existe (para migracion simple)
  try {
    db.execSync(`ALTER TABLE tutorias ADD COLUMN ubicacion TEXT;`);
  } catch (e) {
    // Ignorar error si la columna ya existe
  }

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

/* -----------------------------------------
   AGREGAR TUTORÍA
------------------------------------------ */
export const agregarTutoria = async (tutoria, callback) => {
  try {
    const fecha = new Date().toISOString();
    const result = await db.runAsync(
      `INSERT INTO tutorias (usuarioId, materia, categoria, nivel, descripcion, precio, modalidad, duracion, tutorNombre, fechaCreacion, ubicacion)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tutoria.usuarioId,
        tutoria.materia,
        tutoria.categoria,
        tutoria.nivel,
        tutoria.descripcion,
        tutoria.precio,
        tutoria.modalidad,
        tutoria.duracion,
        tutoria.tutorNombre,
        fecha,
        tutoria.ubicacion || ''
      ]
    );

    if (callback) callback({ insertId: result.lastInsertRowId });
    return { ok: true, insertId: result.lastInsertRowId };

  } catch (error) {
    console.log("❌ Error agregando tutoría:", error);
    if (callback) callback({ error });
    return { ok: false, error };
  }
};

/* -----------------------------------------
   EDITAR TUTORÍA
------------------------------------------ */
export const editarTutoria = async (id, tutoriaActualizada) => {
  try {
    await db.runAsync(
      `UPDATE tutorias
       SET materia = ?,
           categoria = ?,
           nivel = ?,
           descripcion = ?,
           precio = ?,
           modalidad = ?,
           duracion = ?,
           tutorNombre = ?,
           ubicacion = ?
       WHERE id = ?`,
      [
        tutoriaActualizada.materia,
        tutoriaActualizada.categoria,
        tutoriaActualizada.nivel,
        tutoriaActualizada.descripcion,
        tutoriaActualizada.precio,
        tutoriaActualizada.modalidad,
        tutoriaActualizada.duracion,
        tutoriaActualizada.tutorNombre,
        tutoriaActualizada.ubicacion,
        id
      ]
    );

    return { ok: true };

  } catch (error) {
    console.log("❌ Error editando tutoría:", error);
    return { ok: false, mensaje: "Error al editar la tutoría" };
  }
};


/* -----------------------------------------
   OBTENER TUTORÍAS
------------------------------------------ */
export const obtenerTutorias = async () => {
  try {
    const tutorias = await db.getAllAsync(`SELECT * FROM tutorias ORDER BY id DESC`);
    return tutorias;
  } catch (error) {
    console.log("❌ Error obteniendo tutorías:", error);
    return [];
  }
};

/* -----------------------------------------
   OBTENER UNA TUTORÍA POR ID
------------------------------------------ */
export const getTutoriaPorId = async (id) => {
  try {
    const tutoria = await db.getFirstAsync(
      `SELECT * FROM tutorias WHERE id = ?`,
      [id]
    );
    return tutoria;
  } catch (error) {
    console.log("❌ Error obteniendo tutoría por ID:", error);
    return null;
  }
};


/* -----------------------------------------
   OBTENER TUTORÍAS POR USUARIO
------------------------------------------ */
export const obtenerTutoriasPorUsuario = async (usuarioId) => {
  try {
    const tutorias = await db.getAllAsync(
      `SELECT * FROM tutorias WHERE usuarioId = ? ORDER BY id DESC`,
      [usuarioId]
    );
    return tutorias;
  } catch (error) {
    console.log("❌ Error obteniendo tutorías de usuario:", error);
    return [];
  }
};

/* -----------------------------------------
   INSCRIBIRSE A CLASE
------------------------------------------ */
export const inscribirseClase = async (usuarioId, tutoriaId) => {
  try {
    // Verificar si ya está inscrito
    const existe = await db.getFirstAsync(
      `SELECT * FROM inscripciones WHERE usuarioId = ? AND tutoriaId = ?`,
      [usuarioId, tutoriaId]
    );

    if (existe) {
      return { ok: false, mensaje: "Ya estás inscrito en esta clase" };
    }

    const fecha = new Date().toISOString();
    await db.runAsync(
      `INSERT INTO inscripciones (usuarioId, tutoriaId, fecha) VALUES (?, ?, ?)`,
      [usuarioId, tutoriaId, fecha]
    );

    return { ok: true };
  } catch (error) {
    console.log("❌ Error inscribiendo:", error);
    return { ok: false, mensaje: "Error al inscribirse" };
  }
};

/* -----------------------------------------
   NOTIFICACIONES
------------------------------------------ */
export const crearNotificacion = async (usuarioId, titulo, mensaje) => {
  try {
    const fecha = new Date().toISOString();
    await db.runAsync(
      `INSERT INTO notificaciones (usuarioId, titulo, mensaje, fecha, leida) VALUES (?, ?, ?, ?, 0)`,
      [usuarioId, titulo, mensaje, fecha]
    );
    return { ok: true };
  } catch (error) {
    console.log("❌ Error creando notificación:", error);
    return { ok: false };
  }
};

export const obtenerNotificaciones = async (usuarioId) => {
  try {
    const notificaciones = await db.getAllAsync(
      `SELECT * FROM notificaciones WHERE usuarioId = ? ORDER BY id DESC`,
      [usuarioId]
    );
    return notificaciones;
  } catch (error) {
    console.log("❌ Error obteniendo notificaciones:", error);
    return [];
  }
};

export const marcarNotificacionLeida = async (id) => {
  try {
    await db.runAsync(`UPDATE notificaciones SET leida = 1 WHERE id = ?`, [id]);
    return { ok: true };
  } catch (error) {
    console.log("❌ Error marcando notificación:", error);
    return { ok: false };
  }
};
