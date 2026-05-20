package com.equipo4.antojosupb.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.equipo4.antojosupb.entities.RolUsuario;
import com.equipo4.antojosupb.repository.RolUsuarioRepository;

@Service
public class ServiceRolUsuarioJPA implements ServiceRolUsuario {

    @Autowired
    private RolUsuarioRepository rolUsuarioRepository;

    @Override
    public List<RolUsuario> getAllRoles() {
        return rolUsuarioRepository.findAll();
    }

    @Override
    public RolUsuario getRolById(int id) {
        return rolUsuarioRepository.findById(id).orElse(null);
    }
}
