package com.equipo4.antojosupb.controller;

import com.equipo4.antojosupb.dto.HorarioDiaRequest;
import com.equipo4.antojosupb.dto.HorarioDiaResponse;
import com.equipo4.antojosupb.services.HorarioVendedorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth/vendedor")
public class HorarioVendedorController {

    @Autowired
    private HorarioVendedorService horarioVendedorService;

    @GetMapping("/{idUser}/horarios")
    public ResponseEntity<?> obtenerHorarios(@PathVariable int idUser) {
        try {
            List<HorarioDiaResponse> horarios = horarioVendedorService.obtenerHorarioSemanal(idUser);
            return ResponseEntity.ok(horarios);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error interno: " + e.getMessage());
        }
    }

    @PutMapping("/{idUser}/horarios")
    public ResponseEntity<?> guardarHorarios(
            @PathVariable int idUser,
            @RequestBody List<HorarioDiaRequest> dias) {
        try {
            horarioVendedorService.guardarHorarioSemanal(idUser, dias);
            return ResponseEntity.ok("Horario guardado correctamente.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error interno: " + e.getMessage());
        }
    }
}
