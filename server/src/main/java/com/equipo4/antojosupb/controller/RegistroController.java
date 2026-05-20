package com.equipo4.antojosupb.controller;

import com.equipo4.antojosupb.dto.LoginResponse;
import com.equipo4.antojosupb.dto.RegistroRequest;
import com.equipo4.antojosupb.services.RegistroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class RegistroController {

    @Autowired
    private RegistroService registroService;

    @PostMapping("/registro/cliente")
    public ResponseEntity<String> registrarCliente(@RequestBody RegistroRequest request) {
        try {
            String mensaje = registroService.registrarCliente(request);
            return new ResponseEntity<>(mensaje, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            e.printStackTrace(); // <-- Añadido para ver el error real
            return new ResponseEntity<>("Error interno en el servidor: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/registro/vendedor")
    public ResponseEntity<String> registrarVendedor(@RequestBody RegistroRequest request) {
        try {
            String mensaje = registroService.registrarVendedor(request);
            return new ResponseEntity<>(mensaje, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            e.printStackTrace(); // <-- Añadido para ver el error real
            return new ResponseEntity<>("Error interno en el servidor: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody RegistroRequest request) {
        try {
            LoginResponse response = registroService.login(request.getEmail(), request.getContrasena());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error interno en el servidor: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
