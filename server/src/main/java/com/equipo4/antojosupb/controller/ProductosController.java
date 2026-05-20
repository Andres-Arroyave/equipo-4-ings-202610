package com.equipo4.antojosupb.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.equipo4.antojosupb.dto.ProductoResponse;
import com.equipo4.antojosupb.services.ProductosService;

/**
 * Lectura pública de productos (p. ej. clientes). Altas/bajas/cambios: {@link ProductosVendedorController}.
 */
@RestController
@RequestMapping("/api/productos")
public class ProductosController {

    @Autowired
    private ProductosService productosService;

    @GetMapping("/catalogo/{idCatalogo}")
    public ResponseEntity<?> listarPorCatalogo(@PathVariable int idCatalogo) {
        try {
            List<ProductoResponse> lista = productosService.listarPorCatalogo(idCatalogo);
            return ResponseEntity.ok(lista);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error interno: " + e.getMessage());
        }
    }

    @GetMapping("/{idProducto}")
    public ResponseEntity<?> obtenerPorId(@PathVariable int idProducto) {
        try {
            ProductoResponse p = productosService.obtenerPorId(idProducto);
            return ResponseEntity.ok(p);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error interno: " + e.getMessage());
        }
    }
}
