/**
 * Service for profile management
 */
const BASE_URL = 'https://equipo-4-ings-202610-production.up.railway.app/api/perfil';

export const getPerfil = async (idUser) => {
  const response = await fetch(`${BASE_URL}/${idUser}`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Error al obtener el perfil');
  }
  return await response.json();
};

export const getCategorias = async () => {
  const response = await fetch(`${BASE_URL}/categorias`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Error al obtener las categorías');
  }
  return await response.json();
};

export const getPerfilVendedor = async (idUser) => {
  const response = await fetch(`${BASE_URL}/vendedor/${idUser}`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Error al obtener el perfil del vendedor');
  }
  return await response.json();
};

export const getPerfilCliente = async (idUser) => {
  const response = await fetch(`${BASE_URL}/cliente/${idUser}`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Error al obtener el perfil del cliente');
  }
  return await response.json();
};


export const actualizarContacto = async (idUser, contactData) => {
  const response = await fetch(`${BASE_URL}/${idUser}/contacto`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(contactData),
  });
  
  const responseText = await response.text();
  if (!response.ok) {
    throw new Error(responseText || 'Error al actualizar información de contacto');
  }
  return responseText;
};

export const actualizarIdentidadNegocio = async (idUser, businessData) => {
  const response = await fetch(`${BASE_URL}/${idUser}/identidad`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(businessData),
  });
  
  const responseText = await response.text();
  if (!response.ok) {
    throw new Error(responseText || 'Error al actualizar identidad del negocio');
  }
  return responseText;
};
