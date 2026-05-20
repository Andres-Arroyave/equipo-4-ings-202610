package com.equipo4.antojosupb.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "PRODUCTOS")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Productos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdProducto")
    private int idProducto;

    @Column(name = "NombreProd", nullable = false, length = 150)
    private String nombreProd;

    @Column(name = "DescripcionProd", columnDefinition = "NVARCHAR(MAX)")
    private String descripcionProd;

    @Column(name = "Precio", nullable = false)
    private int precio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IdCatalogo", nullable = false)
    private Catalogo catalogo;
}
