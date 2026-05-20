import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ROW_HEIGHT = 52;

/**
 * Selector tipo lista en modal (mismo patrón visual que el horario del vendedor).
 *
 * @param {string} title - Título del campo (también se usa como encabezado del modal).
 * @param {string} placeholder - Texto cuando no hay valor.
 * @param {string | number} value - Valor seleccionado ('' si ninguno).
 * @param {(v: string | number) => void} onSelect
 * @param {{ value: string | number, label: string }[]} options
 * @param {string} [hintText='Toca para elegir'] - Subtexto del trigger.
 * @param {boolean} [marginBottom=true]
 */
export default function ModalSelectField({
  title,
  placeholder,
  value,
  onSelect,
  options,
  hintText = 'Toca para elegir',
  marginBottom = true,
}) {
  const insets = useSafeAreaInsets();
  const listRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);

  const selectedLabel =
    options.find(
      (o) => String(o.value) === String(value) && value !== '' && value != null
    )?.label ?? null;
  const hasValue = selectedLabel != null;
  const displayLine = hasValue ? selectedLabel : placeholder;

  const selectedIndex = Math.max(
    0,
    options.findIndex((o) => String(o.value) === String(value))
  );

  const win = Dimensions.get('window');
  const listMaxHeight = Math.min(
    (win.height - insets.top - insets.bottom) * 0.5,
    400
  );
  const cardMaxHeight = Math.min(
    (win.height - insets.top - insets.bottom) * 0.72,
    win.height - 48
  );

  useEffect(() => {
    if (!modalVisible || options.length === 0) return;
    const idx = selectedIndex >= 0 ? selectedIndex : 0;
    const id = requestAnimationFrame(() => {
      try {
        listRef.current?.scrollToIndex({
          index: idx,
          animated: false,
          viewPosition: 0.35,
        });
      } catch {
        /* lista aún sin medir */
      }
    });
    return () => cancelAnimationFrame(id);
  }, [modalVisible, selectedIndex, options.length]);

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
            style={[styles.triggerMain, !hasValue && styles.triggerPlaceholder]}
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
            <FlatList
              ref={listRef}
              data={options}
              keyExtractor={(item) => String(item.value)}
              style={{ maxHeight: listMaxHeight }}
              showsVerticalScrollIndicator
              getItemLayout={(_, index) => ({
                length: ROW_HEIGHT,
                offset: ROW_HEIGHT * index,
                index,
              })}
              onScrollToIndexFailed={({ index }) => {
                requestAnimationFrame(() => {
                  try {
                    listRef.current?.scrollToOffset({
                      offset: ROW_HEIGHT * index,
                      animated: false,
                    });
                  } catch {
                    /* ignore */
                  }
                });
              }}
              renderItem={({ item }) => {
                const selected = String(item.value) === String(value);
                return (
                  <Pressable
                    onPress={() => {
                      onSelect(item.value);
                      setModalVisible(false);
                    }}
                    style={[styles.modalRow, selected && styles.modalRowSelected]}
                  >
                    <Text
                      style={[
                        styles.modalRowText,
                        selected && styles.modalRowTextSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              }}
            />
            <Pressable
              style={styles.modalCloseBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Cerrar</Text>
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
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  modalRow: {
    height: ROW_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 10,
    marginVertical: 2,
  },
  modalRowSelected: {
    backgroundColor: '#ecfdf5',
  },
  modalRowText: {
    fontSize: 17,
    color: '#374151',
  },
  modalRowTextSelected: {
    fontWeight: '700',
    color: '#064e3b',
  },
  modalCloseBtn: {
    marginTop: 10,
    marginBottom: 6,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#047857',
  },
});
