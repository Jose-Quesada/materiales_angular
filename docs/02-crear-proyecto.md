# Crear un Proyecto Angular

## Objetivos de aprendizaje

Al finalizar esta unidad, el alumnado será capaz de:

1. Comprender el papel de Node.js y npm en el ecosistema Angular.
2. Utilizar Angular CLI para crear, compilar y servir proyectos Angular.
3. Interpretar la estructura de carpetas y archivos generada por `ng new`.
4. Configurar el archivo `angular.json` para personalizar el comportamiento del proyecto.
5. Diferenciar los archivos de configuración TypeScript y entender su propósito.
6. Explicar el proceso de build y sus opciones de optimización.
7. Configurar entornos de desarrollo y producción en un proyecto Angular.
8. Añadir bibliotecas externas compatibles con Angular CLI mediante `ng add`.

## Resultados de aprendizaje

Tras completar esta unidad, el estudiante será capaz de:

- Crear un proyecto Angular desde cero con las opciones adecuadas según los requisitos.
- Explicar la función de cada carpeta y archivo principal del proyecto.
- Modificar la configuración de `angular.json` para ajustar el comportamiento del build y serve.
- Configurar SCSS como preprocesador de estilos.
- Añadir Angular Material a un proyecto existente.
- Crear y gestionar archivos de configuración de entornos.
- Identificar y corregir problemas comunes en la configuración inicial de un proyecto.

## Introducción

Si la unidad anterior fue el plano conceptual, esta unidad es el taller donde empezamos a construir. Hasta ahora hemos hablado de qué es Angular teóricamente; ahora vamos a crear nuestro primer proyecto, a entender cada archivo que se genera y a dominar las herramientas que usaremos cada día como desarrolladores Angular.

Piensa en un edificio: antes de colocar el primer ladrillo, necesitas los cimientos, las herramientas adecuadas y los planos detallados. En Angular, esos cimientos son Node.js y npm; las herramientas son Angular CLI; y los planos son los archivos de configuración del proyecto. Si dominas esta base, todo lo que construyas encima será sólido y mantenible.

En esta unidad, dedicaremos tiempo a entender en profundidad la estructura de un proyecto Angular, porque es la base sobre la que trabajarás durante todo el curso (y durante tu carrera profesional). No es un tema "aburrido que hay que pasar rápido": cada vez que tengas un error de compilación, un problema de rutas o necesites configurar un nuevo entorno, volverás a estos conceptos.

Un desarrollador Angular productivo no solo sabe escribir componentes: sabe navegar con soltura por la estructura del proyecto, modificar configuraciones cuando es necesario, y entender qué está pasando cuando ejecuta `ng serve` o `ng build`. Esa es exactamente la competencia que desarrollaremos en esta unidad.

## Desarrollo teórico

### Node.js y npm

#### ¿Qué es Node.js?

Node.js es un **entorno de ejecución de JavaScript para el servidor**, construido sobre el motor V8 de Google Chrome (el mismo que ejecuta JavaScript en el navegador). Node.js permite ejecutar JavaScript fuera del navegador, en el sistema operativo, accediendo al sistema de archivos, a la red y a otros recursos del sistema.

Para el desarrollo Angular, Node.js es fundamental por varias razones:

1. **Angular CLI es una aplicación Node.js**: cuando escribes `ng serve` en la terminal, estás ejecutando un programa escrito en Node.js que inicia webpack/vite, compila TypeScript, sirve archivos estáticos y recarga el navegador automáticamente.

2. **npm (Node Package Manager)**: el gestor de paquetes que viene con Node.js es la herramienta que usamos para instalar Angular, sus dependencias y cualquier biblioteca de terceros.

3. **Servidor de desarrollo**: `ng serve` inicia un servidor web construido con Node.js que sirve nuestra aplicación durante el desarrollo.

4. **Compilación**: TypeScript se compila a JavaScript usando el compilador de TypeScript, que es un paquete npm ejecutado por Node.js.

5. **SSR (Server-Side Rendering)**: cuando usamos Angular Universal o el SSR nativo, el servidor que renderiza nuestra aplicación es Node.js.

Node.js usa un modelo de ejecución **asíncrono y orientado a eventos**, lo que lo hace muy eficiente para aplicaciones I/O intensivas. A diferencia de los servidores tradicionales que crean un hilo por cada petición, Node.js usa un único hilo con un event loop que gestiona miles de conexiones simultáneas.

#### npm: el gestor de paquetes

npm (Node Package Manager) es el gestor de paquetes más grande del mundo. Cumple tres funciones principales:

1. **Repositorio online**: millones de paquetes publicados en https://www.npmjs.com
2. **Herramienta de línea de comandos**: para instalar, actualizar, publicar y gestionar paquetes.
3. **Gestor de dependencias**: resuelve árboles de dependencias complejos.

Comandos npm esenciales para el día a día en Angular:

```bash
npm install              # Instala TODAS las dependencias listadas en package.json
npm install <paquete>   # Instala un paquete y lo añade a dependencies
npm install --save-dev <paquete>  # Instala en devDependencies
npm uninstall <paquete> # Desinstala un paquete
npm update              # Actualiza paquetes según semver
npm outdated            # Lista paquetes con versiones nuevas disponibles
npm audit               # Revisa vulnerabilidades de seguridad
npm audit fix           # Corrige vulnerabilidades automáticamente
npm run <script>        # Ejecuta un script definido en package.json
npx <paquete>           # Ejecuta un paquete sin instalarlo globalmente
```

#### package.json: el manifiesto del proyecto

El archivo `package.json` es el documento de identidad del proyecto. Contiene:

```json
{
  "name": "mi-proyecto-angular",          // Nombre del proyecto (minúsculas, sin espacios)
  "version": "0.0.0",                     // Versión semántica inicial
  "private": true,                         // Evita publicación accidental en npm
  "scripts": {                             // Comandos ejecutables con npm run
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "lint": "ng lint",
    "serve:ssr:mi-proyecto-angular": "node dist/mi-proyecto-angular/server/server.mjs"  // SSR
  },
  "dependencies": {                        // Paquetes necesarios en PRODUCCIÓN
    "@angular/animations": "^19.0.0",
    "@angular/common": "^19.0.0",
    "@angular/compiler": "^19.0.0",
    "@angular/core": "^19.0.0",
    "@angular/forms": "^19.0.0",
    "@angular/platform-browser": "^19.0.0",
    "@angular/platform-browser-dynamic": "^19.0.0",
    "@angular/platform-server": "^19.0.0",   // Para SSR
    "@angular/router": "^19.0.0",
    "@angular/ssr": "^19.0.0",               // Para SSR
    "express": "^4.18.2",                    // Servidor SSR
    "rxjs": "~7.8.0",
    "tslib": "^2.3.0",
    "zone.js": "~0.15.0"                     // Detección de cambios (se eliminará en el futuro)
  },
  "devDependencies": {                     // Paquetes SOLO para desarrollo
    "@angular-devkit/build-angular": "^19.0.0",    // Build system
    "@angular-eslint/builder": "19.0.0",           // ESLint para Angular
    "@angular-eslint/eslint-plugin": "19.0.0",
    "@angular-eslint/eslint-plugin-template": "19.0.0",
    "@angular-eslint/schematics": "19.0.0",
    "@angular-eslint/template-parser": "19.0.0",
    "@angular/cli": "^19.0.0",                     // Angular CLI
    "@angular/compiler-cli": "^19.0.0",            // Compilador para desarrollo
    "@types/express": "^4.17.17",                  // Tipos TypeScript
    "@types/jasmine": "~5.1.0",
    "@types/node": "^18.18.0",
    "eslint": "^9.0.0",
    "jasmine-core": "~5.4.0",
    "karma": "~6.4.0",
    "karma-chrome-launcher": "~3.2.0",
    "karma-coverage": "~2.2.0",
    "karma-jasmine": "~5.1.0",
    "karma-jasmine-html-reporter": "~2.1.0",
    "typescript": "~5.6.0"
  }
}
```

#### node_modules: el almacén de dependencias

