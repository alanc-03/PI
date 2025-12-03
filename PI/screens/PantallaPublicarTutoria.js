import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { agregarTutoria } from '../database/Database';
import { getUsuarioActual } from '../utils/Session';

export default function PantallaPublicarTutoria({ navigation }) {
  const [formData, setFormData] = useState({
    materia: '',
    categoria: '',
    nivel: '',
    descripcion: '',
    precio: '',
    modalidad: '',
    duracion: '',
    ubicacion: ''
  });

  const categorias = ['Matemáticas', 'Programación', 'Ciencias', 'Idiomas'];
  const niveles = ['Básico', 'Intermedio', 'Avanzado'];
  const modalidades = ['En línea', 'Presencial'];
  const duraciones = ['30 minutos', '1 hora', '1.5 horas', '2 horas'];

  const actualizarCampo = (campo, valor) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const manejarPublicar = () => {
    const { materia, categoria, nivel, descripcion, precio, modalidad, duracion, ubicacion } = formData;
    const usuario = getUsuarioActual();

    if (!usuario) {
      Alert.alert('Error', 'Debes iniciar sesión para publicar');
      return;
    }

    if (usuario.tipoUsuario === 'estudiante') {
      Alert.alert('Acceso denegado', 'Solo los tutores pueden publicar clases.');
      return;
    }

    if (!materia || !categoria || !nivel || !descripcion || !precio || !modalidad || !duracion) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    if (modalidad === 'Presencial' && !ubicacion) {
      Alert.alert('Error', 'Debes especificar la ubicación para clases presenciales');
      return;
    }

    const tutoriaData = {
      ...formData,
      usuarioId: usuario.id,
      tutorNombre: usuario.nombre
    };

    agregarTutoria(tutoriaData, (result) => {
      if (result.insertId) {
        Alert.alert('Éxito', 'Tutoría publicada correctamente');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'No se pudo publicar la tutoría');
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Publicar Tutoría</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Materia */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Materia</Text>
            <TextInput
              style={styles.input}
              placeholder="ej. Cálculo Diferencial"
              value={formData.materia}
              onChangeText={(text) => actualizarCampo('materia', text)}
            />
          </View>

          {/* Categoría */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Categoría</Text>
            <View style={styles.opcionesGrid}>
              {categorias.map((categoria) => (
                <TouchableOpacity
                  key={categoria}
                  style={[
                    styles.opcionButton,
                    formData.categoria === categoria && styles.opcionButtonSeleccionada
                  ]}
                  onPress={() => actualizarCampo('categoria', categoria)}
                >
                  <Text style={[
                    styles.opcionTexto,
                    formData.categoria === categoria && styles.opcionTextoSeleccionado
                  ]}>
                    {categoria}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Nivel */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nivel</Text>
            <View style={styles.opcionesGrid}>
              {niveles.map((nivel) => (
                <TouchableOpacity
                  key={nivel}
                  style={[
                    styles.opcionButton,
                    formData.nivel === nivel && styles.opcionButtonSeleccionada
                  ]}
                  onPress={() => actualizarCampo('nivel', nivel)}
                >
                  <Text style={[
                    styles.opcionTexto,
                    formData.nivel === nivel && styles.opcionTextoSeleccionado
                  ]}>
                    {nivel}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Descripción */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe qué enseñarás..."
              value={formData.descripcion}
              onChangeText={(text) => actualizarCampo('descripcion', text)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Precio */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Precio por hora (MX)</Text>
            <TextInput
              style={styles.input}
              placeholder="80-100"
              value={formData.precio}
              onChangeText={(text) => actualizarCampo('precio', text)}
              keyboardType="numeric"
            />
          </View>

          {/* Modalidad */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Modalidad</Text>
            <View style={styles.opcionesGrid}>
              {modalidades.map((modalidad) => (
                <TouchableOpacity
                  key={modalidad}
                  style={[
                    styles.opcionButton,
                    formData.modalidad === modalidad && styles.opcionButtonSeleccionada
                  ]}
                  onPress={() => actualizarCampo('modalidad', modalidad)}
                >
                  <Text style={[
                    styles.opcionTexto,
                    formData.modalidad === modalidad && styles.opcionTextoSeleccionado
                  ]}>
                    {modalidad}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Ubicación (Solo si es presencial) */}
          {formData.modalidad === 'Presencial' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ubicación</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. Biblioteca Central, Aula 3B..."
                value={formData.ubicacion}
                onChangeText={(text) => actualizarCampo('ubicacion', text)}
              />
            </View>
          )}

          {/* Duración */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Duración de sesión</Text>
            <View style={styles.opcionesGrid}>
              {duraciones.map((duracion) => (
                <TouchableOpacity
                  key={duracion}
                  style={[
                    styles.opcionButton,
                    formData.duracion === duracion && styles.opcionButtonSeleccionada
                  ]}
                  onPress={() => actualizarCampo('duracion', duracion)}
                >
                  <Text style={[
                    styles.opcionTexto,
                    formData.duracion === duracion && styles.opcionTextoSeleccionado
                  ]}>
                    {duracion}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Botones de acción */}
          <View style={styles.botonesContainer}>
            <TouchableOpacity style={styles.botonPublicar} onPress={manejarPublicar}>
              <Text style={styles.botonPublicarTexto}>Publicar Tutoría</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botonBorrador}>
              <Text style={styles.botonBorradorTexto}>Guardar Borrador</Text>
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
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 20,
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  textArea: {
    height: 100,
  },
  opcionesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  opcionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: 'white',
  },
  opcionButtonSeleccionada: {
    borderColor: '#8B5CF6',
    backgroundColor: '#EDE9FE',
  },
  opcionTexto: {
    fontSize: 14,
    color: '#6B7280',
  },
  opcionTextoSeleccionado: {
    color: '#8B5CF6',
    fontWeight: '500',
  },
  botonesContainer: {
    gap: 12,
    marginTop: 20,
  },
  botonPublicar: {
    backgroundColor: '#8B5CF6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  botonPublicarTexto: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  botonBorrador: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  botonBorradorTexto: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
});