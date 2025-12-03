import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUsuarioActual } from '../utils/Session';
import { obtenerMateriasGuardadas, eliminarMateriaGuardada } from '../database/Database';

export default function PantallaMateriasGuardadas({ navigation }) {
    const [materias, setMaterias] = useState([]);
    const usuario = getUsuarioActual();

    useEffect(() => {
        cargarMaterias();
    }, []);

    const cargarMaterias = async () => {
        if (usuario) {
            const datos = await obtenerMateriasGuardadas(usuario.id);
            setMaterias(datos);
        }
    };

    const handleEliminar = (tutoriaId) => {
        Alert.alert(
            "Eliminar",
            "¿Deseas eliminar esta materia de tus guardados?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        await eliminarMateriaGuardada(usuario.id, tutoriaId);
                        cargarMaterias();
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('PerfilTutor', { tutoria: item })}
        >
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Text style={styles.materia}>{item.materia}</Text>
                    <TouchableOpacity onPress={() => handleEliminar(item.id)}>
                        <Ionicons name="bookmark" size={24} color="#8B5CF6" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.tutor}>Tutor: {item.tutorNombre}</Text>
                <Text style={styles.precio}>{item.precio}</Text>
                <View style={styles.footer}>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{item.modalidad}</Text>
                    </View>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{item.nivel}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Materias Guardadas</Text>
            </View>

            <FlatList
                data={materias}
                renderItem={renderItem}
                keyExtractor={(item) => item.guardadoId.toString()}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="bookmark-outline" size={64} color="#D1D5DB" />
                        <Text style={styles.emptyText}>No tienes materias guardadas</Text>
                    </View>
                }
            />
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
    listContainer: {
        padding: 16,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    materia: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        flex: 1,
    },
    tutor: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 4,
    },
    precio: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#8B5CF6',
        marginBottom: 12,
    },
    footer: {
        flexDirection: 'row',
        gap: 8,
    },
    badge: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    badgeText: {
        fontSize: 12,
        color: '#4B5563',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 64,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: '#9CA3AF',
    },
});