La carpeta `node_modules/` contiene todas las dependencias instaladas del proyecto. Es notoriamente grande (cientos de megabytes) y **nunca debe incluirse en el control de versiones** (está en `.gitignore` por defecto). Cuando clonas un proyecto, ejecutas `npm install` y npm reconstruye `node_modules` basándose en `package.json` y `package-lock.json`.

#### Versionado semántico (SemVer)

El versionado semántico sigue el formato `MAYOR.MENOR.PARCHE` (por ejemplo, `19.2.1`):

- **MAYOR (19)**: cambios incompatibles con versiones anteriores (breaking changes). Las dependencias con `^` permitirán actualizaciones menores y parches, pero NUNCA cambios mayores automáticos.
- **MENOR (2)**: nuevas funcionalidades compatibles con versiones anteriores.
- **PARCHE (1)**: correcciones de errores compatibles.

Los prefijos en `package.json` controlan el rango de versiones permitido:

- `^19.0.0`: permite cualquier versión `>=19.0.0` y `<20.0.0` (cambios menores y parches).
- `~19.0.0`: permite `>=19.0.0` y `<19.1.0` (solo parches).
- `19.0.0`: versión exacta, sin actualizaciones automáticas.
- `*`: cualquier versión (peligroso, no recomendado).

#### package-lock.json

Este archivo, generado automáticamente, registra el árbol EXACTO de dependencias instaladas, con versiones específicas y URLs de descarga. Su propósito es garantizar que todos los desarrolladores del equipo y los servidores de CI/CD instalen exactamente las mismas versiones. No se edita manualmente y SÍ debe incluirse en el control de versiones.

### Angular CLI

Angular CLI (`@angular/cli`) es la herramienta de línea de comandos oficial para el desarrollo Angular. Está construida sobre el framework `@angular-devkit`, que proporciona la infraestructura para schematics, builders y workspaces.

#### Comandos principales

##### ng new

Crea un nuevo workspace de Angular con una aplicación inicial. Es el punto de partida de todo proyecto.

```bash
ng new <nombre-proyecto> [opciones]
```

Opciones fundamentales (las detallamos en la siguiente sección):
- `--standalone`: Genera componentes standalone (sin NgModules).
- `--routing`: Incluye configuración de enrutamiento.
- `--style=css|scss|sass|less`: Preprocesador de estilos.
- `--ssr`: Incluye Server-Side Rendering.
- `--strict`: Activa modo estricto de TypeScript.
- `--skip-tests`: Omite la generación de archivos de test.
- `--inline-template`: Templates inline en lugar de archivos HTML separados.
- `--inline-style`: Estilos inline en lugar de archivos CSS separados.
- `--prefix`: Prefijo para los selectores de componentes (por defecto "app").
- `--directory`: Directorio donde crear el proyecto.

##### ng generate (alias: ng g)

Genera elementos del proyecto: componentes, servicios, directivas, pipes, módulos, guards, interceptores, etc.

```bash
ng generate <schematics> <nombre> [opciones]
ng g c mi-componente --standalone     # Generar componente standalone
ng g s servicios/datos                # Generar servicio en carpeta servicios
ng g d directivas/highlight           # Generar directiva
ng g p pipes/filtro                   # Generar pipe
ng g guard auth/auth                  # Generar guard de rutas
ng g interceptor http/auth            # Generar interceptor HTTP
```

Schematics disponibles:
- `component` (alias: `c`)
- `directive` (alias: `d`)
- `pipe` (alias: `p`)
- `service` (alias: `s`)
- `module` (alias: `m`)
- `guard`
- `interceptor`
- `resolver`
- `class`
- `interface`
- `enum`

##### ng serve

Inicia un servidor de desarrollo local con recarga en caliente.

```bash
ng serve [opciones]

# Opciones comunes:
ng serve --open             # Abre el navegador automáticamente
ng serve --port 4300        # Puerto personalizado
ng serve --ssl              # Usar HTTPS (localhost)
ng serve --hmr              # Hot Module Replacement
ng serve --configuration=production  # Usar configuración de producción
ng serve --host 0.0.0.0     # Permitir conexiones externas (para test en móviles)
```

##### ng build

Compila la aplicación para producción (o desarrollo). Genera archivos HTML, CSS y JavaScript optimizados.

```bash
ng build [opciones]

# Opciones clave:
ng build --configuration=production   # Build para producción
ng build --output-path=dist/mi-app    # Directorio de salida personalizado
ng build --base-href=/mi-app/         # Base href para despliegue en subdirectorio
ng build --watch                      # Recompilar al detectar cambios
ng build --source-map                 # Generar source maps (debug en producción)
ng build --optimization               # Optimización (minificación, tree-shaking)
ng build --aot                        # Compilación Ahead-of-Time
ng build --output-hashing=none|all|media|bundles  # Hashing en nombres de archivo
```

##### ng test

Ejecuta los tests unitarios (generalmente con Jasmine y Karma).

```bash
ng test [opciones]

ng test --watch=false        # Ejecución única (sin watch)
ng test --code-coverage      # Generar informe de cobertura
ng test --browsers=Chrome    # Navegador específico
```

##### ng lint

Ejecuta el linter (ESLint) para verificar la calidad del código.

```bash
ng lint [opciones]

ng lint --fix                # Corregir errores automáticamente cuando sea posible
ng lint --format=stylish     # Formato de salida
```

##### ng deploy

Despliega la aplicación a un hosting configurado (Firebase, GitHub Pages, etc.).

```bash
ng add @angular/fire         # Añadir soporte para Firebase
ng deploy                    # Desplegar
```

##### ng update

Actualiza Angular y sus dependencias a la última versión, aplicando migraciones automáticas cuando es necesario.

```bash
ng update [opciones]

ng update @angular/cli @angular/core           # Actualizar a la última versión
ng update @angular/cli@19 @angular/core@19     # Actualizar a una versión específica
ng update --next                                # Actualizar a la versión "next" (pre-release)
ng update --allow-dirty                         # Permitir actualizar con cambios sin commit
```

El comando `ng update` es increíblemente útil porque:
1. Actualiza `package.json` a las versiones correctas.
2. Aplica schematics de migración que modifican el código automáticamente.
3. Valida que las versiones sean compatibles entre sí.

##### ng add

Añade bibliotecas externas con schematics de instalación. Permite que las bibliotecas configuren el proyecto automáticamente.

```bash
ng add @angular/material        # Angular Material
ng add @angular/pwa             # Progressive Web App
ng add @angular/fire            # Firebase
ng add @angular/elements        # Angular Elements (web components)
ng add @ngrx/store              # NgRx para gestión de estado
```

##### ng version

Muestra las versiones de Angular CLI, Node.js, npm y los paquetes de Angular.

```bash
ng version
```

### Creación de proyectos

Vamos a detallar cada opción del comando `ng new`:

#### Opción --standalone

Cuando se especifica `--standalone=true` (o la opción por defecto en Angular 19+), se genera una aplicación basada en Standalone Components. Esto significa:

- No se genera `AppModule` (`app.module.ts`).
- El arranque usa `bootstrapApplication()` en lugar de `platformBrowserDynamic().bootstrapModule()`.
- Los componentes se crean con `standalone: true` por defecto.
- Las dependencias se configuran mediante funciones `provide*()` en `app.config.ts`.

Si NO se usa `--standalone` (o `--standalone=false`), se genera una aplicación basada en NgModules tradicionales. Esto es compatible hacia atrás pero no recomendado para nuevos proyectos.

#### Opción --routing

Cuando se especifica `--routing` (o `--routing=true`), Angular CLI genera:
- Un archivo `app.routes.ts` (o `app-routing.module.ts` en modo NgModule) con la configuración inicial de rutas.
- Importa `provideRouter` en `app.config.ts` (o configura `RouterModule` en el módulo principal).

Si NO se usa `--routing`, la aplicación no tendrá capacidad de navegación entre páginas, pero puedes añadirla manualmente más adelante.

#### Opción --style

Especifica el preprocesador de estilos para la aplicación:

