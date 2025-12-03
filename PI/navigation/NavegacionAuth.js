import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PantallaBienvenida from '../screens/PantallaBienvenida';
import PantallaLogin from '../screens/PantallaLogin';
import PantallaRegistro from '../screens/PantallaRegistro';
import PantallaInicio from '../screens/PantallaInicio';
import PantallaBuscar from '../screens/PantallaBuscar';
import PantallaCalendario from '../screens/PantallaCalendario';
import PantallaChat from '../screens/PantallaChat';
import PantallaNotificaciones from '../screens/PantallaNotificaciones';
import PantallaPerfil from '../screens/PantallaPerfil';
import PantallaPerfilTutor from '../screens/PantallaPerfilTutor';
import PantallaPublicarTutoria from '../screens/PantallaPublicarTutoria';
import NavegacionPrincipal from './NavegacionPrincipal';
import PantallaEditarTutoria from '../screens/PantallaEditarTutoria';


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
      <Stack.Screen name="PantallaInicio" component={PantallaInicio} />
      <Stack.Screen name="Buscar" component={PantallaBuscar} />
      <Stack.Screen name="EditarTutoria" component={PantallaEditarTutoria}/>
      <Stack.Screen name="Calendario" component={PantallaCalendario} />
      <Stack.Screen name="Chat" component={PantallaChat} />
      <Stack.Screen name="Notificaciones" component={PantallaNotificaciones} />
      <Stack.Screen name="Perfil" component={PantallaPerfil} />
      <Stack.Screen name="PerfilTutor" component={PantallaPerfilTutor} />
      <Stack.Screen name="PublicarTutoria" component={PantallaPublicarTutoria} />
    </Stack.Navigator>
  );
}
