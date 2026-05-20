package com.equipo4.antojosupb.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AntojosController {

    @GetMapping("/saludo")
    public Map<String, String> saludo() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hola desde Spring Boot");
        return response;
    }
}