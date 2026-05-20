import React from 'react';
import { View, StyleSheet } from 'react-native';

const BoxSom = ({ children, style }) => {
  return (
    <View style={[styles.BoxSom, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  BoxSom: {
    backgroundColor: '#ffffff', // Fondo blanco nítido
    borderRadius: 20,          // Bordes redondeados suaves
    padding: 25,               // ¡IMPORTANTE! Espacio interno para que no choque
    // marginBottom: 20,       // Opcional, si quieres espacio después de la tarjeta
    
    // 🔥 Sombras Corregidas (sutiles y modernas, como en la imagen)
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
    
  },
});

export default BoxSom;