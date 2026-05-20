# Requisitos Funcionales
> Proyecto: **Antojos UPB** – Plataforma digital de ventas de comida en el campus de la Universidad Pontificia Bolivariana.

---

## 🧑‍💼 Req 001 – Dos tipos de registro

📝 **Descripción:** El usuario debe poder crear 2 tipos de cuentas: Vendedor o Comprador.

📌 **Prioridad:** P0

✅ **Criterios de aceptación:**

**Scenario: Selección de tipo de cuenta durante el registro**
```gherkin
Given que el usuario accede al formulario de registro
When selecciona el tipo de cuenta "Vendedor" o "Comprador"
Then el sistema debe almacenar el rol seleccionado en la base de datos
And debe mostrar un mensaje de confirmación de registro exitoso
```

---

## 📋 Req 002 – Creación de cuenta con información personal

📝 **Descripción:** Todo usuario debe poder crear una cuenta con su información personal.

📌 **Prioridad:** P0

✅ **Criterios de aceptación:**

**Scenario: Registro exitoso con datos válidos**
```gherkin
Given que el usuario accede al formulario de registro
When ingresa su nombre completo, correo institucional y una contraseña de mínimo 8 caracteres
And el correo no está registrado previamente en el sistema
Then el sistema debe crear la cuenta correctamente
And debe mostrar un mensaje de confirmación de registro exitoso
```

**Scenario: Intento de registro con correo duplicado**
```gherkin
Given que el usuario accede al formulario de registro
When ingresa un correo institucional que ya existe en la base de datos
Then el sistema debe rechazar el registro
And debe mostrar un mensaje indicando que el correo ya está en uso
```

**Scenario: Intento de registro con contraseña inválida**
```gherkin
Given que el usuario accede al formulario de registro
When ingresa una contraseña con menos de 8 caracteres
Then el sistema debe impedir el registro
And debe mostrar un mensaje indicando el requisito mínimo de la contraseña
```

---

## ➕ Req 003 – Configuración de identidad del negocio

📝 **Descripción:** Un usuario registrado con rol de vendedor debe poder configurar la información de identidad de su negocio dentro de la plataforma, incluyendo el nombre del negocio y una presentación del emprendimiento que describa su historia o propuesta de valor.

📌 **Prioridad:** P1

✅ **Criterios de aceptación:**

**Scenario: Acceso a la edición del perfil de vendedor**
```gherkin
Given que el usuario ha iniciado sesión en el sistema
And su cuenta tiene el rol "Vendedor"
When accede a la sección de perfil de vendedor
Then el sistema debe mostrar un formulario con su información actual de identidad del negocio
```

**Scenario: Actualización de identidad del negocio**
```gherkin
Given que el vendedor se encuentra en el formulario de edición de perfil
When modifica el nombre de su negocio o su presentación del emprendimiento
And guarda los cambios
Then el sistema debe actualizar la información en la base de datos
And debe mostrar un mensaje confirmando que la información fue actualizada correctamente
```

---

## ✏️ Req 004 – Edición de datos de contacto

📝 **Descripción:** Cada usuario, sea comprador o vendedor debe poder editar su información de contacto (teléfono, WhatsApp, redes sociales).

📌 **Prioridad:** P1

✅ **Criterios de aceptación:**

**Scenario: Edición exitosa de información de contacto**
```gherkin
Given que el usuario ha iniciado sesión
And está en la vista de su perfil
When modifica su teléfono, WhatsApp o redes sociales
And guarda los cambios
Then el sistema debe actualizar la información en la base de datos
And debe mostrar un mensaje de confirmación de actualización exitosa
```

---

## 🕐 Req 005 – Establecer horario de disponibilidad

📝 **Descripción:** Los vendedores deben poder establecer su horario de disponibilidad por días de la semana.

📌 **Prioridad:** P0

✅ **Criterios de aceptación:**

**Scenario: Configuración exitosa de horario semanal**
```gherkin
Given que el vendedor ha iniciado sesión 
And está en la vista de configuración de horario
When selecciona los días de la semana en que estará disponible
And define la hora de inicio y hora de fin para cada día
Then el sistema debe almacenar el horario correctamente en la base de datos
```

**Scenario: Intento de guardar un horario inválido**
```gherkin
Given que el vendedor está configurando su horario
When ingresa una hora de fin anterior a la hora de inicio
Then el sistema debe rechazar el horario
And debe mostrar un mensaje de error indicando que el horario es inválido
```

