import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = '@antojosupb_user_session';

/**
 * Persiste el usuario autenticado (respuesta del login) para restaurar la sesión al abrir la app.
 * @param {object|null} user
 */
export async function saveSession(user) {
  if (user == null) {
    await AsyncStorage.removeItem(SESSION_KEY);
    return;
  }
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

/**
 * @returns {Promise<object|null>}
 */
export async function loadSession() {
  try {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    if (raw == null || raw === '') {
      return null;
    }
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function clearSession() {
  await AsyncStorage.removeItem(SESSION_KEY);
}
