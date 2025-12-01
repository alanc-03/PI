import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, Alert, ScrollView,
  Switch, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { registrarUsuario, buscarUsuarioPorEmail } from '../database/Database';

export default function PantallaRegistro({ navigation }) {

  const [formData, setFormData] = useState({
    nombre: '',
    fechaNacimiento: '',
    email: '',
    universidad: '',
    password: '',
    confirmPassword: '',
    tipoUsuario: 'ambos'
  });

  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: null }));
  };

  /* -----------------------------
     FORMATEAR FECHA AUTOMÁTICAMENTE
  ------------------------------ */
  const formatFecha = (text) => {
    let cleaned = text.replace(/\D/g, "");
    if (cleaned.length >= 3 && cleaned.length <= 4) {
      cleaned = cleaned.replace(/(\d{2})(\d{1,2})/, "$1/$2");
    } else if (cleaned.length >= 5) {
      cleaned = cleaned.replace(/(\d{2})(\d{2})(\d{1,4})/, "$1/$2/$3");
    }
    updateFormData("fechaNacimiento", cleaned);
  };

  /* -----------------------------
     VALIDAR FORMULARIO
  ------------------------------ */
  const validarFormulario = () => {
    let nuevosErrores = {};
    const { nombre, fechaNacimiento, email, universidad, password, confirmPassword } = formData;

    if (!nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";
    if (!fechaNacimiento.trim() || fechaNacimiento.length < 10)
      nuevosErrores.fechaNacimiento = "Formato correcto: DD/MM/AAAA";

    const emailLimpio = email.trim().toLowerCase();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailLimpio) nuevosErrores.email = "Obligatorio";
    else if (!regex.test(emailLimpio)) nuevosErrores.email = "Correo inválido";

    if (!universidad.trim()) nuevosErrores.universidad = "Obligatorio";

    const passRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!password) nuevosErrores.password = "Obligatorio";
    else if (!passRegex.test(password))
      nuevosErrores.password = "6+ caracteres, 1 mayúscula y 1 número";

    if (!confirmPassword) nuevosErrores.confirmPassword = "Confirma tu contraseña";
    else if (password !== confirmPassword)
      nuevosErrores.confirmPassword = "No coinciden";

    if (!aceptaTerminos) nuevosErrores.terminos = "Debes aceptar los términos";

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  /* -----------------------------
     REGISTRO (CORREGIDO)
  ------------------------------ */
  const handleRegistro = async () => {
    if (!validarFormulario()) {
      Alert.alert("Error", "Corrige los campos marcados");
      return;
    }

    setLoading(true);

    try {
      const emailLimpio = formData.email.trim().toLowerCase();

      const usuarioExistente = await buscarUsuarioPorEmail(emailLimpio);

      if (usuarioExistente) {
        setLoading(false);
        setErrors(prev => ({ ...prev, email: "Este correo ya está registrado" }));
        Alert.alert("Error", "Este correo ya está registrado");
        return;
      }

      const resultado = await registrarUsuario({
        ...formData,
        email: emailLimpio,
      });

      setLoading(false);

      if (resultado.ok) {
        Alert.alert("Éxito", "Cuenta creada correctamente");
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", resultado.mensaje);
      }

    } catch (e) {
      console.log("❌ Error registro:", e);
      setLoading(false);
      Alert.alert("Error", "Ocurrió un error inesperado");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#4B5563" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Únete a Lumina</Text>
        </View>

        <View style={styles.form}>

          {/* Nombre */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre completo</Text>
            <TextInput
              style={[styles.input, errors.nombre && styles.inputError]}
              placeholder="Ej: Juan Pérez"
              value={formData.nombre}
              onChangeText={(t) => updateFormData("nombre", t)}
            />
            {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}
          </View>

          {/* Fecha */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Fecha de nacimiento</Text>
            <TextInput
              style={[styles.input, errors.fechaNacimiento && styles.inputError]}
              placeholder="DD/MM/AAAA"
              maxLength={10}
              keyboardType="numeric"
              value={formData.fechaNacimiento}
              onChangeText={formatFecha}
            />
            {errors.fechaNacimiento && <Text style={styles.errorText}>{errors.fechaNacimiento}</Text>}
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="correo@ejemplo.com"
              value={formData.email}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={(t) => updateFormData("email", t)}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          {/* Universidad */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Universidad</Text>
            <TextInput
              style={[styles.input, errors.universidad && styles.inputError]}
              placeholder="Ej: UNAM, UDG..."
              value={formData.universidad}
              onChangeText={(t) => updateFormData("universidad", t)}
            />
            {errors.universidad && <Text style={styles.errorText}>{errors.universidad}</Text>}
          </View>

          {/* Contraseña */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.passwordInput, errors.password && styles.inputError]}
                placeholder="••••••"
                secureTextEntry={!showPassword}
                value={formData.password}
                onChangeText={(t) => updateFormData("password", t)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={26} color="#6B7280" />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          {/* Confirmar */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmar contraseña</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.passwordInput, errors.confirmPassword && styles.inputError]}
                placeholder="••••••"
                secureTextEntry={!showConfirm}
                value={formData.confirmPassword}
                onChangeText={(t) => updateFormData("confirmPassword", t)}
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                <Ionicons name={showConfirm ? "eye-off" : "eye"} size={26} color="#6B7280" />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
          </View>

          {/* Tipo */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tipo de usuario</Text>
            {["estudiante", "tutor", "ambos"].map((tipo) => (
              <TouchableOpacity
                key={tipo}
                style={[styles.radioOption, formData.tipoUsuario === tipo && styles.radioOptionSelected]}
                onPress={() => updateFormData("tipoUsuario", tipo)}
              >
                <View style={styles.radioCircle}>
                  {formData.tipoUsuario === tipo && <View style={styles.radioInnerCircle} />}
                </View>
                <Text style={styles.radioLabel}>
                  {tipo === "estudiante"
                    ? "Estudiante (buscar tutorías)"
                    : tipo === "tutor"
                    ? "Tutor (ofrecer tutorías)"
                    : "Ambos"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Terminos */}
          <View style={styles.inputGroup}>
            <View style={styles.terminosRow}>
              <Switch value={aceptaTerminos} onValueChange={setAceptaTerminos} />
              <Text style={styles.label}>Acepto los términos y condiciones</Text>
            </View>
            {errors.terminos && <Text style={styles.errorText}>{errors.terminos}</Text>}
          </View>

          {/* Botón */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegistro}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="white" />
              : <Text style={styles.registerButtonText}>Crear cuenta</Text>}
          </TouchableOpacity>

          {/* Ir al login */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>¿Ya tienes cuenta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}> Inicia sesión</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* -----------------------------
   ESTILOS
------------------------------ */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  scrollContent: { flexGrow: 1, padding: 24 },
  backButton: { padding: 4, marginBottom: 20 },
  header: { marginBottom: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#1F2937' },
  subtitle: { fontSize: 16, color: '#6B7280' },
  form: { gap: 22 },
  inputGroup: { gap: 6 },
  label: { fontSize: 15, fontWeight: '500', color: '#374151' },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: "white"
  },
  inputError: { borderColor: "red" },
  errorText: { color: "red", fontSize: 13 },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 12
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 0,
    fontSize: 16
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    gap: 12
  },
  radioOptionSelected: {
    borderColor: "#8B5CF6",
    backgroundColor: "#F5F3FF"
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#8B5CF6",
    justifyContent: "center",
    alignItems: "center"
  },
  radioInnerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#8B5CF6"
  },
  radioLabel: { flex: 1, fontSize: 15, color: "#374151" },
  terminosRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  registerButton: {
    backgroundColor: "#8B5CF6",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#8B5CF6",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4
  },
  registerButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700"
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10
  },
  loginText: { color: "#6B7280", fontSize: 14 },
  loginLink: { color: "#8B5CF6", fontSize: 14, fontWeight: "600" }
});
