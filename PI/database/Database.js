import { openDatabaseSync } from "expo-sqlite";
import * as Crypto from "expo-crypto";

const db = openDatabaseSync("luminaDB.db");


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


  try {
    db.execSync(`ALTER TABLE tutorias ADD COLUMN ubicacion TEXT;`);
  } catch (e) {

  }

  console.log("Base de datos lista");
};


export const encriptarPassword = async (password) => {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
};


export const buscarUsuarioPorEmail = async (email) => {
  try {
    const usuario = await db.getFirstAsync(
      `SELECT * FROM usuarios WHERE email = ?`,
      [email]
    );
    return usuario || null;
  } catch (error) {
    console.log("Error buscando usuario:", error);
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
    console.log("Error registrando usuario:", error);
    return { ok: false, mensaje: "Error interno al registrar" };
  }
};


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
    console.log("Error login:", error);
    return { ok: false, mensaje: "Error interno" };
  }
};


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
    console.log(" Error obteniendo tutorías:", error);
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
    console.log(" Error obteniendo tutorías de usuario:", error);
    return [];
  }
};


export const inscribirseClase = async (usuarioId, tutoriaId) => {
  try {

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
    console.log("Error inscribiendo:", error);
    return { ok: false, mensaje: "Error al inscribirse" };
  }
};

export const obtenerInscripciones = async (usuarioId) => {
  try {
    const inscripciones = await db.getAllAsync(
      `SELECT t.*, i.fecha as fechaInscripcion 
       FROM inscripciones i 
       JOIN tutorias t ON i.tutoriaId = t.id 
       WHERE i.usuarioId = ? 
       ORDER BY i.id DESC`,
      [usuarioId]
    );
    return inscripciones;
  } catch (error) {
    console.log("Error obteniendo inscripciones:", error);
    return [];
  }
};


export const crearNotificacion = async (usuarioId, titulo, mensaje) => {
  try {
    const fecha = new Date().toISOString();
    await db.runAsync(
      `INSERT INTO notificaciones (usuarioId, titulo, mensaje, fecha, leida) VALUES (?, ?, ?, ?, 0)`,
      [usuarioId, titulo, mensaje, fecha]
    );
    return { ok: true };
  } catch (error) {
    console.log("Error creando notificación:", error);
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
    console.log(" Error marcando notificación:", error);
    return { ok: false };
  }
};

/* -----------------------------------------
   MATERIAS GUARDADAS
------------------------------------------ */
export const inicializarTablasAdicionales = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS materias_guardadas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuarioId INTEGER,
      tutoriaId INTEGER,
      fecha TEXT,
      FOREIGN KEY (usuarioId) REFERENCES usuarios(id),
      FOREIGN KEY (tutoriaId) REFERENCES tutorias(id)
    );
  `);

  db.execSync(`
    CREATE TABLE IF NOT EXISTS historial (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuarioId INTEGER,
      accion TEXT,
      detalle TEXT,
      fecha TEXT,
      FOREIGN KEY (usuarioId) REFERENCES usuarios(id)
    );
  `);
};

// Llamar a esta función al inicio si es necesario, o integrarla en inicializarBaseDeDatos
inicializarTablasAdicionales();

export const guardarMateria = async (usuarioId, tutoriaId) => {
  try {
    const existe = await db.getFirstAsync(
      `SELECT * FROM materias_guardadas WHERE usuarioId = ? AND tutoriaId = ?`,
      [usuarioId, tutoriaId]
    );

    if (existe) {
      return { ok: false, mensaje: "Ya has guardado esta materia" };
    }

    const fecha = new Date().toISOString();
    await db.runAsync(
      `INSERT INTO materias_guardadas (usuarioId, tutoriaId, fecha) VALUES (?, ?, ?)`,
      [usuarioId, tutoriaId, fecha]
    );

    await registrarHistorial(usuarioId, "Guardar Materia", `Guardaste la tutoría ID: ${tutoriaId}`);
    return { ok: true };
  } catch (error) {
    console.log("Error guardando materia:", error);
    return { ok: false, mensaje: "Error al guardar materia" };
  }
};

export const obtenerMateriasGuardadas = async (usuarioId) => {
  try {
    const materias = await db.getAllAsync(
      `SELECT t.*, mg.id as guardadoId, mg.fecha as fechaGuardado
       FROM materias_guardadas mg
       JOIN tutorias t ON mg.tutoriaId = t.id
       WHERE mg.usuarioId = ?
       ORDER BY mg.id DESC`,
      [usuarioId]
    );
    return materias;
  } catch (error) {
    console.log("Error obteniendo materias guardadas:", error);
    return [];
  }
};

export const eliminarMateriaGuardada = async (usuarioId, tutoriaId) => {
  try {
    await db.runAsync(
      `DELETE FROM materias_guardadas WHERE usuarioId = ? AND tutoriaId = ?`,
      [usuarioId, tutoriaId]
    );
    return { ok: true };
  } catch (error) {
    console.log("Error eliminando materia guardada:", error);
    return { ok: false };
  }
};

/* -----------------------------------------
   HISTORIAL
------------------------------------------ */
export const registrarHistorial = async (usuarioId, accion, detalle) => {
  try {
    const fecha = new Date().toISOString();
    await db.runAsync(
      `INSERT INTO historial (usuarioId, accion, detalle, fecha) VALUES (?, ?, ?, ?)`,
      [usuarioId, accion, detalle, fecha]
    );
    return { ok: true };
  } catch (error) {
    console.log("Error registrando historial:", error);
    return { ok: false };
  }
};

export const obtenerHistorial = async (usuarioId) => {
  try {
    const historial = await db.getAllAsync(
      `SELECT * FROM historial WHERE usuarioId = ? ORDER BY id DESC`,
      [usuarioId]
    );
    return historial;
  } catch (error) {
    console.log("Error obteniendo historial:", error);
    return [];
  }
};

/* -----------------------------------------
   CHAT / MENSAJES
------------------------------------------ */
export const inicializarTablaMensajes = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS mensajes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      emisorId INTEGER,
      receptorId INTEGER,
      texto TEXT,
      fecha TEXT,
      leido INTEGER DEFAULT 0,
      FOREIGN KEY (emisorId) REFERENCES usuarios(id),
      FOREIGN KEY (receptorId) REFERENCES usuarios(id)
    );
  `);
};