---

## 🗂️ Req 006 – Visualización en cuadrículas por vendedor para compradores

📝 **Descripción:** La información de cada vendedor debe mostrarse en tarjetas que indiquen su disponibilidad y productos.

📌 **Prioridad:** P4

✅ **Criterios de aceptación:**

**Scenario: Visualización correcta de las tarjetas de vendedores**
```gherkin
Given que el usuario accede a la vista principal de vendedores
Then el sistema debe mostrar los vendedores en formato de tarjetas (grid)
And cada tarjeta debe mostrar el nombre, los productos y el estado de disponibilidad del vendedor
And la vista debe adaptarse correctamente a dispositivos móviles
```

---

## 🔄 Req 007 – Gestión y visualización del estado del vendedor

📝 **Descripción:** El sistema debe determinar automáticamente el estado del vendedor según su horario registrado y mostrarlo visualmente en la tarjeta del vendedor.

📌 **Prioridad:** P2

✅ **Criterios de aceptación:**

**Scenario: Actualización automática del estado**
```gherkin
Given que el vendedor tiene un horario de disponibilidad registrado
When el sistema verifica la hora actual
Then el estado del vendedor debe actualizarse automáticamente
And la actualización debe ocurrir cuando el usuario consulte la lista de vendedores
```

**Scenario: Vendedor disponible en campus**
```gherkin
Given que el vendedor está dentro de su horario registrado
And ha indicado que se encuentra en el campus de la UPB
When el usuario consulta la lista de vendedores
Then la tarjeta del vendedor debe mostrarse en color blanco hueso
And debe mostrar el indicador "Abierto"
```

**Scenario: Vendedor no disponible**
```gherkin
Given que el vendedor está fuera de su horario
When el usuario consulta la lista de vendedores
Then la tarjeta del vendedor debe mostrarse en color gris
And debe mostrar la etiqueta "Cerrado"
```

---

## ⏱️ Req 008 – Sobrescritura manual del estado del vendedor

📝 **Descripción:** Un vendedor debe poder sobrescribir temporalmente su estado de disponibilidad mediante un botón, permitiéndole marcarse como "Abierto" o "Cerrado" por un tiempo determinado, independientemente de su horario registrado.

📌 **Prioridad:** P2

✅ **Criterios de aceptación:**

**Scenario: Activación manual del estado**
```gherkin
Given que el vendedor ha iniciado sesión en el sistema
And se encuentra en su panel de vendedor
When presiona el botón de control de disponibilidad
Then el sistema debe permitirle seleccionar el estado "Abierto" o "Cerrado"
And debe permitirle definir una duración para dicho estado
```

**Scenario: Sobrescritura manual a estado abierto**
```gherkin
Given que el vendedor ha activado la sobrescritura manual
When selecciona el estado "Abierto" por un tiempo determinado
Then el sistema debe mostrar al vendedor como "Abierto" durante ese tiempo
```

**Scenario: Sobrescritura manual a estado cerrado**
```gherkin
Given que el vendedor ha activado la sobrescritura manual
When selecciona el estado "Cerrado" por un tiempo determinado
Then el sistema debe mostrar al vendedor como "Cerrado" durante ese tiempo
```

**Scenario: Finalización del tiempo de sobrescritura**
```gherkin
Given que el vendedor activó una sobrescritura manual por un tiempo determinado
When el tiempo definido finaliza
Then el sistema debe restaurar automáticamente el estado calculado según el horario registrado
```

---

## 🏷️ Req 009 – Selección de categoría de productos

📝 **Descripción:** Los vendedores deben poder seleccionar una o varias categorías que representen el tipo de productos o servicios que ofrecen.

📌 **Prioridad:** P0

✅ **Criterios de aceptación:**

**Scenario: Selección de categoría durante la configuración del perfil**
```gherkin
Given que el vendedor está en la vista de configuración de su perfil
When selecciona una o varias categorías de productos disponibles
And guarda los cambios
Then el sistema debe almacenar las categorías seleccionadas en la base de datos
And estas deben mostrarse en el perfil público del vendedor
```

---

## 📷 Req 010 – Foto de perfil del vendedor

📝 **Descripción:** El sistema debe permitir subir una foto de perfil para cada vendedor.

📌 **Prioridad:** P1

✅ **Criterios de aceptación:**