| Valor | Descripción |
|---|---|
| `css` | CSS plano (por defecto). No requiere configuración adicional. |
| `scss` | SCSS (Sassy CSS). La sintaxis más popular. Compatible con CSS, añade variables, mixins, nesting. |
| `sass` | Sass (sintaxis indentada). Similar a SCSS pero sin llaves ni punto y coma. |
| `less` | LESS. Alternativa madura con sintaxis similar a CSS. |

Recomendación profesional: SCSS es el estándar de facto en la industria Angular. Ofrece el mejor equilibrio entre potencia y familiaridad.

```bash
ng new mi-app --style=scss
```

#### Opción --ssr

A partir de Angular 17, `--ssr` activa Server-Side Rendering nativo. Cuando se especifica:

- Se añade `@angular/ssr` al proyecto.
- Se genera `server.ts` con la configuración del servidor Express.
- `angular.json` incluye la configuración del builder para SSR.
- Se actualizan los scripts en `package.json` para servir la aplicación con SSR.

El SSR mejora el SEO, el Time to First Byte (TTFB) y la experiencia de usuario en conexiones lentas.

```bash
ng new mi-app --ssr
```

#### Opción --strict

El modo estricto activa comprobaciones más rigurosas de TypeScript y Angular. Cuando se especifica:

- `strict` en `tsconfig.json` se activa (incluye `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, etc.).
- Las plantillas tienen type checking más estricto (`strictTemplates`).
- Los presupuestos de bundle son más restrictivos.
- El tamaño máximo de bundle de entrada es menor.

```bash
ng new mi-app --strict
```

#### Ejemplo completo con todas las opciones

```bash
ng new mi-aplicacion \
  --standalone \
  --routing \
  --style=scss \
  --ssr \
  --strict \
  --prefix=mcp \
  --directory=./mi-aplicacion \
  --skip-git=true
```

Donde:
- `--prefix=mcp`: los selectores de componentes usarán el prefijo `mcp` (ej: `<mcp-header>`).
- `--directory=./mi-aplicacion`: crea el proyecto en un subdirectorio llamado `mi-aplicacion`.
- `--skip-git=true`: no inicializa un repositorio git.

### Estructura de carpetas

Al ejecutar `ng new mi-app --standalone --routing --style=scss --ssr`, se genera la siguiente estructura. Vamos a explicar CADA archivo y carpeta:

```
mi-app/
├── .angular/                        # Caché del CLI (no se sube a git)
│   └── cache/                        # Caché de builds para acelerar recompilaciones
├── .vscode/                         # Configuración específica de VS Code
│   ├── extensions.json              # Extensiones recomendadas para el proyecto
│   ├── launch.json                  # Configuraciones de depuración
│   └── tasks.json                   # Tareas de VS Code (build, serve)
├── public/                          # Assets públicos (no procesados por webpack/vite)
│   └── favicon.ico                  # Favicon de la aplicación
├── src/                             # CÓDIGO FUENTE DE LA APLICACIÓN
│   ├── app/                         # Componentes, servicios y lógica de la aplicación
│   │   ├── app.component.ts        # Componente raíz (clase TypeScript)
│   │   ├── app.component.html      # Plantilla del componente raíz
│   │   ├── app.component.scss      # Estilos del componente raíz
│   │   ├── app.component.spec.ts   # Tests unitarios del componente raíz
│   │   ├── app.config.ts           # Configuración de la aplicación (proveedores)
│   │   ├── app.config.server.ts    # Configuración adicional para SSR
│   │   └── app.routes.ts           # Definición de rutas de la aplicación
│   ├── index.html                   # Página HTML principal (entry point)
│   ├── main.ts                      # Entry point de la aplicación (bootstrap)
│   ├── main.server.ts               # Entry point para SSR
│   ├── server.ts                    # Configuración del servidor Express para SSR
│   └── styles.scss                  # Estilos globales de la aplicación
├── angular.json                     # Configuración del workspace y proyectos Angular
├── package.json                     # Dependencias y scripts del proyecto
├── package-lock.json                # Versiones exactas de las dependencias
├── tsconfig.json                    # Configuración base de TypeScript
├── tsconfig.app.json                # Configuración TypeScript para la aplicación
├── tsconfig.spec.json               # Configuración TypeScript para los tests
├── .editorconfig                    # Configuración del editor (indentación, charset)
├── .gitignore                       # Archivos y carpetas ignorados por git
└── README.md                        # Documentación del proyecto (autogenerado)
```

#### Explicación detallada de cada elemento

##### `.angular/`
Directorio de caché interna usado por Angular CLI para almacenar artefactos de build compilados. Esta caché acelera las compilaciones incrementales. NO se debe subir a git (está en `.gitignore` por defecto). Si alguna vez tienes comportamientos extraños, puedes borrar esta carpeta de forma segura: se regenerará en el próximo build.

##### `.vscode/`
Cuando abres el proyecto con VS Code, esta carpeta contiene configuraciones específicas del proyecto:
- **extensions.json**: Recomienda extensiones al abrir el proyecto. Angular configura `angular.ng-template` y `dbaeumer.vscode-eslint`.
- **launch.json**: Configuraciones para depurar la aplicación desde VS Code. Angular configura perfiles para depurar en Chrome.
- **tasks.json**: Tareas de VS Code que se pueden ejecutar con `Ctrl+Shift+P`. Angular configura tareas para `ng serve` y `ng build`.

##### `public/`
Contiene assets que se copian directamente a la carpeta de salida del build sin ningún procesamiento. A diferencia de los assets en `src/assets/` (que son parte del sistema de build y pueden ser optimizados), los archivos en `public/` se sirven tal cual. Ideal para:
- `favicon.ico`: el icono que aparece en la pestaña del navegador.
- `robots.txt`: instrucciones para motores de búsqueda.
- `manifest.json`: manifiesto para PWA.
- Archivos que deben mantener su nombre exacto.

##### `src/` - El directorio de código fuente

Toda la lógica de la aplicación vive aquí. Es el directorio donde pasaremos el 95% de nuestro tiempo.

**`src/app/` - La aplicación**

El corazón del proyecto. Contiene todos los componentes, servicios, directivas, pipes, guards, interceptores y modelos de datos.

- **`app.component.ts`**: El componente raíz de la aplicación. Es el primer componente que se carga y actúa como contenedor principal. Su selector suele ser `app-root` y en su plantilla se renderiza el resto de la aplicación (normalmente mediante `<router-outlet>`).

```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',               // Nombre de la etiqueta HTML que usaremos
  standalone: true,                    // Componente autónomo
  imports: [RouterOutlet],             // Otros componentes/directivas que necesita
  templateUrl: './app.component.html', // Plantilla externa
  styleUrls: ['./app.component.scss']  // Estilos encapsulados
})
export class AppComponent {
  title = 'mi-app';                    // Propiedad disponible en la plantilla
}
```

- **`app.component.html`**: La plantilla del componente raíz. Normalmente contiene elementos de layout estático (header, footer, sidebar) y el `<router-outlet>` donde se renderizan las vistas según la ruta.

```html
<header>
  <h1>{{ title }}</h1>
  <nav>
    <a routerLink="/">Inicio</a>
    <a routerLink="/about">Acerca de</a>
  </nav>
</header>

<main>
  <router-outlet></router-outlet>
  <!-- Aquí se renderizan los componentes según la ruta activa -->
</main>

<footer>
  <p>© 2024 Mi Aplicación</p>
</footer>
```

- **`app.config.ts`**: Archivo fundamental en aplicaciones standalone. Aquí se configuran los proveedores globales de la aplicación.

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), // Optimización de detección de cambios
    provideRouter(routes),           // Configuración de enrutamiento
    provideClientHydration(),        // Hidratación para SSR
    provideHttpClient(withFetch()),  // Cliente HTTP global
  ]
};
```

Cada función `provide*()` registra servicios y configuraciones en el sistema de inyección de dependencias de Angular. Esto reemplaza a los `imports` y `providers` de los NgModules tradicionales.

- **`app.routes.ts`**: Define las rutas de la aplicación.

