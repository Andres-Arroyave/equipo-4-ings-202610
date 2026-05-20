package com.equipo4.antojosupb.dto;

import lombok.Data;

import java.util.List;

@Data
public class RegistroRequest {
    private String email;
    private String contrasena;
    private String telefono; 
    
    // For Cliente
    private String nombreClient;
    
    // For Vendedor
    private String nombreNegocio;
    private String nombrePropietario;
    private String descripcionNeg;
    private String whatsAppLink;
    private String instagramLink;
    private List<Integer> idCategoriasV;
}
