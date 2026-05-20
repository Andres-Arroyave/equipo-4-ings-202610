// src/services/vendorService.js

// Usando la misma convención de host que authService
export const API_URL = 'https://equipo-4-ings-202610-production.up.railway.app/api/vendedores';
const AUTH_API_URL = 'https://equipo-4-ings-202610-production.up.railway.app/api/auth/vendedor';

export const getRecomendados = async () => {
    try {
        const response = await fetch(`${API_URL}/recomendados`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error("No se pudieron cargar los vendedores recomendados");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
};

export const getAllVendedores = async () => {
    try {
        const response = await fetch(`${API_URL}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error("No se pudieron cargar los vendedores");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
};

export const buscarVendedores = async (nombre) => {
    try {
        const response = await fetch(`${API_URL}/buscar?nombre=${encodeURIComponent(nombre)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error("No se pudo realizar la búsqueda");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
};

export const crearProducto = async (idUser, idCatalogo, productData) => {
    try {
        const response = await fetch(`${AUTH_API_URL}/${idUser}/catalogos/${idCatalogo}/productos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
        });
        const responseText = await response.text();
        if (!response.ok) {
            throw new Error(responseText || "No se pudo crear el producto");
        }
        return JSON.parse(responseText);
    } catch (error) {
        throw error;
    }
};

export const actualizarProducto = async (idUser, idProducto, productData) => {
    try {
        const response = await fetch(`${AUTH_API_URL}/${idUser}/productos/${idProducto}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
        });
        const responseText = await response.text();
        if (!response.ok) {
            throw new Error(responseText || "No se pudo actualizar el producto");
        }
        return JSON.parse(responseText);
    } catch (error) {
        throw error;
    }
};

export const eliminarProducto = async (idUser, idProducto) => {
    try {
        const response = await fetch(`${AUTH_API_URL}/${idUser}/productos/${idProducto}`, {
            method: 'DELETE',
        });
        const responseText = await response.text();
        if (!response.ok) {
            throw new Error(responseText || "No se pudo eliminar el producto");
        }
        return responseText;
    } catch (error) {
        throw error;
    }
};

export const crearCatalogo = async (idUser, nombreCatalogo) => {
    try {
        const response = await fetch(`${AUTH_API_URL}/${idUser}/catalogos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombreCatalogo }),
        });
        const responseText = await response.text();
        if (!response.ok) {
            throw new Error(responseText || "No se pudo crear el catálogo");
        }
        return JSON.parse(responseText);
    } catch (error) {
        throw error;
    }
};
