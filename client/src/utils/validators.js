/**
 * Expresiones regulares centrales utilizadas en los formularios.
 */
const regexName = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]{2,70}$/;
const regexEmail = /^(?=.{1,64}@)[_a-z0-9-]+(([\.])[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,6})$/;
const regexPhone = /^[3]{1}[0-5]{1}[0-9]{8}$/;
const regexText = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ0-9\s.,!?()\-]+$/;
const regexWhatsApp = /^(?:https?:\/\/)?(?:www\.)?(?:wa\.me\/|api\.whatsapp\.com\/send\/?\?phone=)(\+?\d{7,15})(?:[&?].*)?$/;
const regexInstagram = /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9._]{1,30})\/?(?:\?.*)?$/;

const ERRORS = {
    REQUIRED: "• Todos los campos marcados con * son obligatorios.",
    NAME: "• El nombre no es válido o es demasiado corto (mín. 2 letras).",
    BUSINESS_NAME: "• El nombre del negocio no es válido o es demasiado corto.",
    EMAIL: "• El correo electrónico no es válido.",
    PHONE: "• El teléfono debe empezar con 3 y tener 10 dígitos.",
    PASSWORD: "• La contraseña debe tener al menos 8 caracteres.",
    WHATSAPP: "• El enlace de WhatsApp no es válido. Ej: https://wa.me/3001234567",
    INSTAGRAM: "• El enlace de Instagram no es válido. Ej: https://instagram.com/usuario",
    DESCRIPTION: "• La descripción contiene caracteres no permitidos.",
    CATEGORY: "• Por favor selecciona una categoría."
};

/**
 * Valida los datos introducidos en el registro de Clientes.
 */
export const validateClientForm = (name, email, phone, password) => {
    let errors = [];
    if (!name || !email || !phone || !password) {
        errors.push(ERRORS.REQUIRED);
    }
    if (name && !regexName.test(name)) errors.push(ERRORS.NAME);
    if (email && !regexEmail.test(email)) errors.push(ERRORS.EMAIL);
    if (phone && !regexPhone.test(phone)) errors.push(ERRORS.PHONE);
    if (password && password.length < 8) errors.push(ERRORS.PASSWORD);
    return errors;
};

/**
 * Valida la primera fase del formulario de registro de Vendedores.
 */
export const validateVendorBasicForm = (businessName, ownerName, email, phone, password) => {
    let errors = [];
    if (!businessName || !ownerName || !email || !phone || !password) {
        errors.push(ERRORS.REQUIRED);
    }
    if (businessName && !regexName.test(businessName)) errors.push(ERRORS.BUSINESS_NAME);
    if (ownerName && !regexName.test(ownerName)) errors.push(ERRORS.NAME);
    if (email && !regexEmail.test(email)) errors.push(ERRORS.EMAIL);
    if (phone && !regexPhone.test(phone)) errors.push(ERRORS.PHONE);
    if (password && password.length < 8) errors.push(ERRORS.PASSWORD);
    return errors;
};

/**
 * Valida la identidad del negocio (Edición). 
 * Se aplican las mismas reglas que en el registro.
 */
export const validateBusinessIdentityForm = (form) => {
    let errors = [];
    if (!form.nombreNegocio?.trim() || !form.descripcionNeg?.trim()) {
        errors.push(ERRORS.REQUIRED);
    }
    if (!form.idCategoriasV || form.idCategoriasV.length === 0) {
        errors.push(ERRORS.CATEGORY);
    } else if (form.idCategoriasV.length > 5) {
        errors.push("• Máximo 5 categorías permitidas.");
    }
    if (form.nombreNegocio && !regexName.test(form.nombreNegocio)) errors.push("• Nombre de negocio inválido.");
    if (form.descripcionNeg && !regexText.test(form.descripcionNeg)) errors.push("• La presentación contiene caracteres inválidos.");
    if (form.descripcionNeg && form.descripcionNeg.length > 200) errors.push("• La presentación no puede superar los 200 caracteres.");
    return errors;
};



/**
 * Valida los datos de contacto y perfil básico.
 * Mismas reglas de nombre, teléfono y enlaces que en el registro.
 */
export const validateContactForm = (form) => {
    let errors = [];
    if (!form.nombre?.trim() || !form.telefono?.trim()) {
        errors.push(ERRORS.REQUIRED);
    }
    if (form.nombre && !regexName.test(form.nombre)) errors.push(ERRORS.NAME);
    if (form.telefono && !regexPhone.test(form.telefono)) errors.push(ERRORS.PHONE);
    if (form.whatsAppLink && !regexWhatsApp.test(form.whatsAppLink)) errors.push(ERRORS.WHATSAPP);
    if (form.instagramLink && !regexInstagram.test(form.instagramLink)) errors.push(ERRORS.INSTAGRAM);
    return errors;
};


/**
 * Valida la segunda fase del registro de Vendedores (Detalles).
 */
export const validateVendorDetailsForm = (description, categoryIds, whatsappLink, instagramLink) => {
    let errors = [];
    if (!description?.trim() || !whatsappLink?.trim()) {
        errors.push(ERRORS.REQUIRED);
    }
    if (!categoryIds || categoryIds.length === 0) {
        errors.push(ERRORS.CATEGORY);
    } else if (categoryIds.length > 5) {
        errors.push("• Máximo 5 categorías permitidas.");
    }
    if (description && !regexText.test(description)) errors.push(ERRORS.DESCRIPTION);
    if (whatsappLink && !regexWhatsApp.test(whatsappLink)) errors.push(ERRORS.WHATSAPP);
    if (instagramLink && !regexInstagram.test(instagramLink)) errors.push(ERRORS.INSTAGRAM);
    return errors;
};

/**
 * Utilidades de tiempo para el horario.
 */
export const normalizeTime = (s) => {
    if (s == null || !String(s).trim()) return '';
    const parts = String(s).trim().split(':');
    if (parts.length !== 2) return String(s).trim();
    const h = parts[0].padStart(2, '0');
    const m = parts[1].replace(/\D/g, '').slice(0, 2).padStart(2, '0');
    return `${h}:${m}`;
};

export const parseTimeToMinutes = (t) => {
    const n = normalizeTime(t);
    const parts = n.split(':');
    if (parts.length !== 2) return null;
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    if (isNaN(h) || isNaN(m)) return null;
    return h * 60 + m;
};

/**
 * Valida el horario semanal de un vendedor.
 */
export const validateVendorSchedule = (dias) => {
    for (const d of dias) {
        if (!d.activo) continue;
        const ini = normalizeTime(d.horaInicio);
        const fin = normalizeTime(d.horaFin);
        if (!ini || !fin) {
            return `En ${d.nombreDia} indica hora de inicio y fin.`;
        }
        const a = parseTimeToMinutes(ini);
        const b = parseTimeToMinutes(fin);
        if (a === null || b === null) {
            return `Formato de hora inválido en ${d.nombreDia}.`;
        }
        if (b <= a) {
            return `En ${d.nombreDia}, la hora de fin debe ser posterior a la de inicio.`;
        }
    }
    return null;
};
