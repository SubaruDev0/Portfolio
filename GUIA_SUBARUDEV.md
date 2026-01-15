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
    - **Compresión Automática**: Si subes una imagen de más de 200KB, el sistema la comprime automáticamente en el cliente a JPEG (70% calidad) para que no falle la subida y el sitio cargue volando.
4.  **Sistema de Reordenamiento (Drag & Drop):**
    - ¡Olvídate de las flechas lentas! Ahora puedes **arrastrar y soltar** los proyectos y certificados para cambiar su orden. Es fluido y se guarda al instante.
5.  **Tecnologías Dinámicas e Iconografía**: 
    - El sistema sugiere tecnologías automáticamente.
    - **Iconos Maestro**: Ahora puedes poner cualquier cosa de [Simple Icons](https://simpleicons.org/). Si escribes `Wikipedia:wikipedia` en el admin, te saldrá el icono oficial de Wikipedia. ¡Cualquiera de los 3000+ iconos funciona!
6.  **Previsualización en Vivo**: 
    - En el panel de admin, mientras escribes el nombre o el slug, verás una **PREVIEW** del icono al lado para confirmar que es el correcto.
7.  **Prioridades Maestras del Portafolio**:
    - El orden sigue una jerarquía de "Ingeniería":
        1. **Destacado + Producción**: El top tier (Estrella + Maletín).
        2. **Destacado**: (Estrella).
        3. **Producción**: (Maletín Emerald).
        4. **Orden por Drag & Drop**: El que tú decidas arrastrando.

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

## ⚔️ 4. Sistema de Temas Dinámicos (Modo Claro/Oscuro)

Hemos implementado un sistema de **Doble Capa de Tematización** que permite alternar entre modo oscuro y claro con un contraste militar:

- **Contraste Extremo**: En modo claro, hemos forzado el uso de `text-black` y `slate-900` para garantizar legibilidad total, eliminando grises tenues.
- **Transición de Documento**: Usamos `document.startViewTransition` (si el navegador lo soporta) para que el cambio de tema tenga un fundido cinematográfico de 700ms.
- **Inyección de Hex**: La función `getThemeColors(theme, isDarkMode)` en `src/utils/theme.ts` ahora detecta el brillo. Si es modo claro, satura los colores de "metamorfosis" (Frontend, Backend, etc.) para que no se pierdan sobre el fondo blanco.

## 🛡️ 5. TechBadge e Iconografía Inteligente (SimpleIcons Integration)

Los componentes `TechBadge.tsx` y las tarjetas ahora son plenamente conscientes del tema:

- **Iconos Dinámicos**: Los iconos de tecnologías se solicitan dinámicamente a la API de SimpleIcons ajustando el color según el modo:
  - Oscuro: `https://cdn.simpleicons.org/${slug}/white`
  - Claro: `https://cdn.simpleicons.org/${slug}/black`
- **Variantes Especiales**: Se añadió soporte para iconos de lógica de negocio (Lucide React):
  - **Destacados**: Icono de Estrella (`Star`) en color naranja ámbar.
  - **Producción**: Icono de Maletín (`Briefcase`).
  - **Real World**: Icono de Fuego (`Flame`).

## ⚓ 6. Navegación e Ingeniería Interactiva

La Navbar (`src/components/Navbar.tsx`) y los anclajes fueron re-diseñados para una experiencia fluida (Smooth UX):

- **Scroll-MT (Margin Top)**: Todos los anclajes de sección tienen un `scroll-mt-20` o `scroll-mt-24`. Esto evita que la Navbar "pise" el título de la sección al bajar.
- **Smooth Scroll Programático**: El botón "Inicio" utiliza `window.scrollTo({ top: 0, behavior: 'smooth' })`, eliminando saltos bruscos.
- **Control de Scroll**: Implementamos un `useEffect` que bloquea el scroll del cuerpo (`overflow-hidden`) cuando un modal está abierto, evitando que el usuario se pierda.

## 📉 7. Lógica de Ordenamiento Industrial (Ranking de Proyectos)

En el `page-client.tsx`, el filtrado de proyectos no es al azar. Hemos diseñado un algoritmo de prioridad de 5 niveles en el `useMemo`:

1.  **Prioridad 1 (Top Tier)**: Proyectos `isStarred` (Estrella) Y `isRealWorld` (Producción).
2.  **Prioridad 2**: Proyectos `isStarred` (Destacados).
3.  **Prioridad 3**: Proyectos `isRealWorld` (Listos para el mercado).
4.  **Prioridad 4**: Proyectos con imágenes.
5.  **Prioridad 5**: Resto de proyectos por orden de aparición.

Esto asegura que tus mejores trabajos siempre se vendan primero a los reclutadores.

## 🧬 8. La Lógica de "Metamorfosis" (State Management)

En la página principal (`src/app/page-client.tsx`), el estado `theme` controla la categoría:
- Cuando haces clic en el seleccionador, `setTheme` cambia el valor.
- React redibuja todo con los nuevos colores HEX inyectados directamente en el CSS dinámico.

---

## 🏎️ 9. El Carrusel de Alto Rendimiento (Framer Motion Physics)

Sistema de **físicas de partículas** aplicado a imágenes:
- **`useAnimationFrame`**: Un bucle a 60 FPS que calcula la posición inercial.
- **Wrapping Matemático**: El carrusel es infinito. Cuando llega al final, se teletransporta al inicio sin que el ojo humano lo perciba.
- **Inercia**: Al soltar el arrastre, el carrusel tiene fricción real.

## 🛠️ 10. Arquitectura de Modales Globales (Z-Index Fix)

Para evitar que el carrusel bloquee los modales, aplicamos **State Lifting**:
- Los modales viven en la raíz del `page-client.tsx`.
- Las tarjetas envían una señal con el proyecto seleccionado.
- El modal "flota" por encima de todo el DOM, garantizando que siempre sea clickeable.

## 💾 11. Pipeline de Datos y Assets (Base64)

- **PostgreSQL (Neon)**: Los datos no son estáticos, vienen de una base de datos real.
- **Imágenes en Base64**: Las fotos se guardan como texto en la DB. Cero dependencias de servidores de archivos externos.
- **CV Inteligente**: Tu currículum se genera al vuelo desde la base de datos.

## 🚀 12. Cómo trabajar tú solo

### Añadir un proyecto (Modo Admin)
1. Entra en `localhost:3000/admin` (Pass: `mabel123`).
2. Usa el panel para subir títulos, fotos y tecnologías.
3. Si la tecnología no existe, la añades en caliente.
4. **Guardar**: Los datos se inyectan en tu base de datos Neon.

### Recordatorios para SubaruDev
1. **GitHub/LinkedIn**: Configurados en el footer.
2. **Imágenes**: Se recomienda subirlas vía Admin para que se procesen a Base64.
3. **Animaciones**: Mantener las clases `animate-` para preservar el "feeling" profesional.

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
- **Productivity**: `flex items-center justify-center` es universal. No tienes que inventar nombres.
- **Peso**: Tailwind analiza tu código y **solo mete en el archivo final de producción el CSS que realmente estás usando**. El resultado es un sitio web ligerísimo.

### 🔷 TypeScript: Tu seguro contra errores
Usamos `.tsx` en lugar de `.js` por el sistema de **Tipado**.
- **Autocompletado**: Si tienes un objeto `Proyecto`, TypeScript sabe que tiene un `titulo` pero no una `fecha_nacimiento`. Si intentas escribir `proyecto.fecha`, te avisará del error **antes** de que abras el navegador.
- **Refactorización**: Si decides cambiar el nombre de una propiedad en el futuro, TypeScript te mostrará todos los lugares donde se rompió el código para que los arregles en segundos.

### ✨ Animaciones: Framer Motion vs CSS Puro
CSS es bueno para cosas simples, pero para el **Carrusel Físico** usamos Framer Motion.
- **Spring Physics**: Las animaciones no son lineales; tienen "rebote" y "peso" real.
- **Gestos**: Detectar draggings, flicks y velocities es casi imposible solo con CSS. Framer Motion nos permite tratar los elementos de la pantalla como si fueran objetos físicos.
