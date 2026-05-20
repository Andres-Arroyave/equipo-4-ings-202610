package com.equipo4.antojosupb.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendedorDetalleResponse {
    private int idVendedor;
    private String nombreNegocio;
    private List<String> nombreCategorias;
    private boolean activo;
    private String estado;
    private String colorTarjeta;
    private String whatsAppLink;
    private String instagramLink;
    private String descripcionNeg;
    private List<HorarioDiaResponse> horarios;
    private List<ProductoResponse> productos;
}
