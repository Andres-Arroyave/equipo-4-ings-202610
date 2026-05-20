package com.equipo4.antojosupb.repository;

import com.equipo4.antojosupb.entities.Vendedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface VendedorRepository extends JpaRepository<Vendedor, Integer> {
    boolean existsByNombreNegocio(String nombreNegocio);
    Optional<Vendedor> findByUsuarioIdUser(int idUser);
    java.util.List<Vendedor> findAllByOrderByNombreNegocioAsc();
    java.util.List<Vendedor> findByNombreNegocioContainingIgnoreCase(String nombre);
}
