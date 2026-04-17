const BASE_URL = 'http://localhost:8080/api';

export const getVendedores = async () => {
  const response = await fetch(`${BASE_URL}/vendedores`);
  if (!response.ok) throw new Error('Error al obtener vendedores');
  return await response.json();
};

export const getCatalogoPorVendedor = async (idVendedor) => {
  const response = await fetch(`${BASE_URL}/catalogos/vendedor/${idVendedor}`);
  if (!response.ok) throw new Error('Error al obtener catálogo');
  return await response.json();
};

export const getProductosPorCatalogo = async (idCatalogo) => {
  const response = await fetch(`${BASE_URL}/productos/catalogo/${idCatalogo}`);
  if (!response.ok) throw new Error('Error al obtener productos');
  return await response.json();
};

export const getProductoPorId = async (idProducto) => {
  const response = await fetch(`${BASE_URL}/productos/${idProducto}`);
  if (!response.ok) throw new Error('Error al obtener producto');
  return await response.json();
};
