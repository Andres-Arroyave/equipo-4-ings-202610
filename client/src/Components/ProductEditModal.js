import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

export default function ProductEditModal({ visible, onClose, product, onSave, saving }) {
  const [nombreProd, setNombreProd] = useState('');
  const [descripcionProd, setDescripcionProd] = useState('');
  const [precio, setPrecio] = useState('');

  const maxNameLength = 20;
  const maxDescLength = 200;

  useEffect(() => {
    if (product) {
      setNombreProd(product.nombreProd || '');
      setDescripcionProd(product.descripcionProd || '');
      setPrecio(String(product.precio ?? ''));
    }
  }, [product]);

  const nombreVal = nombreProd.trim();
  const descVal = descripcionProd.trim();
  const precioVal = precio.trim();
  const precioNum = Number(precioVal);
  const isEnteroPositivo = /^\d+$/.test(precioVal) && precioNum > 0;

  const hasErrors = !nombreVal || nombreVal.length > maxNameLength || !descVal || descVal.length > maxDescLength || !isEnteroPositivo;

  const handleSave = () => {
    if (hasErrors) return;
    onSave({
      nombreProd: nombreProd.trim(),
      descripcionProd: descripcionProd.trim(),
      precio: Number(precio),
    });
  };

  if (!product) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.centered}
        >
          <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
              <Text style={styles.title}>Editar Producto</Text>

              <Text style={styles.label}>Nombre del producto *</Text>
              <TextInput
                style={styles.input}
                value={nombreProd}
                onChangeText={(t) => { if (t.length <= maxNameLength) setNombreProd(t); }}
                autoCapitalize="sentences"
              />
              <Text style={styles.charCount}>{nombreProd.length}/{maxNameLength}</Text>

              <Text style={styles.label}>Descripción *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={descripcionProd}
                onChangeText={(t) => { if (t.length <= maxDescLength) setDescripcionProd(t); }}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>{descripcionProd.length}/{maxDescLength}</Text>

              <Text style={styles.label}>Precio *</Text>
              <TextInput
                style={styles.input}
                value={precio}
                onChangeText={(t) => { if (/^\d*$/.test(t)) setPrecio(t); }}
                keyboardType="number-pad"
              />

              <TouchableOpacity
                style={[styles.saveButton, (hasErrors || saving) && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={hasErrors || saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.saveButtonText}>Guardar Cambios</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </ScrollView>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.48)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  centered: {
    width: '100%',
    maxWidth: 400,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
    maxHeight: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    marginBottom: 16,
  },
  textArea: {
    minHeight: 80,
  },
  charCount: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
    marginTop: -12,
    marginBottom: 16,
  },
  saveButton: {
    paddingVertical: 14,
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: '#064e3b',
    alignItems: 'center',
    shadowColor: '#064e3b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    backgroundColor: '#a7f3d0',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  cancelButton: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
});