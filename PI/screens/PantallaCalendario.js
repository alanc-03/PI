import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PantallaCalendario({ navigation }) {
  const [mesActual, setMesActual] = useState(new Date());
  const diasSemana = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  const generarDiasMes = () => {
    const year = mesActual.getFullYear();
    const month = mesActual.getMonth();
    const primerDia = new Date(year, month, 1);
    const ultimoDia = new Date(year, month + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    
    const dias = [];
    const diaInicio = primerDia.getDay();
    
    // Días del mes anterior
    for (let i = diaInicio - 1; i >= 0; i--) {
      const dia = new Date(year, month, -i);
      dias.push({
        dia: dia.getDate(),
        esMesActual: false,
        esHoy: false,
        tieneEvento: false
      });
    }
    
    // Días del mes actual
    const hoy = new Date();
    for (let i = 1; i <= diasEnMes; i++) {
      const tieneEvento = [5, 12, 19, 26].includes(i); // Días con eventos guardados
      dias.push({
        dia: i,
        esMesActual: true,
        esHoy: hoy.getDate() === i && hoy.getMonth() === month && hoy.getFullYear() === year,
        tieneEvento
      });
    }
    
    return dias;
  };

  const cambiarMes = (direccion) => {
    const nuevoMes = new Date(mesActual);
    nuevoMes.setMonth(mesActual.getMonth() + direccion);
    setMesActual(nuevoMes);
  };

  const formatearMes = (fecha) => {
    return fecha.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  };

  const formatearDia = (fecha) => {
    return fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const sesionesDelDia = [
    {
      id: 1,
      materia: "Cálculo Diferencial",
      tutor: "Victor Manuel",
      hora: "10:00 - 11:00 AM",
      ubicacion: "En línea",
      tipo: "online",
      color: "#8B5CF6"
    },
    {
      id: 2,
      materia: "Programación Python",
      tutor: "José María",
      hora: "2:00 - 3:30 PM",
      ubicacion: "Biblioteca Central",
      tipo: "presencial",
      color: "#10B981"
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mi Calendario</Text>
        </View>

        {/* Selector de Mes */}
        <View style={styles.monthSelector}>
          <TouchableOpacity onPress={() => cambiarMes(-1)}>
            <Ionicons name="chevron-back" size={24} color="#374151" />
          </TouchableOpacity>
          
          <Text style={styles.monthText}>
            {formatearMes(mesActual).charAt(0).toUpperCase() + formatearMes(mesActual).slice(1)}
          </Text>
          
          <TouchableOpacity onPress={() => cambiarMes(1)}>
            <Ionicons name="chevron-forward" size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Días de la semana */}
        <View style={styles.diasSemanaContainer}>
          {diasSemana.map((dia, index) => (
            <View key={index} style={styles.diaSemana}>
              <Text style={styles.diaSemanaText}>{dia}</Text>
            </View>
          ))}
        </View>

        {/* Grid de días */}
        <View style={styles.calendarioGrid}>
          {generarDiasMes().map((fecha, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.diaCelda,
                !fecha.esMesActual && styles.diaNoActual,
                fecha.esHoy && styles.diaHoy,
                fecha.tieneEvento && !fecha.esHoy && styles.diaConEvento
              ]}
            >
              <Text style={[
                styles.diaNumero,
                !fecha.esMesActual && styles.diaNumeroNoActual,
                fecha.esHoy && styles.diaNumeroHoy
              ]}>
                {fecha.dia}
              </Text>
              {fecha.tieneEvento && <View style={styles.eventoPunto} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Sesiones del día */}
        <View style={styles.sesionesSection}>
          <View style={styles.sesionesHeader}>
            <Text style={styles.sesionesTitle}>
              {formatearDia(new Date())}
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{sesionesDelDia.length} sesiones</Text>
            </View>
          </View>

          <View style={styles.sesionesList}>
            {sesionesDelDia.map((sesion) => (
              <View key={sesion.id} style={[styles.sesionCard, { borderLeftColor: sesion.color }]}>
                <View style={styles.sesionHeader}>
                  <View style={[styles.avatar, { backgroundColor: sesion.color }]}>
                    <Text style={styles.avatarText}>
                      {sesion.tutor.split(' ').map(n => n[0]).join('')}
                    </Text>
                  </View>
                  <View style={styles.sesionInfo}>
                    <Text style={styles.sesionMateria}>{sesion.materia}</Text>
                    <Text style={styles.sesionTutor}>{sesion.tutor}</Text>
                  </View>
                </View>

                <View style={styles.sesionDetalles}>
                  <View style={styles.detalleItem}>
                    <Ionicons name="time-outline" size={16} color="#6B7280" />
                    <Text style={styles.detalleText}>{sesion.hora}</Text>
                  </View>
                  <View style={styles.detalleItem}>
                    <Ionicons 
                      name={sesion.tipo === 'online' ? 'videocam-outline' : 'location-outline'} 
                      size={16} 
                      color="#6B7280" 
                    />
                    <Text style={styles.detalleText}>{sesion.ubicacion}</Text>
                  </View>
                </View>

                <TouchableOpacity style={[
                  styles.sesionButton,
                  { backgroundColor: sesion.tipo === 'online' ? sesion.color : 'transparent' }
                ]}>
                  <Text style={[
                    styles.sesionButtonText,
                    { color: sesion.tipo === 'online' ? 'white' : sesion.color }
                  ]}>
                    {sesion.tipo === 'online' ? 'Unirse' : 'Ver ubicación'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
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
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    marginTop: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  monthSelector: {
    backgroundColor: 'white',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  diasSemanaContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  diaSemana: {
    flex: 1,
    alignItems: 'center',
  },
  diaSemanaText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  calendarioGrid: {
    backgroundColor: 'white',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  diaCelda: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  diaNoActual: {
    opacity: 0.3,
  },
  diaHoy: {
    backgroundColor: '#8B5CF6',
    borderRadius: 20,
  },
  diaConEvento: {
    backgroundColor: '#EDE9FE',
  },
  diaNumero: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  diaNumeroNoActual: {
    color: '#9CA3AF',
  },
  diaNumeroHoy: {
    color: 'white',
  },
  eventoPunto: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#8B5CF6',
  },
  sesionesSection: {
    padding: 20,
  },
  sesionesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sesionesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  badge: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  sesionesList: {
    gap: 12,
  },
  sesionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
  },
  sesionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  sesionInfo: {
    flex: 1,
  },
  sesionMateria: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  sesionTutor: {
    fontSize: 14,
    color: '#6B7280',
  },
  sesionDetalles: {
    gap: 8,
    marginBottom: 12,
  },
  detalleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detalleText: {
    fontSize: 14,
    color: '#6B7280',
  },
  sesionButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  sesionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});