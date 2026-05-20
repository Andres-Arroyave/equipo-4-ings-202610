package com.equipo4.antojosupb.repository;

import com.equipo4.antojosupb.entities.DiasSemana;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DiasSemanaRepository extends JpaRepository<DiasSemana, Integer> {
}
