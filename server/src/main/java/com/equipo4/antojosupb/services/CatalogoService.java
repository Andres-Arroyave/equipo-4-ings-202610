package com.equipo4.antojosupb.services;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.equipo4.antojosupb.dto.CatalogoRequest;
import com.equipo4.antojosupb.dto.CatalogoResponse;
import com.equipo4.antojosupb.entities.Catalogo;
import com.equipo4.antojosupb.entities.Vendedor;
import com.equipo4.antojosupb.repository.CatalogoRepository;

@Service
public class CatalogoService {

    @Autowired
    private CatalogoRepository catalogoRepository;

    @Autowired
    private VendedorAccesoService vendedorAccesoService;

    @Transactional(readOnly = true)
    public CatalogoResponse obtenerPorVendedor(int idVendedor) {
        Catalogo c = catalogoRepository.findByVendedor_IdVendedor(idVendedor)
                .orElseThrow(() -> new IllegalArgumentException("No hay catálogo para este vendedor."));
        return toResponse(c);
    }

    @Transactional(readOnly = true)
    public CatalogoResponse obtenerPorId(int idCatalogo) {
        Catalogo c = catalogoRepository.findById(idCatalogo)
                .orElseThrow(() -> new IllegalArgumentException("Catálogo no encontrado."));
        return toResponse(c);
    }

    @Transactional
    public CatalogoResponse crearCatalogo(int idUser, CatalogoRequest request) {
        if (request.getNombreCatalogo() == null || request.getNombreCatalogo().isBlank()) {
            throw new IllegalArgumentException("El nombre del catálogo es obligatorio.");
        }
        Vendedor vendedor = vendedorAccesoService.requerirVendedor(idUser);
        if (catalogoRepository.existsByVendedor_IdVendedor(vendedor.getIdVendedor())) {
            throw new IllegalArgumentException("Este vendedor ya tiene un catálogo asignado.");
        }

        Catalogo catalogo = new Catalogo();
        catalogo.setNombreCatalogo(request.getNombreCatalogo().trim());
        catalogo.setFechaCreacion(LocalDateTime.now());
        catalogo.setVendedor(vendedor);
        catalogo = catalogoRepository.save(catalogo);
        return toResponse(catalogo);
    }

    @Transactional
    public CatalogoResponse actualizarCatalogo(int idUser, int idCatalogo, String nombreCatalogo) {
        if (nombreCatalogo == null || nombreCatalogo.isBlank()) {
            throw new IllegalArgumentException("El nombre del catálogo es obligatorio.");
        }
        Vendedor vendedor = vendedorAccesoService.requerirVendedor(idUser);
        Catalogo catalogo = catalogoRepository.findById(idCatalogo)
                .orElseThrow(() -> new IllegalArgumentException("Catálogo no encontrado."));
        vendedorAccesoService.asegurarCatalogoPerteneceAVendedor(catalogo, vendedor);
        catalogo.setNombreCatalogo(nombreCatalogo.trim());
        catalogo = catalogoRepository.save(catalogo);
        return toResponse(catalogo);
    }

    private static CatalogoResponse toResponse(Catalogo c) {
        return new CatalogoResponse(
                c.getIdCatalogo(),
                c.getNombreCatalogo(),
                c.getFechaCreacion(),
                c.getVendedor().getIdVendedor());
    }
}
