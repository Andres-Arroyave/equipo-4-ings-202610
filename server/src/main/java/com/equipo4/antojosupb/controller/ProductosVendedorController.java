package com.equipo4.antojosupb.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.equipo4.antojosupb.dto.ProductoRequest;
import com.equipo4.antojosupb.dto.ProductoResponse;
import com.equipo4.antojosupb.services.ProductosService;

@RestController
@RequestMapping("/api/auth/vendedor")
public class ProductosVendedorController {

    @Autowired
    private ProductosService productosService;

    @PostMapping("/{idUser}/catalogos/{idCatalogo}/productos")
    public ResponseEntity<?> crear(
            @PathVariable int idUser,
            @PathVariable int idCatalogo,
            @RequestBody ProductoRequest request) {
        try {
            ProductoResponse creado = productosService.crearProducto(idUser, idCatalogo, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(creado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error interno: " + e.getMessage());
        }
    }

    @PutMapping("/{idUser}/productos/{idProducto}")
    public ResponseEntity<?> actualizar(
            @PathVariable int idUser,
            @PathVariable int idProducto,
            @RequestBody ProductoRequest request) {
        try {
            ProductoResponse actualizado = productosService.actualizarProducto(idUser, idProducto, request);
            return ResponseEntity.ok(actualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error interno: " + e.getMessage());
        }
    }

    @DeleteMapping("/{idUser}/productos/{idProducto}")
    public ResponseEntity<?> eliminar(@PathVariable int idUser, @PathVariable int idProducto) {
        try {
            productosService.eliminarProducto(idUser, idProducto);
            return ResponseEntity.ok("Producto eliminado correctamente.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error interno: " + e.getMessage());
        }
    }
}
