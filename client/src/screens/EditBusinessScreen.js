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
import ChecklistSelectField from '../Components/ChecklistSelectField';
import { getPerfilVendedor, actualizarIdentidadNegocio, getCategorias } from '../services/profileService';
import { validateBusinessIdentityForm } from '../utils/validators';

const EditBusinessScreen = ({ user }) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    nombreNegocio: '',
    descripcionNeg: '',
    idCategoriasV: []
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [vendedorData, categoriesData] = await Promise.all([
        getPerfilVendedor(user.idUser),
        getCategorias()
      ]);
      
      setCategories(categoriesData.map(c => ({ value: c.idCategoriaV, label: c.nombreCategoria })));

      
      setForm({
        nombreNegocio: vendedorData.nombreNegocio || '',
        descripcionNeg: vendedorData.descripcionNeg || '',
        idCategoriasV: vendedorData.categorias?.map(c => c.idCategoriaV) || []
      });
    } catch (error) {
      showAlert('Error', 'No se pudo cargar la información');
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
    const errors = validateBusinessIdentityForm(form);
    if (errors.length > 0) {
      showAlert('Validación', errors.join('\n'));
      return;
    }

    setSaving(true);
    try {
      await actualizarIdentidadNegocio(user.idUser, form);
      showAlert('Éxito', 'Identidad del negocio actualizada correctamente', () => {
        navigation.goBack();
      });
    } catch (error) {
      showAlert('Aviso', error.message);
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <ScreenLayout>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#064e3b" />
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout scrollStyle={styles.scrollContent}>
      <BackButton navigation={navigation} />
      <View style={styles.header}>
        <Text style={styles.title}>Identidad del Negocio</Text>
        <Text style={styles.subtitle}>Configura cómo se presenta tu emprendimiento a los clientes</Text>
      </View>

      <BoxSha>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nombre del Negocio *</Text>
          <TextInput
            style={styles.input}
            value={form.nombreNegocio}
            onChangeText={(val) => setForm({ ...form, nombreNegocio: val })}
            placeholder="Ej: Antojos UPB"
          />
        </View>

        <View style={styles.formGroup}>
          <ChecklistSelectField
            title="Categorías del negocio"
            placeholder="Selecciona categorías (1-5)"
            hintText="Toca para elegir categorías"
            values={form.idCategoriasV}
            onSelect={(val) => setForm({ ...form, idCategoriasV: val })}
            options={categories}
            minSelect={1}
            maxSelect={5}
            marginBottom={true}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Presentación del Emprendimiento *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.descripcionNeg}
            onChangeText={(val) => setForm({ ...form, descripcionNeg: val })}
            placeholder="Describe tu historia o lo que hace especial a tu negocio..."
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>


        <TouchableOpacity
          style={[styles.saveButton, saving && styles.disabledButton]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Actualizar Identidad</Text>
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
    color: '#064e3b',
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
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    minHeight: 120,
  },
  saveButton: {
    backgroundColor: '#064e3b',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#064e3b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#6ee7b7',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default EditBusinessScreen;
