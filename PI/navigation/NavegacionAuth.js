import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PantallaBienvenida from '../screens/PantallaBienvenida';
import PantallaLogin from '../screens/PantallaLogin';
import PantallaRegistro from '../screens/PantallaRegistro';
import NavegacionPrincipal from './NavegacionPrincipal';

const Stack = createStackNavigator();

export default function NavegacionAuth() {
  return (
    <Stack.Navigator 
      initialRouteName="Bienvenida"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Bienvenida" component={PantallaBienvenida} />
      <Stack.Screen name="Login" component={PantallaLogin} />
      <Stack.Screen name="Registro" component={PantallaRegistro} />
      <Stack.Screen name="Principal" component={NavegacionPrincipal} />
    </Stack.Navigator>
  );
}