// Inicializar tabla de mensajes
inicializarTablaMensajes();

export const enviarMensaje = async (emisorId, receptorId, texto) => {
  try {
    const fecha = new Date().toISOString();
    await db.runAsync(
      `INSERT INTO mensajes (emisorId, receptorId, texto, fecha) VALUES (?, ?, ?, ?)`,
      [emisorId, receptorId, texto, fecha]
    );
    return { ok: true };
  } catch (error) {
    console.log("Error enviando mensaje:", error);
    return { ok: false };
  }
};

export const obtenerMensajes = async (usuarioId1, usuarioId2) => {
  try {
    const mensajes = await db.getAllAsync(
      `SELECT * FROM mensajes 
       WHERE (emisorId = ? AND receptorId = ?) 
          OR (emisorId = ? AND receptorId = ?) 
       ORDER BY id ASC`,
      [usuarioId1, usuarioId2, usuarioId2, usuarioId1]
    );
    return mensajes;
  } catch (error) {
    console.log("Error obteniendo mensajes:", error);
    return [];
  }
};

/* -----------------------------------------
   CONFIGURACIÓN / PERFIL
------------------------------------------ */
/* -----------------------------------------
   CONFIGURACIÓN / PERFIL
------------------------------------------ */
export const inicializarColumnasPerfil = () => {
  try {
    db.execSync(`ALTER TABLE usuarios ADD COLUMN alias TEXT;`);
  } catch (e) { }
  try {
    db.execSync(`ALTER TABLE usuarios ADD COLUMN foto TEXT;`);
  } catch (e) { }
};

// Llamar a esta función para asegurar que las columnas existan
inicializarColumnasPerfil();

export const actualizarPerfilCompleto = async (usuarioId, datos) => {
  try {
    const { nombre, fechaNacimiento, alias, foto } = datos;

    await db.runAsync(
      `UPDATE usuarios 
       SET nombre = ?, 
           fechaNacimiento = ?, 
           alias = ?, 
           foto = ? 
       WHERE id = ?`,
      [nombre, fechaNacimiento, alias, foto, usuarioId]
    );

    await registrarHistorial(usuarioId, "Actualizar Perfil", "Actualizaste tu información de perfil");

    // Devolver el usuario actualizado para actualizar la sesión
    const usuarioActualizado = await db.getFirstAsync(
      `SELECT * FROM usuarios WHERE id = ?`,
      [usuarioId]
    );

    return { ok: true, usuario: usuarioActualizado };
  } catch (error) {
    console.log("Error actualizando perfil completo:", error);
    return { ok: false, mensaje: "Error al actualizar perfil" };
  }
};

export const actualizarPerfil = async (usuarioId, nombre) => {
  // Mantener compatibilidad hacia atrás o redirigir a la nueva función
  return actualizarPerfilCompleto(usuarioId, { nombre });
};
