package com.equipo4.antojosupb.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.equipo4.antojosupb.entities.RolUsuario;
import com.equipo4.antojosupb.repository.RolUsuarioRepository;

import java.util.List;

@RestController
@RequestMapping("/roles")

public class RolUsuarioController {

    @Autowired
    private RolUsuarioRepository rolUsuarioRepository;

    @GetMapping
    public List<RolUsuario> getAllRolUsuarios() {
        return rolUsuarioRepository.findAll();
    }

}
