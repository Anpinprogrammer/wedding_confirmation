# Confirmación de Asistencia — Boda 🤍

Clon del formulario de Google Forms original, construido con **React + TypeScript + Tailwind CSS**, con una diferencia clave: al elegir el número de personas (máx. 4), se despliega dinámicamente una tarjeta por invitado para capturar su nombre y elección de almuerzo.

## Stack

- **React 18 + TypeScript + Vite**
- **Tailwind CSS** para estilos
- **react-hook-form + zod** para manejo y validación de formulario
- Librería de componentes propia estilo *shadcn/ui* (`Button`, `Input`, `Select`, `Textarea`, `Label`, `Card`) en `src/components/ui/`, para que sean reutilizables en otras vistas
- **lucide-react** para iconografía
- Integración lista para **Google Sheets** vía Google Apps Script

## Instalación

```bash
npm install
npm run dev
```

## Estructura

```
src/
  components/
    ui/            → librería de componentes reutilizables (Button, Input, Select, etc.)
    GuestCard.tsx   → tarjeta individual por invitado (nombre + almuerzo)
    RsvpForm.tsx    → formulario principal
  services/
    googleSheets.ts → lógica de envío a Google Sheets
  types/
    rsvp.ts          → tipos del formulario
google-apps-script/
  Code.gs            → script a pegar en Google Sheets
```

## Conectar Google Sheets

El formulario envía las respuestas a un **Google Sheet** a través de un pequeño script intermediario (Google Apps Script), que es la forma estándar y gratuita de recibir datos de un formulario externo sin backend propio.

### 1. Crea la hoja de cálculo

Crea un Google Sheet nuevo (o usa uno existente) donde quieras guardar las confirmaciones.

### 2. Agrega el script

1. En el Sheet, ve a **Extensiones > Apps Script**.
2. Borra el contenido de `Code.gs` y pega el contenido de [`google-apps-script/Code.gs`](./google-apps-script/Code.gs) de este proyecto.
3. Guarda el proyecto (ícono de disquete).

### 3. Despliega como aplicación web

1. Haz clic en **Desplegar > Nueva implementación**.
2. Tipo: **Aplicación web**.
3. Configuración:
   - **Ejecutar como:** Yo (tu cuenta)
   - **Quién tiene acceso:** Cualquier usuario
4. Haz clic en **Desplegar** y autoriza los permisos solicitados.
5. Copia la **URL de la aplicación web** (termina en `/exec`).

### 4. Conéctala al proyecto

Crea un archivo `.env` en la raíz del proyecto (puedes copiar `.env.example`):

```bash
cp .env.example .env
```

Y pega tu URL:

```
VITE_GOOGLE_SCRIPT_URL="https://script.google.com/macros/s/TU_ID_DE_DESPLIEGUE/exec"
```

Reinicia `npm run dev`. Cada envío del formulario agregará:

- Una fila en la pestaña **"Respuestas"**, con: fecha, número de personas, nombres, plato elegido por cada uno, y el mensaje (igual que antes).
- **Una fila por cada invitado** en la pestaña correspondiente a su plato — **"Tamal valluno"** o **"Sancocho de pollo"** — con su nombre y la fecha de envío. Estas pestañas se crean automáticamente la primera vez que alguien elige ese plato, así que no necesitas crearlas a mano.

Esto te permite ver de un vistazo, en cada pestaña, exactamente quién eligió cada comida y contar el total fácilmente (por ejemplo con `=COUNTA(B2:B)` en cualquier celda de esa pestaña, para contar cuántos nombres hay).

> Si más adelante agregas otro plato a `MEAL_OPTIONS` en `src/types/rsvp.ts`, recuerda también agregarlo al objeto `MEAL_SHEET_NAMES` en `google-apps-script/Code.gs` para que tenga su propia pestaña.

### Si borras filas manualmente en Sheets

Para eliminar una respuesta, usa siempre **clic derecho sobre el número de fila → "Eliminar fila"**, no selecciones el contenido y presiones `Supr`/`Backspace`. Borrar solo el contenido deja una fila "fantasma" (vacía pero aún registrada por Sheets), lo que puede hacer que la siguiente respuesta del formulario aparezca después de un hueco en blanco.

El script ya incluye una protección para esto (`appendRowSafely_`, en `Code.gs`): busca la verdadera última fila con datos en la columna A antes de escribir, así que aunque quede alguna fila vacía por accidente, las nuevas respuestas no deberían dejar huecos adicionales.

> **Nota técnica:** las solicitudes se envían con `mode: "no-cors"`, porque los Web Apps de Apps Script no siempre configuran cabeceras CORS. Esto significa que el navegador no puede leer la respuesta del script (no se puede confirmar el éxito exacto desde el cliente), pero el dato sí llega y se guarda. Si necesitas confirmación de entrega en el cliente, puedes desplegar el script detrás de un proxy propio (p. ej. una función serverless) que sí devuelva cabeceras CORS.

### 5. Vuelve a desplegar tras cada cambio al script

Si editas `Code.gs` después del primer despliegue, debes ir a **Desplegar > Gestionar implementaciones > Editar (ícono de lápiz) > Nueva versión > Desplegar** para que los cambios surtan efecto en la URL ya conectada.

## Build de producción

```bash
npm run build
```

Los archivos quedan en `dist/`, listos para publicar en cualquier hosting estático (Vercel, Netlify, GitHub Pages, etc.). Recuerda configurar `VITE_GOOGLE_SCRIPT_URL` como variable de entorno en el hosting también.

## Personalización rápida

- **Fecha límite / textos:** en `src/components/RsvpForm.tsx`.
- **Opciones de comida:** en `src/types/rsvp.ts` (`MEAL_OPTIONS`).
- **Colores / tipografías:** en `tailwind.config.ts` y `index.html` (fuentes de Google Fonts).
- **Máximo de invitados:** actualmente fijo en 4, en el `<select>` de `RsvpForm.tsx`.
- **Foto de portada:** está en `public/images/hero-couple.jpg`. Para cambiarla, reemplaza ese archivo (conserva el mismo nombre) o actualiza la ruta en el `<img>` dentro de `src/components/RsvpForm.tsx`.
