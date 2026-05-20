package com.equipo4.antojosupb.repository;

import com.equipo4.antojosupb.entities.Catalogo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CatalogoRepository extends JpaRepository<Catalogo, Integer> {

    Optional<Catalogo> findByVendedor_IdVendedor(int idVendedor);

    boolean existsByVendedor_IdVendedor(int idVendedor);
}
