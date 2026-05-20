package com.equipo4.antojosupb.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.equipo4.antojosupb.dto.CatalogoResponse;
import com.equipo4.antojosupb.services.CatalogoService;

@RestController
@RequestMapping("/api/catalogos")
public class CatalogoController {

    @Autowired
    private CatalogoService catalogoService;

    /** Lectura pública del catálogo por vendedor (p. ej. clientes). */
    @GetMapping("/vendedor/{idVendedor}")
    public ResponseEntity<?> obtenerPorVendedor(@PathVariable int idVendedor) {
        try {
            CatalogoResponse catalogo = catalogoService.obtenerPorVendedor(idVendedor);
            return ResponseEntity.ok(catalogo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error interno: " + e.getMessage());
        }
    }

    @GetMapping("/{idCatalogo}")
    public ResponseEntity<?> obtenerPorId(@PathVariable int idCatalogo) {
        try {
            CatalogoResponse catalogo = catalogoService.obtenerPorId(idCatalogo);
            return ResponseEntity.ok(catalogo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error interno: " + e.getMessage());
        }
    }
}
