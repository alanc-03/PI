import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { obtenerTutorias } from '../database/Database';

export default function PantallaBuscar({ navigation }) {
  const [busqueda, setBusqueda] = useState('');
  const [tutorias, setTutorias] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [filtros, setFiltros] = useState({
    modalidad: '',
    precio: '',
    disponibilidad: ''
  });

  const cargarTutorias = async () => {
    const data = await obtenerTutorias();
    setTutorias(data);
    setResultados(data);
  };

  useEffect(() => {
    cargarTutorias();
    const unsubscribe = navigation.addListener('focus', () => {
      cargarTutorias();
    });
    return unsubscribe;
  }, [navigation]);

  // Efecto para búsqueda en tiempo real
  useEffect(() => {
    if (busqueda.trim() === '') {
      setResultados(tutorias);
    } else {
      const filtrados = tutorias.filter(t =>
        t.materia.toLowerCase().includes(busqueda.toLowerCase()) ||
        (t.tutorNombre && t.tutorNombre.toLowerCase().includes(busqueda.toLowerCase()))
      );
      setResultados(filtrados);
    }
  }, [busqueda, tutorias]);

  const aplicarFiltros = () => {
    let filtrados = tutorias;

    if (filtros.modalidad) {
      filtrados = filtrados.filter(t => t.modalidad.toLowerCase() === filtros.modalidad.toLowerCase());
    }

    if (filtros.precio) {
      filtrados = filtrados.filter(t => t.precio.includes(filtros.precio));
    }

    setResultados(filtrados);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.buscadorContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <View style={styles.buscador}>
            <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar..."
              value={busqueda}
              onChangeText={setBusqueda}
            />
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Filtros */}
        <View style={styles.filtrosSection}>
          <Text style={styles.filtrosTitle}>Filtros</Text>

          {/* Modalidad */}
          <View style={styles.filtroGroup}>
            <Text style={styles.filtroLabel}>Modalidad</Text>
            <View style={styles.filtroOpciones}>
              <TouchableOpacity
                style={[
                  styles.filtroButton,
                  filtros.modalidad === 'online' && styles.filtroButtonActivo
                ]}
                onPress={() => setFiltros(prev => ({
                  ...prev,
                  modalidad: prev.modalidad === 'online' ? '' : 'online'
                }))}
              >
                <Text style={[
                  styles.filtroButtonText,
                  filtros.modalidad === 'online' && styles.filtroButtonTextActivo
                ]}>
                  En línea
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filtroButton,
                  filtros.modalidad === 'presencial' && styles.filtroButtonActivo
                ]}
                onPress={() => setFiltros(prev => ({
                  ...prev,
                  modalidad: prev.modalidad === 'presencial' ? '' : 'presencial'
                }))}
              >
                <Text style={[
                  styles.filtroButtonText,
                  filtros.modalidad === 'presencial' && styles.filtroButtonTextActivo
                ]}>
                  Presencial
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Precio */}
          <View style={styles.filtroGroup}>
            <Text style={styles.filtroLabel}>Precio</Text>
            <View style={styles.filtroOpciones}>
              <TouchableOpacity
                style={[
                  styles.filtroButton,
                  filtros.precio === '80-100' && styles.filtroButtonActivo
                ]}
                onPress={() => setFiltros(prev => ({
                  ...prev,
                  precio: prev.precio === '80-100' ? '' : '80-100'
                }))}
              >
                <Text style={[
                  styles.filtroButtonText,
                  filtros.precio === '80-100' && styles.filtroButtonTextActivo
                ]}>
                  $80-$100
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filtroButton,
                  filtros.precio === '100-120' && styles.filtroButtonActivo
                ]}
                onPress={() => setFiltros(prev => ({
                  ...prev,
                  precio: prev.precio === '100-120' ? '' : '100-120'
                }))}
              >
                <Text style={[
                  styles.filtroButtonText,
                  filtros.precio === '100-120' && styles.filtroButtonTextActivo
                ]}>
                  $100-$120
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Disponibilidad */}
          <View style={styles.filtroGroup}>
            <Text style={styles.filtroLabel}>Disponibilidad</Text>
            <View style={styles.filtroGrid}>
              <TouchableOpacity
                style={[
                  styles.filtroButton,
                  filtros.disponibilidad === 'hoy' && styles.filtroButtonActivo
                ]}
                onPress={() => setFiltros(prev => ({
                  ...prev,
                  disponibilidad: prev.disponibilidad === 'hoy' ? '' : 'hoy'
                }))}
              >
                <Text style={[
                  styles.filtroButtonText,
                  filtros.disponibilidad === 'hoy' && styles.filtroButtonTextActivo
                ]}>
                  Hoy
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filtroButton,
                  filtros.disponibilidad === 'semana' && styles.filtroButtonActivo
                ]}
                onPress={() => setFiltros(prev => ({
                  ...prev,
                  disponibilidad: prev.disponibilidad === 'semana' ? '' : 'semana'
                }))}
              >
                <Text style={[
                  styles.filtroButtonText,
                  filtros.disponibilidad === 'semana' && styles.filtroButtonTextActivo
                ]}>
                  Esta semana
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.aplicarFiltrosButton} onPress={aplicarFiltros}>
            <Text style={styles.aplicarFiltrosText}>Aplicar filtros</Text>
          </TouchableOpacity>
        </View>

        {/* Resultados */}
        <View style={styles.resultadosSection}>
          <Text style={styles.resultadosCount}>
            {resultados.length} resultados encontrados
          </Text>

          <View style={styles.resultadosList}>
            {resultados.length === 0 ? (
              <Text style={{ textAlign: 'center', color: '#6B7280', marginTop: 20 }}>
                No se encontraron resultados.
              </Text>
            ) : (
              resultados.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.resultadoCard}
                  onPress={() => navigation.navigate('PerfilTutor', { tutoria: item })}
                >
                  <View style={styles.resultadoHeader}>
                    <View style={styles.resultadoInfo}>
                      <Text style={styles.resultadoMateria}>{item.materia}</Text>
                      <Text style={styles.resultadoTutor}>{item.tutorNombre}</Text>
                    </View>
                    <View style={[
                      styles.modalidadBadge,
                      item.modalidad === 'En línea' ? styles.modalidadOnline : styles.modalidadPresencial
                    ]}>
                      <Text style={styles.modalidadText}>{item.modalidad}</Text>
                    </View>
                  </View>

                  <View style={styles.resultadoFooter}>
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={16} color="#F59E0B" />
                      <Text style={styles.ratingText}>
                        5.0 (Nuevo)
                      </Text>
                    </View>
                    <Text style={styles.precioText}>${item.precio}</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
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
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  buscadorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    marginRight: 12,
  },
  buscador: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
    color: '#1F2937',
  },
  scrollView: {
    flex: 1,
  },
  filtrosSection: {
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filtrosTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  filtroGroup: {
    marginBottom: 20,
  },
  filtroLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  filtroOpciones: {
    flexDirection: 'row',
    gap: 8,
  },
  filtroGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  filtroButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    alignItems: 'center',
  },
  filtroButtonActivo: {
    borderColor: '#8B5CF6',
    backgroundColor: '#F3F4F6',
  },
  filtroButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  filtroButtonTextActivo: {
    color: '#8B5CF6',
    fontWeight: '500',
  },
  aplicarFiltrosButton: {
    backgroundColor: '#8B5CF6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  aplicarFiltrosText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resultadosSection: {
    padding: 20,
  },
  resultadosCount: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  resultadosList: {
    gap: 12,
  },
  resultadoCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  resultadoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  resultadoInfo: {
    flex: 1,
  },
  resultadoMateria: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  resultadoTutor: {
    fontSize: 14,
    color: '#6B7280',
  },
  modalidadBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  modalidadOnline: {
    backgroundColor: '#EDE9FE',
  },
  modalidadPresencial: {
    backgroundColor: '#D1FAE5',
  },
  modalidadText: {
    fontSize: 12,
    fontWeight: '500',
  },
  resultadoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#1F2937',
  },
  precioText: {
    color: '#8B5CF6',
    fontWeight: '600',
  },
});