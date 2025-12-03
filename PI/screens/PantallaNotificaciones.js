import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUsuarioActual } from '../utils/Session';
import { obtenerNotificaciones, marcarNotificacionLeida } from '../database/Database';
import { useFocusEffect } from '@react-navigation/native';

export default function PantallaNotificaciones({ navigation }) {
  const [notificaciones, setNotificaciones] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const usuario = getUsuarioActual();

  const cargarNotificaciones = async () => {
    if (usuario) {
      const data = await obtenerNotificaciones(usuario.id);
      setNotificaciones(data);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      cargarNotificaciones();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarNotificaciones();
    setRefreshing(false);
  };

  const manejarMarcarLeida = async (id) => {
    await marcarNotificacionLeida(id);
    cargarNotificaciones();
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
              {notificaciones.filter(n => !n.leida).length}
            </Text>
          </View>
        </View>
      </View>

      {/* Lista de Notificaciones */}
      <ScrollView
        style={styles.notificacionesList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {notificaciones.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={48} color="#D1D5DB" />
            <Text style={styles.emptyText}>No tienes notificaciones</Text>
          </View>
        ) : (
          notificaciones.map((notificacion) => (
            <TouchableOpacity
              key={notificacion.id}
              style={[
                styles.notificacionCard,
                !notificacion.leida && styles.notificacionNueva
              ]}
              onPress={() => manejarMarcarLeida(notificacion.id)}
            >
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Ionicons name="information" size={20} color="white" />
                </View>
              </View>

              <View style={styles.notificacionContent}>
                <View style={styles.notificacionHeader}>
                  <Text style={styles.notificacionTitulo}>{notificacion.titulo}</Text>
                  {!notificacion.leida && <View style={styles.puntoNuevo} />}
                </View>

                <Text style={styles.notificacionMensaje}>{notificacion.mensaje}</Text>

                <Text style={styles.notificacionTiempo}>
                  {new Date(notificacion.fecha).toLocaleDateString()}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
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
    marginLeft: -32,
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
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
    gap: 12,
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 16,
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
    backgroundColor: '#F5F3FF',
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
});