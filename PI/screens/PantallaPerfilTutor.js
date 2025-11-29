import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PantallaPerfilTutor({ navigation }) {
  const tutor = {
    nombre: 'Victor Manuel',
    especialidad: 'Matemáticas Aplicadas',
    avatar: 'VM',
    rating: 4.9,
    reseñas: 45,
    estadisticas: {
      sesiones: 156,
      satisfaccion: '98%',
      experiencia: '2 años'
    },
    acercaDe: 'Hola, soy Victor, estudiante de ingeniería en sistemas, me gustan las matemáticas aplicadas y sé mucho sobre ellas. Estoy feliz de poder ayudarte.',
    materias: [
      {
        id: 1,
        nombre: 'Cálculo Diferencial',
        precio: '$80-$100 MX/hr',
        nivel: 'Básico e Intermedio'
      },
      {
        id: 2,
        nombre: 'Álgebra Lineal',
        precio: '$80-$100 MX/hr',
        nivel: 'Intermedio y Avanzado'
      }
    ],
    reseñasRecientes: [
      {
        id: 1,
        usuario: 'Yuliana Valdez',
        avatar: 'YV',
        rating: 5,
        comentario: 'excelente tutor, sabe mucho.',
        fecha: 'Hace 2 días'
      },
      {
        id: 2,
        usuario: 'María Fernanda López',
        avatar: 'MF',
        rating: 5,
        comentario: 'Me ayudó mucho a entender conceptos difíciles.',
        fecha: 'Hace 1 semana'
      }
    ]
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
              <Text style={styles.avatarGrandeText}>{tutor.avatar}</Text>
            </View>
          </View>

          <View style={styles.datosTutor}>
            <Text style={styles.nombreTutor}>{tutor.nombre}</Text>
            <Text style={styles.especialidadTutor}>{tutor.especialidad}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text style={styles.ratingText}>
                {tutor.rating} ({tutor.reseñas} reseñas)
              </Text>
            </View>
          </View>

          {/* Botones de acción */}
          <View style={styles.accionesContainer}>
            <TouchableOpacity style={styles.botonAccionPrimario}>
              <Ionicons name="calendar-outline" size={16} color="white" />
              <Text style={styles.botonAccionPrimarioTexto}>Agendar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.botonAccionSecundario}>
              <Ionicons name="chatbubble-outline" size={16} color="#8B5CF6" />
              <Text style={styles.botonAccionSecundarioTexto}>Mensaje</Text>
            </TouchableOpacity>
          </View>

          {/* Estadísticas */}
          <View style={styles.estadisticasContainer}>
            <View style={styles.estadisticaItem}>
              <Text style={styles.estadisticaNumero}>{tutor.estadisticas.sesiones}</Text>
              <Text style={styles.estadisticaLabel}>Sesiones</Text>
            </View>
            
            <View style={[styles.estadisticaItem, styles.estadisticaItemBorde]}>
              <Text style={styles.estadisticaNumero}>{tutor.estadisticas.satisfaccion}</Text>
              <Text style={styles.estadisticaLabel}>Satisfacción</Text>
            </View>
            
            <View style={styles.estadisticaItem}>
              <Text style={styles.estadisticaNumero}>{tutor.estadisticas.experiencia}</Text>
              <Text style={styles.estadisticaLabel}>Experiencia</Text>
            </View>
          </View>
        </View>

        {/* Acerca de */}
        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Sobre mí</Text>
          <Text style={styles.acercaDeTexto}>{tutor.acercaDe}</Text>
        </View>

        {/* Materias */}
        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Materias</Text>
          <View style={styles.materiasList}>
            {tutor.materias.map((materia) => (
              <View key={materia.id} style={styles.materiaCard}>
                <View style={styles.materiaHeader}>
                  <Text style={styles.materiaNombre}>{materia.nombre}</Text>
                  <Text style={styles.materiaPrecio}>{materia.precio}</Text>
                </View>
                <View style={styles.nivelBadge}>
                  <Text style={styles.nivelText}>{materia.nivel}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Reseñas */}
        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Reseñas Recientes</Text>
          <View style={styles.resenasList}>
            {tutor.reseñasRecientes.map((resena) => (
              <View key={resena.id} style={styles.resenaCard}>
                <View style={styles.resenaHeader}>
                  <View style={styles.resenaUsuario}>
                    <View style={styles.resenaAvatar}>
                      <Text style={styles.resenaAvatarText}>{resena.avatar}</Text>
                    </View>
                    <View style={styles.resenaInfo}>
                      <Text style={styles.resenaNombre}>{resena.usuario}</Text>
                      <View style={styles.resenaRating}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Ionicons 
                            key={star} 
                            name="star" 
                            size={12} 
                            color="#F59E0B" 
                          />
                        ))}
                      </View>
                    </View>
                  </View>
                  <Text style={styles.resenaFecha}>{resena.fecha}</Text>
                </View>
                <Text style={styles.resenaComentario}>{resena.comentario}</Text>
              </View>
            ))}
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
  estadisticasContainer: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  estadisticaItem: {
    flex: 1,
    alignItems: 'center',
  },
  estadisticaItemBorde: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E5E7EB',
  },
  estadisticaNumero: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  estadisticaLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  seccion: {
    paddingHorizontal: 20,
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
  materiasList: {
    gap: 12,
  },
  materiaCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  materiaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  materiaNombre: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  materiaPrecio: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '600',
  },
  nivelBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  nivelText: {
    fontSize: 12,
    color: '#6B7280',
  },
  resenasList: {
    gap: 16,
  },
  resenaCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
  },
  resenaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  resenaUsuario: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  resenaAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resenaAvatarText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  resenaInfo: {
    flex: 1,
  },
  resenaNombre: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  resenaRating: {
    flexDirection: 'row',
  },
  resenaFecha: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  resenaComentario: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});