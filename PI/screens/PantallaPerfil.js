import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { obtenerTutoriasPorUsuario } from '../database/Database';
import { getUsuarioActual, cerrarSesion } from '../utils/Session';

export default function PantallaPerfil({ navigation }) {

  const usuario = getUsuarioActual();
  const [tutorias, setTutorias] = useState([]);
  const [stats, setStats] = useState({
    tutorias: 0,
    rating: 5.0,
    progreso: "+100%"
  });

  useEffect(() => {
    if (usuario) cargarDatos();
  }, [usuario]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // Forzar actualización al volver (por si se editó el perfil)
      if (usuario) cargarDatos();
    });
    return unsubscribe;
  }, [navigation, usuario]);

  const cargarDatos = async () => {
    const misTutorias = await obtenerTutoriasPorUsuario(usuario.id);
    setTutorias(misTutorias);
    setStats(prev => ({ ...prev, tutorias: misTutorias.length }));
  };

  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Seguro que deseas salir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Salir",
        onPress: () => {
          cerrarSesion();
          navigation.replace("Login");
        }
      }
    ]);
  };

  const menuItems = [
    {
      title: "Editar Perfil",
      icon: "person-outline",
      onPress: () => navigation.navigate("EditarPerfil")
    },
    {
      title: "Mis Tutorías",
      icon: "book-outline",
      onPress: () => navigation.navigate("MisTutorias")
    },
    {
      title: "Materias Guardadas",
      icon: "bookmark-outline",
      onPress: () => navigation.navigate("MateriasGuardadas")
    },
    {
      title: "Historial",
      icon: "time-outline",
      onPress: () => navigation.navigate("Historial")
    },
    {
      title: "Notificaciones",
      icon: "notifications-outline",
      onPress: () => navigation.navigate("Notificaciones")
    }
  ];

  // ------------------------------------
  // SI NO HAY USUARIO LOGUEADO
  // ------------------------------------
  if (!usuario) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>No has iniciado sesión</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            style={{ marginTop: 20, padding: 10, backgroundColor: "#8B5CF6", borderRadius: 8 }}
          >
            <Text style={{ color: "white" }}>Ir al Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ------------------------------------
  // SI SÍ HAY USUARIO LOGUEADO
  // ------------------------------------
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>

        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Mi Perfil</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Configuracion')}>
              <Ionicons name="settings-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.perfilInfo}>
            <View style={styles.avatarGrande}>
              {usuario.foto ? (
                <Image source={{ uri: usuario.foto }} style={styles.avatarImagen} />
              ) : (
                <Text style={styles.avatarGrandeText}>
                  {usuario.nombre ? usuario.nombre.substring(0, 2).toUpperCase() : "US"}
                </Text>
              )}
            </View>
            <View style={styles.datosUsuario}>
              <Text style={styles.nombreUsuario}>{usuario.nombre}</Text>
              {usuario.alias && <Text style={styles.aliasUsuario}>{usuario.alias}</Text>}
              <Text style={styles.carreraUsuario}>{usuario.universidad}</Text>
            </View>
          </View>
        </View>

        {/* TARJETAS DE ESTADÍSTICAS */}
        <View style={styles.estadisticasContainer}>
          <View style={styles.estadisticaCard}>
            <Ionicons name="book-outline" size={24} color="#8B5CF6" />
            <Text style={styles.estadisticaNumero}>{stats.tutorias}</Text>
            <Text style={styles.estadisticaLabel}>Tutorías</Text>
          </View>

          <View style={styles.estadisticaCard}>
            <Ionicons name="star" size={24} color="#F59E0B" />
            <Text style={styles.estadisticaNumero}>{stats.rating}</Text>
            <Text style={styles.estadisticaLabel}>Rating</Text>
          </View>

          <View style={styles.estadisticaCard}>
            <Ionicons name="trending-up" size={24} color="#10B981" />
            <Text style={styles.estadisticaNumero}>{stats.progreso}</Text>
            <Text style={styles.estadisticaLabel}>Progreso</Text>
          </View>
        </View>

        {/* MENÚ */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, index < menuItems.length - 1 && styles.menuItemConBorde]}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon} size={20} color="#374151" />
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* BOTÓN CERRAR SESIÓN */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        {/* CTA SER TUTOR */}
        {usuario && usuario.tipoUsuario !== "estudiante" && (
          <View style={styles.ctaContainer}>
            <View style={styles.ctaCard}>
              <Text style={styles.ctaTitle}>¿Quieres ser tutor?</Text>
              <Text style={styles.ctaDescription}>
                Comparte tus conocimientos con otros estudiantes
              </Text>
              <TouchableOpacity
                style={styles.ctaButton}
                onPress={() => navigation.navigate("PublicarTutoria")}
              >
                <Text style={styles.ctaButtonText}>Comenzar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

// -------------------
// ESTILOS
// -------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollView: { flex: 1 },
  header: {
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  perfilInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarGrande: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 2,
    borderColor: "white",
    overflow: 'hidden',
  },
  avatarImagen: {
    width: '100%',
    height: '100%',
  },
  avatarGrandeText: {
    color: "#8B5CF6",
    fontSize: 24,
    fontWeight: "bold",
  },
  datosUsuario: { flex: 1 },
  nombreUsuario: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 2,
  },
  aliasUsuario: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 4,
    fontStyle: 'italic',
  },
  carreraUsuario: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  estadisticasContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: -16,
    marginBottom: 24,
  },
  estadisticaCard: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 2,
  },
  estadisticaNumero: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginVertical: 4,
  },
  estadisticaLabel: { fontSize: 12, color: "#6B7280" },
  menuContainer: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  menuItemConBorde: {
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  menuItemLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  menuItemText: { fontSize: 16, color: "#374151" },
  ctaContainer: { paddingHorizontal: 20, marginBottom: 24 },
  ctaCard: {
    backgroundColor: "#8B5CF6",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
  },
  ctaTitle: { fontSize: 18, fontWeight: "bold", color: "white", marginBottom: 8 },
  ctaDescription: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginBottom: 16,
  },
  ctaButton: {
    backgroundColor: "white",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  ctaButtonText: { color: "#8B5CF6", fontSize: 14, fontWeight: "600" },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FCA5A5",
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#EF4444",
  },
});
