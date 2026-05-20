package com.equipo4.antojosupb.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "CATEGORIAVENDEDOR")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoriaVendedor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdCategoriaV")
    private int idCategoriaV;

    @Column(name = "NombreCategoria", nullable = false, length = 50)
    private String nombreCategoria;
}
