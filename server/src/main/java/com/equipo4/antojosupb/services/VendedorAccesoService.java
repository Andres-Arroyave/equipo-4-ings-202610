package com.equipo4.antojosupb.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.equipo4.antojosupb.entities.Catalogo;
import com.equipo4.antojosupb.entities.Productos;
import com.equipo4.antojosupb.entities.Usuario;
import com.equipo4.antojosupb.entities.Vendedor;
import com.equipo4.antojosupb.repository.UsuarioRepository;
import com.equipo4.antojosupb.repository.VendedorRepository;

@Service
public class VendedorAccesoService {

    private static final int ROL_VENDEDOR = 1;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private VendedorRepository vendedorRepository;

    /**
     * Resuelve el perfil de vendedor asociado al usuario (mismo criterio que horarios).
     */
    public Vendedor requerirVendedor(int idUser) {
        return requerirVendedor(idUser, "Solo los vendedores pueden realizar esta acción.");
    }

    public Vendedor requerirVendedor(int idUser, String mensajeSiNoEsVendedor) {
        Usuario usuario = usuarioRepository.findById(idUser)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado."));
        if (usuario.getRol().getIdRol() != ROL_VENDEDOR) {
            throw new IllegalArgumentException(mensajeSiNoEsVendedor);
        }
        return vendedorRepository.findByUsuarioIdUser(idUser)
                .orElseThrow(() -> new IllegalArgumentException("No se encontró el perfil de vendedor."));
    }

    public void asegurarCatalogoPerteneceAVendedor(Catalogo catalogo, Vendedor vendedor) {
        if (catalogo.getVendedor().getIdVendedor() != vendedor.getIdVendedor()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tiene permiso para modificar este catálogo.");
        }
    }

    public void asegurarProductoPerteneceAVendedor(Productos producto, Vendedor vendedor) {
        if (producto.getCatalogo().getVendedor().getIdVendedor() != vendedor.getIdVendedor()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tiene permiso para modificar este producto.");
        }
    }
}
