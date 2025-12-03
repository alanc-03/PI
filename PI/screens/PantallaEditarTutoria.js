import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { getTutoriaPorId, editarTutoria } from '../database/Database';

export default function PantallaEditarTutoria({ route, navigation }) {
  const { id } = route.params;
  const [tutoria, setTutoria] = useState(null);

  /* Listas para opciones desplegables */
  const categorias = ['Matemáticas', 'Programación', 'Ciencias', 'Idiomas'];
  const niveles = ['Básico', 'Intermedio', 'Avanzado'];
  const modalidades = ['En línea', 'Presencial'];
  const duraciones = ['30 minutos', '1 hora', '1.5 horas', '2 horas'];

  /* Cargar datos */
  const cargarDatos = async () => {
    const data = await getTutoriaPorId(id);
    setTutoria(data);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  if (!tutoria) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: "#6B7280" }}>Cargando...</Text>
      </View>
    );
  }

  const handleChange = (key, value) => {
    setTutoria({ ...tutoria, [key]: value });
  };

  /* Guardar cambios */
  const guardarCambios = async () => {
    const respuesta = await editarTutoria(id, tutoria);

    if (!respuesta.ok) {
      Alert.alert("Error", "No se pudieron guardar los cambios.");
      return;
    }

    Alert.alert("Éxito", "Tutoría actualizada correctamente.");
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Editar Tutoría</Text>
      </View>

      <View style={styles.form}>

        {/* Materia */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Materia</Text>
          <TextInput
            style={styles.input}
            value={tutoria.materia}
            onChangeText={(v) => handleChange("materia", v)}
          />
        </View>

        {/* Categoría */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Categoría</Text>

          <View style={styles.opcionesGrid}>
            {categorias.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.opcionButton,
                  tutoria.categoria === cat && styles.opcionButtonSeleccionada
                ]}
                onPress={() => handleChange("categoria", cat)}
              >
                <Text
                  style={[
                    styles.opcionTexto,
                    tutoria.categoria === cat && styles.opcionTextoSeleccionado
                  ]}
                >
                  {cat}
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
                  tutoria.nivel === nivel && styles.opcionButtonSeleccionada
                ]}
                onPress={() => handleChange("nivel", nivel)}
              >
                <Text
                  style={[
                    styles.opcionTexto,
                    tutoria.nivel === nivel && styles.opcionTextoSeleccionado
                  ]}
                >
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
            multiline
            value={tutoria.descripcion}
            onChangeText={(v) => handleChange("descripcion", v)}
          />
        </View>

        {/* Precio */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Precio</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(tutoria.precio)}
            onChangeText={(v) => handleChange("precio", v)}
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
                  tutoria.modalidad === modalidad && styles.opcionButtonSeleccionada
                ]}
                onPress={() => handleChange("modalidad", modalidad)}
              >
                <Text
                  style={[
                    styles.opcionTexto,
                    tutoria.modalidad === modalidad && styles.opcionTextoSeleccionado
                  ]}
                >
                  {modalidad}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Ubicación solo si la modalidad es Presencial */}
        {tutoria.modalidad === "Presencial" && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ubicación</Text>
            <TextInput
              style={styles.input}
              value={tutoria.ubicacion}
              onChangeText={(v) => handleChange("ubicacion", v)}
            />
          </View>
        )}

        {/* Duración */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Duración</Text>

          <View style={styles.opcionesGrid}>
            {duraciones.map((dur) => (
              <TouchableOpacity
                key={dur}
                style={[
                  styles.opcionButton,
                  tutoria.duracion === dur && styles.opcionButtonSeleccionada
                ]}
                onPress={() => handleChange("duracion", dur)}
              >
                <Text
                  style={[
                    styles.opcionTexto,
                    tutoria.duracion === dur && styles.opcionTextoSeleccionado
                  ]}
                >
                  {dur}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Botón Guardar */}
        <TouchableOpacity style={styles.saveButton} onPress={guardarCambios}>
          <Ionicons name="save-outline" size={20} color="white" />
          <Text style={styles.saveButtonText}>Guardar Cambios</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}


/* ------------------------- ESTILOS ------------------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  titulo: { fontSize: 20, fontWeight: "600", color: "#1F2937" },

  backButton: { padding: 6 },

  form: { padding: 20, gap: 24 },

  inputGroup: { gap: 8 },

  label: { fontSize: 16, fontWeight: "500", color: "#374151" },

  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "white",
    fontSize: 16,
  },

  textArea: { height: 100, textAlignVertical: "top" },

  opcionesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  opcionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "white",
  },

  opcionButtonSeleccionada: {
    borderColor: "#8B5CF6",
    backgroundColor: "#EDE9FE",
  },

  opcionTexto: { fontSize: 14, color: "#6B7280" },

  opcionTextoSeleccionado: { color: "#8B5CF6", fontWeight: "500" },

  saveButton: {
    backgroundColor: "#10B981",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },

  saveButtonText: { color: "white", fontSize: 16, fontWeight: "600" },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
