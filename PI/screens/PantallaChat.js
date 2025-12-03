import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PantallaChat({ navigation, route }) {
  const [mensaje, setMensaje] = useState('');
  const [mensajes, setMensajes] = useState([
    {
      id: 1,
      texto: 'Hola, hoy tenemos sesión, el tema de hoy serán las derivadas.',
      esUsuario: false,
      hora: '10:15 AM',
      fecha: 'Hoy'
    },
    {
      id: 2,
      texto: 'okey, está perfecto!',
      esUsuario: true,
      hora: '10:16 AM',
      fecha: 'Hoy'
    }
  ]);

  const enviarMensaje = () => {
    if (mensaje.trim()) {
      const nuevoMensaje = {
        id: mensajes.length + 1,
        texto: mensaje,
        esUsuario: true,
        hora: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        fecha: 'Hoy'
      };
      setMensajes([...mensajes, nuevoMensaje]);
      setMensaje('');
    }
  };

  const tutor = {
    nombre: 'Victor Manuel',
    estado: 'En línea',
    avatar: 'VM'
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
        
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{tutor.avatar}</Text>
        </View>
        
        <View style={styles.tutorInfo}>
          <Text style={styles.tutorNombre}>{tutor.nombre}</Text>
          <Text style={styles.tutorEstado}>{tutor.estado}</Text>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Mensajes */}
        <ScrollView 
          style={styles.mensajesContainer}
          contentContainerStyle={styles.mensajesContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Indicador de fecha */}
          <View style={styles.fechaContainer}>
            <Text style={styles.fechaText}>Hoy</Text>
          </View>

          {mensajes.map((msg) => (
            <View key={msg.id} style={[
              styles.mensajeContainer,
              msg.esUsuario ? styles.mensajeUsuario : styles.mensajeTutor
            ]}>
              {!msg.esUsuario && (
                <View style={styles.avatarPequeño}>
                  <Text style={styles.avatarPequeñoText}>{tutor.avatar}</Text>
                </View>
              )}
              
              <View style={[
                styles.mensajeBurbuja,
                msg.esUsuario ? styles.burbujaUsuario : styles.burbujaTutor
              ]}>
                <Text style={[
                  styles.mensajeTexto,
                  msg.esUsuario ? styles.mensajeTextoUsuario : styles.mensajeTextoTutor
                ]}>
                  {msg.texto}
                </Text>
              </View>
              
              <Text style={styles.mensajeHora}>{msg.hora}</Text>
            </View>
          ))}

          {/* Recordatorio de sesión */}
          <View style={styles.recordatorioContainer}>
            <Text style={styles.recordatorioText}>
              La sesión inicia en una hora
            </Text>
          </View>
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
            onPress={enviarMensaje}
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
    marginTop:30,
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