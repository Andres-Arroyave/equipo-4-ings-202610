import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ROW_HEIGHT = 52;

export default function ChecklistSelectField({
  title,
  placeholder,
  values = [],
  onSelect,
  options = [],
  minSelect = 1,
  maxSelect = 5,
  hintText = 'Toca para elegir',
  marginBottom = true,
}) {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);

  const selectedLabels = values
    .map((v) => {
      const opt = options.find((o) => String(o.value) === String(v));
      return opt ? opt.label : null;
    })
    .filter(Boolean);

  const displayLine =
    selectedLabels.length > 0
      ? selectedLabels.join(', ')
      : placeholder;

  const win = Dimensions.get('window');
  const listMaxHeight = Math.min(
    (win.height - insets.top - insets.bottom) * 0.5,
    400
  );
  const cardMaxHeight = Math.min(
    (win.height - insets.top - insets.bottom) * 0.72,
    win.height - 48
  );

  const toggleItem = (itemValue) => {
    const strValue = String(itemValue);
    const current = values.map((v) => String(v));
    if (current.includes(strValue)) {
      onSelect(values.filter((v) => String(v) !== strValue));
    } else {
      if (values.length >= maxSelect) return;
      onSelect([...values, itemValue]);
    }
  };

  const isSelected = (itemValue) =>
    values.some((v) => String(v) === String(itemValue));

  return (
    <View style={[styles.wrap, !marginBottom && styles.wrapNoMargin]}>
      <Text style={styles.fieldLabel}>{title}</Text>

      <Pressable
        onPress={() => setModalVisible(true)}
        style={({ pressed }) => [styles.trigger, pressed && styles.triggerPressed]}
        accessibilityRole="button"
        accessibilityLabel={`${title}, ${displayLine}`}
      >
        <View style={styles.triggerTextCol}>
          <Text
            style={[styles.triggerMain, selectedLabels.length === 0 && styles.triggerPlaceholder]}
            numberOfLines={2}
          >
            {displayLine}
          </Text>
          <Text style={styles.triggerHint}>{hintText}</Text>
        </View>
        <Text style={styles.triggerChevron}>▾</Text>
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalRoot} pointerEvents="box-none">
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setModalVisible(false)}
            accessibilityLabel="Cerrar"
          />
          <View
            style={[
              styles.modalCard,
              {
                maxHeight: cardMaxHeight,
                marginBottom: Math.max(insets.bottom, 12),
              },
            ]}
          >
            <Text style={styles.modalTitle}>{title}</Text>

            <View style={styles.counterRow}>
              <Text style={styles.counterText}>
                {values.length}/{maxSelect} seleccionadas
              </Text>
              {values.length < minSelect && (
                <Text style={styles.counterHint}>
                  Mínimo {minSelect}
                </Text>
              )}
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => String(item.value)}
              style={{ maxHeight: listMaxHeight }}
              showsVerticalScrollIndicator
              renderItem={({ item }) => {
                const selected = isSelected(item.value);
                const atMax = values.length >= maxSelect && !selected;
                return (
                  <Pressable
                    onPress={() => {
                      if (atMax) return;
                      toggleItem(item.value);
                    }}
                    style={[
                      styles.modalRow,
                      selected && styles.modalRowSelected,
                      atMax && styles.modalRowDisabled,
                    ]}
                  >
                    <View style={styles.checkbox}>
                      {selected && (
                        <Ionicons name="checkmark" size={18} color="#064e3b" />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.modalRowText,
                        selected && styles.modalRowTextSelected,
                        atMax && styles.modalRowTextDisabled,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              }}
            />

            <Pressable
              style={[
                styles.confirmBtn,
                values.length < minSelect && styles.confirmBtnDisabled,
              ]}
              onPress={() => {
                if (values.length >= minSelect) {
                  setModalVisible(false);
                }
              }}
            >
              <Text
                style={[
                  styles.confirmBtnText,
                  values.length < minSelect && styles.confirmBtnTextDisabled,
                ]}
              >
                {values.length < minSelect
                  ? `Selecciona al menos ${minSelect}`
                  : 'Confirmar'}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 4,
  },
  wrapNoMargin: {
    marginBottom: 0,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginLeft: 4,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 52,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(6, 95, 70, 0.14)',
    backgroundColor: '#f0fdf4',
    shadowColor: '#064e3b',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  triggerPressed: {
    opacity: 0.92,
    backgroundColor: '#ecfdf5',
  },
  triggerTextCol: {
    flex: 1,
    marginRight: 8,
  },
  triggerMain: {
    fontSize: 17,
    fontWeight: '700',
    color: '#064e3b',
  },
  triggerPlaceholder: {
    fontWeight: '500',
    color: '#9ca3af',
  },
  triggerHint: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  triggerChevron: {
    fontSize: 16,
    color: '#047857',
    paddingHorizontal: 4,
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.48)',
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    zIndex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingTop: 16,
    paddingHorizontal: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  counterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#047857',
  },
  counterHint: {
    fontSize: 12,
    color: '#dc2626',
  },
  modalRow: {
    height: ROW_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 10,
    marginVertical: 2,
  },
  modalRowSelected: {
    backgroundColor: '#ecfdf5',
  },
  modalRowDisabled: {
    opacity: 0.4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#ffffff',
  },
  modalRowText: {
    fontSize: 17,
    color: '#374151',
    flex: 1,
  },
  modalRowTextSelected: {
    fontWeight: '700',
    color: '#064e3b',
  },
  modalRowTextDisabled: {
    color: '#9ca3af',
  },
  confirmBtn: {
    marginTop: 12,
    marginBottom: 6,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#064e3b',
    borderRadius: 12,
  },
  confirmBtnDisabled: {
    backgroundColor: '#d1d5db',
  },
  confirmBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  confirmBtnTextDisabled: {
    color: '#9ca3af',
  },
});
