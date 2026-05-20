package com.equipo4.antojosupb.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.equipo4.antojosupb.dto.ProductoRequest;
import com.equipo4.antojosupb.dto.ProductoResponse;
import com.equipo4.antojosupb.entities.Catalogo;
import com.equipo4.antojosupb.entities.Productos;
import com.equipo4.antojosupb.entities.Vendedor;
import com.equipo4.antojosupb.repository.CatalogoRepository;
import com.equipo4.antojosupb.repository.ProductosRepository;

@Service
public class ProductosService {

    @Autowired
    private ProductosRepository productosRepository;

    @Autowired
    private CatalogoRepository catalogoRepository;

    @Autowired
    private VendedorAccesoService vendedorAccesoService;

    @Transactional(readOnly = true)
    public List<ProductoResponse> listarPorCatalogo(int idCatalogo) {
        if (!catalogoRepository.existsById(idCatalogo)) {
            throw new IllegalArgumentException("Catálogo no encontrado.");
        }
        return productosRepository.findByCatalogo_IdCatalogoOrderByIdProductoAsc(idCatalogo).stream()
                .map(ProductosService::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductoResponse obtenerPorId(int idProducto) {
        Productos p = productosRepository.findById(idProducto)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado."));
        return toResponse(p);
    }

    @Transactional
    public ProductoResponse crearProducto(int idUser, int idCatalogo, ProductoRequest request) {
        validarRequest(request);
        Vendedor vendedor = vendedorAccesoService.requerirVendedor(idUser);
        Catalogo catalogo = catalogoRepository.findById(idCatalogo)
                .orElseThrow(() -> new IllegalArgumentException("Catálogo no encontrado."));
        vendedorAccesoService.asegurarCatalogoPerteneceAVendedor(catalogo, vendedor);

        Productos p = new Productos();
        p.setNombreProd(request.getNombreProd().trim());
        p.setDescripcionProd(request.getDescripcionProd() != null ? request.getDescripcionProd().trim() : null);
        p.setPrecio(request.getPrecio());
        p.setCatalogo(catalogo);
        p = productosRepository.save(p);
        return toResponse(p);
    }

    @Transactional
    public ProductoResponse actualizarProducto(int idUser, int idProducto, ProductoRequest request) {
        validarRequest(request);
        Vendedor vendedor = vendedorAccesoService.requerirVendedor(idUser);
        Productos p = productosRepository.findById(idProducto)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado."));
        vendedorAccesoService.asegurarProductoPerteneceAVendedor(p, vendedor);
        p.setNombreProd(request.getNombreProd().trim());
        p.setDescripcionProd(request.getDescripcionProd() != null ? request.getDescripcionProd().trim() : null);
        p.setPrecio(request.getPrecio());
        p = productosRepository.save(p);
        return toResponse(p);
    }

    @Transactional
    public void eliminarProducto(int idUser, int idProducto) {
        Vendedor vendedor = vendedorAccesoService.requerirVendedor(idUser);
        Productos p = productosRepository.findById(idProducto)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado."));
        vendedorAccesoService.asegurarProductoPerteneceAVendedor(p, vendedor);
        productosRepository.delete(p);
    }

    private static void validarRequest(ProductoRequest request) {
        if (request.getNombreProd() == null || request.getNombreProd().isBlank()) {
            throw new IllegalArgumentException("El nombre del producto es obligatorio.");
        }
        if (request.getPrecio() < 0) {
            throw new IllegalArgumentException("El precio debe ser mayor o igual a cero.");
        }
    }

    private static ProductoResponse toResponse(Productos p) {
        return new ProductoResponse(
                p.getIdProducto(),
                p.getNombreProd(),
                p.getDescripcionProd(),
                p.getPrecio(),
                p.getCatalogo().getIdCatalogo());
    }
}
