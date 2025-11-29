import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { obtenerTutorias } from '../database/Database';

export default function PantallaInicio({ navigation }) {
  const [tutorias, setTutorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');

  useEffect(() => {
    cargarTutorias();
  }, []);

  const cargarTutorias = () => {
    obtenerTutorias((tutorias) => {
      setTutorias(tutorias);
    });
  };

  const categorias = ['Todas', 'Matemáticas', 'Programación', 'Ciencias', 'Idiomas'];

  const tutoriasEjemplo = [
    {
      id: 1,
      materia: "Cálculo Diferencial",
      tutor: "Victor Manuel",
      rating: 4.9,
      reseñas: 45,
      precio: "$80-$100 MX/hr",
      avatar: "VM",
      categoria: "Matemáticas",
      disponibilidad: "Disponible hoy"
    },
    {
      id: 2,
      materia: "Programación Python",
      tutor: "José María",
      rating: 5.0,
      reseñas: 32,
      precio: "$80-$100 MX/hr",
      avatar: "JM",
      categoria: "Programación",
      disponibilidad: "Mañana 3 PM"
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.saludo}>Hola,</Text>
              <Text style={styles.nombre}>Yuliana Valdez</Text>
            </View>
            <TouchableOpacity 
              style={styles.notificationButton}
              onPress={() => navigation.navigate('Notificaciones')}
            >
              <Ionicons name="notifications-outline" size={24} color="white" />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar materias o tutores..."
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Categorías */}
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {categorias.map((categoria) => (
              <TouchableOpacity
                key={categoria}
                style={[
                  styles.categoryButton,
                  categoriaSeleccionada === categoria && styles.categoryButtonSelected
                ]}
                onPress={() => setCategoriaSeleccionada(categoria)}
              >
                <Text style={[
                  styles.categoryText,
                  categoriaSeleccionada === categoria && styles.categoryTextSelected
                ]}>
                  {categoria}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Tutorías Disponibles */}
        <View style={styles.tutoriasSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tutorías Disponibles</Text>
            <TouchableOpacity>
              <Text style={styles.verTodasText}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tutoriasList}>
            {tutoriasEjemplo.map((tutoria) => (
              <TouchableOpacity 
                key={tutoria.id}
                style={styles.tutoriaCard}
                onPress={() => navigation.navigate('PerfilTutor')}
              >
                <View style={styles.tutoriaHeader}>
                  <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>{tutoria.avatar}</Text>
                  </View>
                  <View style={styles.tutoriaInfo}>
                    <Text style={styles.tutoriaMateria}>{tutoria.materia}</Text>
                    <Text style={styles.tutoriaTutor}>{tutoria.tutor}</Text>
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={16} color="#F59E0B" />
                      <Text style={styles.ratingText}>{tutoria.rating}</Text>
                      <Text style={styles.reviewsText}>({tutoria.reseñas})</Text>
                    </View>
                  </View>
                  <Text style={styles.precioText}>{tutoria.precio}</Text>
                </View>

                <View style={styles.tutoriaFooter}>
                  <View style={styles.categoriaBadge}>
                    <Text style={styles.categoriaText}>{tutoria.categoria}</Text>
                  </View>
                  <View style={styles.disponibilidadContainer}>
                    <Ionicons name="time-outline" size={16} color="#6B7280" />
                    <Text style={styles.disponibilidadText}>{tutoria.disponibilidad}</Text>
                    <Ionicons name="location-outline" size={16} color="#6B7280" />
                    <Text style={styles.disponibilidadText}>En línea</Text>
                  </View>
                </View>
              </TouchableOpacity>
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
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  saludo: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  nombre: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EC4899',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  categoriesContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 16,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#F3F4F6',
  },
  categoryButtonSelected: {
    backgroundColor: '#8B5CF6',
  },
  categoryText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: 'white',
  },
  tutoriasSection: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  verTodasText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '500',
  },
  tutoriasList: {
    gap: 12,
  },
  tutoriaCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tutoriaHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tutoriaInfo: {
    flex: 1,
  },
  tutoriaMateria: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  tutoriaTutor: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  reviewsText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  precioText: {
    color: '#8B5CF6',
    fontWeight: '600',
  },
  tutoriaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoriaBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoriaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  disponibilidadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  disponibilidadText: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 8,
  },
});