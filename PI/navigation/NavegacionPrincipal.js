import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import PantallaInicio from '../screens/PantallaInicio';
import PantallaBuscar from '../screens/PantallaBuscar';
import PantallaCalendario from '../screens/PantallaCalendario';
import PantallaPerfil from '../screens/PantallaPerfil';
import PantallaChat from '../screens/PantallaChat';
import PantallaNotificaciones from '../screens/PantallaNotificaciones';
import PantallaPublicarTutoria from '../screens/PantallaPublicarTutoria';
import PantallaPerfilTutor from '../screens/PantallaPerfilTutor';
import MisTutorias from '../screens/MisTutorias';
import PantallaEditarTutoria from '../screens/PantallaEditarTutoria';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function InicioStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="InicioPrincipal" component={PantallaInicio} />
      <Stack.Screen name="Chat" component={PantallaChat} />
      <Stack.Screen name="PerfilTutor" component={PantallaPerfilTutor} />
      <Stack.Screen name="Notificaciones" component={PantallaNotificaciones} />
    </Stack.Navigator>
  );
}

function PerfilStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PerfilPrincipal" component={PantallaPerfil} />
      <Stack.Screen name="PublicarTutoria" component={PantallaPublicarTutoria} />
      <Stack.Screen name="MisTutorias" component={MisTutorias}/>
    </Stack.Navigator>
  );
}

export default function NavegacionPrincipal() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Inicio') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Buscar') iconName = focused ? 'search' : 'search-outline';
          else if (route.name === 'Calendario') iconName = focused ? 'calendar' : 'calendar-outline';
          else if (route.name === 'Perfil') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#8B5CF6',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Inicio" component={InicioStack} />
      <Tab.Screen name="Buscar" component={PantallaBuscar} />
      <Tab.Screen name="Calendario" component={PantallaCalendario} />
      <Tab.Screen name="Perfil" component={PerfilStack} />
    </Tab.Navigator>
  );
}
