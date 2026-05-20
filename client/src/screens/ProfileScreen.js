import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenLayout from '../Components/ScreenLayout';
import { ROL_VENDEDOR } from '../services/scheduleService';

const ProfileScreen = ({ onLogout, user }) => {
  const navigation = useNavigation();
  const showAlert = (title, message, onOk) => {
    if (Platform.OS === 'web') {
      alert(`${title}: ${message}`);
      if (onOk) onOk();
    } else {
      Alert.alert(title, message, onOk ? [{ text: "OK", onPress: onOk }] : [{ text: "OK" }]);
    }
  };

  const handleLogout = () => {
    showAlert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      () => {
        onLogout();
      }
    );
  };

  const esVendedor = Number(user?.idRol) === ROL_VENDEDOR;

  return (
    <ScreenLayout>
      <View style={styles.container}>
        {user?.nombre ? (
          <Text style={styles.greeting}>Hola, {user.nombre}</Text>
        ) : null}
        {user?.email ? (
          <Text style={styles.emailLine}>{user.email}</Text>
        ) : null}

        {esVendedor ? (
          <>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => navigation.navigate('EditBusiness')}
            >
              <Text style={styles.menuButtonText}>Identidad del negocio</Text>
              <Text style={styles.menuSub}>Personaliza tu historia y nombre</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.scheduleButton}
              onPress={() => navigation.navigate('VendorSchedule')}
            >
              <Text style={styles.scheduleButtonText}>Horario de disponibilidad</Text>
              <Text style={styles.scheduleSub}>Configura tu semana de atención</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => navigation.navigate('EditContact')}
            >
              <Text style={styles.contactButtonText}>Información de contacto</Text>
              <Text style={styles.contactSub}>Teléfono, WhatsApp y redes sociales</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate('EditContact')}
          >
            <Text style={styles.menuButtonText}>Editar perfil</Text>
            <Text style={styles.menuSub}>Nombre y teléfono</Text>
          </TouchableOpacity>
        )}


        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
  },
  emailLine: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  scheduleButton: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#ecfdf5',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  scheduleButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#064e3b',
  },
  scheduleSub: {
    fontSize: 13,
    color: '#047857',
    marginTop: 4,
  },
  menuButton: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#eff6ff',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  menuButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1e3a8a',
  },
  menuSub: {
    fontSize: 13,
    color: '#1d4ed8',
    marginTop: 4,
  },
  contactButton: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#fff7ed',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#ffedd5',
  },
  contactButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#7c2d12',
  },
  contactSub: {
    fontSize: 13,
    color: '#9a3412',
    marginTop: 4,
  },
  comingSoon: {
    fontSize: 18,
    color: '#9ca3af',
    marginBottom: 30,
  },
  logoutButton: {
    backgroundColor: '#C0392B',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;
