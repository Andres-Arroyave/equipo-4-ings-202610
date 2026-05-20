# Decisiones Backend
> Proyecto: **Antojos UPB**

## Frameworks considerados

Se evaluaron cinco opciones — Spring Boot, NestJS, Express.js, Django REST Framework y FastAPI — considerando los requisitos del sistema y la decisión previa de usar React Native + Expo con TypeScript en el frontend.

---

### 🌼 Spring Boot (Java)
Framework que simplifica el desarrollo de aplicaciones Java empresariales, proporcionando configuración automática y un enfoque de convención sobre configuración. Es ampliamente adoptado en sistemas de gran escala y cuenta con un ecosistema maduro para seguridad, acceso a datos y comunicación en tiempo real.

**Ventajas**
- Alta escalabilidad y rendimiento para aplicaciones con alta concurrencia.
- Spring Security ofrece autenticación JWT, control de acceso por roles y protección contra ataques comunes de forma integrada.
- Soporte nativo para WebSockets con STOMP, sin necesidad de dependencias externas.
- Spring Data JPA con Hibernate simplifica el acceso a bases de datos relacionales y el manejo de migraciones.
- Arquitectura en capas (Controller → Service → Repository) bien definida, que facilita el trabajo colaborativo en equipos.
- Documentación extensa y comunidad muy activa.
- Muy valorado en el mercado laboral.

**Desventajas**
- El lenguaje (Java) es diferente al del frontend (TypeScript), lo que implica dos contextos distintos en el stack.
- Tiempo de arranque más lento en comparación con frameworks basados en Node.js, debido a la JVM.
- Más verboso que otras alternativas para definir endpoints simples.
- Puede requerir configuración inicial considerable.

---

### 🐦 NestJS (Node.js)
Framework backend opinionado para Node.js construido sobre TypeScript. Inspirado en la arquitectura de Angular, organiza el código en módulos, controladores y servicios. Es una de las opciones más estructuradas del ecosistema JavaScript/TypeScript para construir APIs escalables.

**Ventajas**
- TypeScript nativo, lo que permite compartir el mismo lenguaje con el frontend en React Native + Expo.
- Soporte oficial para WebSockets mediante `@nestjs/websockets`, facilitando comunicación en tiempo real.
- Módulo `@nestjs/jwt` con Guards integrado para autenticación y protección de rutas.
- Arquitectura modular y opinionada que impone convenciones claras al equipo.
- Acceso al amplio ecosistema de paquetes de npm.
- Documentación automática compatible con Swagger/OpenAPI.

**Desventajas**
- Curva de aprendizaje por la estructura de módulos y decoradores, especialmente para quienes vienen de otros paradigmas.
- El ecosistema de plugins es menor comparado con frameworks más maduros como Spring Boot.
- Requiere conocimiento previo de TypeScript y Node.js para aprovecharlo bien.

---

### 🚅 Express.js (Node.js)
Framework web minimalista y flexible para Node.js, ampliamente utilizado para construir APIs REST. No impone ninguna estructura ni convención, lo que lo hace muy configurable pero también demandante en términos de organización del proyecto.

**Ventajas**
- Muy rápido de aprender y de poner en marcha.
- Acceso al ecosistema completo de npm con una enorme cantidad de middlewares disponibles.
- Manejo natural de JSON para APIs REST.
- Flexible y altamente personalizable.
- Muy usado en la industria, con abundantes recursos de aprendizaje.

**Desventajas**
- No impone ninguna estructura, lo que puede generar código inconsistente en proyectos de equipo.
- JWT, WebSockets y validación requieren configuración manual con librerías adicionales.
- La seguridad no es robusta por defecto y depende completamente de configuraciones adicionales.
- No trae ORM oficial; la integración con bases de datos debe configurarse por separado.
- Tipado débil en JavaScript puro, lo que puede generar errores en tiempo de ejecución.

---

### 🐍 Django REST Framework (Python)
Framework backend de alto nivel basado en Python que sigue el principio de "baterías incluidas". Construido sobre Django, provee herramientas completas para autenticación, manejo de base de datos, serialización y panel de administración de forma nativa.

**Ventajas**
- Autenticación y permisos integrados, sin necesidad de librerías externas.
- ORM propio robusto, fácil de usar con bases de datos relacionales como PostgreSQL y MySQL.
- Panel de administración automático para gestión de datos.
- Protección integrada contra ataques comunes como SQL Injection, XSS y CSRF.
- Documentación muy completa y comunidad grande.

**Desventajas**
- Introduce Python como un lenguaje adicional en el stack, separado del frontend (TypeScript) y del ecosistema Java.
- El soporte para WebSockets es un complemento externo (Django Channels) que añade complejidad operativa.
- Puede sentirse pesado y excesivo para APIs simples o MVPs livianos.
- Estructura más rígida que sigue convenciones estrictas del framework.
- Menor rendimiento comparado con alternativas asíncronas para APIs puras.

