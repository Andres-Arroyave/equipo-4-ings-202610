package com.equipo4.antojosupb.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoResponse {
    private int idProducto;
    private String nombreProd;
    private String descripcionProd;
    private int precio;
    private int idCatalogo;
}
