package com.equipo4.antojosupb.dto;

import lombok.Data;

@Data
public class CatalogoRequest {
    /** Solo nombre; el vendedor se toma del usuario autenticado en la ruta (idUser). */
    private String nombreCatalogo;
}
