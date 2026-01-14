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
- **Contraseña de Acceso:** `mabel123`

### 🚀 Mejoras de UX (Experiencia de Usuario):
1.  **Protección de Identidad:** El acceso está bloqueado por contraseña para evitar que curiosos jueguen con el generador.
2.  **Gestión de Miniaturas y Subida Local:** 
    - Ya puedes añadir la URL de una foto o subir archivos directamente desde tu PC usando el icono **Subir (FileUp)**. 
    - Las imágenes se guardan automáticamente en `public/projects/`.
3.  **Sistema de Galería (Proyectos Privados):**
    - Si un proyecto no tiene demo pública, puedes subir múltiples capturas de pantalla en la sección **Galería**.
    - El portafolio mostrará un carrusel dinámico para que los visitantes puedan ver el interior del software.
4.  **Combobox Inteligente de Tecnologías (LOGOS):** 
    - Ya no tienes que escribir todo a mano. El sistema te sugiere tecnologías que **ya has usado**.
    - **Soporte para Logos**: El sistema busca el logo oficial en Simple Icons automáticamente.
5.  **Distintivos de Calidad:**
    - **Estrella ⭐ (Favorito):** Fija el proyecto arriba del todo, sin importar la fecha.
    - **Maletín 💼 (Proyecto en Producción):** Marca el software como validado en entorno real (Software que ya está siendo usado por empresas o clientes).

---

## 🎨 3. El Motor de Animaciones (Midu-Style)

Aquí es donde nos pusimos serios. Querías usar `tailwind-animations` de **midudev**, pero esa librería es para Tailwind v4 y nosotros estamos en v3 por compatibilidad con tu sistema (Node 18).

### ¿Cómo lo hemos solucionado? (El "Bridge")
Hemos creado un "Puente" en el archivo `tailwind.config.ts`. Si lo abres, verás una sección llamada `keyframes` y `animation`.
1. **Keyframes**: Son los pasos de la animación. (Ej: "En el 0% no te veas, en el 100% que aparezcas con blur").
2. **Animation**: Es el nombre corto que le damos para usarlo en el código.
   - Ejemplo: `animate-blurred-fade-in` es puro estilo Midu.

**Uso práctico**:
- `animate-delay-[300ms]`: Retrasa la animación 300 milisegundos.
- `hover:animate-shake`: Hace que algo tiemble cuando pasas el ratón.
- `animate-jelly`: Ese efecto "gelatina" tan característico cuando algo aparece o es presionado.

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
