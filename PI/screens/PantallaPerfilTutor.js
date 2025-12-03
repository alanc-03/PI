import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUsuarioActual } from '../utils/Session';
import { inscribirseClase, crearNotificacion } from '../database/Database';

export default function PantallaPerfilTutor({ route, navigation }) {
  // Obtener datos de la tutoría pasados por navegación
  const { tutoria } = route.params || {};
  const usuarioActual = getUsuarioActual();

  // Si no hay tutoría (error de navegación), mostrar mensaje
  if (!tutoria) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text>Error al cargar la tutoría</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.link}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const manejarUnirse = async () => {
    if (!usuarioActual) {
      Alert.alert('Error', 'Debes iniciar sesión para unirte a una clase');
      return;
    }

    if (usuarioActual.tipoUsuario === 'tutor') {
      Alert.alert('Acceso denegado', 'Los tutores no pueden unirse a clases como estudiantes.');
      return;
    }

    if (usuarioActual.id === tutoria.usuarioId) {
      Alert.alert('Error', 'No puedes unirte a tu propia clase');
      return;
    }

    Alert.alert(
      'Unirse a la clase',
      `¿Deseas inscribirte a la clase de ${tutoria.materia}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            const resultado = await inscribirseClase(usuarioActual.id, tutoria.id);
            if (resultado.ok) {
              // Crear notificación para el tutor
              await crearNotificacion(
                tutoria.usuarioId,
                'Nueva inscripción',
                `${usuarioActual.nombre} se ha inscrito a tu clase de ${tutoria.materia}`
              );
              Alert.alert('Éxito', 'Te has inscrito correctamente a la clase');
            } else {
              Alert.alert('Error', resultado.mensaje || 'No se pudo realizar la inscripción');
            }
          }
        }
      ]
    );
  };

  const manejarVerUbicacion = () => {
    if (!tutoria.ubicacion) {
      Alert.alert('Información', 'El tutor no ha especificado una ubicación exacta.');
      return;
    }

    Alert.alert(
      'Ubicación',
      tutoria.ubicacion,
      [
        { text: 'Cerrar', style: 'cancel' },
        {
          text: 'Abrir en Mapas',
          onPress: () => {
            const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
            const latLng = `${tutoria.ubicacion}`;
            const label = 'Ubicación de la clase';
            const url = Platform.select({
              ios: `${scheme}${label}@${latLng}`,
              android: `${scheme}${latLng}(${label})`
            });
            // Intentar abrir mapa (simple, busca por texto)
            const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tutoria.ubicacion)}`;
            Linking.openURL(mapUrl);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header con imagen de fondo */}
        <View style={styles.header}>
          <View style={styles.headerBackground} />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <View style={styles.backButtonInner}>
              <Ionicons name="arrow-back" size={20} color="#374151" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Información del perfil */}
        <View style={styles.perfilInfo}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarGrande}>
              <Text style={styles.avatarGrandeText}>
                {tutoria.tutorNombre ? tutoria.tutorNombre.substring(0, 2).toUpperCase() : 'TU'}
              </Text>
            </View>
          </View>

          <View style={styles.datosTutor}>
            <Text style={styles.nombreTutor}>{tutoria.tutorNombre}</Text>
            <Text style={styles.especialidadTutor}>{tutoria.categoria}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text style={styles.ratingText}>
                4.9 (15 reseñas) {/* Placeholder por ahora */}
              </Text>
            </View>
          </View>

          {/* Botones de acción */}
          <View style={styles.accionesContainer}>
            <TouchableOpacity
              style={styles.botonAccionPrimario}
              onPress={manejarUnirse}
            >
              <Ionicons name="school-outline" size={16} color="white" />
              <Text style={styles.botonAccionPrimarioTexto}>Unirse a la clase</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botonAccionSecundario}
              onPress={() => navigation.navigate('Chat', { tutor: { nombre: tutoria.tutorNombre } })}
            >
              <Ionicons name="chatbubble-outline" size={16} color="#8B5CF6" />
              <Text style={styles.botonAccionSecundarioTexto}>Mensaje</Text>
            </TouchableOpacity>

            {tutoria.modalidad === 'Presencial' && (
              <TouchableOpacity
                style={styles.botonAccionSecundario}
                onPress={manejarVerUbicacion}
              >
                <Ionicons name="location-outline" size={16} color="#8B5CF6" />
                <Text style={styles.botonAccionSecundarioTexto}>Ver Ubicación</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Detalles de la Clase */}
          <View style={styles.seccion}>
            <Text style={styles.seccionTitulo}>Detalles de la Clase</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Materia:</Text>
                <Text style={styles.infoValue}>{tutoria.materia}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Nivel:</Text>
                <Text style={styles.infoValue}>{tutoria.nivel}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Modalidad:</Text>
                <Text style={styles.infoValue}>{tutoria.modalidad}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Duración:</Text>
                <Text style={styles.infoValue}>{tutoria.duracion}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Precio:</Text>
                <Text style={styles.infoValuePrecio}>{tutoria.precio}</Text>
              </View>
            </View>
          </View>

          {/* Descripción */}
          <View style={styles.seccion}>
            <Text style={styles.seccionTitulo}>Descripción</Text>
            <Text style={styles.acercaDeTexto}>{tutoria.descripcion}</Text>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  link: {
    color: '#8B5CF6',
    marginTop: 10,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    height: 120,
    position: 'relative',
  },
  headerBackground: {
    height: '100%',
    backgroundColor: '#8B5CF6',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  backButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  perfilInfo: {
    paddingHorizontal: 20,
    marginTop: -40,
  },
  avatarContainer: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  avatarGrande: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarGrandeText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  datosTutor: {
    marginBottom: 20,
  },
  nombreTutor: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  especialidadTutor: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#6B7280',
  },
  accionesContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  botonAccionPrimario: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  botonAccionPrimarioTexto: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  botonAccionSecundario: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#8B5CF6',
    gap: 8,
  },
  botonAccionSecundarioTexto: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '600',
  },
  seccion: {
    marginBottom: 24,
  },
  seccionTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  acercaDeTexto: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  infoValuePrecio: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '700',
  },
});