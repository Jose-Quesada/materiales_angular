# Proyecto de Documentación con Zensical | Angular 19+ (Edición 2025)

Este directorio contiene el proyecto **Zensical** configurado para compilar y publicar el material didáctico, código paso a paso y guías de clase para los alumnos del curso **Angular De Cero a Experto (Edición 2025)**.

---

## 🚀 Inicio Rápido en Local

### 1. Previsualizar el sitio (Hot Reload)
Para ver la documentación en vivo con recarga automática mientras editas los archivos Markdown:

* **En Windows (Doble clic):** Ejecuta `start-docs.bat`
* **Desde PowerShell:**
  ```powershell
  .\start-docs.ps1
  # O directamente:
  python -m zensical serve
  ```
El sitio estará disponible en tu navegador en: **`http://127.0.0.1:8000/`**

---

### 2. Compilar para Producción
Para generar los archivos estáticos listos para subir a cualquier servidor web o hosting:

* **En Windows (Doble clic):** Ejecuta `build-docs.bat`
* **Desde PowerShell:**
  ```powershell
  .\build-docs.ps1
  # O directamente:
  python -m zensical build --clean
  ```
El resultado se generará dentro del directorio `site/`.

---

## 🌐 Opciones Fáciles de Publicación

### Opción A: GitHub Pages (Automatizado con GitHub Actions)
El proyecto ya incluye el workflow en `.github/workflows/docs.yml`:
1. Sube este directorio a tu repositorio de GitHub (en la rama `main` o `master`).
2. En GitHub, ve a **Settings** > **Pages** > **Build and deployment** y selecciona **GitHub Actions** como origen.
3. Cada vez que hagas `git push`, GitHub compilará y publicará la web automáticamente.

### Opción B: Cloudflare Pages / Vercel / Netlify
1. Conecta tu repositorio.
2. Configura los siguientes parámetros en el panel de despliegue:
   * **Build command:** `pip install zensical && zensical build --clean`
   * **Output directory:** `site`

### Opción C: Subida Directa por FTP / Intranet / Nginx
Ejecuta `.\build-docs.ps1` y copia el contenido íntegro de la carpeta `site/` al directorio raíz de tu servidor web (`/var/www/html/` o `htdocs/`).

---

## 📁 Estructura del Proyecto

```
documentacion-angular/
├── .github/
│   └── workflows/
│       └── docs.yml           # Despliegue automático a GitHub Pages
├── docs/                      # Archivos Markdown fuente
│   ├── index.md               # Portada del curso y roadmap general
│   ├── 04-angular-bases.md    # Guía completa paso a paso de la Sección 04
│   └── markdown.md            # Guía rápida de sintaxis y componentes
├── zensical.toml              # Configuración central del sitio y navegación
├── start-docs.bat / .ps1      # Scripts de inicio del servidor local
├── build-docs.bat / .ps1      # Scripts de compilación a HTML estático
└── README.md                  # Este documento
```

---

## ✍️ Cómo Agregar Nuevas Secciones (ej: Sección 05)

1. Crea tu nuevo archivo en `docs/`: por ejemplo `docs/05-expandir-bases.md`.
2. Abre `zensical.toml` y añade la entrada al arreglo `nav`:
   ```toml
   nav = [
     { "Inicio" = "index.md" },
     { "04. Bases de Angular (Guía de Aula)" = "04-angular-bases.md" },
     { "05. Expandir Bases" = "05-expandir-bases.md" },
     { "Referencia de Markdown" = "markdown.md" },
   ]
   ```
3. Guarda el archivo y el servidor Zensical actualizará la navegación al instante.