**Scenario: Carga exitosa de foto de perfil**
```gherkin
Given que el vendedor está en la vista de configuración de su perfil
When sube una imagen en formato JPG o PNG con un tamaño máximo de 5MB
Then el sistema debe guardar la imagen correctamente
And debe mostrarse en la tarjeta del vendedor dentro de la plataforma
```

**Scenario: Intento de subir un archivo inválido**
```gherkin
Given que el vendedor intenta subir una foto de perfil
When el archivo supera los 5MB o no es formato JPG o PNG
Then el sistema debe rechazar el archivo
And debe mostrar un mensaje indicando los formatos y tamaño permitidos
```

---

## 📝 Req 011 – Descripción del catálogo de productos

📝 **Descripción:** Los vendedores deben poder agregar una descripción breve de los productos o servicios específicos que ofrecen, la cual será visible públicamente en su tarjeta y perfil dentro de la plataforma.

📌 **Prioridad:** P0

✅ **Criterios de aceptación:**

**Scenario: Agregar descripción del catálogo de productos**
```gherkin
Given que el vendedor está en la vista de configuración de su perfil
When ingresa una descripción de sus productos o servicios de máximo 200 caracteres
And guarda los cambios
Then la descripción debe almacenarse correctamente en la base de datos
And debe mostrarse en la tarjeta pública y en el perfil del vendedor
```

**Scenario: Intento de ingresar descripción que supera el límite**
```gherkin
Given que el vendedor está redactando la descripción de su catálogo
When el texto supera los 200 caracteres
Then el sistema debe impedir seguir escribiendo o mostrar una advertencia
And no debe permitir guardar una descripción que exceda el límite
```

**Scenario: Distinción visual entre identidad del negocio y catálogo**
```gherkin
Given que el usuario consulta el perfil público de un vendedor
When visualiza la información del vendedor
Then el sistema debe mostrar la presentación del emprendimiento y la descripción del catálogo en secciones claramente diferenciadas
And cada sección debe tener una etiqueta que identifique su propósito
```

---

## 🔍 Req 012 – Filtrar vendedores por tipo de producto

📝 **Descripción:** Los usuarios deben poder filtrar vendedores por tipo de producto o servicio.

📌 **Prioridad:** P0

✅ **Criterios de aceptación:**

**Scenario: Filtrado exitoso por categoría**
```gherkin
Given que el usuario está en la vista principal de vendedores
And existen vendedores con diferentes categorías de productos
When selecciona una categoría desde el filtro disponible
Then el sistema debe actualizar dinámicamente la lista
And debe mostrar únicamente los vendedores que pertenecen a la categoría seleccionada
```

---

## 🔎 Req 013 – Buscar vendedores por nombre

📝 **Descripción:** Los usuarios deben poder buscar vendedores por nombre.

📌 **Prioridad:** P0

✅ **Criterios de aceptación:**

**Scenario: Búsqueda exitosa por nombre**
```gherkin
Given que el usuario está en la vista principal de vendedores
And existe una barra de búsqueda visible
When escribe el nombre o parte del nombre de un vendedor
Then el sistema debe actualizar los resultados en tiempo real
And debe mostrar todos los vendedores cuyo nombre coincida parcial o totalmente con el texto ingresado
```

**Scenario: Búsqueda sin resultados**
```gherkin
Given que el usuario escribe un nombre en la barra de búsqueda
When el sistema no encuentra ningún vendedor con ese nombre
Then debe mostrar un mensaje indicando que no se encontraron resultados
```

---

## 📅 Req 014 – Ver horario semanal del vendedor

📝 **Descripción:** Los usuarios deben poder ver el horario completo semanal de cada vendedor.

📌 **Prioridad:** P0

✅ **Criterios de aceptación:**

**Scenario: Visualización del horario semanal**
```gherkin
Given que el usuario consulta el perfil de un vendedor
When accede a la sección de horario
Then el sistema debe mostrar una tabla o lista organizada por días de la semana
And debe indicar claramente la hora de inicio y la hora de fin de atención para cada día disponible
```

---

## 🟢 Req 015 – Filtrar vendedores por disponibilidad

📝 **Descripción:** Debe poder filtrarse la lista de vendedores por estado: disponible o no disponible.

📌 **Prioridad:** P1

✅ **Criterios de aceptación:**

**Scenario: Filtrado por estado de disponibilidad**
```gherkin
Given que el usuario está en la vista principal de vendedores
When selecciona el filtro "Disponible" o "No disponible"
Then el sistema debe actualizar la lista mostrando únicamente los vendedores que correspondan al estado seleccionado
And no debe requerir recargar la página manualmente
```

