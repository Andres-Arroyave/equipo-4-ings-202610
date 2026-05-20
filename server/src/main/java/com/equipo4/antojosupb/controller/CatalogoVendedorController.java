package com.equipo4.antojosupb.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.equipo4.antojosupb.dto.CatalogoRequest;
import com.equipo4.antojosupb.dto.CatalogoResponse;
import com.equipo4.antojosupb.dto.CatalogoUpdateRequest;
import com.equipo4.antojosupb.services.CatalogoService;

@RestController
@RequestMapping("/api/auth/vendedor")
public class CatalogoVendedorController {

    @Autowired
    private CatalogoService catalogoService;

    @PostMapping("/{idUser}/catalogos")
    public ResponseEntity<?> crear(@PathVariable int idUser, @RequestBody CatalogoRequest request) {
        try {
            CatalogoResponse creado = catalogoService.crearCatalogo(idUser, request);
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

    @PutMapping("/{idUser}/catalogos/{idCatalogo}")
    public ResponseEntity<?> actualizar(
            @PathVariable int idUser,
            @PathVariable int idCatalogo,
            @RequestBody CatalogoUpdateRequest request) {
        try {
            CatalogoResponse actualizado = catalogoService.actualizarCatalogo(idUser, idCatalogo,
                    request.getNombreCatalogo());
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
}
