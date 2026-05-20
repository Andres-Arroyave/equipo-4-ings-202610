package com.equipo4.antojosupb.services;

import com.equipo4.antojosupb.dto.VendedorEstadoResponse;
import com.equipo4.antojosupb.dto.VendedorDetalleResponse;
import com.equipo4.antojosupb.dto.HorarioDiaResponse;
import com.equipo4.antojosupb.dto.ProductoResponse;
import com.equipo4.antojosupb.entities.CategoriaVendedor;
import com.equipo4.antojosupb.entities.Vendedor;
import com.equipo4.antojosupb.repository.VendedorRepository;
import com.equipo4.antojosupb.repository.CatalogoRepository;
import com.equipo4.antojosupb.repository.ProductosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Collections;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VendedoresPublicosService {

    @Autowired
    private VendedorRepository vendedorRepository;

    @Autowired
    private CatalogoRepository catalogoRepository;

    @Autowired
    private ProductosRepository productosRepository;

    @Autowired
    private HorarioVendedorService horarioVendedorService;

    @Transactional
    public List<VendedorEstadoResponse> listarVendedores() {
        List<Vendedor> vendedores = vendedorRepository.findAllByOrderByNombreNegocioAsc();
        return vendedores.stream()
                .map(vendedor -> {
                    boolean activo = horarioVendedorService.actualizarEstadoPorHorario(vendedor);
                    return toResponse(vendedor, activo);
                })
                .collect(Collectors.toList());
    }

    private static VendedorEstadoResponse toResponse(Vendedor vendedor, boolean activo) {
        List<String> nombreCategorias = vendedor.getCategorias() != null
                ? vendedor.getCategorias().stream().map(CategoriaVendedor::getNombreCategoria).collect(Collectors.toList())
                : Collections.emptyList();
        return new VendedorEstadoResponse(
                vendedor.getIdVendedor(),
                vendedor.getNombreNegocio(),
                nombreCategorias,
                activo,
                activo ? "Abierto" : "Cerrado",
                activo ? "blanco-hueso" : "gris",
                vendedor.getWhatsAppLink(),
                vendedor.getDescripcionNeg());
    }

    @Transactional
    public List<VendedorEstadoResponse> listarRecomendados(int cantidad) {
        List<Vendedor> vendedores = vendedorRepository.findAll();
        Collections.shuffle(vendedores);
        return vendedores.stream()
                .limit(cantidad)
                .map(vendedor -> {
                    boolean activo = horarioVendedorService.actualizarEstadoPorHorario(vendedor);
                    return toResponse(vendedor, activo);
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public List<VendedorEstadoResponse> buscarVendedoresPorNombre(String nombre) {
        List<Vendedor> vendedores = vendedorRepository.findByNombreNegocioContainingIgnoreCase(nombre);
        return vendedores.stream()
                .map(vendedor -> {
                    boolean activo = horarioVendedorService.actualizarEstadoPorHorario(vendedor);
                    return toResponse(vendedor, activo);
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<VendedorDetalleResponse> obtenerDetalle(int idVendedor) {
        return vendedorRepository.findById(idVendedor)
                .map(vendedor -> {
                    List<HorarioDiaResponse> horarios = horarioVendedorService.obtenerHorarioSemanal(vendedor.getUsuario().getIdUser());
                    
                    List<ProductoResponse> productos = catalogoRepository.findByVendedor_IdVendedor(idVendedor)
                            .map(catalogo -> productosRepository.findByCatalogo_IdCatalogoOrderByIdProductoAsc(catalogo.getIdCatalogo()).stream()
                                    .map(p -> new ProductoResponse(p.getIdProducto(), p.getNombreProd(), p.getDescripcionProd(), p.getPrecio(), p.getCatalogo().getIdCatalogo()))
                                    .collect(Collectors.toList()))
                            .orElse(Collections.emptyList());

                    List<String> nombreCategorias = vendedor.getCategorias() != null
                            ? vendedor.getCategorias().stream().map(CategoriaVendedor::getNombreCategoria).collect(Collectors.toList())
                            : Collections.emptyList();

                    return new VendedorDetalleResponse(
                            vendedor.getIdVendedor(),
                            vendedor.getNombreNegocio(),
                            nombreCategorias,
                            vendedor.isActivo(),
                            vendedor.isActivo() ? "Abierto" : "Cerrado",
                            vendedor.isActivo() ? "blanco-hueso" : "gris",
                            vendedor.getWhatsAppLink(),
                            vendedor.getInstagramLink(),
                            vendedor.getDescripcionNeg(),
                            horarios,
                            productos
                    );
                });
    }
}