---

## 🚩 Req 016 – Reportar vendedores

📝 **Descripción:** Debe permitirse reportar vendedores inactivos o con información incorrecta.

📌 **Prioridad:** P3

✅ **Criterios de aceptación:**

**Scenario: Reporte exitoso de un vendedor**
```gherkin
Given que el usuario está en la tarjeta o perfil de un vendedor
And existe un botón "Reportar" visible
When hace clic en el botón
And selecciona o ingresa el motivo del reporte
And confirma el envío
Then el sistema debe almacenar el reporte en la base de datos
And debe mostrar un mensaje de confirmación indicando que el reporte fue enviado
```

---

## ⏰ Req 017 – Ventana emergente para extender horario

📝 **Descripción:** El sistema debe mostrar una ventana emergente para que el vendedor pueda extender su horario antes de que cierre.

📌 **Prioridad:** P4

✅ **Criterios de aceptación:**

**Scenario: Notificación de cierre próximo**
```gherkin
Given que el vendedor tiene una sesión activa
And faltan 15 minutos para que su horario de atención finalice
When el sistema detecta ese umbral de tiempo
Then debe mostrarse una notificación o ventana emergente informando que el horario está por cerrar
And debe ofrecer al vendedor la opción de extender su horario manualmente
```

**Scenario: Extensión de horario exitosa**
```gherkin
Given que el vendedor recibió la notificación de cierre próximo
When selecciona la opción de extender su horario
Then el sistema debe actualizar la hora de cierre
And el estado del vendedor debe permanecer como "Disponible" durante el tiempo extendido
```

---

## 🗺️ Req 018 – Mapa estático de ubicación

📝 **Descripción:** El sistema debe mostrar un mapa no interactivo con la ubicación de los vendedores con local fijo en el campus.

📌 **Prioridad:** P4

✅ **Criterios de aceptación:**

**Scenario: Visualización del mapa estático**
```gherkin
Given que el usuario consulta el perfil de un vendedor con local fijo en el campus
When accede a la sección de ubicación
Then el sistema debe mostrar una imagen estática con la ubicación del vendedor
And el mapa no debe permitir zoom ni desplazamiento
```

---

## 💬 Req 019 – Contacto con el vendedor vía WhatsApp

📝 **Descripción:** El sistema debe permitir al comprador iniciar una conversación con el vendedor a través de WhatsApp, redirigiendo al número registrado por el vendedor en su perfil.

📌 **Prioridad:** P0

✅ **Criterios de aceptación:**

**Scenario: Contactar a un vendedor desde su perfil**
```gherkin
Given que el usuario está en la vista de un vendedor específico
And el vendedor tiene un número de WhatsApp registrado en su perfil
When selecciona el botón "Contactar por WhatsApp"
Then el sistema debe abrir WhatsApp con el número del vendedor
And debe incluir un mensaje de texto predefinido que mencione la plataforma
```

**Scenario: Vendedor sin número registrado**
```gherkin
Given que el usuario está en la vista de un vendedor específico
And el vendedor no tiene un número de WhatsApp registrado
When intenta contactarlo
Then el sistema debe ocultar o deshabilitar el botón de contacto
And debe mostrar un mensaje indicando que el vendedor no tiene medio de contacto disponible
```

---

## ⭐ Req 020 – Sistema de calificación de vendedores

📝 **Descripción:** Los usuarios deben poder calificar y dejar una reseña a un vendedor después de haber interactuado con él.

📌 **Prioridad:** P2

✅ **Criterios de aceptación:**

**Scenario: Calificación exitosa de un vendedor**
```gherkin
Given que el usuario ha tenido una interacción con un vendedor
And aún no ha calificado dicha interacción
When selecciona entre 1 y 5 estrellas para calificar al vendedor
And opcionalmente escribe una reseña de máximo 250 caracteres
And envía la calificación
Then el sistema debe almacenar la calificación y reseña en la base de datos
And la calificación promedio del vendedor debe actualizarse y mostrarse en su tarjeta
```

**Scenario: Intento de calificar más de una vez la misma interacción**
```gherkin
Given que el usuario ya calificó una interacción específica con un vendedor
When intenta enviar una nueva calificación para esa misma interacción
Then el sistema debe impedir la acción
And debe mostrar un mensaje indicando que ya realizó una calificación para esa interacción
```
