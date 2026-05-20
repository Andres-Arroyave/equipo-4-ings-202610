package com.equipo4.antojosupb.services;

import java.util.List;

import com.equipo4.antojosupb.entities.RolUsuario;

public interface ServiceRolUsuario {
    public List<RolUsuario> getAllRoles();
    public RolUsuario getRolById(int id);
}
