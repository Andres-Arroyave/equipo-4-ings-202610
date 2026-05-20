# Requisitos No Funcionales
> Proyecto: **Antojos UPB** – Plataforma digital de ventas de comida en el campus de la Universidad Pontificia Bolivariana.

---

## 📚 NF-01 – Rendimiento
### Soporte de 100 usuarios concurrentes

📝 **Descripción**
El sistema debe soportar al menos 100 usuarios concurrentes sin degradación del servicio, garantizando una experiencia fluida para todos los estudiantes que accedan simultáneamente a la plataforma.

🔎 **Criterios de aceptación**
- El sistema debe soportar 100 usuarios activos simultáneamente sin interrupciones.
- El tiempo de respuesta no debe superar los 3 segundos bajo carga máxima.

📌 **Prioridad:** P2

---

## 📚 NF-02 – Compatibilidad
### Aplicación responsive para iOS y Android

📝 **Descripción**
La aplicación debe ser responsive y funcionar correctamente en dispositivos móviles tanto iOS como Android, adaptándose a los distintos tamaños y resoluciones de pantalla de los estudiantes de la UPB.

🔎 **Criterios de aceptación**
- No debe presentar desbordamientos visuales en ningún dispositivo.
- Debe adaptarse correctamente a diferentes tamaños de pantalla.

📌 **Prioridad:** P0

---

## 📚 NF-03 – Usabilidad
### Navegación consistente

📝 **Descripción**
La navegación debe ser consistente en todas las pantallas de la aplicación, asegurando que los estudiantes puedan moverse por la plataforma de forma predecible y sin confusiones.

🔎 **Criterios de aceptación**
- El menú de navegación debe mantener su posición y estilo en todas las pantallas.
- Los botones deben conservar un diseño uniforme a lo largo de toda la aplicación.

📌 **Prioridad:** P1

---

## 📚 NF-04 – Seguridad
### Acceso exclusivo para usuarios autenticados

📝 **Descripción**
La información de contacto de los vendedores solo debe ser visible para usuarios autenticados, protegiendo los datos personales de los miembros de la comunidad "Antojos".

🔎 **Criterios de aceptación**
- Los usuarios no autenticados no pueden visualizar datos de contacto de ningún vendedor.
- El sistema debe requerir inicio de sesión para acceder a esta información.

📌 **Prioridad:** P0

---

## 📚 NF-05 – Disponibilidad
### Copia de seguridad diaria

📝 **Descripción**
Debe realizarse una copia de seguridad de la base de datos diariamente para garantizar la integridad y recuperación de la información en caso de fallo.

🔎 **Criterios de aceptación**
- El sistema debe ejecutar un backup automático cada 24 horas.
- Las copias de seguridad deben almacenarse en un servidor seguro.

📌 **Prioridad:** P3

---

## 📚 NF-06 – Diseño Visual
### Estilo tipo app de domicilios

📝 **Descripción**
La interfaz debe emular el estilo visual de aplicaciones de domicilios líderes en el mercado, generando una experiencia familiar y atractiva para los estudiantes.

🔎 **Criterios de aceptación**
- La vista principal debe presentar a los vendedores en una cuadrícula de tarjetas.
- Debe incluir íconos claros de contacto en cada tarjeta.
- Debe usar indicadores visuales de disponibilidad fácilmente reconocibles.

📌 **Prioridad:** P4

---

## 📚 NF-07 – Usabilidad
### Interfaz intuitiva

📝 **Descripción**
La interfaz debe ser intuitiva y permitir que un estudiante pueda contactar a un vendedor en el menor número de pasos posible, sin necesidad de instrucciones externas.

🔎 **Criterios de aceptación**
- Contactar a un vendedor debe requerir un máximo de 4 clics desde la pantalla principal.
- Debe existir una jerarquía visual clara que guíe al usuario durante la navegación.

📌 **Prioridad:** P1

---

## 📚 NF-08 – Disponibilidad
### Alta disponibilidad en horario académico (6:00 a 21:00)

📝 **Descripción**
La aplicación debe estar disponible y operar con alta funcionalidad durante el horario académico de la UPB, cubriendo las necesidades de los estudiantes a lo largo de la jornada.

🔎 **Criterios de aceptación**
- La aplicación debe estar completamente operativa entre las 6:00 y las 21:00 horas.
- Fuera de ese horario, el sistema puede mostrar un mensaje de "fuera de servicio".

📌 **Prioridad:** P0

---

## 📚 NF-09 – Rendimiento
### Actualización del estado en tiempo real

📝 **Descripción**
La aplicación debe reflejar el estado de disponibilidad de los vendedores en tiempo real, con un retraso máximo de 30 segundos, para que los compradores cuenten siempre con información actualizada.

🔎 **Criterios de aceptación**
- El estado de disponibilidad debe actualizarse automáticamente sin intervención del usuario.
- El retraso entre el cambio real y su reflejo en la interfaz no debe superar los 30 segundos.

📌 **Prioridad:** P2

---

## 📚 NF-10 – Seguridad
### Seguridad y cifrado de datos

📝 **Descripción**
El sistema debe garantizar la protección de los datos personales de los usuarios mediante mecanismos de seguridad adecuados, asegurando la privacidad de los miembros de la comunidad "Antojos".

🔎 **Criterios de aceptación**
- Las contraseñas deben almacenarse cifradas mediante hashing (bcrypt o equivalente).
- Toda la comunicación entre cliente y servidor debe realizarse mediante HTTPS.
- No deben mostrarse datos sensibles en texto plano en ningún momento.
- La sesión debe cerrarse automáticamente tras 30 minutos de inactividad.

📌 **Prioridad:** P0
