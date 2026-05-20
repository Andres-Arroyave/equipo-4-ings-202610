package com.equipo4.antojosupb.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.util.List;

@Data
public class VendedorPerfilRequest {
    
    @NotBlank(message = "El nombre del negocio es obligatorio")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\\s]{2,70}$", message = "El nombre del negocio no es válido")
    private String nombreNegocio;

    @NotBlank(message = "La descripción es obligatoria")

    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ0-9\\s.,!?()\\-]{2,200}$", message = "La descripción contiene caracteres no permitidos")
    private String descripcionNeg;

    private List<Integer> idCategoriasV;

    @Pattern(regexp = "^(?:https?://)?(?:www\\.)?(?:wa\\.me/|api\\.whatsapp\\.com/send/?\\?phone=)(\\+?\\d{7,15})(?:[&?].*)?$", message = "El enlace de WhatsApp no es válido")
    private String whatsAppLink;

    @Pattern(regexp = "^(?:https?://)?(?:www\\.)?instagram\\.com/([a-zA-Z0-9._]{1,30})/?(?:\\?.*)?$", message = "El enlace de Instagram no es válido")
    private String instagramLink;
}
