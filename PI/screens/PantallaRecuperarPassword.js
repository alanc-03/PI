import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, SafeAreaView, Alert, ActivityIndicator,
    KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { buscarUsuarioPorEmail, actualizarPassword } from '../database/Database';

export default function PantallaRecuperarPassword({ navigation }) {
    const [paso, setPaso] = useState(1); // 1: Verificar Email, 2: Nueva Contraseña
    const [email, setEmail] = useState('');
    const [nuevaPassword, setNuevaPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const verificarEmail = async () => {
        if (!email.trim()) {
            Alert.alert("Error", "Ingresa tu correo electrónico");
            return;
        }

        setLoading(true);
        const usuario = await buscarUsuarioPorEmail(email.trim().toLowerCase());
        setLoading(false);

        if (usuario) {
            setPaso(2);
        } else {
            Alert.alert("Error", "El correo no está registrado");
        }
    };

    const cambiarPassword = async () => {
        if (!nuevaPassword || !confirmarPassword) {
            Alert.alert("Error", "Completa todos los campos");
            return;
        }

        if (nuevaPassword !== confirmarPassword) {
            Alert.alert("Error", "Las contraseñas no coinciden");
            return;
        }

        if (nuevaPassword.length < 6) {
            Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
            return;
        }

        setLoading(true);
        const resultado = await actualizarPassword(email.trim().toLowerCase(), nuevaPassword);
        setLoading(false);

        if (resultado.ok) {
            Alert.alert("Éxito", "Contraseña actualizada correctamente", [
                { text: "Iniciar Sesión", onPress: () => navigation.goBack() }
            ]);
        } else {
            Alert.alert("Error", resultado.mensaje);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>

                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#374151" />
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <Text style={styles.title}>Recuperar Contraseña</Text>
                        <Text style={styles.subtitle}>
                            {paso === 1
                                ? "Ingresa tu correo para buscar tu cuenta"
                                : "Ingresa tu nueva contraseña"}
                        </Text>
                    </View>

                    <View style={styles.form}>
                        {paso === 1 ? (
                            // PASO 1: VERIFICAR EMAIL
                            <>
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

                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={verificarEmail}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <Text style={styles.buttonText}>Buscar Cuenta</Text>
                                    )}
                                </TouchableOpacity>
                            </>
                        ) : (
                            // PASO 2: NUEVA CONTRASEÑA
                            <>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Nueva Contraseña</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="••••••••"
                                        secureTextEntry
                                        value={nuevaPassword}
                                        onChangeText={setNuevaPassword}
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Confirmar Contraseña</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="••••••••"
                                        secureTextEntry
                                        value={confirmarPassword}
                                        onChangeText={setConfirmarPassword}
                                    />
                                </View>

                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={cambiarPassword}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <Text style={styles.buttonText}>Actualizar Contraseña</Text>
                                    )}
                                </TouchableOpacity>
                            </>
                        )}
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    scrollContent: { flexGrow: 1, padding: 24 },
    backButton: { alignSelf: 'flex-start', marginBottom: 32 },
    header: { marginBottom: 32 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#1F2937', marginBottom: 8 },
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
    button: {
        backgroundColor: '#8B5CF6',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
