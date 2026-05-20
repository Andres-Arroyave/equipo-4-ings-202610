package com.equipo4.antojosupb.repository;

import com.equipo4.antojosupb.entities.HorariosV;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HorariosVRepository extends JpaRepository<HorariosV, Integer> {

    List<HorariosV> findByVendedor_IdVendedor(int idVendedor);

    void deleteByVendedor_IdVendedor(int idVendedor);
}
