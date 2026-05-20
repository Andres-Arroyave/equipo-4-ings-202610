package com.equipo4.antojosupb.controller;

import com.equipo4.antojosupb.dto.VendedorEstadoResponse;
import com.equipo4.antojosupb.dto.VendedorDetalleResponse;
import com.equipo4.antojosupb.services.VendedoresPublicosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/vendedores")
public class VendedoresController {

    @Autowired
    private VendedoresPublicosService vendedoresPublicosService;

    @GetMapping
    public ResponseEntity<List<VendedorEstadoResponse>> listarVendedores() {
        return ResponseEntity.ok(vendedoresPublicosService.listarVendedores());
    }

    @GetMapping("/recomendados")
    public ResponseEntity<List<VendedorEstadoResponse>> listarRecomendados() {
        // Enviar por defecto 3 recomendados
        return ResponseEntity.ok(vendedoresPublicosService.listarRecomendados(3));
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<VendedorEstadoResponse>> buscarVendedores(@org.springframework.web.bind.annotation.RequestParam String nombre) {
        return ResponseEntity.ok(vendedoresPublicosService.buscarVendedoresPorNombre(nombre));
    }

    @GetMapping("/{id}/detalle")
    public ResponseEntity<VendedorDetalleResponse> obtenerDetalleVendedor(@PathVariable int id) {
        return vendedoresPublicosService.obtenerDetalle(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
