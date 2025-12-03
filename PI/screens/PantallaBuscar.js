import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, ScrollView
} from 'react-native';
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
    const unsubscribe = navigation.addListener('focus', () => cargarTutorias());
    return unsubscribe;
  }, [navigation]);

  // 🔍 BÚSQUEDA EN TIEMPO REAL
  useEffect(() => {
    if (busqueda.trim() === '') {
      setResultados(tutorias);
      return;
    }

    const filtrados = tutorias.filter(t =>
      t.materia?.toLowerCase().includes(busqueda.toLowerCase()) ||
      t.tutorNombre?.toLowerCase().includes(busqueda.toLowerCase())
    );

    setResultados(filtrados);
  }, [busqueda, tutorias]);

  // 🎯 APLICAR FILTROS
  const aplicarFiltros = () => {
    let filtrados = [...tutorias];

    if (filtros.modalidad !== '') {
      filtrados = filtrados.filter(t => t.modalidad === filtros.modalidad);
    }

    if (filtros.precio) {
      filtrados = filtrados.filter(t => {
        // Limpiar el precio de símbolos como '$' y convertir a número
        const precioNumerico = parseFloat(t.precio.toString().replace(/[^0-9.]/g, ''));

        if (isNaN(precioNumerico)) return true; // Si no es número, no filtrar (o filtrar, según preferencia)

        if (filtros.precio === 'bajo') {
          return precioNumerico <= 50; // Ajustado rango para ser más realista
        } else if (filtros.precio === 'medio') {
          return precioNumerico > 50 && precioNumerico <= 100;
        } else if (filtros.precio === 'alto') {
          return precioNumerico > 100;
        }
        return true;
      });
    }

    setResultados(filtrados);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* 🔍 BUSCADOR */}
        <View style={styles.header}>
          <View style={styles.buscadorContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>

            <View style={styles.buscador}>
              <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
              <TextInput
                placeholder="Buscar materia o tutor..."
                style={styles.searchInput}
                value={busqueda}
                onChangeText={setBusqueda}
              />
            </View>
          </View>
        </View>

        {/* 🎛 FILTROS */}
        <View style={styles.filtrosSection}>
          <Text style={styles.filtrosTitle}>Filtros</Text>

          {/* Modalidad */}
          <View style={styles.filtroGroup}>
            <Text style={styles.filtroLabel}>Modalidad</Text>
            <View style={styles.filtroOpciones}>
              {['En línea', 'Presencial'].map((modo) => (
                <TouchableOpacity
                  key={modo}
                  style={[
                    styles.filtroButton,
                    filtros.modalidad === modo && styles.filtroButtonActivo
                  ]}
                  onPress={() => setFiltros(prev => ({
                    ...prev,
                    modalidad: prev.modalidad === modo ? '' : modo
                  }))}
                >
                  <Text style={[
                    styles.filtroButtonText,
                    filtros.modalidad === modo && styles.filtroButtonTextActivo
                  ]}>
                    {modo}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Precio */}
          <View style={styles.filtroGroup}>
            <Text style={styles.filtroLabel}>Precio</Text>
            <View style={styles.filtroOpciones}>
              {[
                { label: 'Bajo', value: 'bajo' },
                { label: 'Medio', value: 'medio' },
                { label: 'Alto', value: 'alto' }
              ].map(p => (
                <TouchableOpacity
                  key={p.value}
                  style={[
                    styles.filtroButton,
                    filtros.precio === p.value && styles.filtroButtonActivo
                  ]}
                  onPress={() => setFiltros(prev => ({
                    ...prev,
                    precio: prev.precio === p.value ? '' : p.value
                  }))}
                >
                  <Text style={[
                    styles.filtroButtonText,
                    filtros.precio === p.value && styles.filtroButtonTextActivo
                  ]}>
                    {p.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Disponibilidad */}
          <View style={styles.filtroGroup}>
            <Text style={styles.filtroLabel}>Disponibilidad</Text>
            <View style={styles.filtroGrid}>
              {[
                { label: 'Hoy', value: 'hoy' },
                { label: 'Esta semana', value: 'semana' }
              ].map(op => (
                <TouchableOpacity
                  key={op.value}
                  style={[
                    styles.filtroButton,
                    filtros.disponibilidad === op.value && styles.filtroButtonActivo
                  ]}
                  onPress={() => setFiltros(prev => ({
                    ...prev,
                    disponibilidad: prev.disponibilidad === op.value ? '' : op.value
                  }))}
                >
                  <Text style={[
                    styles.filtroButtonText,
                    filtros.disponibilidad === op.value && styles.filtroButtonTextActivo
                  ]}>
                    {op.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.aplicarFiltrosButton} onPress={aplicarFiltros}>
            <Text style={styles.aplicarFiltrosText}>Aplicar filtros</Text>
          </TouchableOpacity>
        </View>

        {/* 📌 RESULTADOS */}
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
                      item.modalidad === 'En línea'
                        ? styles.modalidadOnline
                        : styles.modalidadPresencial
                    ]}>
                      <Text style={styles.modalidadText}>{item.modalidad}</Text>
                    </View>
                  </View>

                  <View style={styles.resultadoFooter}>
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={16} color="#F59E0B" />
                      <Text style={styles.ratingText}>5.0 (Nuevo)</Text>
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
  container: { flex: 1, backgroundColor: 'white' },
  header: {
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  buscadorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: { marginRight: 12 },
  buscador: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
    color: '#1F2937',
  },
  scrollView: { flex: 1 },
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
  filtroGroup: { marginBottom: 20 },
  filtroLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  filtroOpciones: { flexDirection: 'row', gap: 8 },
  filtroGrid: { flexDirection: 'row', gap: 8 },
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
  resultadosSection: { padding: 20 },
  resultadosCount: { fontSize: 14, color: '#6B7280', marginBottom: 16 },
  resultadosList: { gap: 12 },
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
    marginBottom: 12,
  },
  resultadoMateria: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  resultadoTutor: { fontSize: 14, color: '#6B7280' },
  modalidadBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  modalidadOnline: { backgroundColor: '#EDE9FE' },
  modalidadPresencial: { backgroundColor: '#D1FAE5' },
  modalidadText: { fontSize: 12, fontWeight: '500' },
  resultadoFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 14, color: '#1F2937' },
  precioText: { color: '#8B5CF6', fontWeight: '600' },
});
