Objetivo

Este archivo explica cómo usar Docker para construir y ejecutar el proyecto sin instalar Node en tu sistema.

Construir la imagen (producción)

```bash
# crea la imagen de producción (ejecuta build dentro del contenedor)
docker build -t subarudev-portfolio:prod .

# ejecutar la imagen resultante
docker run --rm -p 3000:3000 subarudev-portfolio:prod
```

Alternativa: build + run en un solo contenedor (rápido)

```bash
# instalar dependencias y construir dentro de un contenedor temporal
docker run --rm -v "$PWD":/app -w /app node:20.9.0-bullseye-slim bash -lc "npm ci && npm run build"

# luego ejecutar con la imagen de producción creada arriba
docker run --rm -p 3000:3000 subarudev-portfolio:prod
```

Desarrollo (hot reload) con docker-compose

```bash
# arranca el contenedor en modo desarrollo (puerto 3000)
docker compose up --build

# Docker: construir y ejecutar la app localmente

Este documento explica cómo usar Docker para construir y ejecutar el proyecto sin instalar Node en tu sistema.

Construir la imagen (producción)

```bash
# crea la imagen de producción (ejecuta build dentro del contenedor)
docker build -t subarudev-portfolio:prod .

# ejecutar la imagen resultante
docker run --rm -p 3000:3000 subarudev-portfolio:prod
```

Alternativa: build + run en un solo contenedor (rápido)

```bash
# instalar dependencias y construir dentro de un contenedor temporal
docker run --rm -v "$PWD":/app -w /app node:20.9.0-bullseye-slim bash -lc "npm ci && npm run build"

# luego ejecutar con la imagen de producción creada arriba
docker run --rm -p 3000:3000 subarudev-portfolio:prod
```

Desarrollo (hot reload) con docker-compose

```bash
# arranca el contenedor en modo desarrollo (puerto 3000)
docker compose up --build

# parar y remover
docker compose down
```

Notas generales

- El `Dockerfile` usa Node 20.9.0 para cumplir la exigencia de Next.js (>=20.9.0).
- No necesitas instalar Node localmente: todo sucede dentro del contenedor.
- Si tu host es Linux, el rendimiento de volúmenes suele ser bueno. En macOS/Windows puede ser más lento.
- Asegúrate de tener Docker instalado y funcionando.

Usar Neon (Postgres remoto) en desarrollo
----------------------------------------

Si quieres que tu contenedor en desarrollo use la misma base de datos Neon que usas en producción, crea un archivo `.env` en la raíz del proyecto copiando `.env.example` y pegando tu `DATABASE_URL` de Neon:

```bash
cp .env.example .env
# editar .env y pegar la línea DATABASE_URL=postgres://user:pass@... (tu URL de Neon)
```

Luego levanta el contenedor normalmente:

```bash
docker compose up --build
```

Accede a `http://localhost:3000/admin` y loguea con la contraseña por defecto (`Mabel#zer0`) para poder inicializar las tablas (botón "Inicializar DB"). El proyecto incorpora la función `initDatabase()` que crea las tablas necesarias.

Qué cambia entre desarrollo (local) y producción
------------------------------------------------

- En producción normalmente ya tienes configurada la variable `DATABASE_URL` (p. ej. en Vercel) y las migraciones/tablas ya existen. La app en producción se conecta a Neon directamente.
- En desarrollo, usar Neon es idéntico desde el punto de vista de la app: solo necesitas asegurar que `DATABASE_URL` esté presente y que el contenedor tenga acceso de red a Neon. En local normalmente trabajarás con datos de prueba y deberás inicializar o poblar tablas manualmente.
- Si prefieres no tocar tu Neon de producción, puedes usar una instancia Postgres local (añadiendo un servicio `db` a `docker-compose.yml`) y apuntar `DATABASE_URL` a esa instancia local.

Seguridad y buenas prácticas
---------------------------

- Nunca subas tu `.env` con credenciales a Git. Usa `.env.example` y guarda el real en tu entorno local/CI.
- Para producción, configura variables de entorno en la plataforma (Vercel, Fly, etc.) en lugar de hardcodearlas.
- Cambia la contraseña admin inicial y no dejes contraseñas por defecto en producción.

Si quieres que añada un servicio Postgres local al `docker-compose.yml` para desarrollo offline, dímelo y lo agrego. Actualmente `docker-compose.yml` está preparado para leer `DATABASE_URL` desde `.env` y conectar a Neon o a cualquier Postgres remoto.