```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
    // Lazy loading: el componente se carga solo cuando el usuario navega a esta ruta
  },
  {
    path: 'about',
    loadComponent: () => import('./about/about.component').then(m => m.AboutComponent),
  },
  {
    path: '**',                       // Wildcard: ruta no encontrada
    redirectTo: ''                    // Redirige a la página principal
  }
];
```

- **`app.config.server.ts`**: Configuración específica para el entorno de servidor (SSR). Se fusiona con `app.config.ts` cuando la aplicación se ejecuta en el servidor.

```typescript
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering()   // Proveedor necesario para renderizado en servidor
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
```

**`src/index.html`**

El archivo HTML raíz que se sirve al navegador. Es el entry point estático. Angular no modifica este archivo dinámicamente; en su lugar, el componente raíz se renderiza dentro del selector (normalmente `<app-root>`).

```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Mi Aplicación</title>
  <base href="/">          <!-- Base URL para el router de Angular -->
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
  <app-root></app-root>    <!-- Aquí se monta la aplicación Angular -->
</body>
</html>
```

Elementos clave:
- `<base href="/">`: Fundamental para el router de Angular. Define la URL base para navegación. Si despliegas en un subdirectorio (ej: `https://ejemplo.com/app/`), debes cambiarlo a `<base href="/app/">`.
- `<app-root></app-root>`: El selector del componente raíz. Angular reemplaza este elemento con el contenido renderizado de `AppComponent`.

**`src/main.ts`**

El entry point de la aplicación. Aquí se invoca `bootstrapApplication()` para iniciar Angular.

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
```

Este es el primer código TypeScript que se ejecuta. `bootstrapApplication()` recibe el componente raíz y la configuración de la aplicación, y monta todo en el DOM.

**`src/styles.scss`**

Estilos CSS/SCSS globales. A diferencia de los estilos de componente (que están encapsulados), estos estilos afectan a TODA la aplicación. Es el lugar ideal para:
- Variables CSS globales (tema, colores).
- Estilos de reset/normalize.
- Tipografía base.
- Utilidades globales.

```scss
// Variables globales
:root {
  --color-primary: #3f51b5;
  --color-accent: #ff4081;
  --color-warn: #f44336;
  --font-family: 'Roboto', sans-serif;
}

// Reset básico
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-family);
  line-height: 1.6;
  color: #333;
}
```

**`server.ts`**

El servidor Express para SSR. Cuando la aplicación se ejecuta en modo SSR (`ng serve` con la configuración de SSR), este archivo inicia un servidor Node.js que renderiza la aplicación.

```typescript
import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Servir archivos estáticos desde /browser
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y'
  }));

  // Todas las rutas regulares usan el motor de Angular para SSR
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}
```

### Ficheros de configuración

#### angular.json

Este es el archivo de configuración más importante del proyecto. Define la estructura del workspace, las opciones de build, serve, test y despliegue. Vamos a analizarlo en profundidad:

```json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,                               // Versión del formato de configuración
  "newProjectRoot": "projects",               // Raíz para nuevos proyectos (en monorepos)
  "projects": {                               // Proyectos en el workspace
    "mi-app": {                               // Nombre del proyecto
      "projectType": "application",           // Tipo: application o library
      "schematics": {                         // Opciones por defecto para schematics
        "@schematics/angular:component": {
          "style": "scss",                     // Usar SCSS al generar componentes
          "standalone": true,                  // Generar standalone por defecto
          "changeDetection": "OnPush"          // Estrategia de detección de cambios
        }
      },
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",                        // Prefijo para selectores de componentes
      "architect": {                          // Configuración de tareas (build, serve, test)
        "build": {                            // Tarea: ng build
          "builder": "@angular-devkit/build-angular:application",
          "options": {                        // Opciones por defecto (desarrollo y producción)
            "outputPath": {                   // Directorio de salida
              "base": "dist/mi-app",
              "browser": "dist/mi-app/browser",      // Archivos para navegador
              "server": "dist/mi-app/server"          // Archivos para SSR
            },
            "index": "src/index.html",        // Entry point HTML
            "browser": "src/main.ts",         // Entry point para navegador
            "server": "src/main.server.ts",    // Entry point para SSR
            "polyfills": ["zone.js"],         // Polyfills necesarios
            "tsConfig": "tsconfig.app.json",  // Config TypeScript para la app
            "assets": [                       // Assets a copiar al output
              {
                "glob": "**/*",
                "input": "public"             // Carpeta public/
              }
            ],
            "styles": [                       // Estilos globales
              "src/styles.scss"
            ],
            "scripts": [],                    // Scripts JS globales (ej: jQuery, Bootstrap JS)
            "stylePreprocessorOptions": {     // Opciones para SCSS/Sass
              "includePaths": [
                "src/styles"                  // Importar desde src/styles sin ruta completa
              ]
            }
          },
          "configurations": {                // Configuraciones específicas
            "development": {                  // ng build --configuration=development
              "optimization": false,          // Sin minificación
              "extractLicenses": false,       // No extraer licencias a archivo separado
              "sourceMap": true               // Generar source maps para debug
            },
            "production": {                   // ng build --configuration=production
              "optimization": true,           // Minificación y tree-shaking
              "outputHashing": "all",         // Hash en nombres de archivo
              "sourceMap": false,             // Sin source maps (más pequeño)
              "namedChunks": false,           // Sin nombres descriptivos en chunks
              "extractLicenses": true,        // Extraer licencias a archivo separado
              "budgets": [                    // Presupuestos de tamaño
                {
                  "type": "initial",
                  "maximumWarning": "500kb",  // Aviso si > 500KB
                  "maximumError": "1mb"       // Error si > 1MB
                }
              ]
            }
          },
          "defaultConfiguration": "production"  // Config por defecto para build
        },
        "serve": {                            // Tarea: ng serve
          "builder": "@angular-devkit/build-angular:dev-server",
          "options": {
            // La mayoría de opciones se heredan de "build"
          },
          "configurations": {
            "development": {
              "buildTarget": "mi-app:build:development"
            },
            "production": {
              "buildTarget": "mi-app:build:production"
            }
          },
          "defaultConfiguration": "development"
        },
        "extract-i18n": {                     // Tarea: ng extract-i18n
          "builder": "@angular-devkit/build-angular:extract-i18n"
        },
        "test": {                             // Tarea: ng test
          "builder": "@angular-devkit/build-angular:karma",
          "options": {
            "polyfills": ["zone.js", "zone.js/testing"],
            "tsConfig": "tsconfig.spec.json",
            "karmaConfig": "karma.conf.js",
            "styles": ["src/styles.scss"],
            "scripts": []
          }
        }
      }
    }
  }
}
```

**Conceptos clave de `angular.json`:**

- **Builder**: es la herramienta que ejecuta una tarea. Angular tiene builders para build, serve, test, lint, etc. Puedes crear builders personalizados.

- **Options**: configuración base que se aplica siempre, independientemente de la configuración seleccionada.

- **Configurations**: sobreescrituras de las opciones base para entornos específicos. Permiten tener configuraciones diferentes para desarrollo, producción, staging, etc.

- **Budgets**: límites de tamaño para los bundles. Si el bundle supera el límite, se muestra un warning o un error. Son fundamentales para mantener el rendimiento bajo control.

- **Scripts y styles**: archivos JS y CSS que se incluyen globalmente en la aplicación. Los scripts se añaden al bundle global (no lazy-loading). Siempre que sea posible, prefiere importar dependencias en los componentes específicos que las necesitan.

#### Configuración TypeScript

Angular genera varios archivos de configuración TypeScript que trabajan juntos mediante herencia:

**`tsconfig.json`** (configuración base):

```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "outDir": "./dist/out-tsc",
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "sourceMap": true,
    "declaration": false,
    "experimentalDecorators": true,        // Necesario para decoradores @Component, @Input...
    "moduleResolution": "bundler",
    "importHelpers": true,
    "target": "ES2022",
    "module": "ES2022",
    "lib": ["ES2022", "dom"],
    "baseUrl": "./",
    "paths": {                             // Alias de rutas
      "@app/*": ["src/app/*"],
      "@environments/*": ["src/environments/*"]
    }
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true                // Type checking en plantillas HTML
  }
}
```

**`tsconfig.app.json`** (extiende `tsconfig.json` para la aplicación):

```json
{
  "extends": "./tsconfig.json",           // Hereda la configuración base
  "compilerOptions": {
    "outDir": "./out-tsc/app",
    "types": ["node"]                      // Tipos disponibles para el código de la app
  },
  "files": [
    "src/main.ts",                         // Entry point del navegador
    "src/main.server.ts",                  // Entry point del servidor (SSR)
    "src/server.ts"                        // Configuración del servidor Express
  ],
  "include": ["src/**/*.d.ts"]             // Archivos incluidos en la compilación
}
```

**`tsconfig.spec.json`** (para tests):

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/spec",
    "types": ["jasmine", "node"]           // Tipos de Jasmine para los tests
  },
  "include": [
    "src/**/*.spec.ts",                    // Solo archivos de test
    "src/**/*.d.ts"
  ]
}
```

