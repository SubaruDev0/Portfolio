# 📘 Guía Maestra de Desarrollo: SubaruDev Portfolio

¡Hola Javier! Has pasado de Django y CSS puro al mundo de **Next.js 14** con el motor de animaciones de **midudev**. Esta guía está diseñada para que entiendas **todo** (absolutamente todo) lo que hay bajo el capó, comparándolo con lo que ya conoces.

---

## 🐣 0. El Origen: ¿Cómo se creó esto?

El primer comando que lancé para crear los cimientos de tu sitio fue:
`npx create-next-app@14 subarudev-portfolio --typescript --tailwind --eslint`

Esto generó automáticamente una estructura de carpetas que puede parecer abrumadora, pero aquí te explico para qué sirve cada una:

### 📁 Carpetas Raíz
*   **`node_modules/`**: Aquí viven todas las librerías que instalamos (como si fuera el `env` de Python). **Nunca la toques.**
*   **`public/`**: Es la carpeta donde guardamos archivos estáticos (imágenes, iconos, tu CV). Todo lo que pongas aquí se puede ver desde el navegador (ej: `public/foto.jpg` -> `tusitio.com/foto.jpg`).
*   **`src/`**: Es el corazón del proyecto. Aquí está todo tu código.

### 📁 Dentro de `src/`
*   **`app/`**: Aquí ocurre la magia de las rutas. Cada carpeta dentro es una URL.
    *   `layout.tsx`: Es como el "esqueleto" de tu HTML (donde va el `head`, el `body` común, etc.).
    *   `page.tsx`: Es el contenido de tu página de inicio.
    *   `globals.css`: Donde vive tu CSS base (incluyendo Tailwind).
*   **`components/`**: Aquí guardamos las "piezas de LEGO" reutilizables (Botones, Navbar, etc.).
*   **`data/`**: Contiene archivos de datos (como `projects.ts`), que actúan como tu "base de datos" local.

---

## 🏗️ 1. El Cambio de Mentalidad: De Django a React/Next.js

En Django, tienes **Templates (HTML)**, **Views (Lógica)** y **Models (Datos)**. Aquí, todo se fusiona en **Componentes**.

### ¿Qué es un Componente?
Piensa en el `Navbar` o la `ProjectCard` como piezas de una máquina. Cada pieza tiene su propio HTML, su propio estilo y su propia lógica en un solo archivo `.tsx`.
- **Ventaja**: Si quieres cambiar cómo se ve una tarjeta de proyecto, solo editas `src/components/ProjectCard.tsx` y se actualiza en todos lados.

### El "App Router" (La carpeta `src/app`)
- En Django, las rutas se definen en `urls.py`. 
- En Next.js, **la carpeta es la ruta**.
    - `src/app/page.tsx` -> Es tu página de inicio (`/`).
    - `src/app/admin/page.tsx` -> Es tu panel de administración (`/admin`).

---

## 🎨 2. Tailwind CSS: Olvida los archivos `.css` gigantes

En CSS puro, escribes:
```css
.mi-boton { background-color: blue; padding: 10px; border-radius: 5px; }
```
En **Tailwind**, escribes clases directamente en el HTML:
```html
<button class="bg-blue-500 p-2 rounded-md">Botón</button>
```
**¿Por qué es mejor?** No tienes que inventar nombres de clases (como `.container-v2-final`) y ves el estilo directamente donde está el código.

---

## 🔐 Panel de Administración (Sistema Maestro)

El panel `/admin` ha sido reforzado para que puedas gestionar tus proyectos de forma segura y profesional.

