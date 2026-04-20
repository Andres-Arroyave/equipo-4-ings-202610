package com.equipo4.antojosupb.services;

import com.equipo4.antojosupb.dto.PerfilUpdateRequest;
import com.equipo4.antojosupb.dto.VendedorPerfilRequest;
import com.equipo4.antojosupb.entities.Usuario;
import com.equipo4.antojosupb.entities.Vendedor;
import com.equipo4.antojosupb.repository.UsuarioRepository;
import com.equipo4.antojosupb.repository.VendedorRepository;
import com.equipo4.antojosupb.repository.CatalogoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.equipo4.antojosupb.repository.CategoriaVendedorRepository;
import com.equipo4.antojosupb.repository.ClienteRepository;
import com.equipo4.antojosupb.entities.Cliente;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class PerfilService {

    private static final Pattern NAME_PATTERN = Pattern.compile("^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\\s]{2,70}$");
    private static final Pattern PHONE_PATTERN = Pattern.compile("^[3]{1}[0-5]{1}[0-9]{8}$");
    private static final Pattern DESC_PATTERN = Pattern.compile("^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ0-9\\s.,!?()\\-]+$");
    private static final Pattern WA_PATTERN = Pattern.compile("^(?:https?://)?(?:www\\.)?(?:wa\\.me/|api\\.whatsapp\\.com/send/?\\?phone=)(\\+?\\d{7,15})(?:[&?].*)?$");
    private static final Pattern IG_PATTERN = Pattern.compile("^(?:https?://)?(?:www\\.)?instagram\\.com/([a-zA-Z0-9._]{1,30})/?(?:\\?.*)?$");

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private VendedorRepository vendedorRepository;

    @Autowired
    private CategoriaVendedorRepository categoriaVendedorRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private CatalogoRepository catalogoRepository;

    public Usuario getUsuario(int idUser) {
        return usuarioRepository.findById(idUser)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
    }

    public Vendedor getVendedorPorUsuario(int idUser) {
        return vendedorRepository.findByUsuarioIdUser(idUser)
                .orElseThrow(() -> new IllegalArgumentException("Vendedor no encontrado"));
    }

    public Cliente getClientePorUsuario(int idUser) {
        return clienteRepository.findByUsuarioIdUser(idUser)
                .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado"));
    }


    public java.util.List<com.equipo4.antojosupb.entities.CategoriaVendedor> listarCategorias() {
        return categoriaVendedorRepository.findAll();
    }

    @Transactional
    public void actualizarContacto(int idUser, PerfilUpdateRequest request) {
        // Validaciones manuales
        if (request.getNombre() == null || request.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }
        if (!NAME_PATTERN.matcher(request.getNombre()).matches()) {
            throw new IllegalArgumentException("El nombre no es válido (2-70 letras)");
        }
        if (request.getTelefono() == null || request.getTelefono().trim().isEmpty()) {
            throw new IllegalArgumentException("El teléfono es obligatorio");
        }
        if (!PHONE_PATTERN.matcher(request.getTelefono()).matches()) {
            throw new IllegalArgumentException("El teléfono debe empezar con 3 y tener 10 dígitos");
        }
        if (request.getWhatsAppLink() != null && !request.getWhatsAppLink().isEmpty() && !WA_PATTERN.matcher(request.getWhatsAppLink()).matches()) {
            throw new IllegalArgumentException("El enlace de WhatsApp no es válido");
        }
        if (request.getInstagramLink() != null && !request.getInstagramLink().isEmpty() && !IG_PATTERN.matcher(request.getInstagramLink()).matches()) {
            throw new IllegalArgumentException("El enlace de Instagram no es válido");
        }

        Usuario usuario = getUsuario(idUser);
        usuario.setTelefono(request.getTelefono());
        usuarioRepository.save(usuario);

        // Actualizar nombre según el tipo de usuario
        Optional<Vendedor> vendedorOpt = vendedorRepository.findByUsuarioIdUser(idUser);
        if (vendedorOpt.isPresent()) {
            Vendedor v = vendedorOpt.get();
            v.setNombrePropietario(request.getNombre());
            v.setWhatsAppLink(request.getWhatsAppLink());
            v.setInstagramLink(request.getInstagramLink());
            vendedorRepository.save(v);
        } else {
            Optional<Cliente> clienteOpt = clienteRepository.findByUsuarioIdUser(idUser);
            if (clienteOpt.isPresent()) {
                Cliente c = clienteOpt.get();
                c.setNombreClient(request.getNombre());
                clienteRepository.save(c);
            }
        }
    }

    @Transactional
    public void actualizarIdentidadNegocio(int idUser, VendedorPerfilRequest request) {
        // Validaciones manuales
        if (request.getNombreNegocio() == null || request.getNombreNegocio().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del negocio es obligatorio");
        }
        if (!NAME_PATTERN.matcher(request.getNombreNegocio()).matches()) {
            throw new IllegalArgumentException("El nombre del negocio no es válido");
        }
        if (request.getDescripcionNeg() == null || request.getDescripcionNeg().trim().isEmpty()) {
            throw new IllegalArgumentException("La descripción es obligatoria");
        }
        if (request.getDescripcionNeg().length() > 500 || !DESC_PATTERN.matcher(request.getDescripcionNeg()).matches()) {
            throw new IllegalArgumentException("La descripción contiene caracteres no permitidos o es muy larga");
        }
        if (request.getIdCategoriaV() == null) {
            throw new IllegalArgumentException("La categoría es obligatoria");
        }

        Vendedor vendedor = getVendedorPorUsuario(idUser);
        
        // Validar que el nombre del negocio no esté tomado si se está cambiando
        if (!vendedor.getNombreNegocio().equalsIgnoreCase(request.getNombreNegocio())) {
            if (vendedorRepository.existsByNombreNegocio(request.getNombreNegocio())) {
                throw new IllegalArgumentException("El nombre del negocio ya está en uso");
            }
        }
        
        vendedor.setNombreNegocio(request.getNombreNegocio());
        vendedor.setDescripcionNeg(request.getDescripcionNeg());


        
        com.equipo4.antojosupb.entities.CategoriaVendedor cat = categoriaVendedorRepository.findById(request.getIdCategoriaV())
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada"));
        vendedor.setCategoriaVendedor(cat);
        
        vendedorRepository.save(vendedor);

        catalogoRepository.findByVendedor_IdVendedor(vendedor.getIdVendedor())
                .ifPresent(catalogo -> {
                    catalogo.setDescripcionCatalogo(request.getDescripcionNeg());
                    catalogoRepository.save(catalogo);
                });
    }
}
