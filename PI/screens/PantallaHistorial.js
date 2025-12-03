import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUsuarioActual } from '../utils/Session';
import { obtenerHistorial } from '../database/Database';

export default function PantallaHistorial({ navigation }) {
    const [historial, setHistorial] = useState([]);
    const usuario = getUsuarioActual();

    useEffect(() => {
        cargarHistorial();
    }, []);

    const cargarHistorial = async () => {
        if (usuario) {
            const datos = await obtenerHistorial(usuario.id);
            setHistorial(datos);
        }
    };

    const formatearFecha = (fechaISO) => {
        const fecha = new Date(fechaISO);
        return fecha.toLocaleDateString() + ' ' + fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getIconoAccion = (accion) => {
        switch (accion) {
            case 'Guardar Materia': return 'bookmark';
            case 'Inscripción': return 'school';
            case 'Actualizar Perfil': return 'person';
            case 'Login': return 'log-in';
            default: return 'time';
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <View style={styles.iconContainer}>
                <Ionicons name={getIconoAccion(item.accion)} size={20} color="#8B5CF6" />
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.accion}>{item.accion}</Text>
                <Text style={styles.detalle}>{item.detalle}</Text>
                <Text style={styles.fecha}>{formatearFecha(item.fecha)}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Historial de Actividad</Text>
            </View>

            <FlatList
                data={historial}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="time-outline" size={64} color="#D1D5DB" />
                        <Text style={styles.emptyText}>No hay actividad reciente</Text>
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
    item: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    contentContainer: {
        flex: 1,
    },
    accion: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 2,
    },
    detalle: {
        fontSize: 14,
        color: '#4B5563',
        marginBottom: 4,
    },
    fecha: {
        fontSize: 12,
        color: '#9CA3AF',
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
