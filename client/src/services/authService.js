/**
 * URL base apuntando al controlador de autenticación del Backend de Spring Boot.
 * NOTA: En ambiente local (emuladores u otros dispositivos en red), debes cambiar 
 * 'localhost' por la dirección IP de tu máquina (ej. http://192.168.x.x:8080/...).
 */
export const API_URL = 'https://equipo-4-ings-202610-production.up.railway.app/api/auth';


/**
 * Consume el endpoint /registro/cliente para crear una cuenta de Cliente.
 * 
 * @param {Object} clientData - Payload JSON de datos del cliente.
 * @param {string} clientData.nombreClient - Nombre del cliente.
 * @param {string} clientData.email - Correo de usuario.
 * @param {string} clientData.contrasena - Clave en texto plano.
 * @param {string} clientData.telefono - Número teléfonico.
 * @returns {Promise<string>} La respuesta del backend si el registro fue exitoso (Ej: "Cliente registrado...").
 * @throws {Error} Excepción con el mensaje de error provisto por la API o un genérico si falla la red.
 */
export const registerClient = async (clientData) => {
  try {
    const response = await fetch(`${API_URL}/registro/cliente`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientData),
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(responseText || "Tuvimos un problema con el registro");
    }

    return responseText;
  } catch (error) {
    // Re-lanzar el error para que el componente lo maneje
    throw error;
  }
};

/**
 * Consume el endpoint /registro/vendedor para completar la creación de la cuenta del Negocio.
 * 
 * @param {Object} vendorData - Payload JSON ensamblando los datos básicos y los detalles del local.
 * @param {string} vendorData.nombreNegocio - Nombre público del negocio.
 * @param {string} vendorData.nombrePropietario - Nombre del dueño.
 * @param {string} vendorData.email - Correo del negocio/dueño.
 * @param {string} vendorData.contrasena - Contraseña para la plataforma.
 * @param {string} vendorData.telefono - Número de teléfono.
 * @param {string} vendorData.descripcionNeg - Descripción de lo que se vende.
 * @param {string|number} vendorData.idCategoriaV - Identificador numérico de la categoría.
 * @param {string} vendorData.whatsAppLink - Link de whatsapp del vendedor.
 * @returns {Promise<string>} Mensaje del servidor indicando éxito.
 * @throws {Error} Excepción lanzada si el servidor no devuelve status OK (Ej. Email ya uso).
 */
export const registerVendor = async (vendorData) => {
  try {
    const response = await fetch(`${API_URL}/registro/vendedor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vendorData),
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(responseText || "Tuvimos un problema con el registro");
    }

    return responseText;
  } catch (error) {
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, contrasena: password }),
    });

    if (!response.ok) {
      const responseText = await response.text();
      throw new Error(responseText || "Credenciales inválidas");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
