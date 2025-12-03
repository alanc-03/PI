import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { obtenerTutoriasPorUsuario } from '../database/Database';
import { getUsuarioActual } from '../utils/Session';
import { openDatabaseSync } from "expo-sqlite";

const db = openDatabaseSync("luminaDB.db");

export default function PantallaMisTutorias({ navigation }) {

  const usuario = getUsuarioActual();
  const [tutorias, setTutorias] = useState([]);

  const cargarTutorias = async () => {
    if (!usuario) return;
    const data = await obtenerTutoriasPorUsuario(usuario.id);
    setTutorias(data);
  };

  useEffect(() => {
    cargarTutorias();

    const unsubscribe = navigation.addListener('focus', () => {
      cargarTutorias();
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
              cargarTutorias();
              navigation.goBack(); // 🔥 REGRESAR AUTOMÁTICAMENTE
            } catch (error) {
              console.log("Error eliminando tutoría:", error);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>    
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header1}> 
          <View>
            <Text style={styles.titulo}>Mis Tutorías</Text>
            <Text style={styles.subtitulo}>Tutorías creadas por ti</Text>
          </View>
          <View>
             <TouchableOpacity
                     style={styles.backButton}
                     onPress={() => navigation.goBack()}
                   >
                     <Ionicons name="arrow-back" size={32} color="#ffffffff" />
                   </TouchableOpacity>
          </View>
        </View>
        <View style={styles.tutoriasList}>
          {tutorias.length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#6B7280', marginTop: 20 }}>
              Aún no has publicado ninguna tutoría.
            </Text>
          ) : (
            tutorias.map((tutoria) => (
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

                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={16} color="#F59E0B" />
                      <Text style={styles.ratingText}>5.0</Text>
                      <Text style={styles.reviewsText}>(Nuevo)</Text>
                    </View>
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
    padding: 20,
    paddingTop: 30,
  },
    header1: {
      flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    padding: 20,
    paddingTop: 30,
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  titulo: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  subtitulo: { color: 'rgba(255,255,255,0.8)', marginTop: 4 },

  tutoriasList: { padding: 20, gap: 12 },

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

  ratingContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 14, color: '#1F2937', fontWeight: '500' },
  reviewsText: { fontSize: 12, color: '#9CA3AF' },
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
  backButton: {
    marginRight: 12,
    marginTop:15,
    color: 'white',
  },
});
