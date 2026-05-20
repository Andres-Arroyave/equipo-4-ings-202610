package com.equipo4.antojosupb.repository;

import com.equipo4.antojosupb.entities.Productos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductosRepository extends JpaRepository<Productos, Integer> {

    List<Productos> findByCatalogo_IdCatalogoOrderByIdProductoAsc(int idCatalogo);
}
