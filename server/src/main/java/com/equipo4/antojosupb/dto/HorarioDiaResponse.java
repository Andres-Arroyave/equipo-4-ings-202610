package com.equipo4.antojosupb.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HorarioDiaResponse {
    private int idDia;
    private String nombreDia;
    private boolean activo;
    /** HH:mm o null si no hay horario */
    private String horaInicio;
    private String horaFin;
}
