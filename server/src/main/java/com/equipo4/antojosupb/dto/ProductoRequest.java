package com.equipo4.antojosupb.dto;

import lombok.Data;

@Data
public class ProductoRequest {
    private String nombreProd;
    private String descripcionProd;
    private int precio;
}
