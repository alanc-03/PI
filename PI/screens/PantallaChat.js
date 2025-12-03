import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUsuarioActual } from '../utils/Session';
import { enviarMensaje, obtenerMensajes } from '../database/Database';

export default function PantallaChat({ navigation, route }) {
  const { tutor } = route.params || {}; // Esperamos un objeto tutor con id y nombre
  const usuarioActual = getUsuarioActual();

  const [mensaje, setMensaje] = useState('');
  const [mensajes, setMensajes] = useState([]);
  const scrollViewRef = useRef();

  useEffect(() => {
    if (usuarioActual && tutor && tutor.id) {
      cargarMensajes();
      // Polling simple para actualizar mensajes cada 3 segundos
      const interval = setInterval(cargarMensajes, 3000);
      return () => clearInterval(interval);
    }
  }, [usuarioActual, tutor]);

  const cargarMensajes = async () => {
    if (!usuarioActual || !tutor || !tutor.id) return;
    const data = await obtenerMensajes(usuarioActual.id, tutor.id);
    setMensajes(data);
  };

  const handleEnviar = async () => {
    if (mensaje.trim() && usuarioActual && tutor) {
      await enviarMensaje(usuarioActual.id, tutor.id, mensaje);
      setMensaje('');
      cargarMensajes();
    }
  };

  if (!tutor) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>No se especificó el usuario para chatear.</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
            <Text style={{ color: '#8B5CF6' }}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {tutor.nombre ? tutor.nombre.substring(0, 2).toUpperCase() : 'US'}
          </Text>
        </View>

        <View style={styles.tutorInfo}>
          <Text style={styles.tutorNombre}>{tutor.nombre}</Text>
          <Text style={styles.tutorEstado}>En línea</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Mensajes */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.mensajesContainer}
          contentContainerStyle={styles.mensajesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {mensajes.map((msg) => {
            const esMio = msg.emisorId === usuarioActual.id;
            return (
              <View key={msg.id} style={[
                styles.mensajeContainer,
                esMio ? styles.mensajeUsuario : styles.mensajeTutor
              ]}>
                {!esMio && (
                  <View style={styles.avatarPequeño}>
                    <Text style={styles.avatarPequeñoText}>
                      {tutor.nombre ? tutor.nombre.substring(0, 2).toUpperCase() : 'T'}
                    </Text>
                  </View>
                )}

                <View style={[
                  styles.mensajeBurbuja,
                  esMio ? styles.burbujaUsuario : styles.burbujaTutor
                ]}>
                  <Text style={[
                    styles.mensajeTexto,
                    esMio ? styles.mensajeTextoUsuario : styles.mensajeTextoTutor
                  ]}>
                    {msg.texto}
                  </Text>
                </View>

                <Text style={styles.mensajeHora}>
                  {new Date(msg.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        {/* Input de mensaje */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Escribe un mensaje..."
            value={mensaje}
            onChangeText={setMensaje}
            multiline
          />
          <TouchableOpacity
            style={styles.enviarButton}
            onPress={handleEnviar}
          >
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  tutorInfo: {
    flex: 1,
  },
  tutorNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  tutorEstado: {
    fontSize: 12,
    color: '#10B981',
  },
  keyboardView: {
    flex: 1,
  },
  mensajesContainer: {
    flex: 1,
  },
  mensajesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  fechaContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  fechaText: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    color: '#6B7280',
  },
  mensajeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  mensajeUsuario: {
    justifyContent: 'flex-end',
  },
  mensajeTutor: {
    justifyContent: 'flex-start',
  },
  avatarPequeño: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarPequeñoText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  mensajeBurbuja: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 16,
  },
  burbujaTutor: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
  },
  burbujaUsuario: {
    backgroundColor: '#8B5CF6',
    borderBottomRightRadius: 4,
  },
  mensajeTexto: {
    fontSize: 14,
    lineHeight: 20,
  },
  mensajeTextoTutor: {
    color: '#1F2937',
  },
  mensajeTextoUsuario: {
    color: 'white',
  },
  mensajeHora: {
    fontSize: 10,
    color: '#9CA3AF',
    marginHorizontal: 8,
    marginBottom: 2,
  },
  recordatorioContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  recordatorioText: {
    backgroundColor: '#EDE9FE',
    borderColor: '#DDD6FE',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    fontSize: 12,
    color: '#7C3AED',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    maxHeight: 100,
  },
  enviarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});
