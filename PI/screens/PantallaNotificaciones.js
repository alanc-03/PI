import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PantallaNotificaciones({ navigation }) {
  const notificaciones = [
    {
      id: 1,
      titulo: 'Sesión próxima',
      mensaje: 'Tu tutoría de Cálculo con Victor Manuel en 30 minutos',
      tiempo: 'Hace 5 min',
      esNueva: true,
      avatar: 'VM',
      tieneAcciones: false
    },
    {
      id: 2,
      titulo: 'Nuevo mensaje',
      mensaje: 'José María te envió un mensaje',
      tiempo: 'Hace 1 hora',
      esNueva: true,
      avatar: 'JM',
      tieneAcciones: false
    },
    {
      id: 3,
      titulo: 'Nueva reseña',
      mensaje: 'Victor Manuel dejó una reseña de 5 estrellas',
      tiempo: 'Hace 2 horas',
      esNueva: false,
      avatar: 'VM',
      tieneAcciones: false
    },
    {
      id: 4,
      titulo: 'Solicitud de tutoría',
      mensaje: 'Ana Martínez solicitó una tutoría de POO',
      tiempo: 'Hace 3 horas',
      esNueva: false,
      avatar: 'AM',
      tieneAcciones: true
    }
  ];

  const manejarAceptar = (notificacionId) => {
    Alert.alert('Solicitud Aceptada', 'Acabas de aceptar la solicitud de tutoría');
    // Aquí iría la lógica para actualizar el estado de la notificación
  };

  const manejarRechazar = (notificacionId) => {
    Alert.alert('Solicitud Rechazada', 'Has rechazado la solicitud de  tutoría');
    // Aquí iría la lógica para actualizar el estado de la notificación
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notificaciones</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {notificaciones.filter(n => n.esNueva).length}
            </Text>
          </View>
        </View>
      </View>

      {/* Lista de Notificaciones */}
      <ScrollView style={styles.notificacionesList} showsVerticalScrollIndicator={false}>
        {notificaciones.map((notificacion) => (
          <View
            key={notificacion.id}
            style={[
              styles.notificacionCard,
              notificacion.esNueva && styles.notificacionNueva
            ]}
          >
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{notificacion.avatar}</Text>
              </View>
            </View>
            
            <View style={styles.notificacionContent}>
              <View style={styles.notificacionHeader}>
                <Text style={styles.notificacionTitulo}>{notificacion.titulo}</Text>
                {notificacion.esNueva && <View style={styles.puntoNuevo} />}
              </View>
              
              <Text style={styles.notificacionMensaje}>{notificacion.mensaje}</Text>
              
              <Text style={styles.notificacionTiempo}>{notificacion.tiempo}</Text>
              
              {notificacion.tieneAcciones && (
                <View style={styles.accionesContainer}>
                  <TouchableOpacity 
                    style={styles.accionAceptar}
                    onPress={() => manejarAceptar(notificacion.id)}
                  >
                    <Ionicons name="checkmark" size={16} color="white" />
                    <Text style={styles.accionTexto}>Aceptar</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.accionRechazar}
                    onPress={() => manejarRechazar(notificacion.id)}
                  >
                    <Ionicons name="close" size={16} color="#374150" />
                    <Text style={styles.accionTextoRechazar}>Rechazar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
    marginLeft: -32, // Compensa el espacio del botón de retroceso
  },
  badge: {
    backgroundColor: '#8B5CF6',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  notificacionesList: {
    flex: 1,
    padding: 16,
  },
  notificacionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  notificacionNueva: {
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  notificacionContent: {
    flex: 1,
  },
  notificacionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notificacionTitulo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  puntoNuevo: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8B5CF6',
    marginTop: 4,
  },
  notificacionMensaje: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  notificacionTiempo: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  accionesContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  accionAceptar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 4,
  },
  accionRechazar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    gap: 4,
  },
  accionTexto: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  accionTextoRechazar: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '500',
  },
});