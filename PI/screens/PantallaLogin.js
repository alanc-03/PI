import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, Alert, ScrollView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { verificarLogin } from '../database/Database';

export default function PantallaLogin({ navigation }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const limpiarEmail = (t) => t.trim().toLowerCase();

  const handleLogin = async () => {
    const emailLimpio = limpiarEmail(email);

    if (!emailLimpio || !password) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    setLoading(true);

    const resultado = await verificarLogin(emailLimpio, password);

    setLoading(false);

    if (resultado.ok) {
      Alert.alert("Éxito", "Inicio de sesión correcto");

      setTimeout(() => {
        navigation.replace("PantallaInicio", { usuario: resultado.usuario });
      }, 300);
    } else {
      Alert.alert("Error", resultado.mensaje);
    }
  };

  const disabled = !email || !password || loading;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Iniciar Sesión</Text>
          <Text style={styles.subtitle}>Bienvenido de vuelta</Text>
        </View>

        <View style={styles.form}>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              style={styles.input}
              placeholder="tu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, disabled && styles.disabledButton]}
            onPress={handleLogin}
            disabled={disabled}
          >
            {loading
              ? <ActivityIndicator color="white" />
              : <Text style={styles.loginButtonText}>Iniciar sesión</Text>}
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>¿No tienes cuenta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Registro")}>
              <Text style={styles.registerLink}> Regístrate</Text>
            </TouchableOpacity>
          </View>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  scrollContent: { flexGrow: 1, padding: 24 },
  backButton: { alignSelf: 'flex-start', marginBottom: 32 },
  header: { marginBottom: 32 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#1F2937', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B7280' },
  form: { gap: 20 },
  inputGroup: { gap: 8 },
  label: { fontSize: 16, fontWeight: '500', color: '#374151' },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16
  },
  forgotPassword: { alignSelf: 'flex-end' },
  forgotPasswordText: { color: '#8B5CF6', fontSize: 14 },
  loginButton: {
    backgroundColor: '#8B5CF6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: { opacity: 0.5 },
  loginButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16
  },
  registerText: { color: '#6B7280', fontSize: 14 },
  registerLink: { color: '#8B5CF6', fontSize: 14, fontWeight: '500' },
});
