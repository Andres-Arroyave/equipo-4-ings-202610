package com.equipo4.antojosupb.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.Set;

@Entity
@Table(name = "VENDEDORES")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Vendedor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdVendedor")
    private int idVendedor;

    @Column(name = "NombreNegocio", nullable = false, unique = true, length = 150)
    private String nombreNegocio;

    @Column(name = "NombrePropietario", nullable = false, length = 150)
    private String nombrePropietario;

    @Column(name = "DescripcionNeg", columnDefinition = "NVARCHAR(MAX)")
    private String descripcionNeg;

    @Column(name = "WhatsAppLink", nullable = false, length = 120)
    private String whatsAppLink;

    @Column(name = "InstagramLink", length = 120)
    private String instagramLink;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "VENDEDOR_CATEGORIA",
        joinColumns = @JoinColumn(name = "IdVendedor"),
        inverseJoinColumns = @JoinColumn(name = "IdCategoriaV")
    )
    private Set<CategoriaVendedor> categorias;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IdUser", nullable = false)
    private Usuario usuario;

    @Column(name = "Activo", nullable = false)
    private boolean activo;
}
