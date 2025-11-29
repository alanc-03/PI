// =============================================================
// Importación y conexión a SQLite según el dispositivo
// =============================================================
import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

let db;

// Función para abrir la base de datos de forma segura
const abrirBaseDeDatos = () => {
  try {
    if (Platform.OS === "android") {
      console.log("📱 Base de datos cargada: ANDROID");
      return SQLite.openDatabase('lumina_android.db');
    } else if (Platform.OS === "ios") {
      console.log("🍎 Base de datos cargada: IOS");
      return SQLite.openDatabase('lumina_ios.db');
    } else if (Platform.OS === "web") {
      console.log("💻 Web detectada, SQLite no soportado. Usando fallback temporal.");
      // Fallback: objeto simulado para no romper la app
      return {
        transaction: (fn) => {
          console.log("Simulando transacción SQLite en Web");
          fn({
            executeSql: (sql, params, success, error) => {
              console.log("SQL simulado:", sql, params);
              if (success) success(null, { rows: { _array: [] } });
            }
          });
        }
      };
    } else {
      console.log("⚠️ Plataforma desconocida. Usando fallback SQLite");
      return {
        transaction: (fn) => { fn({ executeSql: () => {} }); }
      };
    }
  } catch (error) {
    console.log("❌ Error al abrir la base de datos:", error);
    // Fallback seguro
    return { transaction: (fn) => { fn({ executeSql: () => {} }); } };
  }
};

// Inicializamos la base
db = abrirBaseDeDatos();

// =============================================================
// Inicialización de la Base de Datos
// =============================================================
export const inicializarBaseDeDatos = () => {
  db.transaction(tx => {

    // Tabla de usuarios
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        universidad TEXT,
        tipo_usuario TEXT DEFAULT 'estudiante',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabla de tutorías
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS tutorias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        materia TEXT NOT NULL,
        categoria TEXT NOT NULL,
        nivel TEXT NOT NULL,
        descripcion TEXT,
        precio TEXT NOT NULL,
        modalidad TEXT NOT NULL,
        duracion TEXT NOT NULL,
        tutor_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabla de sesiones agendadas
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS sesiones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tutoria_id INTEGER,
        estudiante_id INTEGER,
        fecha DATETIME NOT NULL,
        estado TEXT DEFAULT 'pendiente',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabla de mensajes
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS mensajes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chat_id TEXT NOT NULL,
        remitente_id INTEGER,
        mensaje TEXT NOT NULL,
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

  });
};

// =============================================================
// Registrar Usuario
// =============================================================
export const registrarUsuario = (usuario, callback) => {
  const { nombre, email, universidad, password, tipoUsuario } = usuario;

  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO usuarios (nombre, email, password, universidad, tipo_usuario)
       VALUES (?, ?, ?, ?, ?)`,
      [nombre, email, password, universidad, tipoUsuario],
      (_, result) => callback(result),
      (_, error) => {
        console.log("❌ Error al registrar usuario:", error);
        return true;
      }
    );
  });
};

// =============================================================
// Login de Usuario
// =============================================================
export const loginUsuario = (email, password, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM usuarios WHERE email = ? AND password = ?`,
      [email, password],
      (_, { rows }) => callback(rows._array),
      (_, error) => {
        console.log("❌ Error al iniciar sesión:", error);
        return true;
      }
    );
  });
};
