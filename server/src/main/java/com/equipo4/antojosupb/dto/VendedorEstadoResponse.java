package com.equipo4.antojosupb.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendedorEstadoResponse {
    private int idVendedor;
    private String nombreNegocio;
    private List<String> nombreCategorias;
    private boolean activo;
    private String estado;
    private String colorTarjeta;
    private String whatsAppLink;
    private String descripcionNeg;
}
