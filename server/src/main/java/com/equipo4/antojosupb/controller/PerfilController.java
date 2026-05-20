package com.equipo4.antojosupb.controller;

import com.equipo4.antojosupb.dto.PerfilUpdateRequest;
import com.equipo4.antojosupb.dto.VendedorPerfilRequest;
import com.equipo4.antojosupb.entities.Usuario;
import com.equipo4.antojosupb.entities.Vendedor;
import com.equipo4.antojosupb.entities.Cliente;
import com.equipo4.antojosupb.services.PerfilService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/perfil")
public class PerfilController {

    @Autowired
    private PerfilService perfilService;

    @GetMapping("/{idUser}")
    public ResponseEntity<?> getPerfil(@PathVariable int idUser) {
        try {
            Usuario usuario = perfilService.getUsuario(idUser);
            // Podríamos crear un DTO de respuesta si quisiéramos ocultar campos
            return ResponseEntity.ok(usuario);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/categorias")
    public ResponseEntity<?> getCategorias() {
        try {
            return ResponseEntity.ok(perfilService.listarCategorias());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/vendedor/{idUser}")
    public ResponseEntity<?> getPerfilVendedor(@PathVariable int idUser) {
        try {
            Vendedor vendedor = perfilService.getVendedorPorUsuario(idUser);
            return ResponseEntity.ok(vendedor);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/cliente/{idUser}")
    public ResponseEntity<?> getPerfilCliente(@PathVariable int idUser) {
        try {
            Cliente cliente = perfilService.getClientePorUsuario(idUser);
            return ResponseEntity.ok(cliente);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @PutMapping("/{idUser}/contacto")
    public ResponseEntity<?> actualizarContacto(@PathVariable int idUser, @RequestBody PerfilUpdateRequest request) {
        try {
            perfilService.actualizarContacto(idUser, request);
            return ResponseEntity.ok("Información de contacto actualizada correctamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{idUser}/identidad")
    public ResponseEntity<?> actualizarIdentidad(@PathVariable int idUser, @RequestBody VendedorPerfilRequest request) {
        try {
            perfilService.actualizarIdentidadNegocio(idUser, request);
            return ResponseEntity.ok("Identidad del negocio actualizada correctamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

