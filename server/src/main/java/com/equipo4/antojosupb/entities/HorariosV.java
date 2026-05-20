package com.equipo4.antojosupb.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.time.LocalTime;

@Entity
@Table(name = "HORARIOSV")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class HorariosV {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdHorario")
    private int idHorario;

    @Column(name = "HoraInicio", nullable = false)
    private LocalTime horaInicio;

    @Column(name = "HoraFin", nullable = false)
    private LocalTime horaFin;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IdDia", nullable = false)
    private DiasSemana dia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IdVendedor", nullable = false)
    private Vendedor vendedor;
}
