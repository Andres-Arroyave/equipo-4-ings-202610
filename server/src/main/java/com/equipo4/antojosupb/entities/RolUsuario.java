package com.equipo4.antojosupb.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable; 

@Entity
@Immutable 
@Table(name = "ROLUSUARIO")
@Data
@AllArgsConstructor
@NoArgsConstructor


public class RolUsuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdRol")
    private int IdRol;
    @Column(name = "NombreRol", nullable = false, unique = true, length = 20)
    private String NombreRol;
}
