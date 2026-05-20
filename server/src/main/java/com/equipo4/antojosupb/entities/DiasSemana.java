package com.equipo4.antojosupb.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "DIASSEMANA")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DiasSemana {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdDia")
    private int idDia;

    @Column(name = "NombreDia", nullable = false, unique = true, length = 20)
    private String nombreDia;
}
