import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { obtenerTutoriasPorUsuario } from '../database/Database';
import { getUsuarioActual } from '../utils/Session';

export default function PantallaPerfil({ navigation }) {
  const usuario = getUsuarioActual();
  const [tutorias, setTutorias] = useState([]);
  const [stats, setStats] = useState({
    tutorias: 0,
    rating: 5.0,
    progreso: '+100%'
  });

  useEffect(() => {
    if (usuario) {
      cargarDatos();
    }
  }, [usuario]);

  // Recargar al volver a la pantalla
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (usuario) cargarDatos();
    });
    return unsubscribe;
  }, [navigation, usuario]);

  const cargarDatos = async () => {
    const misTutorias = await obtenerTutoriasPorUsuario(usuario.id);
    setTutorias(misTutorias);
    setStats(prev => ({ ...prev, tutorias: misTutorias.length }));
  };

  if (!usuario) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>No has iniciado sesión</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: 20, padding: 10, backgroundColor: '#8B5CF6', borderRadius: 8 }}>
            <Text style={{ color: 'white' }}>Ir al Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const menuItems = [
    {
      icon: 'book-outline',
      title: 'Mis Tutorías',
      onPress: () => navigation.navigate('MisTutorias')
    },
    {
      icon: 'bookmark-outline',
      title: 'Materias Guardadas',
      onPress: () => Alert.alert('Próximamente', 'Materias Guardadas estarán disponibles pronto')
    },
    {
      icon: 'time-outline',
      title: 'Historial',
      onPress: () => Alert.alert('Próximamente', 'Historial estará disponible pronto')
    },
    {
      icon: 'settings-outline',
      title: 'Configuración',
      onPress: () => Alert.alert('Próximamente', 'Configuración estará disponible pronto')
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Mi Perfil</Text>
            <TouchableOpacity>
              <Ionicons name="settings-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.perfilInfo}>
            <View style={styles.avatarGrande}>
              <Text style={styles.avatarGrandeText}>
                {usuario.nombre ? usuario.nombre.substring(0, 2).toUpperCase() : "US"}
              </Text>
            </View>
            <View style={styles.datosUsuario}>
              <Text style={styles.nombreUsuario}>{usuario.nombre}</Text>
              <Text style={styles.carreraUsuario}>{usuario.universidad}</Text>
            </View>
          </View>
        </View>

        {/* Tarjetas de Estadísticas */}
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

        {/* Menú de Opciones */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                index < menuItems.length - 1 && styles.menuItemConBorde
              ]}
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

        {/* CTA Ser Tutor */}
        <View style={styles.ctaContainer}>
          <View style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>¿Quieres ser tutor?</Text>
            <Text style={styles.ctaDescription}>
              Comparte tus conocimientos con otros estudiantes
            </Text>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => navigation.navigate('PublicarTutoria')}
            >
              <Text style={styles.ctaButtonText}>Comenzar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  perfilInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarGrande: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'white',
  },
  avatarGrandeText: {
    color: '#8B5CF6',
    fontSize: 24,
    fontWeight: 'bold',
  },
  datosUsuario: {
    flex: 1,
  },
  nombreUsuario: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  carreraUsuario: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  estadisticasContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: -16,
    marginBottom: 24,
  },
  estadisticaCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  estadisticaNumero: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginVertical: 4,
  },
  estadisticaLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  menuContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuItemConBorde: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#374151',
  },
  ctaContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  ctaCard: {
    backgroundColor: '#8B5CF6',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  ctaButton: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  ctaButtonText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '600',
  },
});