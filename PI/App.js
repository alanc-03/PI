import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import NavegacionAuth from "./navigation/NavegacionAuth";
import { inicializarBaseDeDatos } from "./database/Database";


export default function App() {

  useEffect(() => {
    inicializarBaseDeDatos();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <NavegacionAuth />
    </NavigationContainer>
  );
}
