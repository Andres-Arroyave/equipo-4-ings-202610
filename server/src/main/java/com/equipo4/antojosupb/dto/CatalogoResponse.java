package com.equipo4.antojosupb.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CatalogoResponse {
    private int idCatalogo;
    private String nombreCatalogo;
    private LocalDateTime fechaCreacion;
    private int idVendedor;
}
