import { API_URL } from './authService';

/**
 * Rol vendedor en base de datos (coincide con RegistroService / ROLUSUARIO).
 */
export const ROL_VENDEDOR = 1;

/**
 * @param {number} idUser
 * @returns {Promise<Array<{ idDia: number, nombreDia: string, activo: boolean, horaInicio: string|null, horaFin: string|null }>>}
 */
export const fetchVendorWeeklySchedule = async (idUser) => {
  const response = await fetch(`${API_URL}/vendedor/${idUser}/horarios`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(text || 'No se pudo cargar el horario');
  }
  return JSON.parse(text);
};

/**
 * @param {number} idUser
 * @param {Array<{ idDia: number, activo: boolean, horaInicio: string|null, horaFin: string|null }>} dias
 */
export const saveVendorWeeklySchedule = async (idUser, dias) => {
  const response = await fetch(`${API_URL}/vendedor/${idUser}/horarios`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(dias),
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(text || 'No se pudo guardar el horario');
  }
  return text;
};