**Opciones clave de TypeScript para Angular:**

| Opción | Propósito |
|---|---|
| `strict` | Activa todas las comprobaciones estrictas (noImplicitAny, strictNullChecks, etc.) |
| `experimentalDecorators` | Necesario para usar @Component, @Injectable, @Input, etc. |
| `target` | Versión de ECMAScript de salida (ES2022 recomendado) |
| `module` | Sistema de módulos (ES2022 para tree-shaking óptimo) |
| `strictTemplates` | Type checking en plantillas Angular (detecta errores de tipos en {{ }} y [ ]) |
| `baseUrl` | Directorio base para importaciones no relativas |
| `paths` | Alias de rutas para imports (ej: `@app/components/mi-componente`) |

### Build

El comando `ng build` compila la aplicación Angular en archivos estáticos (HTML, CSS, JS) que pueden ser servidos por cualquier servidor web. El proceso de build incluye:

#### Etapas del build

1. **Compilación TypeScript** (`tsc` o esbuild): Convierte TypeScript a JavaScript.
2. **Compilación de plantillas** (Angular compiler): Compila las plantillas HTML en instrucciones JavaScript. Con AOT (Ahead-of-Time), esto ocurre durante el build; con JIT (Just-in-Time), ocurre en el navegador.
3. **Bundling** (webpack o esbuild): Agrupa todos los módulos en archivos (chunks) optimizados para el navegador.
4. **Minificación y tree-shaking**: Elimina código no utilizado (dead code) y reduce el tamaño del código.
5. **Hashing**: Añade hashes a los nombres de archivo para cache-busting.
6. **Generación de index.html**: Inserta las etiquetas `<script>` y `<link>` necesarias.

#### Estructura de salida de `ng build`

```
dist/mi-app/
├── browser/                              # Archivos para el navegador
│   ├── index.html                        # Página HTML principal
│   ├── main-ABCDEF1234.js                # Bundle principal (lógica de la app)
│   ├── polyfills-ABCDEF1234.js           # Polyfills (Zone.js, etc.)
│   ├── styles-ABCDEF1234.css             # Estilos globales compilados
│   ├── chunk-XXXX.js                     # Lazy chunks (componentes cargados bajo demanda)
│   ├── worker-XXXX.js                    # Web Workers (si se usan)
│   └── assets/                           # Assets copiados (imágenes, fuentes)
├── server/                               # Archivos para SSR
│   ├── server.mjs                        # Servidor Express compilado
│   └── index.server.html                 # HTML para renderizado en servidor
```

#### Opciones importantes de build

- **`--configuration=production`**: Build optimizado para producción (minificado, sin source maps, con hashes).
- **`--output-path`**: Directorio donde se generan los archivos de salida.
- **`--base-href`**: URL base para la aplicación. Necesario si se despliega en un subdirectorio.
- **`--deploy-url`**: URL base para los assets (scripts, estilos).
- **`--source-map`**: Genera source maps para depurar en producción (aumenta el tamaño del build).
- **`--watch`**: Recompila automáticamente al detectar cambios en los archivos fuente.
- **`--optimization`**: Activa/desactiva la optimización (minificación, tree-shaking).
- **`--aot`**: Usa compilación Ahead-of-Time (activado por defecto en producción desde Angular 9).
- **`--output-hashing`**: Estrategia de hashing (`none`, `all`, `media`, `bundles`).
- **`--named-chunks`**: Usa nombres descriptivos para los chunks en lugar de IDs numéricos.
- **`--progress`**: Muestra el progreso de la compilación en la terminal.

#### Lazy loading y code splitting

Angular divide automáticamente el código en chunks cuando usas lazy loading con `loadComponent` o `loadChildren`. Esto significa que el código de una ruta solo se descarga cuando el usuario navega a ella:

```typescript
// En app.routes.ts
export const routes: Routes = [
  {
    path: 'dashboard',
    // El código del Dashboard NO se incluye en el bundle principal.
    // Se descarga en un archivo separado cuando se navega a /dashboard.
    loadComponent: () => import('./dashboard/dashboard.component')
      .then(m => m.DashboardComponent)
  }
];
```

### Serve

`ng serve` inicia un servidor de desarrollo basado en webpack-dev-server (o vite-dev-server en versiones modernas). Características:

#### Hot Module Replacement (HMR)

Cuando modificas un archivo, el servidor detecta el cambio y:
1. Recompila solo los módulos afectados (compilación incremental).
2. Notifica al navegador mediante WebSocket.
3. El navegador actualiza el componente modificado sin recargar la página completa.

Esto mantiene el estado de la aplicación (datos en formularios, scroll position, etc.) durante la recarga.

#### Configuración del proxy

Puedes configurar un proxy para redirigir peticiones API durante el desarrollo a un backend externo, evitando problemas de CORS. Crea un archivo `proxy.conf.json`:

```json
{
  "/api": {
    "target": "http://localhost:8080",   // Backend de desarrollo
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

Luego, úsalo con:

```bash
ng serve --proxy-config proxy.conf.json
```

Esto redirige todas las peticiones a `/api/*` a `http://localhost:8080/api/*`.

#### SSL en desarrollo

```bash
ng serve --ssl
```

Esto genera un certificado autofirmado para probar HTTPS en localhost. Útil para probar Service Workers, geolocalización y otras APIs que requieren HTTPS.

### Configuración de entornos

Los entornos permiten tener configuraciones diferentes para desarrollo, producción, staging, etc. Angular no genera archivos de entornos por defecto en proyectos modernos (Angular 15+), pero puedes crearlos manualmente o utilizar el sistema de `configurations` en `angular.json`.

#### Método moderno: archivos de entorno (recomendado)

Crea una carpeta `src/environments/` con los siguientes archivos:

```typescript
// src/environments/environment.ts (desarrollo)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  apiKey: 'dev-key-12345',
  logging: true,
  featureFlags: {
    newDashboard: true,
    darkMode: false,
  }
};

// src/environments/environment.production.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.miempresa.com/v2',
  apiKey: 'prod-key-67890',
  logging: false,
  featureFlags: {
    newDashboard: false,   // Desactivado en producción hasta que esté listo
    darkMode: true,
  }
};

// src/environments/environment.staging.ts (entorno de pruebas)
export const environment = {
  production: false,
  apiUrl: 'https://staging-api.miempresa.com/v2',
  apiKey: 'staging-key-11111',
  logging: true,
  featureFlags: {
    newDashboard: true,
    darkMode: true,
  }
};
```

Luego, configura `fileReplacements` en `angular.json`:

```json
{
  "projects": {
    "mi-app": {
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.production.ts"
                }
              ]
            },
            "staging": {
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.staging.ts"
                }
              ]
            }
          }
        }
      }
    }
  }
}
```

Para usar los entornos:

```typescript
import { environment } from '../environments/environment';

// En cualquier servicio o componente
if (environment.logging) {
  console.log('Modo debug activado');
}

this.http.get(`${environment.apiUrl}/usuarios`);
```

Y para build con un entorno específico:

```bash
ng build --configuration=staging
ng build --configuration=production
```

## Ejemplos guiados

### Ejemplo 1: Crear un proyecto desde cero paso a paso

**Objetivo**: Crear un proyecto Angular completo con routing, SCSS y SSR, interpretando cada paso del asistente.

```bash
# Paso 1: Crear el proyecto
ng new gestion-tareas

# El CLI interactivo preguntará:
# ? Which stylesheet format would you like to use?
#   Elegimos: SCSS (uso profesional, más potente que CSS)
#
# ? Do you want to enable Server-Side Rendering (SSR)?
#   Respondemos: Yes (para tener SSR desde el principio)
#
# ? Would you like to use Standalone Components?
#   Respondemos: Yes (recomendado para proyectos nuevos)

# Paso 2: Navegar al directorio del proyecto
cd gestion-tareas

# Paso 3: Iniciar el servidor de desarrollo
ng serve --open

# El navegador se abre en http://localhost:4200
# Vemos la página de bienvenida de Angular
```

**Explicación del proyecto generado**:
- Como usamos `--style=scss`, todos los componentes generados usarán archivos `.scss`.
- Como activamos SSR, tenemos la estructura completa con `server.ts`, `main.server.ts` y `app.config.server.ts`.
- Como elegimos Standalone, tenemos `app.config.ts` en lugar de `app.module.ts`.

**Verificación del funcionamiento**:
1. Abre `src/app/app.component.ts`.
2. Cambia la propiedad `title` a `'Gestión de Tareas'`.
3. Guarda el archivo.
4. El navegador se actualiza automáticamente mostrando el nuevo título.

### Ejemplo 2: Configurar SCSS como preprocesador y personalizar estilos globales

**Explicación**: Vamos a configurar SCSS con variables globales, un sistema de reset básico y tipografía personalizada. Configuraremos los `stylePreprocessorOptions` para poder importar parciales SCSS sin rutas largas.

```bash
# Crear estructura de estilos
mkdir -p src/styles/abstracts
mkdir -p src/styles/base
```

**Crear archivos de estilos**:

```scss
// src/styles/abstracts/_variables.scss
// Variables de diseño globales

// Colores de la marca
$color-primary: #3f51b5;       // Índigo
$color-primary-light: #757de8;
$color-primary-dark: #002984;
$color-accent: #ff4081;        // Rosa
$color-warn: #f44336;          // Rojo

// Escala de grises
$color-white: #ffffff;
$color-gray-100: #f5f5f5;
$color-gray-200: #eeeeee;
$color-gray-300: #e0e0e0;
$color-gray-700: #616161;
$color-gray-900: #212121;

// Tipografía
$font-family-base: 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif;
$font-family-mono: 'Fira Code', 'Consolas', monospace;
$font-size-base: 16px;
$line-height-base: 1.6;

// Espaciado
$spacing-unit: 8px;
$spacing-xs: $spacing-unit * 0.5;   // 4px
$spacing-sm: $spacing-unit;         // 8px
$spacing-md: $spacing-unit * 2;     // 16px
$spacing-lg: $spacing-unit * 3;     // 24px
$spacing-xl: $spacing-unit * 4;     // 32px

// Breakpoints
$breakpoint-sm: 576px;
$breakpoint-md: 768px;
$breakpoint-lg: 992px;
$breakpoint-xl: 1200px;

// Bordes y sombras
$border-radius: 4px;
$border-radius-lg: 8px;
$box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
$box-shadow-lg: 0 4px 12px rgba(0, 0, 0, 0.15);
```

```scss
// src/styles/abstracts/_mixins.scss
// Mixins reutilizables

@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

@mixin flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@mixin responsive($breakpoint) {
  @if $breakpoint == sm {
    @media (min-width: $breakpoint-sm) { @content; }
  } @else if $breakpoint == md {
    @media (min-width: $breakpoint-md) { @content; }
  } @else if $breakpoint == lg {
    @media (min-width: $breakpoint-lg) { @content; }
  } @else if $breakpoint == xl {
    @media (min-width: $breakpoint-xl) { @content; }
  }
}

@mixin button-base {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-sm $spacing-md;
  border: none;
  border-radius: $border-radius;
  font-family: $font-family-base;
  font-size: $font-size-base;
  cursor: pointer;
  transition: all 0.2s ease;
}

@mixin button-primary {
  @include button-base;
  background-color: $color-primary;
  color: $color-white;

  &:hover {
    background-color: $color-primary-dark;
  }

  &:active {
    transform: scale(0.98);
  }
}
```

```scss
// src/styles/base/_reset.scss
// Reset CSS básico

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: $font-size-base;
  -webkit-text-size-adjust: 100%;
}

body {
  font-family: $font-family-base;
  line-height: $line-height-base;
  color: $color-gray-900;
  background-color: $color-gray-100;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}

input, button, textarea, select {
  font: inherit;
}

a {
  color: $color-primary;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

ul, ol {
  list-style: none;
}

h1, h2, h3, h4, h5, h6 {
  line-height: 1.2;
  margin-bottom: $spacing-sm;
}

h1 { font-size: 2.5rem; }
h2 { font-size: 2rem; }
h3 { font-size: 1.75rem; }
h4 { font-size: 1.5rem; }
h5 { font-size: 1.25rem; }
h6 { font-size: 1rem; }
```

**Actualizar el archivo principal de estilos**:

```scss
// src/styles.scss
// Importaciones globales

// Abstracts (variables y mixins: no generan CSS por sí mismos)
@import 'styles/abstracts/variables';
@import 'styles/abstracts/mixins';

// Base (reset y estilos base)
@import 'styles/base/reset';

// Opcionalmente, importa una fuente de Google Fonts
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Fira+Code&display=swap');
```

**Configurar includePaths en `angular.json`**:

```json
{
  "projects": {
    "gestion-tareas": {
      "architect": {
        "build": {
          "options": {
            "stylePreprocessorOptions": {
              "includePaths": [
                "src/styles",
                "src"
              ]
            }
          }
        }
      }
    }
  }
}
```

Con esta configuración, desde cualquier componente SCSS puedes importar variables sin rutas largas:

```scss
// Antes (sin includePaths)
@import '../../../styles/abstracts/variables';

// Ahora (con includePaths)
@import 'styles/abstracts/variables';
@import 'abstracts/variables';  // También funciona
```

### Ejemplo 3: Personalizar angular.json (presupuestos, estilos globales, assets)

**Explicación**: Vamos a configurar presupuestos de bundle más estrictos para mantener el rendimiento bajo control y añadir assets adicionales como Google Fonts.

```json
// Fragmento de angular.json con configuraciones personalizadas
{
  "projects": {
    "gestion-tareas": {
      "architect": {
        "build": {
          "options": {
            "outputPath": "dist/gestion-tareas",
            "index": "src/index.html",
            "browser": "src/main.ts",
            "polyfills": ["zone.js"],
            "tsConfig": "tsconfig.app.json",
            "assets": [
              "src/favicon.ico",
              "src/assets",
              {
                "glob": "**/*",
                "input": "public"
              }
            ],
            "styles": [
              "src/styles.scss"
            ],
            "scripts": [],
            "stylePreprocessorOptions": {
              "includePaths": ["src/styles"]
            },
            "allowedCommonJsDependencies": [
              "lodash"  // Si usas alguna dependencia CommonJS
            ]
          },
          "configurations": {
            "production": {
              "optimization": true,
              "outputHashing": "all",
              "sourceMap": false,
              "namedChunks": false,
              "extractLicenses": true,
              "vendorChunk": false,
              "buildOptimizer": true,
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "300kb",   // Más estricto que el default
                  "maximumError": "500kb"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "2kb",
                  "maximumError": "4kb"
                },
                {
                  "type": "any",
                  "maximumWarning": "1mb",
                  "maximumError": "2mb"
                }
              ],
              "outputHashing": "all"
            },
            "development": {
              "optimization": false,
              "extractLicenses": false,
              "sourceMap": true
            }
          }
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": {
            "production": {
              "buildTarget": "gestion-tareas:build:production"
            },
            "development": {
              "buildTarget": "gestion-tareas:build:development"
            }
          },
          "defaultConfiguration": "development"
        }
      }
    }
  }
}
```

**Explicación de los presupuestos**:
- `initial`: Tamaño del bundle inicial (el que se carga en la primera visita).
- `anyComponentStyle`: Tamaño máximo de los estilos de cualquier componente individual.
- `any`: Tamaño máximo de cualquier chunk individual.

Si algún chunk supera el `maximumError`, el build falla (útil en CI/CD). Si solo supera el `maximumWarning`, se muestra una advertencia pero el build continúa.

## Ejercicios resueltos

### Ejercicio 1: Crear proyecto Angular con routing, SCSS y SSR

**Enunciado**: Crea un proyecto Angular llamado `biblioteca-digital` con las siguientes características: routing activado, SCSS como preprocesador, SSR activado, modo estricto, y componentes standalone. Documenta cada paso y verifica que todo funciona.

**Solución**:

```bash
# 1. Crear el proyecto con todas las opciones requeridas
ng new biblioteca-digital \
  --routing \
  --style=scss \
  --ssr \
  --strict \
  --standalone \
  --prefix=bib

