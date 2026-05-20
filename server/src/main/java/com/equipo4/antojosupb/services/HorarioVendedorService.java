package com.equipo4.antojosupb.services;

import com.equipo4.antojosupb.dto.HorarioDiaRequest;
import com.equipo4.antojosupb.dto.HorarioDiaResponse;
import com.equipo4.antojosupb.entities.DiasSemana;
import com.equipo4.antojosupb.entities.HorariosV;
import com.equipo4.antojosupb.entities.Vendedor;
import com.equipo4.antojosupb.repository.DiasSemanaRepository;
import com.equipo4.antojosupb.repository.HorariosVRepository;
import com.equipo4.antojosupb.repository.VendedorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class HorarioVendedorService {

    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm");

    @Autowired
    private VendedorAccesoService vendedorAccesoService;

    @Autowired
    private DiasSemanaRepository diasSemanaRepository;

    @Autowired
    private HorariosVRepository horariosVRepository;

    @Autowired
    private VendedorRepository vendedorRepository;

    public List<HorarioDiaResponse> obtenerHorarioSemanal(int idUser) {
        Vendedor vendedor = resolverVendedor(idUser);
        List<DiasSemana> diasOrdenados = diasSemanaRepository.findAll(Sort.by("idDia"));
        List<HorariosV> existentes = horariosVRepository.findByVendedor_IdVendedor(vendedor.getIdVendedor());

        Map<Integer, HorariosV> porDia = new HashMap<>();
        for (HorariosV h : existentes) {
            int idDia = h.getDia().getIdDia();
            porDia.putIfAbsent(idDia, h);
        }

        return diasOrdenados.stream()
                .map(dia -> {
                    HorariosV h = porDia.get(dia.getIdDia());
                    if (h == null) {
                        return new HorarioDiaResponse(dia.getIdDia(), dia.getNombreDia(), false, null, null);
                    }
                    return new HorarioDiaResponse(
                            dia.getIdDia(),
                            dia.getNombreDia(),
                            true,
                            h.getHoraInicio().format(TIME_FMT),
                            h.getHoraFin().format(TIME_FMT));
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void guardarHorarioSemanal(int idUser, List<HorarioDiaRequest> dias) {
        Vendedor vendedor = resolverVendedor(idUser);

        if (dias == null || dias.isEmpty()) {
            throw new IllegalArgumentException("Debe enviar la configuración de los días.");
        }

        for (HorarioDiaRequest req : dias) {
            if (!req.isActivo()) {
                continue;
            }
            if (req.getHoraInicio() == null || req.getHoraInicio().isBlank()
                    || req.getHoraFin() == null || req.getHoraFin().isBlank()) {
                throw new IllegalArgumentException(
                        "Para los días activos, la hora de inicio y fin son obligatorias.");
            }
            LocalTime inicio;
            LocalTime fin;
            try {
                inicio = LocalTime.parse(req.getHoraInicio().trim(), TIME_FMT);
                fin = LocalTime.parse(req.getHoraFin().trim(), TIME_FMT);
            } catch (Exception e) {
                throw new IllegalArgumentException("Formato de hora inválido. Use HH:mm (ej. 09:30).");
            }
            if (!fin.isAfter(inicio)) {
                throw new IllegalArgumentException(
                        "La hora de fin debe ser posterior a la hora de inicio.");
            }
            if (!diasSemanaRepository.existsById(req.getIdDia())) {
                throw new IllegalArgumentException("Día de la semana no válido: " + req.getIdDia());
            }
        }

        horariosVRepository.deleteByVendedor_IdVendedor(vendedor.getIdVendedor());

        for (HorarioDiaRequest req : dias) {
            if (!req.isActivo()) {
                continue;
            }
            LocalTime inicio = LocalTime.parse(req.getHoraInicio().trim(), TIME_FMT);
            LocalTime fin = LocalTime.parse(req.getHoraFin().trim(), TIME_FMT);
            DiasSemana dia = diasSemanaRepository.findById(req.getIdDia())
                    .orElseThrow(() -> new IllegalArgumentException("Día no encontrado."));

            HorariosV entity = new HorariosV();
            entity.setHoraInicio(inicio);
            entity.setHoraFin(fin);
            entity.setDia(dia);
            entity.setVendedor(vendedor);
            horariosVRepository.save(entity);
        }
    }

    private Vendedor resolverVendedor(int idUser) {
        return vendedorAccesoService.requerirVendedor(idUser,
                "Solo los vendedores pueden gestionar el horario de disponibilidad.");
    }

    @Transactional
    public boolean actualizarEstadoPorHorario(Vendedor vendedor) {
        boolean disponible = calcularDisponibilidad(vendedor, LocalDateTime.now());
        if (vendedor.isActivo() != disponible) {
            vendedor.setActivo(disponible);
            vendedorRepository.save(vendedor);
        }
        return disponible;
    }

    private boolean calcularDisponibilidad(Vendedor vendedor, LocalDateTime ahora) {
        int idDiaActual = ahora.getDayOfWeek().getValue();
        LocalTime horaActual = ahora.toLocalTime();

        List<HorariosV> horariosDia = horariosVRepository.findByVendedor_IdVendedor(vendedor.getIdVendedor())
                .stream()
                .filter(h -> h.getDia().getIdDia() == idDiaActual)
                .collect(Collectors.toList());

        for (HorariosV horario : horariosDia) {
            boolean inicia = !horaActual.isBefore(horario.getHoraInicio());
            boolean termina = !horaActual.isAfter(horario.getHoraFin());
            if (inicia && termina) {
                return true;
            }
        }
        return false;
    }
}