---

### 🏃 FastAPI (Python)
Framework moderno y ligero de alto rendimiento para Python, diseñado específicamente para crear APIs rápidas y eficientes con tipado automático y documentación interactiva. Usa ASGI, lo que le da soporte nativo para programación asíncrona.

**Ventajas**
- Uno de los frameworks más rápidos para Python gracias a su arquitectura ASGI y soporte para async/await.
- Genera automáticamente documentación interactiva en OpenAPI y Swagger.
- Validación automática de datos de entrada y salida mediante Pydantic.
- Soporte completo para type hints de Python, reduciendo errores en tiempo de ejecución.
- Flexible para trabajar con bases de datos SQL (PostgreSQL, SQLAlchemy) y NoSQL (MongoDB).

**Desventajas**
- Introduce Python como un lenguaje adicional en el stack, separado del ecosistema del frontend y del backend en Java.
- Ecosistema más joven con menor cantidad de plugins y recursos comparado con Django o Spring Boot.
- Requiere entendimiento de conceptos de programación asíncrona (async/await).
- La autenticación, administración y otros módulos deben configurarse manualmente por separado.

---

## Análisis por criterio del proyecto

| Criterio | Spring Boot | NestJS | Express | Django | FastAPI |
|---|---|---|---|---|---|
| Rendimiento y concurrencia | Alto | Alto | Alto | Alto | Muy alto |
| Soporte para WebSockets | Alto | Muy alto | Alto | Medio | Medio |
| Seguridad y autenticación JWT | Muy alto | Alto | Medio | Alto | Alto |
| Escalabilidad | Alto | Alto | Alto | Alto | Muy alto |
| Estructura para trabajo en equipo | Muy alto | Muy alto | Bajo | Alto | Medio |
| Velocidad de desarrollo (MVP) | Alto | Medio | Medio | Bajo | Medio |

---

## 🎯 Framework Seleccionado: Spring Boot (Java)

### ✅ Justificación

Después de comparar diferentes frameworks (Spring Boot, NestJS, Express.js, Django REST Framework y FastAPI), se selecciona Spring Boot por las siguientes razones:

1. El equipo tiene experiencia previa con Java, lo que elimina la curva de aprendizaje de lenguaje y permite enfocarse en construir el producto desde el primer día.
2. Spring Security provee autenticación JWT y control de acceso por roles de forma robusta y probada en producción, cubriendo directamente NF-04 y NF-10.
3. Spring WebSocket con STOMP permite implementar el estado en tiempo real de los vendedores (NF-09) de forma nativa, sin dependencias externas.
4. La arquitectura en capas (Controller → Service → Repository) es una convención clara que facilita dividir tareas entre los integrantes del equipo sin conflictos estructurales.
5. Spring Data JPA con Hibernate simplifica el acceso a la base de datos y el manejo de migraciones, acelerando el desarrollo del MVP.
6. El modelo de concurrencia de Spring Boot soporta con holgura los 100 usuarios simultáneos requeridos en NF-01.

### ⚖️ Alternativas descartadas

- **NestJS:** segunda opción más fuerte por compartir TypeScript con el frontend, pero descartado porque el equipo no domina Node.js/TypeScript, lo que representaría una curva de aprendizaje significativa durante la fase de MVP.
- **Express.js:** flexible y fácil de arrancar, pero su naturaleza minimalista y sin convenciones genera inconsistencias estructurales en equipos. Además, JWT y WebSockets requieren configuración manual adicional.
- **Django REST Framework:** robusto y con autenticación integrada, pero introduce Python como un tercer lenguaje en el stack sin que el equipo tenga experiencia en él. El soporte para WebSockets es un add-on externo (Django Channels).
- **FastAPI:** muy alto rendimiento asíncrono, pero al igual que Django introduce Python y su ecosistema para autenticación móvil es más limitado. El equipo tampoco tiene experiencia en este lenguaje.

### 🚀 Conclusión

Spring Boot es la mejor opción porque combina:

- Dominio del lenguaje por parte del equipo (Java)
- Seguridad robusta y probada (Spring Security + JWT)
- Soporte nativo para tiempo real (Spring WebSocket + STOMP)
- Arquitectura estructurada y apta para trabajo colaborativo
- Escalabilidad suficiente para los requisitos del proyecto

El único reto identificado es que el backend (Java) y el frontend (TypeScript) no comparten lenguaje, pero esto es completamente normal en arquitecturas cliente-servidor reales y no representa ningún problema técnico. La ganancia en productividad al trabajar en el lenguaje dominado por el equipo justifica ampliamente este trade-off.

