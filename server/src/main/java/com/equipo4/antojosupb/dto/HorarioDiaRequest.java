package com.equipo4.antojosupb.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HorarioDiaRequest {
    private int idDia;
    private boolean activo;
    /** Requerido si activo es true, formato HH:mm */
    private String horaInicio;
    private String horaFin;
}
