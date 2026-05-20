package com.equipo4.antojosupb.repository;

import com.equipo4.antojosupb.entities.CategoriaVendedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaVendedorRepository extends JpaRepository<CategoriaVendedor, Integer> {
}