- **URL:** [http://localhost:3001/admin](http://localhost:3001/admin)
- **Contraseña de Acceso:** `Mabel#zer0` (Configurable en BD)

### 🚀 Seguridad y UX de Élite:
1.  **Pantalla de Acceso (Login Gate):** 
    - Ahora el panel no es visible directamente. Verás una pantalla de "Verificación de Identidad" con un diseño minimalista y efectos de cristal.
    - La contraseña se verifica en el **servidor** (Server Actions), lo que significa que la clave nunca viaja al navegador ni se queda guardada en el código del cliente.
2.  **Protección de Datos (DB-Based Auth):** 
    - La contraseña reside en la tabla `admin_auth`. 
    - **Cero Código Hardcoded**: Si alguien descarga tu repositorio, no podrá saltarse el acceso ni ver la clave "inspeccionando el código".
3.  **Gestión Inteligente de Activos:**
    - Ya puedes subir múltiples capturas de pantalla en la sección **Galería**.
    - El portafolio mostrará un carrusel dinámico con fotos si el proyecto no tiene Live Demo.
4.  **Sistema de Reordenamiento:**
    - ¿Quieres que un certificado o proyecto aparezca antes? Usa las flechas subida/bajada al lado de cada ítem para cambiar su prioridad en tiempo real.
5.  **Tecnologías Dinámicas**: 
    - El sistema sugiere tecnologías automáticamente basándose en tus proyectos anteriores para mantener consistencia visual.
6.  **Mapeo de Iconos Personalizado**: 
    - Si una tecnología no tiene icono (ej: "Virus"), ahora puedes especificar un "Slug" en el panel de admin (ej: `platformio`) para que el sistema use ese logo manteniendo el nombre original.
7.  **Prioridades Maestras del Portafolio**:
    - El orden de los proyectos ahora sigue una jerarquía lógica de "Ingeniería":
        1. **Destacado + Producción**: Máximo nivel (Estrella + Maletín).
        2. **Destacado**: (Estrella).
        3. **Producción**: Sistemas reales validados (Maletín Emerald).
        4. **Orden Manual**: El que establezcas con las flechas en el Admin.

---

## 🎨 3. El Motor de Animaciones (Midu-Style) e Interacción de Élite

Aquí es donde nos pusimos serios. Querías un portafolio de **Ingeniería**, y lo hemos llevado al siguiente nivel con detalles de micro-interacción:

### ¿Cómo lo hemos solucionado? (El "Bridge")
Hemos creado un "Puente" en el archivo `tailwind.config.ts`. Si lo abres, verás una sección llamada `keyframes` y `animation`.
1. **Keyframes**: Son los pasos de la animación. (Ej: "En el 0% no te veas, en el 100% que aparezcas con blur").
2. **Animation**: Es el nombre corto que le damos para usarlo en el código.
   - Ejemplo: `animate-blurred-fade-in` es puro estilo Midu.

### 🧬 Detalles de Ingeniería (UX/UI de Alta Gama):
- **Efecto de "Revelado" de Tecnologías**: 
    - Las tecnologías en las tarjetas tienen un fondo oscuro (`bg-black/60`) y `backdrop-blur` para máxima legibilidad. 
    - Al pasar el cursor por la **tarjeta entera**, los iconos cobran vida (pasan de una opacidad tenue a un blanco brillante).
- **Tratamiento de Markdown para Previsualización**:
    - Hemos creado una utilidad (`src/utils/text.ts`) que limpia los símbolos de Markdown (`###`, `**`, `>`) de las tarjetas.
    - Esto asegura que la previsualización se vea fluida y profesional sin mostrar "basura" visual de código.
- **Sincronía Cromática (Certificados)**:
    - Los certificados ahora detectan el color de la "metamorfosis" actual (Frontend, Backend, etc.).
    - Al pasar el ratón, el título del certificado cambia dinámicamente al color del tema seleccionado.
- **Anti-Aliasing de Imágenes**:
    - Las imágenes de las tarjetas usan `transform-gpu` y una escala base de `1.01`. Esto soluciona un bug clásico de los navegadores donde las imágenes muestran líneas blancas o bordes pixelados al escalarse.

---

## 🧬 4. La Lógica de "Metamorfosis" (State Management)

En la página principal (`src/app/page-client.tsx`), verás una línea que dice:
`const [theme, setTheme] = useState<ThemeType>('all');`

Esto es el **Estado**. 
- Cuando haces clic en el seleccionador de temas, `setTheme` cambia el valor.
- React detecta ese cambio y **redibuja** toda la página instantáneamente con los nuevos colores de la categoría (Azul para Frontend, Rojo para Backend, etc.).
- No hay recargas de página (F5), todo fluye en el navegador del usuario.

### ¿Cómo funciona el cambio de color dinámico?
Usamos una función llamada `getThemeColors(theme)` ubicada en `src/utils/theme.ts`. Esta función devuelve un objeto con el color en formato HEX. 
Luego, en el código, inyectamos ese color directamente en el atributo `style` de los elementos:
```tsx
style={{ color: themeColors.hex }} // Para texto
style={{ backgroundColor: themeColors.hex }} // Para fondos
```

### El Filtro de Proyectos (`useMemo`)
Usamos algo llamado `useMemo` para que, cada vez que cambies el tema o filtres por tecnología, la computadora no trabaje de más. Solo recalcula qué proyectos mostrar si realmente algo cambió.

---

## 🏎️ 5. El Carrusel de Alto Rendimiento (Framer Motion Physics)

Este no es un carrusel normal. Es un sistema de **físicas de partículas** aplicado a imágenes.

### El Secreto del Movimiento Infinito
Usamos tres herramientas clave de la librería `framer-motion`:
1.  **`useMotionValue(x)`**: Es un valor de posición súper rápido que no hace que React se ralentice.
2.  **`useAnimationFrame`**: Es un bucle que corre 60 veces por segundo. En cada cuadro, calculamos `está posición + velocidad`.
3.  **Wrapping Matemático**: 
    ```tsx
    if (latest <= -totalWidth * 2) x.set(latest + totalWidth);
    ```
    Cuando el carrusel se mueve hacia la izquierda y llega al final del segundo set de imágenes, lo movemos instantáneamente al inicio del primer set. Como todas las imágenes son clones, es un bucle infinito perfecto (sin saltos visuales).

### Inercia y Momentum (Modo Divertido)
Al añadir `drag="x"`, permitimos que uses el ratón como si estuvieras moviendo algo físico. 
- Usamos `dragTransition={{ power: 0.8, timeConstant: 200 }}` para que, al soltarlo, el carrusel siga girando solo y se detenga gradualmente con fricción, como una rueda de la fortuna.

---

## 🛠️ 6. Arquitectura de Modales Globales (Z-Index Fix)

Tuvimos un problema técnico: los modales no se veían. Esto pasaba porque el carrusel tiene una propiedad llamada `transform` (para moverse), y en el mundo web, eso crea un "caparazón" que bloquea a los elementos con `position: fixed`.

### ¿Cómo lo arreglamos? (State Lifting)
1.  **Sacamos los Modales del Carrusel**: Los movimos al final de `HomeClient`, cerca del `</footer>`.
2.  **Referencia por Estado**: Creamos `activeProject` y `activeCertificate`. 
3.  **Comunicación**: Cuando haces clic en una tarjeta, esta envía un mensaje: *"Oye, muéstrame a mí"*. `HomeClient` captura ese mensaje, guarda el objeto en el estado, y renderiza el modal correspondiente en la raíz de la página, por encima de todo.

---

## 💾 7. Pipeline de Datos y Assets (Base64)

Para que el sitio funcione en **Vercel** sin problemas de permisos de escritura, cambiamos el sistema de archivos local por una base de datos **Neon (PostgreSQL)**.

- **Imágenes como Texto**: Cuando subes una foto en el panel admin, la convertimos a una cadena **Base64** (un texto larguísimo que representa la imagen). 
- **Ventaja**: El sitio es totalmente "Serverless". No necesitamos un servidor de archivos externo; todo vive dentro de tu base de datos.
- **CV Inteligente**: Tu CV se guarda igual. Cuando alguien pulsa "Descargar CV", reconstruimos el PDF desde ese texto Base64 en un milisegundo.

---

## 📁 8. Estructura de Archivos (Para que no te pierdas)

- `/src/app/`: Las páginas del sitio.
- `/src/components/`: Los botones, barras de navegación y tarjetas.
- `/src/data/projects.ts`: **Tu base de datos**. Como no estamos usando una base de datos SQL como en Django (todavía), usamos este archivo de texto para guardar tus proyectos.
- `/src/utils/theme.ts`: Aquí es donde definí los códigos de colores (HEX) para cada metamorfosis.
- `/tailwind.config.ts`: El "cerebro" de los estilos y animaciones.

---

## 🚀 6. Cómo trabajar tú solo

### Añadir un proyecto (El modo PRO)
1. Entra en `localhost:3001/admin` y pon la contraseña `mabel123`.
2. Completa el formulario con el título, descripción, urls y **selecciona las tecnologías del Combobox**.
3. Si la tecnología no existe, escríbela y presiona "Añadir".
4. Dale a **Guardar Proyecto**.
5. Abre la consola de desarrollador (F12) en el navegador. Verás un objeto de código ya formateado.
6. Copia ese objeto y pégalo dentro de la lista en `src/data/projects.ts`.

### Probar cambios
Asegúrate de tener la terminal abierta y escribir:
`npm run dev` (o `npm run dev-port` si el puerto 3000 está ocupado).
Luego abre [http://localhost:3001](http://localhost:3001).

---

## ⚠️ 7. Recordatorios para SubaruDev

1. **LinkedIn/GitHub**: Ya configuré tus enlaces a `SubaruDev0`. Si los cambias, edita el footer en `page.tsx`.
2. **Imágenes**: Siempre pon las imágenes en la carpeta `public/`. Si no pones imagen, el sistema pondrá un icono de código por defecto automáticamente.
3. **Midu animations**: Si ves una clase que empieza por `animate-`, viene de la configuración que le "robamos" a la librería de midudev para que te funcione a ti.

¡Ahora eres un Ingeniero de Metamorfosis Digital! A seguir construyendo. 🚀🔥

---

## 🛠️ Explicación Técnica para un Ingeniero: El Stack Moderno

Javier, aquí te explico por qué usamos estas herramientas en lugar de las tradicionales:

### ⚡ ¿Por qué Next.js 14 en lugar de React básico?
Next.js es un **framework**, mientras que React es solo una **librería**.
- **Server Components**: Next.js procesa parte del código en el servidor antes de mandarlo al cliente. Esto hace que Google te quiera más (SEO) y que la página cargue mucho más rápido.
- **Rutas Automáticas**: No necesitas configurar un router. Si creas un archivo en `app/contacto/page.tsx`, la URL `/contacto` ya existe.
- **Optimización de Imágenes**: Next.js comprime y cambia el tamaño de tus fotos automáticamente según el dispositivo del usuario.

### 🎨 Tailwind CSS: El fin del "Spaghetti Code"
En lugar de tener un archivo `estilos.css` de 2000 líneas donde te pierdes buscando la clase `.card-container-inner-fixed-v2`, Tailwind te da **clases utilitarias**.
- **Productividad**: `flex items-center justify-center` es universal. No tienes que inventar nombres.
- **Peso**: Tailwind analiza tu código y **solo mete en el archivo final de producción el CSS que realmente estás usando**. El resultado es un sitio web ligerísimo.

### 🔷 TypeScript: Tu seguro contra errores
Usamos `.tsx` en lugar de `.js` por el sistema de **Tipado**.
- **Autocompletado**: Si tienes un objeto `Proyecto`, TypeScript sabe que tiene un `titulo` pero no una `fecha_nacimiento`. Si intentas escribir `proyecto.fecha`, te avisará del error **antes** de que abras el navegador.
- **Refactorización**: Si decides cambiar el nombre de una propiedad en el futuro, TypeScript te mostrará todos los lugares donde se rompió el código para que los arregles en segundos.

### ✨ Animaciones: Framer Motion vs CSS Puro
CSS es bueno para cosas simples, pero para el **Carrusel Físico** usamos Framer Motion.
- **Spring Physics**: Las animaciones no son lineales; tienen "rebote" y "peso" real.
- **Gestos**: Detectar draggings, flicks y velocities es casi imposible solo con CSS. Framer Motion nos permite tratar los elementos de la pantalla como si fueran objetos físicos.
