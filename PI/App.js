import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import NavegacionAuth from './navigation/NavegacionAuth';

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <NavegacionAuth />
    </NavigationContainer>
  );
}
