import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUsuarioActual, cerrarSesion, iniciarSesion } from '../utils/Session';
import { actualizarPerfil } from '../database/Database';

export default function PantallaConfiguracion({ navigation }) {
    const usuario = getUsuarioActual();
    const [nombre, setNombre] = useState(usuario?.nombre || '');
    const [cargando, setCargando] = useState(false);

    const handleGuardarCambios = async () => {
        if (!nombre.trim()) {
            Alert.alert('Error', 'El nombre no puede estar vacío');
            return;
        }

        setCargando(true);
        const resultado = await actualizarPerfil(usuario.id, nombre);

        if (resultado.ok) {
            // Actualizar sesión localmente (simulado, idealmente Session.js tendría un método update)
            usuario.nombre = nombre;
            // Re-guardar usuario en sesión si fuera persistente de otra forma, 
            // aquí asumimos que iniciarSesion actualiza el objeto global/storage
            await iniciarSesion(usuario);

            Alert.alert('Éxito', 'Perfil actualizado correctamente');
        } else {
            Alert.alert('Error', 'No se pudo actualizar el perfil');
        }
        setCargando(false);
    };

    const handleLogout = () => {
        Alert.alert(
            "Cerrar Sesión",
            "¿Estás seguro de que quieres cerrar sesión?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Cerrar Sesión",
                    style: "destructive",
                    onPress: () => {
                        cerrarSesion();
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Bienvenida' }],
                        });
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Configuración</Text>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Perfil</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Nombre Completo</Text>
                        <TextInput
                            style={styles.input}
                            value={nombre}
                            onChangeText={setNombre}
                            placeholder="Tu nombre"
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.button, cargando && styles.buttonDisabled]}
                        onPress={handleGuardarCambios}
                        disabled={cargando}
                    >
                        <Text style={styles.buttonText}>{cargando ? 'Guardando...' : 'Guardar Cambios'}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Cuenta</Text>

                    <TouchableOpacity style={styles.optionButton} onPress={handleLogout}>
                        <View style={styles.optionContent}>
                            <Ionicons name="swap-horizontal-outline" size={24} color="#4B5563" />
                            <View>
                                <Text style={styles.optionTitle}>Cambiar de Cuenta</Text>
                                <Text style={styles.optionSubtitle}>Cerrar sesión actual e iniciar con otra</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={24} color="#EF4444" />
                        <Text style={styles.logoutText}>Cerrar Sesión</Text>
                    </TouchableOpacity>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    content: {
        padding: 20,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 16,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: '#4B5563',
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#1F2937',
    },
    button: {
        backgroundColor: '#8B5CF6',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    optionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    optionSubtitle: {
        fontSize: 12,
        color: '#6B7280',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FEF2F2',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FCA5A5',
        gap: 8,
        marginTop: 8,
    },
    logoutText: {
        color: '#EF4444',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