# 2. Navegar al directorio
cd biblioteca-digital

# 3. Explorar la estructura generada
ls -la

# 4. Verificar que los archivos principales existen
ls src/app/
# Deberíamos ver: app.component.ts, app.component.html, app.component.scss,
# app.component.spec.ts, app.config.ts, app.config.server.ts, app.routes.ts

# 5. Iniciar el servidor de desarrollo
ng serve --open

# 6. Verificar que el SSR funciona (en una segunda terminal)
npm run build
npm run serve:ssr:biblioteca-digital
# Visitar http://localhost:4000 para ver la versión con SSR

# 7. Verificar los scripts disponibles en package.json
# Deberían estar: start, build, watch, test, serve:ssr:biblioteca-digital
```

**Verificación**:
- `ng serve` funciona correctamente en `http://localhost:4200`.
- `ng build` genera los archivos en `dist/biblioteca-digital/`.
- `ng test` ejecuta los tests iniciales (aunque no haya tests personalizados, debería pasar).
- La estructura de carpetas coincide con la documentada.

### Ejercicio 2: Añadir Angular Material al proyecto

**Enunciado**: Añade Angular Material al proyecto `biblioteca-digital`, configurando un tema personalizado (indigo-pink), tipografía Roboto y animaciones. Personaliza el tema para usar colores corporativos.

**Solución**:

```bash
# 1. Añadir Angular Material mediante ng add
ng add @angular/material

# Durante la instalación, Angular Material hará preguntas interactivas:
# ? Choose a prebuilt theme name, or "custom" for a custom theme:
#   Elegimos: Custom (para aprender a personalizar)
#
# ? Set up global Angular Material typography styles?
#   Yes (para usar la tipografía de Material Design)
#
# ? Include the Angular animations module?
#   Yes (necesario para animaciones de Material)
```

**Archivos modificados por `ng add @angular/material`**:

1. **`angular.json`**: añade `src/styles.scss` como estilo global si no estaba.
2. **`src/styles.scss`**: modifica para incluir el tema.
3. **`src/index.html`**: añade enlaces a Google Fonts (Roboto) y Material Icons.
4. **`src/app/app.config.ts`**: añade `provideAnimations()` y `provideHttpClient()`.

**Configurar un tema personalizado**:

```scss
// src/styles.scss
// Tema personalizado para Angular Material

@use '@angular/material' as mat;

// Incluir los estilos comunes de Material
@include mat.core();

// Definir la paleta de colores primaria
$biblioteca-primary: mat.define-palette(mat.$indigo-palette, 700, 300, 900);
// 700 = tono por defecto (más oscuro que el estándar)
// 300 = tono más claro (para hover, estados focus)
// 900 = tono más oscuro (para texto sobre fondo primario)

// Definir la paleta de acento (colores secundarios)
$biblioteca-accent: mat.define-palette(mat.$pink-palette, A200, A100, A400);
// A200, A100, A400 = tonos de la paleta "accent" (colores más vibrantes)

// Definir la paleta de advertencia
$biblioteca-warn: mat.define-palette(mat.$red-palette);

// Definir la tipografía personalizada
$biblioteca-typography: mat.define-typography-config(
  $font-family: 'Roboto, sans-serif',
  $headline-1: mat.define-typography-level(32px, 40px, 700),
  $headline-2: mat.define-typography-level(24px, 32px, 500),
  $body-1: mat.define-typography-level(16px, 24px, 400),
);

// Crear el tema claro
$biblioteca-theme: mat.define-light-theme((
  color: (
    primary: $biblioteca-primary,
    accent: $biblioteca-accent,
    warn: $biblioteca-warn,
  ),
  typography: $biblioteca-typography,
  density: 0,  // 0 = densidad normal, -1 o -2 para más compacto
));

// Aplicar el tema a todos los componentes de Material
@include mat.all-component-themes($biblioteca-theme);

// Crear tema oscuro (opcional)
$biblioteca-dark-theme: mat.define-dark-theme((
  color: (
    primary: $biblioteca-primary,
    accent: $biblioteca-accent,
    warn: $biblioteca-warn,
  ),
  typography: $biblioteca-typography,
));

// Clase para activar el tema oscuro
.dark-theme {
  @include mat.all-component-colors($biblioteca-dark-theme);
}
```

**Verificar la instalación**:

```typescript
// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'bib-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule, MatIconModule, MatToolbarModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'biblioteca-digital';
}
```

```html
<!-- src/app/app.component.html -->
<mat-toolbar color="primary">
  <button mat-icon-button aria-label="Menú">
    <mat-icon>menu</mat-icon>
  </button>
  <span>{{ title }}</span>
  <span class="spacer"></span>
  <button mat-icon-button aria-label="Cuenta">
    <mat-icon>account_circle</mat-icon>
  </button>
</mat-toolbar>

<main>
  <router-outlet></router-outlet>
</main>
```

```scss
// src/app/app.component.scss
.spacer {
  flex: 1 1 auto;
}

main {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}
```

## Actividades propuestas

### Actividad 1: Análisis de la estructura del proyecto

**Descripción**: Crea un proyecto Angular con SCSS, routing y sin SSR. Explora la estructura de carpetas y crea un diagrama de árbol explicando la función de cada carpeta y archivo principal en tus propias palabras.

**Objetivos**:
- Memorizar la estructura del proyecto Angular.
- Comprender la función de cada archivo.
- Desarrollar la capacidad de orientarse en proyectos Angular.

**Entregable**: Diagrama en formato digital (puede ser un esquema de texto, un dibujo o usar herramientas como draw.io) con anotaciones.

### Actividad 2: Configuración de diferentes entornos

**Descripción**: Crea tres entornos para un proyecto llamado `ecommerce`: desarrollo, staging y producción. Cada entorno debe tener diferentes URLs de API, claves de API y feature flags. Configura `angular.json` para usar el entorno correcto en cada build.

**Entregable**: Capturas de pantalla mostrando el contenido de los archivos de entorno y la configuración en `angular.json`.

### Actividad 3: Añadir Angular Material y configurar tema oscuro/claro

**Descripción**: Añade Angular Material a tu proyecto y configura un sistema de temas (claro y oscuro) con un botón para alternar entre ellos. Usa paletas de colores que representen una marca ficticia.

**Entregable**: Código del componente de cambio de tema y capturas mostrando ambos temas.

### Actividad 4: Análisis del build

**Descripción**: Ejecuta `ng build --configuration=production` en un proyecto Angular y analiza los archivos generados en `dist/`. Explica qué es cada archivo JS (main, polyfills, styles) y por qué tiene un hash en el nombre.

**Entregable**: Documento con capturas de la carpeta `dist/` y una explicación de cada archivo.

### Actividad 5: Configurar un proxy para desarrollo

**Descripción**: Configura un proxy en tu proyecto Angular para que las peticiones a `/api` se redirijan a `https://jsonplaceholder.typicode.com`. Crea un servicio que haga una petición a `/api/users` y verifica que los datos se reciben correctamente.

