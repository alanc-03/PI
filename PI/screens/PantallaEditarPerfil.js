import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getUsuarioActual, iniciarSesion } from '../utils/Session';
import { actualizarPerfilCompleto } from '../database/Database';

export default function PantallaEditarPerfil({ navigation }) {
    const usuario = getUsuarioActual();

    const [nombre, setNombre] = useState(usuario?.nombre || '');
    const [alias, setAlias] = useState(usuario?.alias || '');
    const [fechaNacimiento, setFechaNacimiento] = useState(usuario?.fechaNacimiento || '');
    const [foto, setFoto] = useState(usuario?.foto || null);
    const [cargando, setCargando] = useState(false);

    const pickImage = async () => {
        // Pedir permisos
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'Necesitamos permiso para acceder a tu galería.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
            base64: true, // Opcional, si quieres guardar base64 en DB (cuidado con el tamaño)
        });

        if (!result.canceled) {
            setFoto(result.assets[0].uri);
        }
    };

    const handleGuardar = async () => {
        if (!nombre.trim()) {
            Alert.alert('Error', 'El nombre es obligatorio');
            return;
        }

        setCargando(true);
        const datos = {
            nombre,
            alias,
            fechaNacimiento,
            foto
        };

        const resultado = await actualizarPerfilCompleto(usuario.id, datos);

        if (resultado.ok) {
            // Actualizar sesión con los nuevos datos
            await iniciarSesion(resultado.usuario);
            Alert.alert('Éxito', 'Perfil actualizado correctamente', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } else {
            Alert.alert('Error', 'No se pudo actualizar el perfil');
        }
        setCargando(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Editar Perfil</Text>
            </View>

            <ScrollView style={styles.content}>

                {/* Foto de Perfil */}
                <View style={styles.fotoContainer}>
                    <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
                        {foto ? (
                            <Image source={{ uri: foto }} style={styles.avatar} />
                        ) : (
                            <View style={[styles.avatar, styles.avatarPlaceholder]}>
                                <Text style={styles.avatarText}>
                                    {nombre ? nombre.substring(0, 2).toUpperCase() : 'US'}
                                </Text>
                            </View>
                        )}
                        <View style={styles.cameraIcon}>
                            <Ionicons name="camera" size={20} color="white" />
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.cambiarFotoText}>Toca para cambiar foto</Text>
                </View>

                {/* Formulario */}
                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nombre Completo</Text>
                        <TextInput
                            style={styles.input}
                            value={nombre}
                            onChangeText={setNombre}
                            placeholder="Tu nombre completo"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Alias (Nombre de usuario)</Text>
                        <TextInput
                            style={styles.input}
                            value={alias}
                            onChangeText={setAlias}
                            placeholder="@usuario"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Fecha de Nacimiento</Text>
                        <TextInput
                            style={styles.input}
                            value={fechaNacimiento}
                            onChangeText={setFechaNacimiento}
                            placeholder="DD/MM/AAAA"
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.button, cargando && styles.buttonDisabled]}
                        onPress={handleGuardar}
                        disabled={cargando}
                    >
                        <Text style={styles.buttonText}>{cargando ? 'Guardando...' : 'Guardar Cambios'}</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop:20,
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
    fotoContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarWrapper: {
        position: 'relative',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    avatarPlaceholder: {
        backgroundColor: '#8B5CF6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 40,
        color: 'white',
        fontWeight: 'bold',
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#4B5563',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#F9FAFB',
    },
    cambiarFotoText: {
        marginTop: 12,
        color: '#8B5CF6',
        fontWeight: '600',
    },
    form: {
        gap: 20,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
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
        marginTop: 12,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
