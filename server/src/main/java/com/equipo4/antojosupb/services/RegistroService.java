package com.equipo4.antojosupb.services;

import com.equipo4.antojosupb.dto.LoginResponse;
import com.equipo4.antojosupb.dto.RegistroRequest;
import com.equipo4.antojosupb.entities.*;
import com.equipo4.antojosupb.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.regex.Pattern;
import java.util.Optional;
import java.util.HashSet;
import java.util.Set;

import java.time.LocalDateTime;

@Service
public class RegistroService {

    private static final Pattern NAME_PATTERN = Pattern.compile("^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\\s]+$");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^(?=[^@]{3,64}@)[_a-z0-9-]+(([\\.])[_a-z0-9-]+)*@[a-z0-9-]+(\\.[a-z0-9-]+)*(\\.[a-z]{2,6})$");
    private static final Pattern PHONE_PATTERN = Pattern.compile("^[3]{1}[0-5]{1}[0-9]{8}$");

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private VendedorRepository vendedorRepository;

    @Autowired
    private RolUsuarioRepository rolUsuarioRepository;

    @Autowired
    private CategoriaVendedorRepository categoriaVendedorRepository;

    @Autowired
    private PasswordService passwordService;

    @Transactional
    public String registrarCliente(RegistroRequest request) {

        // Validación Cliente

        // Validación del nombre del cliente: no nulo, no vacío, solo letras y espacios
        if (request.getNombreClient() == null || request.getNombreClient().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del cliente es obligatorio.");
        }

        // Validación del formato del nombre del cliente: solo letras incluyendo acentos
        // y espacios
        if (!NAME_PATTERN.matcher(request.getNombreClient()).matches()) {
            throw new IllegalArgumentException("El nombre del cliente solo puede contener letras y espacios.");
        }

        // Validación del teléfono: no nulo, no vacío
        if (request.getTelefono() == null || request.getTelefono().trim().isEmpty()) {
            throw new IllegalArgumentException("El teléfono es obligatorio.");
        }
        // validación del formato del teléfono: debe iniciar con 3, seguido de un dígito
        // entre 0 y 5, y luego 8 dígitos más
        if (request.getTelefono() != null && usuarioRepository.existsByTelefono(request.getTelefono())) {
            throw new IllegalArgumentException("El número de teléfono ya está registrado.");
        }
        // Validación del formato del teléfono: debe iniciar con 3, seguido de un dígito
        // entre 0 y 5,
        if (request.getTelefono() != null && !PHONE_PATTERN.matcher(request.getTelefono()).matches()) {
            throw new IllegalArgumentException("El formato del teléfono no es válido.");
        }

        // Validación de email: no nulo, no vacío
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("El email es obligatorio.");
        }
        // Validación del formato del email
        if (!EMAIL_PATTERN.matcher(request.getEmail()).matches()) {
            throw new IllegalArgumentException("El formato del email no es válido.");
        }
        // Validación de unicidad del email
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("El email ya está registrado.");
        }
        // Validación de la contraseña: no nulo, no vacío, mínimo 8 caracteres
        if (request.getContrasena() == null || request.getContrasena().length() < 8) {
            throw new IllegalArgumentException("La contraseña debe tener al menos 8 caracteres.");
        }

        // 1. Registrar Usuario General
        Usuario usuario = new Usuario();
        usuario.setEmail(request.getEmail());
        usuario.setContrasena(passwordService.hash(request.getContrasena()));
        usuario.setTelefono(request.getTelefono());
        usuario.setFechaRegis(LocalDateTime.now());

        // Rol 2 para Cliente
        RolUsuario rol = rolUsuarioRepository.findById(2)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Rol de Cliente no encontrado en la base de datos (se esperaba IdRol = 2)."));
        usuario.setRol(rol);

        Usuario usuarioGuardado = usuarioRepository.save(usuario);

        // 2. Guardar en tabla CLIENTES
        Cliente cliente = new Cliente();
        cliente.setNombreClient(request.getNombreClient());
        cliente.setUsuario(usuarioGuardado);
        clienteRepository.save(cliente);

        return "Cliente registrado con éxito.";
    }

    @Transactional
    public String registrarVendedor(RegistroRequest request) {

        // Validación nombre propietario: solo letras incluyendo acentos y espacios
        if (!NAME_PATTERN.matcher(request.getNombrePropietario()).matches()) {
            throw new IllegalArgumentException("El nombre del propietario no es válido.");
        }
        // Validación nombre propietario: no nulo, no vacío
        if (request.getNombrePropietario() == null || request.getNombrePropietario().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del propietario es obligatorio.");

        }

        // Validación nombre negocio: no nulo, no vacío
        if (request.getNombreNegocio() == null || request.getNombreNegocio().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del negocio es obligatorio.");
        }
        // Validacion de la unicidad del nombre del negocio
        if (vendedorRepository.existsByNombreNegocio(request.getNombreNegocio())) {
            throw new IllegalArgumentException("El nombre del negocio ya está en uso.");
        }
        // Validación del formato del nombre del negocio:  solo letras incluyendo acentos y espacios
        if (!NAME_PATTERN.matcher(request.getNombreNegocio()).matches()) {
            throw new IllegalArgumentException("El nombre del negocio no es válido. Solo puede contener letras y espacios.");
        }
        
        //Validacion del formato del email
        if (!EMAIL_PATTERN.matcher(request.getEmail()).matches()) {
            throw new IllegalArgumentException("El formato del email no es válido.");
        }
        // Validación de email: no nulo, no vacío
        if (request.getContrasena() == null || request.getContrasena().length() < 8) {
            throw new IllegalArgumentException("La contraseña debe tener al menos 8 caracteres.");
        }
        // Validación de unicidad del email
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("El email ya está registrado.");
        }

        // Validación de la unicidad del teléfono
        if (request.getTelefono() != null && usuarioRepository.existsByTelefono(request.getTelefono())) {
            throw new IllegalArgumentException("El número de teléfono ya está registrado.");
        }
        // Validación del formato del teléfono: debe iniciar con 3, seguido de un dígito entre 0 y 5, y luego 8 dígitos más
        if (request.getTelefono() != null && !PHONE_PATTERN.matcher(request.getTelefono()).matches()) {
            throw new IllegalArgumentException("El formato del teléfono no es válido.");
        }
        //Validacion telefono: no nulo, no vacío
        if (request.getTelefono() == null || request.getTelefono().trim().isEmpty()) {
            throw new IllegalArgumentException("El teléfono es obligatorio.");
        }
        
        //Validacion de la descripción del negocio: no nulo, no vacío
        if (request.getDescripcionNeg() == null || request.getDescripcionNeg().trim().isEmpty()) {
            throw new IllegalArgumentException("La descripción del negocio es obligatoria.");
        }

        // Validación de categorías: al menos 1, máximo 5
        if (request.getIdCategoriasV() == null || request.getIdCategoriasV().isEmpty()) {
            throw new IllegalArgumentException("Debe seleccionar al menos 1 categoría.");
        }
        if (request.getIdCategoriasV().size() > 5) {
            throw new IllegalArgumentException("Máximo 5 categorías permitidas.");
        }

        // Validación del contacto del vendedor: no nulo, no vacío
        if (request.getWhatsAppLink() == null || request.getWhatsAppLink().trim().isEmpty()) {
            throw new IllegalArgumentException("El contacto del vendedor es obligatorio.");
        }

        // instagramLink es opcional: si viene vacío o nulo, se guarda como null
        // (no se valida presencia, solo formato si se provee — validado en el frontend)

        // 1. Registrar Usuario General
        Usuario usuario = new Usuario();
        usuario.setEmail(request.getEmail());
        usuario.setContrasena(passwordService.hash(request.getContrasena()));
        usuario.setTelefono(request.getTelefono());
        usuario.setFechaRegis(LocalDateTime.now());

        // Rol 1 para Vendedor
        RolUsuario rol = rolUsuarioRepository.findById(1)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Rol de Vendedor no encontrado en la base de datos (se esperaba IdRol = 1)."));
        usuario.setRol(rol);

        Usuario usuarioGuardado = usuarioRepository.save(usuario);

        // 2. Guardar en tabla VENDEDORES
        Vendedor vendedor = new Vendedor();
        vendedor.setNombreNegocio(request.getNombreNegocio());
        vendedor.setNombrePropietario(request.getNombrePropietario());
        vendedor.setDescripcionNeg(request.getDescripcionNeg());
        vendedor.setWhatsAppLink(request.getWhatsAppLink());
        String ig = request.getInstagramLink();
        vendedor.setInstagramLink((ig != null && !ig.trim().isEmpty()) ? ig.trim() : null);
        vendedor.setUsuario(usuarioGuardado);
        vendedor.setActivo(false);

        // Guardar múltiples categorías
        Set<CategoriaVendedor> categorias = new HashSet<>();
        for (Integer catId : request.getIdCategoriasV()) {
            CategoriaVendedor categoria = categoriaVendedorRepository.findById(catId)
                    .orElseThrow(() -> new IllegalArgumentException("Categoría con ID " + catId + " no encontrada."));
            categorias.add(categoria);
        }
        vendedor.setCategorias(categorias);

        vendedorRepository.save(vendedor);
        return "Vendedor registrado con éxito.";
    }

    public LoginResponse login(String email, String contrasena) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("El email es obligatorio.");
        }
        if (contrasena == null || contrasena.trim().isEmpty()) {
            throw new IllegalArgumentException("La contraseña es obligatoria.");
        }

        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        
        if (usuarioOpt.isEmpty()) {
            throw new IllegalArgumentException("El usuario no existe.");
        }

        Usuario usuario = usuarioOpt.get();

        if (!passwordService.verify(contrasena, usuario.getContrasena())) {
            throw new IllegalArgumentException("Contraseña incorrecta.");
        }

        String nombre = "";
        int idRol = usuario.getRol().getIdRol();
        
        if (idRol == 1) {
            Optional<Vendedor> vendedorOpt = vendedorRepository.findByUsuarioIdUser(usuario.getIdUser());
            if (vendedorOpt.isPresent()) {
                nombre = vendedorOpt.get().getNombreNegocio();
            }
        } else if (idRol == 2) {
            Optional<Cliente> clienteOpt = clienteRepository.findByUsuarioIdUser(usuario.getIdUser());
            if (clienteOpt.isPresent()) {
                nombre = clienteOpt.get().getNombreClient();
            }
        }

        LoginResponse response = new LoginResponse(
            usuario.getIdUser(),
            usuario.getEmail(),
            nombre,
            idRol,
            usuario.getRol().getNombreRol()
        );

        return response;
    }
}
