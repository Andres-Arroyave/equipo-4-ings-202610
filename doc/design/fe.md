# Decisiones Frontend
> Proyecto: **Antojos UPB**

## Frameworks considerados

Se evaluaron tres opciones — React Native + Expo, Flutter e Ionic — dado que el proyecto requiere una aplicación móvil funcional en iOS y Android.

---

### 📱 React Native + Expo (JavaScript/TypeScript)
Framework de código abierto desarrollado por Meta que permite construir aplicaciones móviles nativas para iOS y Android usando JavaScript o TypeScript. Expo es una capa adicional sobre React Native que simplifica la configuración del entorno, el proceso de build y el despliegue, siendo ampliamente adoptado en proyectos móviles que buscan productividad sin sacrificar rendimiento.

**Ventajas**
- Permite desarrollar para iOS y Android desde una única base de código en JavaScript/TypeScript.
- Expo elimina la necesidad de configurar entornos nativos complejos como Xcode o Android Studio, reduciendo tiempos de onboarding.
- Acceso al ecosistema completo de npm, con una enorme cantidad de librerías disponibles para cualquier necesidad.
- Hot reload rápido que permite ver cambios en tiempo real durante el desarrollo.
- Soporte nativo para WebSockets, facilitando la implementación de actualizaciones de estado en tiempo real.
- React Navigation provee un sistema de navegación flexible y consistente para toda la aplicación.
- Comunidad muy activa con abundante documentación, tutoriales y soluciones a problemas comunes.

**Desventajas**
- El rendimiento puede ser inferior al de aplicaciones completamente nativas en escenarios de alta demanda gráfica.
- El puente (bridge) entre JavaScript y el código nativo puede generar bugs difíciles de depurar.
- Algunas dependencias nativas requieren configuración adicional que escapa del entorno gestionado por Expo.
- Las actualizaciones de Expo pueden romper compatibilidad con ciertas librerías de terceros.

---

### 🦋 Flutter (Dart)
Framework de código abierto desarrollado por Google que permite construir aplicaciones nativas para iOS, Android, web y escritorio desde una única base de código escrita en Dart. Usa su propio motor de renderizado (Skia/Impeller), lo que le da control total sobre la UI y garantiza consistencia visual en todas las plataformas.

**Ventajas**
- Rendimiento muy cercano al nativo gracias a su motor gráfico propio (Skia/Impeller), sin depender de puentes entre lenguajes.
- UI completamente consistente entre iOS y Android, ya que Flutter dibuja sus propios widgets en lugar de usar componentes nativos del sistema.
- Sistema de widgets muy expresivo y personalizable, ideal para interfaces con diseños complejos.
- Excelente hot reload que acelera el ciclo de desarrollo.
- Soporte para múltiples plataformas (móvil, web, escritorio) desde el mismo proyecto.

**Desventajas**
- Usa Dart como lenguaje de programación, que tiene una curva de aprendizaje para equipos que no lo conocen previamente.
- El tamaño de los archivos APK/IPA resultantes es mayor comparado con otras alternativas.
- El ecosistema de librerías es más pequeño que el de React Native/npm.
- Al no usar componentes nativos del sistema operativo, puede no seguir las convenciones visuales de iOS o Android en todos los casos.

---

### ⚡ Ionic (HTML/CSS/JavaScript)
Framework de código abierto que permite construir aplicaciones móviles híbridas usando tecnologías web estándar: HTML, CSS y JavaScript. Las aplicaciones se ejecutan dentro de un WebView nativo (a través de Capacitor o Cordova) y pueden integrarse con frameworks web como React, Vue o Angular.

**Ventajas**
- Usa tecnologías web estándar (HTML, CSS, JS), lo que facilita la incorporación de desarrolladores con experiencia web.
- Compatible con los principales frameworks web: React, Vue y Angular.
- Acceso al ecosistema completo de npm.
- Proceso de desarrollo rápido para equipos que ya dominan el desarrollo web.
- Capacitor permite acceder a funcionalidades nativas del dispositivo como cámara, GPS y notificaciones.

**Desventajas**
- El rendimiento es inferior al de React Native y Flutter, ya que la UI se renderiza dentro de un WebView y no sobre componentes nativos.
- La experiencia de usuario no se siente completamente nativa, especialmente en animaciones y transiciones.
- Problemas de rendimiento en listas largas y scroll, comunes en aplicaciones tipo catálogo.
- Las animaciones son menos fluidas comparadas con soluciones que renderizan sobre componentes nativos.
- El look and feel puede diferir del estándar de iOS o Android dependiendo de la configuración.

---

## Análisis por criterio del proyecto

| Criterio | React Native + Expo | Flutter | Ionic |
|---|---|---|---|
| Facilidad de aprendizaje | Alto | Medio | Muy alto |
| Rendimiento | Alto | Muy alto | Bajo |
| UI nativa iOS y Android | Alto | Muy alto | Medio |
| Soporte para tiempo real / WebSocket | Alto | Alto | Medio |
| Usabilidad y fluidez de la interfaz | Alto | Muy alto | Medio |
| Ecosistema de librerías | Muy alto | Alto | Alto |
| Velocidad de desarrollo (MVP) | Muy alto | Alto | Alto |

---

## 🎯 Framework Seleccionado: React Native + Expo

### ✅ Justificación

Después de comparar los frameworks disponibles (React Native + Expo, Flutter e Ionic), se selecciona React Native + Expo por las siguientes razones:

1. Permite desarrollar para iOS y Android desde una única base de código, cumpliendo directamente con el requisito de compatibilidad multiplataforma.
2. Expo simplifica el proceso de build y despliegue, eliminando la necesidad de configurar entornos nativos complejos como Xcode o Android Studio, lo que reduce el tiempo de onboarding del equipo.
3. El soporte nativo para WebSockets permite implementar la actualización de disponibilidad de los vendedores en tiempo real sin dependencias adicionales.
4. React Navigation proporciona una navegación consistente y predecible en todas las pantallas de la aplicación.
5. El acceso al ecosistema de npm garantiza que cualquier necesidad de integración (notificaciones, comunicación, mapas) tenga solución documentada disponible.
6. La comunidad activa y la extensa documentación reducen los tiempos de resolución de problemas durante el desarrollo del MVP.

### ⚖️ Alternativas descartadas

- **Flutter:** técnicamente superior en rendimiento gráfico, pero descartado por el uso de Dart, un lenguaje con curva de aprendizaje considerable, sin un beneficio proporcional para el tipo de interfaz que requiere el proyecto.
- **Ionic:** descartado porque renderiza la UI dentro de un WebView, lo que genera problemas de fluidez en listas, scroll y animaciones — incompatible con el objetivo de una interfaz intuitiva y de estilo app de domicilios que se siente nativa.

### 🚀 Conclusión

React Native + Expo es la mejor opción porque combina:

- Compatibilidad nativa con iOS y Android desde una sola base de código
- Soporte para tiempo real mediante WebSockets
- Navegación consistente con React Navigation
- Ecosistema maduro con soluciones disponibles para todas las necesidades del proyecto
- Velocidad de desarrollo adecuada para un MVP académico

El único trade-off identificado es que el rendimiento puede ser inferior al de una aplicación completamente nativa en escenarios de alta demanda gráfica, pero esto no representa un problema para las funcionalidades definidas en el alcance del proyecto.
