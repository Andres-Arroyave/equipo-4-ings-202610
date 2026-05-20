package com.equipo4.antojosupb.repository;

import com.equipo4.antojosupb.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    boolean existsByEmail(String email);
    boolean existsByTelefono(String telefono);
    Optional<Usuario> findByEmail(String email);
}
