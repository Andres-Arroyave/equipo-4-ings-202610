package com.equipo4.antojosupb.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class PerfilUpdateRequest {
    
    @NotBlank(message = "El nombre es obligatorio")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\\s]{2,70}$", message = "El nombre no es válido (2-70 caracteres)")
    private String nombre;

    @NotBlank(message = "El teléfono es obligatorio")
    @Pattern(regexp = "^[3]{1}[0-5]{1}[0-9]{8}$", message = "El teléfono debe empezar con 3 y tener 10 dígitos")
    private String telefono;

    @Pattern(regexp = "^(?:https?://)?(?:www\\.)?(?:wa\\.me/|api\\.whatsapp\\.com/send/?\\?phone=)(\\+?\\d{7,15})(?:[&?].*)?$", message = "El enlace de WhatsApp no es válido")
    private String whatsAppLink;

    @Pattern(regexp = "^(?:https?://)?(?:www\\.)?instagram\\.com/([a-zA-Z0-9._]{1,30})/?(?:\\?.*)?$", message = "El enlace de Instagram no es válido")
    private String instagramLink;
}


