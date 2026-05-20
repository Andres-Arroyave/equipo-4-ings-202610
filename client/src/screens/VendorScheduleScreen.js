import React, { useCallback, useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import ScreenLayout from '../Components/ScreenLayout';
import BackButton from '../Components/BackButton';
import {
  fetchVendorWeeklySchedule,
  saveVendorWeeklySchedule,
} from '../services/scheduleService';

import {
  normalizeTime,
  parseTimeToMinutes,
  validateVendorSchedule,
} from '../utils/validators';

function minutesToStr(mins) {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** Intervalos de 15 min desde start (inclusive) hasta endExclusive (exclusivo). */
function buildQuarterSlots(startMins, endExclusive) {
  const out = [];
  for (let m = startMins; m < endExclusive; m += 15) {
    out.push(minutesToStr(m));
  }
  return out;
}

/** Mañana: 6:00–11:45. Tarde: 12:00–20:00 (máx. 8 p. m.). */
const MIN_MINUTOS = 6 * 60;
const MAX_MINUTOS = 20 * 60;
const SLOTS_MANANA = buildQuarterSlots(6 * 60, 12 * 60);
const SLOTS_TARDE = buildQuarterSlots(12 * 60, 20 * 60 + 15);

/** Ajusta a la rejilla de 15 min y acota entre 6:00 y 20:00. */
function snapToQuarterSlot(hhmm) {
  const raw = parseTimeToMinutes(normalizeTime(hhmm));
  if (raw == null) return '09:00';
  const rounded = Math.round(raw / 15) * 15;
  const clamped = Math.max(MIN_MINUTOS, Math.min(MAX_MINUTOS, rounded));
  return minutesToStr(clamped);
}

function isMananaTime(hhmm) {
  const m = parseTimeToMinutes(normalizeTime(hhmm));
  return m != null && m < 12 * 60;
}

const MODAL_ROW_HEIGHT = 48;

/**
 * Elige mañana (6:00–11:45) o tarde (12:00–20:00) en pasos de 15 min.
 * Lista en modal con altura acotada (no ocupa toda la pantalla).
 */
function PeriodTimePicker({ label, value, onChange, defaultIfSwitch }) {
  const insets = useSafeAreaInsets();
  const listRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);

  const normalized = snapToQuarterSlot(value || defaultIfSwitch);
  const enManana = isMananaTime(normalized);
  const slots = enManana ? SLOTS_MANANA : SLOTS_TARDE;
  const selected = slots.includes(normalized) ? normalized : slots[0];
  const selectedIndex = Math.max(0, slots.indexOf(selected));

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
    if (!modalVisible || slots.length === 0) return;
    const idx = Math.min(selectedIndex, slots.length - 1);
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
  }, [modalVisible, selectedIndex, slots.length]);

  useEffect(() => {
    setModalVisible(false);
  }, [enManana]);

  return (
    <View style={periodStyles.wrap}>
      <Text style={periodStyles.fieldLabel}>{label}</Text>
      <View style={periodStyles.chips}>
        <Pressable
          onPress={() => {
            if (!enManana) onChange(snapToQuarterSlot('09:00'));
          }}
          style={({ pressed }) => [
            periodStyles.chip,
            enManana && periodStyles.chipActive,
            pressed && periodStyles.chipPressed,
          ]}
        >
          <Text style={[periodStyles.chipText, enManana && periodStyles.chipTextActive]}>
            Mañana
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            if (enManana) onChange(snapToQuarterSlot('12:00'));
          }}
          style={({ pressed }) => [
            periodStyles.chip,
            !enManana && periodStyles.chipActive,
            pressed && periodStyles.chipPressed,
          ]}
        >
          <Text style={[periodStyles.chipText, !enManana && periodStyles.chipTextActive]}>
            Tarde
          </Text>
        </Pressable>
      </View>

      <Pressable
        onPress={() => setModalVisible(true)}
        style={({ pressed }) => [
          periodStyles.trigger,
          pressed && periodStyles.triggerPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`${label}, hora ${selected}`}
      >
        <View style={periodStyles.triggerTextCol}>
          <Text style={periodStyles.triggerTime}>{selected}</Text>
          <Text style={periodStyles.triggerHint}>Toca para elegir hora</Text>
        </View>
        <Text style={periodStyles.triggerChevron}>▾</Text>
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={periodStyles.modalRoot} pointerEvents="box-none">
          <Pressable
            style={periodStyles.modalBackdrop}
            onPress={() => setModalVisible(false)}
            accessibilityLabel="Cerrar"
          />
          <View
            style={[
              periodStyles.modalCard,
              {
                maxHeight: cardMaxHeight,
                marginBottom: Math.max(insets.bottom, 12),
              },
            ]}
          >
            <Text style={periodStyles.modalTitle}>{label}</Text>
            <FlatList
              ref={listRef}
              data={slots}
              keyExtractor={(item) => item}
              style={{ maxHeight: listMaxHeight }}
              showsVerticalScrollIndicator
              getItemLayout={(_, index) => ({
                length: MODAL_ROW_HEIGHT,
                offset: MODAL_ROW_HEIGHT * index,
                index,
              })}
              onScrollToIndexFailed={({ index }) => {
                requestAnimationFrame(() => {
                  try {
                    listRef.current?.scrollToOffset({
                      offset: MODAL_ROW_HEIGHT * index,
                      animated: false,
                    });
                  } catch {
                    /* ignore */
                  }
                });
              }}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onChange(item);
                    setModalVisible(false);
                  }}
                  style={[
                    periodStyles.modalRow,
                    item === selected && periodStyles.modalRowSelected,
                  ]}
                >
                  <Text
                    style={[
                      periodStyles.modalRowText,
                      item === selected && periodStyles.modalRowTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              )}
            />
            <Pressable
              style={periodStyles.modalCloseBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={periodStyles.modalCloseText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const VendorScheduleScreen = ({ user }) => {
  const navigation = useNavigation();
  const [dias, setDias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const showAlert = (title, message) => {
    if (Platform.OS === 'web') {
      alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const load = useCallback(async () => {
    if (!user?.idUser) return;
    setLoading(true);
    try {
      const data = await fetchVendorWeeklySchedule(user.idUser);
      setDias(
        data.map((d) => ({
          idDia: Number(d.idDia),
          nombreDia: d.nombreDia,
          activo: !!d.activo,
          horaInicio: snapToQuarterSlot(d.horaInicio || '09:00'),
          horaFin: snapToQuarterSlot(d.horaFin || '18:00'),
        }))
      );
    } catch (e) {
      showAlert('Error', e.message || 'No se pudo cargar el horario');
      setDias([]);
    } finally {
      setLoading(false);
    }
  }, [user?.idUser]);

  useEffect(() => {
    load();
  }, [load]);

  const updateDia = (idDia, patch) => {
    const id = Number(idDia);
    setDias((prev) =>
      prev.map((d) => (Number(d.idDia) === id ? { ...d, ...patch } : d))
    );
  };


  const handleSave = async () => {
    if (!user?.idUser) return;
    const errorMsg = validateVendorSchedule(dias);
    if (errorMsg) {
      showAlert('Validación', errorMsg);
      return;
    }

    setSaving(true);
    try {
      const payload = dias.map((d) => ({
        idDia: d.idDia,
        activo: d.activo,
        horaInicio: d.activo ? normalizeTime(d.horaInicio) : null,
        horaFin: d.activo ? normalizeTime(d.horaFin) : null,
      }));
      await saveVendorWeeklySchedule(user.idUser, payload);
      showAlert('Guardado', 'Tu horario de disponibilidad se actualizó correctamente.');
    } catch (e) {
      showAlert('No se pudo guardar', e.message || 'Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ScreenLayout scrollStyle={styles.scroll}>
        <BackButton navigation={navigation} />
        <Text style={styles.screenTitle}>Horario de disponibilidad</Text>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#064e3b" />
          <Text style={styles.loadingText}>Cargando horario…</Text>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout scrollStyle={styles.scroll}>
      <BackButton navigation={navigation} />
      <Text style={styles.screenTitle}>Horario de disponibilidad</Text>
      <Text style={styles.hint}>
        Toca el interruptor para marcar si atiendes ese día. Mañana de 6:00 a 11:45; tarde de
        12:00 a 20:00 como máximo. Horas en intervalos de 15 minutos.
      </Text>
      {dias.map((d) => (
        <View key={d.idDia} style={styles.card}>
          <View style={styles.rowTop}>
            <Text style={styles.dayName}>{d.nombreDia}</Text>
            <Pressable
              accessibilityRole="switch"
              accessibilityState={{ checked: d.activo }}
              onPress={() => updateDia(d.idDia, { activo: !d.activo })}
              style={({ pressed }) => [
                styles.toggleTrack,
                d.activo && styles.toggleTrackOn,
                pressed && styles.togglePressed,
              ]}
            >
              <View
                style={[
                  styles.toggleKnob,
                  d.activo ? styles.toggleKnobOn : styles.toggleKnobOff,
                ]}
              />
            </Pressable>
          </View>
          {d.activo ? (
            <View style={styles.timesColumn}>
              <PeriodTimePicker
                label="Hora de inicio"
                value={d.horaInicio}
                defaultIfSwitch="09:00"
                onChange={(t) =>
                  updateDia(d.idDia, { horaInicio: snapToQuarterSlot(t) })
                }
              />
              <PeriodTimePicker
                label="Hora de fin"
                value={d.horaFin}
                defaultIfSwitch="18:00"
                onChange={(t) =>
                  updateDia(d.idDia, { horaFin: snapToQuarterSlot(t) })
                }
              />
            </View>
          ) : (
            <Text style={styles.closed}>Cerrado</Text>
          )}
        </View>
      ))}

      <TouchableOpacity
        style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
        onPress={handleSave}
        disabled={saving || dias.length === 0}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveBtnText}>Guardar horario</Text>
        )}
      </TouchableOpacity>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#064e3b',
    marginBottom: 16,
  },
  centered: {
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    color: '#6b7280',
  },
  hint: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 16,
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleTrack: {
    width: 52,
    height: 32,
    borderRadius: 15,
    backgroundColor: '#d1d5db',
    padding: 3,
    justifyContent: 'center',
  },
  toggleTrackOn: {
    backgroundColor: '#86efac',
  },
  togglePressed: {
    opacity: 0.85,
  },
  toggleKnob: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#ffffff',
  },
  toggleKnobOff: {
    alignSelf: 'flex-start',
  },
  toggleKnobOn: {
    alignSelf: 'flex-end',
    backgroundColor: '#064e3b',
  },
  dayName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
  },
  timesColumn: {
    marginTop: 8,
  },
  closed: {
    marginTop: 8,
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  saveBtn: {
    backgroundColor: '#064e3b',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnDisabled: {
    opacity: 0.7,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

const periodStyles = StyleSheet.create({
  wrap: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 8,
  },
  chips: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  chipActive: {
    backgroundColor: '#064e3b',
    borderColor: '#064e3b',
  },
  chipPressed: {
    opacity: 0.85,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
  },
  chipTextActive: {
    color: '#ffffff',
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
  },
  triggerTime: {
    fontSize: 18,
    fontWeight: '700',
    color: '#064e3b',
  },
  triggerHint: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  triggerChevron: {
    fontSize: 16,
    color: '#047857',
    marginLeft: 8,
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
    height: MODAL_ROW_HEIGHT,
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

export default VendorScheduleScreen;
