import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenLayout from '../Components/ScreenLayout';
import BoxSha from '../Components/BoxSha';
import BackButton from '../Components/BackButton';
import { getPerfilVendedor, getPerfilCliente, actualizarContacto } from '../services/profileService';
import { validateContactForm } from '../utils/validators';
import { ROL_VENDEDOR } from '../services/scheduleService';

const EditContactScreen = ({ user }) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    telefono: '',
    whatsAppLink: '',
    instagramLink: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const isVendor = Number(user?.idRol) === ROL_VENDEDOR;
      const data = isVendor ? await getPerfilVendedor(user.idUser) : await getPerfilCliente(user.idUser);
      
      setForm({
        nombre: isVendor ? (data.nombrePropietario || '') : (data.nombreClient || ''),
        telefono: data.usuario?.telefono || '',
        whatsAppLink: data.whatsAppLink || '',
        instagramLink: data.instagramLink || ''
      });
      setLoading(false);
    } catch (error) {
      showAlert('Error', 'No se pudo cargar la información de contacto');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (title, message, onOk) => {
    if (Platform.OS === 'web') {
      alert(`${title}: ${message}`);
      if (onOk) onOk();
    } else {
      Alert.alert(title, message, onOk ? [{ text: "OK", onPress: onOk }] : [{ text: "OK" }]);
    }
  };

  const handleSave = async () => {
    const errors = validateContactForm(form);
    if (errors.length > 0) {
      showAlert('Validación', errors.join('\n'));
      return;
    }

    setSaving(true);
    try {
      await actualizarContacto(user.idUser, form);
      showAlert('Éxito', 'Información de contacto actualizada correctamente', () => {
        navigation.goBack();
      });
    } catch (error) {
      showAlert('Error', error.message);
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <ScreenLayout>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#e81123" />
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout scrollStyle={styles.scrollContent}>
      <BackButton navigation={navigation} />
      <View style={styles.header}>
        <Text style={styles.title}>{Number(user?.idRol) === ROL_VENDEDOR ? 'Datos de Contacto' : 'Editar Perfil'}</Text>
        <Text style={styles.subtitle}>
          {Number(user?.idRol) === ROL_VENDEDOR 
            ? 'Actualiza cómo pueden contactarte los demás usuarios' 
            : 'Actualiza tus datos personales básicos'}
        </Text>
      </View>

      <BoxSha>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nombre *</Text>
          <TextInput
            style={styles.input}
            value={form.nombre}
            onChangeText={(val) => setForm({ ...form, nombre: val })}
            placeholder="Tu nombre completo"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Teléfono *</Text>
          <TextInput
            style={styles.input}
            value={form.telefono}
            onChangeText={(val) => setForm({ ...form, telefono: val })}
            placeholder="300 ..."
            keyboardType="phone-pad"
          />
        </View>

        {Number(user?.idRol) === ROL_VENDEDOR && (
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>WhatsApp Link *</Text>
              <TextInput
                style={styles.input}
                value={form.whatsAppLink}
                onChangeText={(val) => setForm({ ...form, whatsAppLink: val })}
                placeholder="https://wa.me/..."
                autoCapitalize="none"
                keyboardType="url"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Instagram Link</Text>
              <TextInput
                style={styles.input}
                value={form.instagramLink}
                onChangeText={(val) => setForm({ ...form, instagramLink: val })}
                placeholder="https://instagram.com/..."
                autoCapitalize="none"
                keyboardType="url"
              />
            </View>
          </>
        )}

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.disabledButton]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Guardar Cambios</Text>
          )}
        </TouchableOpacity>
      </BoxSha>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 8,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  saveButton: {
    backgroundColor: '#e81123',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#e81123',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#fca5a5',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default EditContactScreen;
