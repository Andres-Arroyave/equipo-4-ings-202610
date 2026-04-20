package com.equipo4.antojosupb.entities;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "CATALOGO")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Catalogo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdCatalogo")
    private int idCatalogo;

    @Column(name = "NombreCatalogo", nullable = false, length = 100)
    private String nombreCatalogo;

    @Column(name = "FechaCreacion")
    private LocalDateTime fechaCreacion;

    @Column(name = "DescripcionCatalogo", length = 200)
    private String descripcionCatalogo;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IdVendedor", nullable = false, unique = true)
    private Vendedor vendedor;
}