**Entregable**: Archivo `proxy.conf.json`, configuración en `angular.json` y código del servicio.

## Actividades de ampliación

### Actividad de ampliación 1: Crear un workspace multi-proyecto

**Descripción**: Crea un workspace Angular que contenga dos aplicaciones (una web pública y un panel de administración) y una biblioteca compartida de componentes. Investiga cómo funciona `ng generate application` y `ng generate library` dentro de un workspace.

**Entregable**: Estructura del workspace, explicación de cómo se comparten componentes entre aplicaciones y cómo se sirven por separado.

### Actividad de ampliación 2: Migrar un proyecto de NgModule a Standalone

**Descripción**: Encuentra un tutorial o proyecto de ejemplo que use la sintaxis antigua de NgModules. Migra al menos un módulo y sus componentes a la sintaxis standalone, documentando los pasos necesarios y los errores encontrados.

**Entregable**: Código antes y después de la migración, con comentarios explicando cada cambio.

### Actividad de ampliación 3: Automatizar la verificación de presupuestos en CI/CD

**Descripción**: Configura presupuestos de bundle estrictos en `angular.json` y crea un script que ejecute `ng build` y verifique que no se superen los límites. Documenta cómo integrar esto en un pipeline de CI/CD (por ejemplo, GitHub Actions).

**Entregable**: Archivo de configuración de CI/CD (ej: `.github/workflows/build.yml`) y explicación del flujo.

## Buenas prácticas profesionales

1. **Versionar siempre `package-lock.json`**: Este archivo garantiza que todos los miembros del equipo y los servidores de CI/CD instalen exactamente las mismas versiones de las dependencias. No añadirlo a `.gitignore`.

2. **No modificar `node_modules` manualmente**: Si necesitas parchear una dependencia, usa herramientas como `patch-package` en lugar de modificar directamente `node_modules`, que se regenera con cada `npm install`.

3. **Usar `ng add` en lugar de `npm install` cuando esté disponible**: Muchas bibliotecas Angular (Material, PWA, Firebase) proporcionan schematics que configuran el proyecto automáticamente. `ng add` ejecuta estos schematics, mientras que `npm install` solo descarga el paquete.

4. **Mantener los presupuestos de bundle actualizados**: Revisa periódicamente el tamaño de los bundles y ajusta los presupuestos. Un bundle que crece descontroladamente suele indicar que se están importando dependencias innecesarias.

5. **Separar estilos globales de estilos de componentes**: Los estilos en `src/styles.scss` deben limitarse a variables, mixins, reset y tipografía base. Los estilos específicos de componentes deben estar en los archivos `.scss` de cada componente para aprovechar la encapsulación de Angular.

6. **Usar `includePaths` para SCSS**: Configura los paths de inclusión en `angular.json` para poder importar variables y mixins desde cualquier componente sin rutas relativas largas y frágiles.

7. **Configurar un prefijo único para los selectores**: El prefijo por defecto (`app`) puede colisionar con otras bibliotecas. Usa un prefijo que identifique tu organización o proyecto (ej: `bib`, `mcp`, `crm`).

8. **No abusar de los scripts globales en `angular.json`**: Añadir scripts y estilos globales aumenta el bundle inicial. Siempre que sea posible, importa las dependencias de forma lazy o específica para cada componente.

## Errores frecuentes

1. **Olvidar el flag `--standalone` en Angular 17/18**: Si creas un proyecto con `ng new` sin `--standalone` en versiones donde no es el comportamiento por defecto, obtendrás una aplicación basada en NgModules que requerirá más configuración. En Angular 19+ es standalone por defecto.

2. **Modificar `angular.json` con valores incorrectos**: Un error de sintaxis en `angular.json` puede romper todos los comandos del CLI (`ng serve`, `ng build`, etc.). Es un archivo JSON estricto: sin comentarios, sin comas finales, con comillas dobles.

3. **Instalar paquetes con `npm` en lugar de `ng add`**: Si instalas Angular Material con `npm install @angular/material` en lugar de `ng add @angular/material`, el paquete se descarga pero no se configura (faltan estilos, tema, tipografía, animaciones). Siempre usa `ng add` para paquetes Angular con schematics.

4. **No distinguir entre `styles` globales y estilos de componente**: Poner estilos específicos de un componente en `styles.scss` rompe la encapsulación y puede causar conflictos. Cada componente debe tener sus propios estilos.

5. **Ignorar los warnings de presupuestos**: Si ignoras los warnings de tamaño de bundle durante el desarrollo, probablemente tendrás problemas de rendimiento en producción. Los presupuestos están diseñados para detectar problemas temprano.

6. **Subir `node_modules` al repositorio**: Esta carpeta puede pesar cientos de megabytes. Debe estar en `.gitignore` siempre. El comando `npm install` la reconstruye a partir de `package.json` y `package-lock.json`.

7. **No configurar `@types/node` en `tsconfig.app.json`**: Si usas APIs de Node.js en tu código Angular (para SSR o scripts de build), necesitas incluir `"types": ["node"]` en `compilerOptions`. De lo contrario, TypeScript no reconocerá `require`, `process`, `Buffer`, etc.

8. **Confundir el `--ssr` flag**: `--ssr` configura Server-Side Rendering, pero NO significa que la aplicación se ejecute automáticamente con SSR. Necesitas ejecutar el comando de serve SSR específico (`npm run serve:ssr:...`) o configurar un servidor Node.js para producción.

## Resumen

En esta unidad hemos cubierto en profundidad la creación y configuración de proyectos Angular. Los conceptos clave son:

- **Node.js y npm** son la base sobre la que se ejecuta todo el ecosistema Angular. Comprender `package.json`, el versionado semántico y la diferencia entre `dependencies` y `devDependencies` es fundamental para gestionar proyectos profesionales.

- **Angular CLI** es la navaja suiza del desarrollador Angular: permite crear proyectos, generar código, servir en desarrollo, compilar para producción, ejecutar tests y desplegar. Dominar los comandos `ng new`, `ng serve`, `ng build` y `ng generate` es esencial para la productividad diaria.

- **La estructura de carpetas** de un proyecto Angular está diseñada para escalar. Conocer la función de cada archivo (`main.ts`, `app.config.ts`, `angular.json`, `tsconfig.*.json`) permite diagnosticar problemas rápidamente y configurar el proyecto de manera eficiente.

- **`angular.json`** es el archivo de configuración central del workspace. Controla cómo se compila, sirve, prueba y despliega cada proyecto. Sus sistemas de `options`, `configurations` y `budgets` proporcionan flexibilidad para adaptarse a diferentes entornos.

- **Los entornos** permiten tener configuraciones diferentes para desarrollo, pruebas y producción. El mecanismo de `fileReplacements` reemplaza archivos de entorno según la configuración de build seleccionada.

Con estos conocimientos, estamos listos para pasar a la creación de componentes, la pieza fundamental de cualquier aplicación Angular.

## Recursos adicionales

### Documentación oficial
- **Angular CLI Reference**: https://angular.dev/cli
- **Angular Workspace Configuration**: https://angular.dev/reference/configs/workspace-config
- **Angular SSR Guide**: https://angular.dev/guide/ssr
- **npm Documentation**: https://docs.npmjs.com

### Tutoriales
- **Angular First App Tutorial**: https://angular.dev/tutorials/first-app
- **Angular Material Getting Started**: https://material.angular.io/guide/getting-started
- **Deploying Angular Applications**: https://angular.dev/guide/deployment

### Herramientas relacionadas
- **nvm (Node Version Manager)**: https://github.com/nvm-sh/nvm
- **Angular Builders (build, serve, test)**: https://angular.dev/tools/cli/cli-builder
- **esbuild**: https://esbuild.github.io (nuevo motor de build en Angular 17+)

### Libros
- "Angular for Enterprise Applications" - Doguhan Uluca (capítulos sobre configuración)
- "Pro Angular" - Adam Freeman (capítulos sobre entorno de desarrollo)
