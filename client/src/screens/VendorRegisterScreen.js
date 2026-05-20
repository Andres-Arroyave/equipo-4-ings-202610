import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import BoxSha from '../Components/BoxSha';
import ScreenLayout from '../Components/ScreenLayout';
import BackButton from '../Components/BackButton';
import { validateVendorBasicForm } from '../utils/validators';

const VendorRegisterScreen = ({ navigation }) => {
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [password, setPassword] = useState('');

  const showAlert = (title, message, onOk) => {
    
    if (Platform.OS === 'web') {
      alert(`${title}: ${message}`);
      if (onOk) onOk();
    } else {
      Alert.alert(title, message, onOk ? [{ text: "OK", onPress: onOk }] : [{ text: "OK" }]);
    }
  };

  const handleNextStep = () => {
    
    const b = businessName.trim();
    const o = ownerName.trim();
    const e = email.trim();
    const t = telephone.trim();
    const p = password.trim();

    const errors = validateVendorBasicForm(b, o, e, t, p);

    if (errors.length > 0) {
      showAlert("Campos incorrectos", errors.join("\n"));
      return;
    }

    navigation.navigate('VendorDetails', {
      initialData: { b, o, e, t, p }
    });
  };

  return (

    <ScreenLayout scrollStyle={styles.scroll}>
      <BackButton navigation={navigation} />

      <View style={styles.formContainer}>

        <BoxSha>
          <Text style={styles.title}>Registra tu negocio</Text>
          <Text style={styles.infoText}>Paso 1 de 2: Información básica</Text>

          <Text style={styles.label}>Nombre del negocio</Text>
          <TextInput
            style={styles.input}
            placeholder="Dulces UPB"
            placeholderTextColor="#9ca3af"
            value={businessName}
            onChangeText={setBusinessName}
            autoCapitalize="words"
          />
          <Text style={styles.label}>Nombre del propietario</Text>
          <TextInput
            style={styles.input}
            placeholder="Juan Pérez"
            placeholderTextColor="#9ca3af"
            value={ownerName}
            onChangeText={setOwnerName}
            autoCapitalize="words"
          />
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="dulcesupb@mail.com"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Text style={styles.label}>Número de Teléfono</Text>
          <TextInput
            style={styles.input}
            placeholder="3001234567"
            placeholderTextColor="#9ca3af"
            value={telephone}
            onChangeText={setTelephone}
            keyboardType="phone-pad"
          />
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Pepito123."
            placeholderTextColor="#9ca3af"
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            secureTextEntry
          />

          <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
            <Text style={styles.nextButtonText}>Continuar</Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>¿Ya tienes una cuenta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Iniciar Sesión</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.clientContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('ClientRegister')}>
              <Text style={styles.clientLink}>¿Eres cliente?</Text>
            </TouchableOpacity>
          </View>

        </BoxSha>

      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#064e3b', // darker green
    marginBottom: 8,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    marginTop: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
    marginLeft: 4
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 13,
    borderWidth: 0.5,
    borderColor: '#e5e7eb',
    shadowColor: 'rgba(6, 78, 59, 0.5)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  nextButton: {
    backgroundColor: '#064e3b', // green for vendors
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: 'rgba(6, 78, 59, 0.5)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    marginTop: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    color: '#6b7280',
    fontSize: 14,
    marginRight: 8,

  },
  loginLink: {
    color: '#064e3b',
    fontSize: 15,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 15,
    width: '100%',
  },
  clientContainer: {
    alignItems: 'center',
  },
  clientLink: {
    fontSize: 15,
    color: '#064e3b',
    fontWeight: '600',
  }
});

export default VendorRegisterScreen;
