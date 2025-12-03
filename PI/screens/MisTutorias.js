import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { obtenerTutoriasPorUsuario, obtenerInscripciones } from '../database/Database';
import { getUsuarioActual } from '../utils/Session';
import { openDatabaseSync } from "expo-sqlite";

const db = openDatabaseSync("luminaDB.db");

export default function PantallaMisTutorias({ navigation }) {

  const usuario = getUsuarioActual();
  const [tutoriasPublicadas, setTutoriasPublicadas] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);
  const [activeTab, setActiveTab] = useState('publicadas'); // 'publicadas' | 'inscripciones'

  const cargarDatos = async () => {
    if (!usuario) return;

    // Cargar tutorias publicadas si es tutor o ambos
    if (usuario.tipoUsuario !== 'estudiante') {
      const publicadas = await obtenerTutoriasPorUsuario(usuario.id);
      setTutoriasPublicadas(publicadas);
    }

    // Cargar inscripciones si es estudiante o ambos
    if (usuario.tipoUsuario !== 'tutor') {
      const misInscripciones = await obtenerInscripciones(usuario.id);
      setInscripciones(misInscripciones);
    }

    // Set default tab based on role
    if (usuario.tipoUsuario === 'estudiante' && activeTab === 'publicadas') {
      setActiveTab('inscripciones');
    }
  };

  useEffect(() => {
    cargarDatos();

    const unsubscribe = navigation.addListener('focus', () => {
      cargarDatos();
    });

    return unsubscribe;
  }, [navigation]);

  /* ------------------------------
     ELIMINAR TUTORÍA
  ------------------------------ */
  const eliminarTutoria = async (id) => {
    Alert.alert(
      "Eliminar tutoría",
      "¿Estás seguro de eliminar esta tutoría?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await db.runAsync(`DELETE FROM tutorias WHERE id = ?`, [id]);
              cargarDatos();
            } catch (error) {
              console.log("Error eliminando tutoría:", error);
            }
          }
        }
      ]
    );
  };

  const renderPublicadas = () => (
    <View style={styles.tutoriasList}>
      {tutoriasPublicadas.length === 0 ? (
        <Text style={styles.emptyText}>
          Aún no has publicado ninguna tutoría.
        </Text>
      ) : (
        tutoriasPublicadas.map((tutoria) => (
          <View key={tutoria.id} style={styles.tutoriaCard}>
            {/* HEADER */}
            <View style={styles.tutoriaHeader}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>
                  {tutoria.tutorNombre ? tutoria.tutorNombre.substring(0, 2).toUpperCase() : "TU"}
                </Text>
              </View>

              <View style={styles.tutoriaInfo}>
                <Text style={styles.tutoriaMateria}>{tutoria.materia}</Text>
                <Text style={styles.tutoriaTutor}>{tutoria.tutorNombre}</Text>
              </View>

              <Text style={styles.precioText}>${tutoria.precio}</Text>
            </View>

            {/* FOOTER */}
            <View style={styles.tutoriaFooter}>
              <View style={styles.categoriaBadge}>
                <Text style={styles.categoriaText}>{tutoria.categoria}</Text>
              </View>

              <View style={styles.disponibilidadContainer}>
                <Ionicons name="time-outline" size={16} color="#6B7280" />
                <Text style={styles.disponibilidadText}>{tutoria.duracion}</Text>
                <Ionicons name="location-outline" size={16} color="#6B7280" />
                <Text style={styles.disponibilidadText}>{tutoria.modalidad}</Text>
              </View>
            </View>

            {/* BOTONES */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  navigation.navigate("EditarTutoria", { id: tutoria.id });
                }}
              >
                <Ionicons name="create-outline" size={16} color="white" />
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => eliminarTutoria(tutoria.id)}
              >
                <Ionicons name="trash-outline" size={16} color="white" />
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </View>
  );

  const renderInscripciones = () => (
    <View style={styles.tutoriasList}>
      {inscripciones.length === 0 ? (
        <Text style={styles.emptyText}>
          No te has inscrito a ninguna clase aún.
        </Text>
      ) : (
        inscripciones.map((inscripcion) => (
          <TouchableOpacity
            key={inscripcion.id}
            style={styles.tutoriaCard}
            onPress={() => navigation.navigate('PerfilTutor', { tutoria: inscripcion })}
          >
            {/* HEADER */}
            <View style={styles.tutoriaHeader}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>
                  {inscripcion.tutorNombre ? inscripcion.tutorNombre.substring(0, 2).toUpperCase() : "TU"}
                </Text>
              </View>

              <View style={styles.tutoriaInfo}>
                <Text style={styles.tutoriaMateria}>{inscripcion.materia}</Text>
                <Text style={styles.tutoriaTutor}>Tutor: {inscripcion.tutorNombre}</Text>
                <Text style={styles.fechaInscripcion}>
                  Inscrito el: {new Date(inscripcion.fechaInscripcion).toLocaleDateString()}
                </Text>
              </View>
            </View>

            {/* FOOTER */}
            <View style={styles.tutoriaFooter}>
              <View style={styles.categoriaBadge}>
                <Text style={styles.categoriaText}>{inscripcion.categoria}</Text>
              </View>
              <View style={styles.disponibilidadContainer}>
                <Text style={[styles.disponibilidadText, { color: '#8B5CF6' }]}>
                  Ver Detalles
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#8B5CF6" />
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.titulo}>Mis Clases</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Tabs */}
        {usuario && usuario.tipoUsuario === 'ambos' && (
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'publicadas' && styles.tabActive]}
              onPress={() => setActiveTab('publicadas')}
            >
              <Text style={[styles.tabText, activeTab === 'publicadas' && styles.tabTextActive]}>
                Publicadas
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'inscripciones' && styles.tabActive]}
              onPress={() => setActiveTab('inscripciones')}
            >
              <Text style={[styles.tabText, activeTab === 'inscripciones' && styles.tabTextActive]}>
                Inscripciones
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {usuario && usuario.tipoUsuario === 'estudiante' ? (
          renderInscripciones()
        ) : usuario && usuario.tipoUsuario === 'tutor' ? (
          renderPublicadas()
        ) : (
          activeTab === 'publicadas' ? renderPublicadas() : renderInscripciones()
        )}
      </ScrollView>
    </SafeAreaView>
  );
}


/* ------------------------------------------
   ESTILOS
------------------------------------------ */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollView: { flex: 1 },

  header: {
    backgroundColor: '#8B5CF6',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  titulo: { color: 'white', fontSize: 20, fontWeight: 'bold' },

  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    padding: 4,
    marginTop: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  tabActive: {
    backgroundColor: 'white',
  },
  tabText: {
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
    fontSize: 14,
  },
  tabTextActive: {
    color: '#8B5CF6',
  },

  tutoriasList: { padding: 20, gap: 12 },
  emptyText: { textAlign: 'center', color: '#6B7280', marginTop: 40, fontSize: 16 },

  tutoriaCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  tutoriaHeader: { flexDirection: 'row', marginBottom: 12 },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

  tutoriaInfo: { flex: 1 },

  tutoriaMateria: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
  tutoriaTutor: { fontSize: 14, color: '#6B7280' },
  fechaInscripcion: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },

  precioText: { color: '#8B5CF6', fontWeight: '600' },

  tutoriaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoriaBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoriaText: { fontSize: 12, color: '#6B7280' },

  disponibilidadContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  disponibilidadText: { fontSize: 12, color: '#6B7280' },

  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },

  editButton: {
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    alignItems: 'center',
    gap: 6,
  },
  deleteButton: {
    flexDirection: 'row',
    backgroundColor: '#EF4444',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    alignItems: 'center',
    gap: 6,
  },
  buttonText: { color: 'white', fontSize: 14, fontWeight: '500' },
});
