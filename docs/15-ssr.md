# Server Side Rendering (SSR) en Angular

## Objetivos de aprendizaje

Al finalizar este capítulo, el alumnado será capaz de:

- Comprender el concepto de Server-Side Rendering y sus ventajas frente al renderizado exclusivamente en cliente.
- Configurar SSR en un proyecto Angular utilizando `@angular/ssr`.
- Implementar hydration para reutilizar el HTML generado en el servidor.
- Aplicar técnicas de SEO (Title, Meta tags, Open Graph, JSON-LD) en aplicaciones Angular.
- Utilizar `@defer` para carga diferida de componentes no críticos.
- Escribir código compatible con entornos de servidor y cliente usando `isPlatformBrowser()`.
- Optimizar imágenes con la directiva `NgOptimizedImage`.

## Resultados de aprendizaje

1. Configura y ejecuta una aplicación Angular con Server-Side Rendering.
2. Implementa meta tags dinámicos y datos estructurados para mejorar el SEO.
3. Utiliza `@defer` para optimizar la carga de componentes pesados.
4. Escribe código condicional que se ejecute solo en cliente o solo en servidor.
5. Optimiza la carga de imágenes usando `NgOptimizedImage`.

## Introducción

Las aplicaciones Angular tradicionales se ejecutan completamente en el navegador del usuario (Client-Side Rendering o CSR). Cuando un usuario visita la URL, el servidor envía un archivo HTML prácticamente vacío y los scripts de Angular. El navegador descarga y ejecuta estos scripts, que construyen el DOM dinámicamente. Este enfoque tiene dos problemas fundamentales:

1. **SEO (Search Engine Optimization):** Los motores de búsqueda como Google, aunque han mejorado su capacidad para ejecutar JavaScript, pueden tener dificultades para indexar correctamente el contenido generado dinámicamente. Los rastreadores de redes sociales (Twitter, Facebook, LinkedIn) a menudo no ejecutan JavaScript, por lo que no pueden leer meta tags dinámicos.

2. **Rendimiento percibido:** El usuario ve una página en blanco durante varios segundos mientras el navegador descarga los bundles de JavaScript, los interpreta y construye la interfaz. En dispositivos lentos o conexiones móviles, este tiempo puede ser considerable.

El **Server-Side Rendering (SSR)** soluciona ambos problemas ejecutando la aplicación Angular en el servidor y enviando al navegador HTML completamente renderizado. El usuario ve contenido inmediatamente, y los motores de búsqueda pueden indexar la página sin necesidad de ejecutar JavaScript. Una vez cargado, Angular toma el control del HTML generado en el servidor mediante un proceso llamado **hydration**.

En este capítulo, aprenderás a configurar SSR en un proyecto Angular, implementar hydration, optimizar el SEO con meta tags dinámicos, usar `@defer` para carga diferida de componentes, y escribir código que funcione correctamente tanto en el servidor como en el navegador.

---

## Desarrollo teórico

### Qué es SSR (Server-Side Rendering)

#### Renderizado en el servidor vs renderizado en el cliente

Para entender el SSR, comparemos los dos enfoques:

**Client-Side Rendering (CSR):**
1. El navegador solicita `https://miapp.com/productos`.
2. El servidor responde con un HTML mínimo: `<app-root></app-root>` + bundles de JavaScript.
3. El navegador descarga los archivos JavaScript (main.js, etc.).
4. El navegador ejecuta Angular, que construye el DOM y renderiza la página.
5. El usuario ve el contenido (tras varios segundos de pantalla en blanco o spinner).

**Server-Side Rendering (SSR):**
1. El navegador solicita `https://miapp.com/productos`.
2. El servidor ejecuta Angular, construye el DOM completo y genera HTML.
3. El servidor envía HTML completamente renderizado al navegador.
4. El usuario ve el contenido inmediatamente.
5. En paralelo, el navegador descarga los bundles de JavaScript.
6. Cuando los bundles se cargan, Angular toma el control del DOM existente (**hydration**).

#### Cómo funciona: el servidor ejecuta Angular, genera HTML estático, lo envía al cliente

Angular utiliza un motor llamado **CommonEngine** (parte del paquete `@angular/ssr`) que es capaz de ejecutar componentes Angular en Node.js. El flujo es:

1. El servidor Express (o cualquier servidor Node.js) recibe la petición HTTP.
2. El `CommonEngine` renderiza la aplicación Angular, ejecutando todos los componentes necesarios.
3. Se genera un string HTML completo con el contenido renderizado.
4. El HTML se envía como respuesta HTTP.
5. El navegador muestra el HTML inmediatamente.
6. Los scripts de Angular se descargan y el cliente hace "hydrate" del HTML existente.

#### Ventajas: SEO, rendimiento percibido (FCP, LCP), accesibilidad

**Mejora del SEO:**
- Los motores de búsqueda reciben HTML completo con todo el contenido textual.
- Las meta tags (title, description, Open Graph, Twitter Cards) están disponibles en la respuesta HTML.
- Los datos estructurados (JSON-LD) son legibles por los rastreadores sin ejecutar JavaScript.
- Las redes sociales pueden generar vistas previas (tarjetas) correctamente.

**Mejora del rendimiento percibido:**
- **FCP (First Contentful Paint):** Se reduce drásticamente porque el HTML ya contiene contenido visible.
- **LCP (Largest Contentful Paint):** El contenido principal aparece antes.
- **TTI (Time to Interactive):** Puede mejorar porque el usuario puede leer el contenido mientras el JavaScript se carga.

**Mejora de la accesibilidad:**
- Los lectores de pantalla pueden procesar el HTML inmediatamente.
- Los usuarios con JavaScript deshabilitado o navegadores antiguos pueden ver el contenido básico.

#### Desventajas: mayor complejidad, carga del servidor, restricciones

- **Mayor complejidad técnica:** Hay que gestionar dos entornos (servidor y cliente) con diferencias importantes.
- **Carga del servidor:** Cada petición requiere ejecutar Angular en el servidor, lo que consume CPU y memoria.
- **Restricciones en el servidor:** No existen `window`, `document`, `localStorage`, `navigator` ni otras APIs del navegador. Hay que escribir código condicional.
- **Latencia del servidor:** Para usuarios lejanos geográficamente, el SSR puede añadir latencia si el servidor no está bien posicionado.
- **Tiempo hasta la interactividad:** Aunque el contenido se ve antes, la página no es interactiva hasta que el JavaScript se carga y se completa la hydration.

### Angular Universal / @angular/ssr

Angular Universal es el nombre histórico de la solución de SSR de Angular. A partir de Angular 17, el soporte SSR se ha integrado directamente en el CLI con el paquete `@angular/ssr`.

#### ng add @angular/ssr (configuración automática)

Para añadir SSR a un proyecto Angular existente, ejecutamos:

```bash
ng add @angular/ssr
```

Este comando realiza las siguientes acciones:

1. Instala los paquetes necesarios (`@angular/ssr`, `express`, `@types/express`).
2. Genera los archivos de configuración SSR:
   - `server.ts`: El servidor Express que maneja las peticiones.
   - `src/main.server.ts`: Punto de entrada para el renderizado en el servidor.
   - `src/app/app.config.server.ts`: Configuración específica para el entorno de servidor.
3. Actualiza `angular.json` añadiendo la sección de configuración SSR.
4. Añade los scripts `"dev:ssr"`, `"build:ssr"`, `"serve:ssr"` y `"prerender"` en `package.json`.

También podemos crear un proyecto nuevo con SSR habilitado por defecto:

```bash
ng new mi-aplicacion --ssr
```

#### Archivos generados

**server.ts:**

```typescript
// Archivo: server.ts (raíz del proyecto)
import 'zone.js/dist/zone-node';

import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';

// Configuración del servidor Express
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  // Motor de renderizado CommonEngine de Angular
  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Servir archivos estáticos desde la carpeta del navegador
  server.get(
    '*.*',
    express.static(browserDistFolder, {
      maxAge: '1y' // Cache de 1 año para archivos estáticos con hash
    })
  );

  // Todas las demás rutas se renderizan con Angular SSR
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,                                     // Función bootstrap del servidor
        documentFilePath: indexHtml,                   // Plantilla HTML base
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,                 // Carpeta de archivos estáticos
        providers: [
          { provide: APP_BASE_HREF, useValue: baseUrl }
        ],
      })
      .then((html: string) => res.send(html))
      .catch((err: Error) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Iniciar el servidor Node
  const server = app();
  server.listen(port, () => {
    console.log(`Servidor Node Express escuchando en http://localhost:${port}`);
  });
}

run();
```

**main.server.ts:**

```typescript
// Archivo: src/main.server.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

// Función bootstrap exportada para que CommonEngine la use en el servidor
const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;
```

**app.config.server.ts:**

```typescript
// Archivo: src/app/app.config.server.ts
import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

// Configuración adicional específica del servidor
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering() // Habilita el renderizado en el servidor
  ]
};

// Fusionar la configuración del cliente con la del servidor
export const config = mergeApplicationConfig(appConfig, serverConfig);
```

**Configuración en angular.json (sección ssr):**

```json
{
  "projects": {
    "mi-aplicacion": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "outputPath": "dist/mi-aplicacion",
            "index": "src/index.html",
            "browser": "src/main.ts",
            "server": "src/main.server.ts",   // Punto de entrada del servidor
            "ssr": {                          // Configuración SSR
              "entry": "server.ts"            // Archivo del servidor Express
            },
            "prerender": {
              "routes": ["/", "/productos"]   // Rutas a pre-renderizar
            }
          }
        }
      }
    }
  }
}
```

### Hydration

#### Qué es (reutilizar DOM del servidor en cliente sin regenerar)

La hydration es el proceso mediante el cual Angular, una vez cargado en el navegador, toma el control del HTML generado en el servidor en lugar de destruirlo y regenerarlo. Antes de Angular 16, el comportamiento predeterminado era que Angular destruyera el HTML del servidor y lo reconstruyera, lo que provocaba un "flicker" (parpadeo) y anulaba parte de la ventaja del SSR.

Con la hydration, Angular:

1. **Reutiliza** el DOM existente generado en el servidor.
2. **Asocia** los listeners de eventos y bindings al DOM existente.
3. **Verifica** que el DOM del servidor coincide con lo que Angular habría generado en el cliente.

Esto significa que NO hay destrucción ni reconstrucción del DOM, lo que elimina el flicker y mejora el rendimiento.

La hydration se habilita automáticamente con `provideClientHydration()`:

```typescript
// Archivo: src/app/app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration() // Habilita hydration
  ]
};
```

#### withEventReplay() (reproducir eventos del usuario durante hydration)

Un problema de la hydration es que el usuario puede interactuar con la página (hacer clic en botones, escribir en inputs) antes de que Angular termine de cargarse. Esos eventos se perderían. `withEventReplay()` resuelve este problema grabando los eventos que ocurren durante la hydration y reproduciéndolos una vez Angular está listo.

```typescript
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(
      withEventReplay() // Reproduce eventos del usuario durante la hydration
    )
  ]
};
```

Esto es especialmente útil en:
- Formularios donde el usuario puede empezar a escribir antes de que Angular esté listo.
- Botones de navegación que el usuario podría pulsar prematuramente.

#### withI18nSupport() (hydration con internacionalización)

Si la aplicación usa el sistema de internacionalización (i18n) de Angular, es necesario añadir `withI18nSupport()`:

```typescript
import { provideClientHydration, withI18nSupport } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(
      withI18nSupport() // Soporte para hydration con i18n
    )
  ]
};
```

#### Verificación de hydration (ngSkipHydration)

Angular verifica que el DOM generado en el servidor coincide con el que generaría en el cliente. Si hay discrepancias, Angular emite un error en desarrollo. Para elementos que legítimamente difieren (como timestamps, IDs generados aleatoriamente, o contenido que depende de la zona horaria del navegador), podemos usar el atributo `ngSkipHydration`:

```html
<!-- Saltar la verificación de hydration para todo un componente -->
<app-widget-clima ngSkipHydration />

<!-- Saltar la verificación para un elemento específico -->
<span ngSkipHydration>{{ timestampRelativo() }}</span>
```

También podemos añadir `ngSkipHydration` a un elemento contenedor para saltar todos sus hijos:

```html
<div ngSkipHydration>
  <app-reloj />
  <app-widget-bolsa />
</div>
```

#### Errores de hydration y cómo depurarlos

Los errores de hydration ocurren cuando el HTML del servidor difiere del HTML que Angular generaría en el cliente. Los más comunes son:

1. **Uso de `new Date()` o `Date.now()` directamente en templates** que producen valores diferentes entre servidor y cliente.
2. **Uso de APIs del navegador (`window`, `document`, `localStorage`)** sin verificar `isPlatformBrowser()`.
3. **IDs aleatorios generados con `Math.random()`** que difieren entre entornos.
4. **Contenido que depende del `userAgent`** o de características del dispositivo.

**Mensaje de error típico:**

```
NG0500: Hydration Node Mismatch. Angular expected the DOM to have the following structure, but it was different.
```

**Cómo depurar:**

1. Abre la consola del navegador (F12).
2. Busca errores que empiecen por `NG0500`.
3. Inspecciona los nodos señalados en el error.
4. Añade `ngSkipHydration` en el elemento problemático mientras investigas la causa raíz.
5. Usa `isPlatformBrowser()` y `isPlatformServer()` para código condicional.

### Renderizado híbrido

Angular permite combinar diferentes estrategias de renderizado en una misma aplicación:

#### Rutas pre-renderizadas (prerender en angular.json)

El pre-renderizado genera archivos HTML estáticos en tiempo de compilación (build time). Es ideal para páginas que no cambian frecuentemente y tienen alta importancia SEO (página de inicio, landing pages, páginas "Acerca de").

```json
// En angular.json
"prerender": {
  "routes": [
    "/",
    "/productos",
    "/productos/1",   // Pre-renderizar productos específicos
    "/contacto",
    "/faq"
  ],
  "discoverRoutes": true  // Descubrir rutas automáticamente desde routerLinks
}
```

Con `discoverRoutes: true`, Angular rastrea los `routerLink` encontrados durante el pre-renderizado y genera HTML para esas rutas también.

**Ventajas del pre-renderizado:**
- HTML generado en build time, sin carga en el servidor en runtime.
- Respuesta instantánea (archivo estático).
- Ideal para contenido que no cambia frecuentemente.

**Desventajas:**
- No sirve para contenido dinámico o personalizado por usuario.
- Requiere un nuevo build para actualizar el contenido.
- No escala bien a miles de páginas (largos tiempos de build).

#### Rutas con SSR dinámico

El SSR dinámico renderiza la página en cada petición. Es necesario para contenido que cambia frecuentemente o es personalizado por usuario.

```typescript
// server.ts: todas las rutas no estáticas se renderizan dinámicamente
server.get('*', (req, res, next) => {
  commonEngine.render({...}).then(html => res.send(html));
});
```

#### Rutas solo cliente (CSR)

Algunas rutas no necesitan SSR (por ejemplo, dashboards detrás de autenticación). Podemos configurarlas como solo cliente mediante `renderMode`:

```typescript
// Angular 19+ (API en evolución)
export const routes: Routes = [
  // Ruta con SSR (por defecto)
  { path: 'inicio', component: InicioComponent },

  // Ruta solo cliente
  {
    path: 'dashboard',
    component: DashboardComponent,
    // renderMode: 'client' // API en evolución en Angular 19+
  }
];
```

En versiones anteriores, la configuración se realizaba en el servidor Express excluyendo ciertas rutas del renderizado SSR, o usando guards que redirigieran en el servidor.

#### Configuración con server routes

A partir de Angular 19, se ha introducido un sistema de configuración de rutas de servidor (server routes) que permite especificar explícitamente el modo de renderizado de cada ruta:

```typescript
// server.routes.ts (API en evolución en Angular 19+)
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'inicio',
    renderMode: RenderMode.Prerender       // Pre-renderizar en build
  },
  {
    path: 'productos/**',
    renderMode: RenderMode.Prerender       // Pre-renderizar todas las rutas de productos
  },
  {
    path: 'dashboard/**',
    renderMode: RenderMode.Client          // Solo cliente (CSR)
  },
  {
    path: 'perfil/**',
    renderMode: RenderMode.Server          // SSR dinámico
  },
  {
    path: '**',
    renderMode: RenderMode.Server          // Resto de rutas: SSR dinámico
  }
];
```

### SEO en Angular

El SEO (Search Engine Optimization) es una de las principales razones para adoptar SSR. Angular proporciona servicios integrados para gestionar meta tags, título de la página y datos estructurados.

#### Title y Meta services de Angular

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  template: `
    <h1>{{ producto.nombre }}</h1>
    <p>{{ producto.descripcion }}</p>
  `
})
export class ProductoDetalleComponent implements OnInit {
  private title = inject(Title);
  private meta = inject(Meta);

  producto = { nombre: 'Portátil HP', descripcion: '...', precio: 799 };

  ngOnInit(): void {
    // Actualizar el título de la página
    this.title.setTitle(`${this.producto.nombre} - Mi Tienda Online`);

    // Actualizar meta tags
    this.meta.updateTag({
      name: 'description',
      content: `Compra ${this.producto.nombre} por solo ${this.producto.precio}€. ${this.producto.descripcion}`
    });

    this.meta.updateTag({
      name: 'keywords',
      content: 'portátil, HP, ordenador, tecnología, tienda online'
    });

    this.meta.updateTag({
      name: 'robots',
      content: 'index, follow'
    });

    // Añadir meta tags adicionales
    this.meta.addTag({
      name: 'author',
      content: 'Mi Tienda Online'
    });
  }
}
```

**Métodos principales del servicio Meta:**

```typescript
const meta = inject(Meta);

// Añadir una meta tag
meta.addTag({ name: 'description', content: 'Descripción' });

// Añadir múltiples meta tags
meta.addTags([
  { name: 'description', content: 'Descripción' },
  { name: 'keywords', content: 'angular, ssr, seo' },
  { property: 'og:title', content: 'Título Open Graph' }
]);

// Actualizar una meta tag existente (si no existe, la añade)
meta.updateTag({ name: 'description', content: 'Nueva descripción' });

// Eliminar una meta tag
meta.removeTag('name="description"');

// Obtener una meta tag específica
const description = meta.getTag('name="description"');
```

#### Open Graph tags

Open Graph es un protocolo de Facebook que permite a las redes sociales mostrar vistas previas enriquecidas al compartir URLs:

```typescript
ngOnInit(): void {
  const url = `https://mitienda.com/productos/${this.producto.id}`;
  const imagen = `https://mitienda.com/images/productos/${this.producto.id}.jpg`;

  this.meta.addTags([
    // Open Graph básico
    { property: 'og:title', content: this.producto.nombre },
    { property: 'og:description', content: this.producto.descripcion },
    { property: 'og:image', content: imagen },
    { property: 'og:url', content: url },
    { property: 'og:type', content: 'product' },
    { property: 'og:site_name', content: 'Mi Tienda Online' },

    // Open Graph para productos (comercio electrónico)
    { property: 'product:price:amount', content: String(this.producto.precio) },
    { property: 'product:price:currency', content: 'EUR' },
    { property: 'product:availability', content: 'in stock' },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: this.producto.nombre },
    { name: 'twitter:description', content: this.producto.descripcion },
    { name: 'twitter:image', content: imagen }
  ]);
}
```

#### JSON-LD para datos estructurados

JSON-LD (JavaScript Object Notation for Linked Data) es un formato estandarizado por Google para proporcionar datos estructurados que los motores de búsqueda entienden perfectamente. Permite mostrar rich snippets en los resultados de búsqueda (estrellas de valoración, precio, disponibilidad, breadcrumbs, etc.).

```typescript
import { Component, inject, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  template: `...`
})
export class ProductoDetalleComponent implements OnInit {
  private renderer = inject(Renderer2);

  producto = {
    id: 42,
    nombre: 'Portátil HP Pavilion',
    descripcion: 'Portátil de 15.6 pulgadas con procesador Intel Core i7',
    precio: 799.99,
    moneda: 'EUR',
    disponibilidad: 'https://schema.org/InStock',
    imagen: 'https://mitienda.com/images/productos/42.jpg',
    marca: 'HP',
    sku: 'HP-PAV-15-I7',
    valoracion: 4.5,
    numValoraciones: 128
  };

  ngOnInit(): void {
    this.insertarJSONLD();
  }

  private insertarJSONLD(): void {
    // Eliminar script anterior si existe
    const scriptAnterior = document.querySelector('script[type="application/ld+json"]');
    if (scriptAnterior) {
      scriptAnterior.remove();
    }

    const datosEstructurados = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: this.producto.nombre,
      description: this.producto.descripcion,
      image: this.producto.imagen,
      sku: this.producto.sku,
      brand: {
        '@type': 'Brand',
        name: this.producto.marca
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: this.producto.moneda,
        price: this.producto.precio,
        availability: this.producto.disponibilidad,
        url: `https://mitienda.com/productos/${this.producto.id}`
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: this.producto.valoracion,
        reviewCount: this.producto.numValoraciones,
        bestRating: 5,
        worstRating: 1
      }
    };

    const script = this.renderer.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(datosEstructurados);
    this.renderer.appendChild(document.head, script);
  }
}
```

**Ejemplo de JSON-LD para breadcrumbs:**

```typescript
const breadcrumbJSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Inicio',
      item: 'https://mitienda.com'
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Productos',
      item: 'https://mitienda.com/productos'
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: this.producto.nombre,
      item: `https://mitienda.com/productos/${this.producto.id}`
    }
  ]
};
```

#### Sitemaps

El sitemap es un archivo XML que lista todas las URLs de un sitio web para ayudar a los motores de búsqueda a descubrirlas. En aplicaciones Angular con SSR, el sitemap puede generarse dinámicamente:

```typescript
// server.ts: endpoint para generar el sitemap dinámicamente
server.get('/sitemap.xml', async (req, res) => {
  const urls = [
    { loc: 'https://mitienda.com/', lastmod: '2025-01-01', priority: '1.0' },
    { loc: 'https://mitienda.com/productos', lastmod: '2025-01-01', priority: '0.9' },
    { loc: 'https://mitienda.com/contacto', lastmod: '2025-01-01', priority: '0.5' },
    // ... más URLs, posiblemente generadas desde una API
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(url => `
    <url>
      <loc>${url.loc}</loc>
      <lastmod>${url.lastmod}</lastmod>
      <priority>${url.priority}</priority>
    </url>
  `).join('')}
</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});
```

### Optimización

#### Lazy loading de rutas con SSR

El lazy loading funciona perfectamente con SSR. Las rutas cargadas con `loadChildren` o `loadComponent` se renderizan en el servidor sin problema. El servidor carga los módulos necesarios para la ruta solicitada antes de renderizar.

```typescript
// No hay diferencia en la definición de rutas para SSR
export const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.routes)
    // SSR renderizará estas rutas en el servidor sin problemas
  }
];
```

#### Deferrable Views (@defer)

`@defer` es un bloque del nuevo control flow de Angular que permite diferir la carga de partes no críticas de la plantilla. El contenido dentro de un bloque `@defer` no se renderiza inicialmente, sino que se carga bajo demanda según el trigger especificado.

**Concepto:**

```html
<!-- Este gráfico pesado NO se carga inicialmente -->
@defer (on viewport) {
  <app-grafico-ventas />
} @placeholder {
  <div class="placeholder-chart">Cargando gráfico...</div>
} @loading (minimum 500ms) {
  <app-spinner mensaje="Cargando gráfico de ventas..." />
} @error {
  <p>Error al cargar el gráfico. <button (click)="reintentar()">Reintentar</button></p>
}
```

En el ejemplo anterior:
- El componente `app-grafico-ventas` NO se incluye en el bundle inicial.
- Cuando el placeholder entra en el viewport (es visible en pantalla), se descarga el bundle del gráfico.
- Mientras se carga, se muestra el bloque `@loading` (con un mínimo de 500ms para evitar parpadeos).
- Si falla la carga, se muestra el bloque `@error`.

#### Triggers de @defer

Angular proporciona varios triggers para controlar cuándo se carga el contenido diferido:

| Trigger | Descripción | Ejemplo |
|---------|-------------|---------|
| `on idle` | Se carga cuando el navegador está inactivo (idle) | `@defer (on idle)` |
| `on viewport` | Se carga cuando el elemento entra en el viewport | `@defer (on viewport)` |
| `on interaction` | Se carga al interactuar (click, focus) con el placeholder | `@defer (on interaction)` |
| `on hover` | Se carga al pasar el ratón sobre el placeholder | `@defer (on hover)` |
| `on immediate` | Se carga inmediatamente después del renderizado inicial | `@defer (on immediate)` |
| `on timer(duration)` | Se carga después de un tiempo especificado | `@defer (on timer(5s))` |
| `when condición` | Se carga cuando una condición es verdadera | `@defer (when datosCargados())` |

**Combinación de triggers:**

```html
<!-- Cargar cuando sea visible O cuando el usuario interactúe con el placeholder -->
@defer (on viewport; on interaction) {
  <app-comentarios />
} @placeholder {
  <p>Haz clic para cargar comentarios</p>
}
```

**Prefetching:**

El prefetching permite descargar el código del bloque `@defer` en segundo plano antes de que se active el trigger, para que cuando se active, el contenido aparezca instantáneamente:

```html
<!-- Precarga el bundle cuando el elemento es visible, pero no lo renderiza hasta que interactúes -->
@defer (on interaction; prefetch on viewport) {
  <app-comentarios />
} @placeholder {
  <button>Mostrar comentarios</button>
}
```

**Ejemplo realista con múltiples bloques @defer en una landing page:**

```html
<main class="landing">
  <!-- Hero: contenido crítico, se carga inmediatamente -->
  <app-hero />

  <!-- Sección "Características": carga en idle (cuando el navegador está libre) -->
  @defer (on idle) {
    <app-caracteristicas />
  } @placeholder {
    <app-seccion-esqueleto />
  }

  <!-- Sección "Testimonios": carga cuando el usuario hace scroll hasta ella -->
  @defer (on viewport) {
    <app-testimonios />
  } @placeholder {
    <app-seccion-esqueleto altura="300px" />
  } @loading (minimum 300ms) {
    <app-seccion-esqueleto altura="300px" animado="true" />
  }

  <!-- Sección "Precios": carga al interactuar (click) con el placeholder -->
  @defer (on interaction) {
    <app-tabla-precios />
  } @placeholder {
    <div class="cta-precios">
      <h2>¿Quieres ver nuestros precios?</h2>
      <button>Ver planes y precios</button>
    </div>
  }

  <!-- Sección "Gráficos": solo se carga si el usuario está autenticado -->
  @defer (when usuarioAutenticado() && !esMovil()) {
    <app-graficos-interactivos />
  } @placeholder {
    <p>Los gráficos interactivos están disponibles para usuarios registrados.</p>
  }
</main>
```

#### @placeholder, @loading, @error blocks

Estos bloques opcionales mejoran la experiencia del usuario durante la carga diferida:

**@placeholder:** Contenido que se muestra ANTES de que comience la carga. Debe ser ligero y no requerir dependencias adicionales.

```html
@defer (on viewport) {
  <app-galeria-imagenes />
} @placeholder {
  <div class="galeria-placeholder">
    <!-- Contenido ligero: SVG inline, texto, etc. -->
    <svg><!-- icono de imagen --></svg>
    <p>Desplázate para ver la galería</p>
  </div>
}
```

**@loading:** Contenido que se muestra DURANTE la carga (después de que el trigger se activa).

```html
@defer (on interaction) {
  <app-mapa-interactivo />
} @placeholder {
  <button>Cargar mapa</button>
} @loading (minimum 500ms; after 100ms) {
  <!-- minimum: tiempo mínimo que se muestra el loader (evita parpadeos) -->
  <!-- after: retraso antes de mostrar el loader (evita mostrar loader para cargas rápidas) -->
  <div class="mapa-loader">
    <app-spinner />
    <p>Cargando mapa interactivo...</p>
  </div>
}
```

Los parámetros `after` y `minimum` son importantes para UX:
- `after 100ms`: No mostrar loading si la carga tarda menos de 100ms (evita flash).
- `minimum 500ms`: Mostrar el loading al menos 500ms aunque la carga sea instantánea (evita flash del loader).

**@error:** Contenido que se muestra si la carga falla.

```html
@defer (on viewport) {
  <app-lista-noticias />
} @loading {
  <app-spinner />
} @error {
  <div class="error-carga">
    <p>No se pudieron cargar las noticias.</p>
    <button (click)="recargarNoticias()">Reintentar</button>
  </div>
}
```

### Consideraciones para SSR

#### Código que solo debe ejecutarse en cliente (plataforma browser)

Uno de los desafíos del SSR es que muchas APIs del navegador no existen en el servidor:

- `window`
- `document`
- `localStorage` / `sessionStorage`
- `navigator`
- `location`
- APIs del DOM (`getBoundingClientRect`, `innerWidth`, etc.)

Intentar acceder a cualquiera de estas APIs en el servidor lanzará un error o causará comportamientos inesperados.

#### isPlatformBrowser() e isPlatformServer()

Angular proporciona las funciones `isPlatformBrowser()` e `isPlatformServer()` para verificar en qué plataforma se está ejecutando el código:

```typescript
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Component({
  selector: 'app-componente-seguro',
  standalone: true,
  template: `
    <p>Ancho de la ventana: {{ anchoVentana }}</p>
    <p>Plataforma: {{ plataforma }}</p>
  `
})
export class ComponenteSeguroComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);

  anchoVentana = '';
  plataforma = '';

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // ✅ Seguro: solo se ejecuta en el navegador
      this.anchoVentana = `${window.innerWidth}px`;
      this.plataforma = `Navegador: ${navigator.userAgent}`;

      // Acceso a localStorage
      const tema = localStorage.getItem('tema');

      // Suscripción a eventos del DOM
      window.addEventListener('resize', this.onResize);
    }

    if (isPlatformServer(this.platformId)) {
      // Código que solo se ejecuta en el servidor
      this.plataforma = 'Servidor Node.js';
    }
  }

  private onResize = (): void => {
    this.anchoVentana = `${window.innerWidth}px`;
  };

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.onResize);
    }
  }
}
```

**Patrón recomendado: encapsular en servicios:**

```typescript
// storage.service.ts
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private platformId = inject(PLATFORM_ID);

  getItem(clave: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(clave);
    }
    return null; // En el servidor, devolvemos null
  }

  setItem(clave: string, valor: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(clave, valor);
    }
  }

  removeItem(clave: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(clave);
    }
  }
}
```

#### afterRender() y afterNextRender()

Estas funciones, introducidas en Angular 16, permiten ejecutar código exclusivamente en el navegador, después de que el DOM se haya renderizado. Son la alternativa moderna a manipulaciones DOM en `ngAfterViewInit` para aplicaciones SSR.

```typescript
import { afterRender, afterNextRender, Component, viewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-mapa',
  standalone: true,
  template: `<div #contenedorMapa style="height: 400px;"></div>`
})
export class MapaComponent {
  contenedorMapa = viewChild.required<ElementRef>('contenedorMapa');
  private mapa?: any; // Referencia a la instancia de la librería de mapas

  constructor() {
    // afterNextRender: se ejecuta una sola vez, después del primer renderizado
    afterNextRender(() => {
      // ✅ Seguro: solo se ejecuta en el navegador
      this.inicializarMapa();
    });

    // afterRender: se ejecuta después de CADA detección de cambios
    afterRender(() => {
      // Útil para sincronizar estado con librerías externas
      const altura = this.contenedorMapa().nativeElement.offsetHeight;
      console.log(`Altura del mapa: ${altura}px`);
    });
  }

  private inicializarMapa(): void {
    // Inicializar librería de mapas (Leaflet, Google Maps, Mapbox, etc.)
    // this.mapa = L.map(this.contenedorMapa().nativeElement).setView([40.4168, -3.7038], 13);
  }
}
```

**Diferencia entre `afterRender` y `afterNextRender`:**

| Función | ¿Cuándo se ejecuta? | ¿Cuántas veces? |
|---------|-------------------|-----------------|
| `afterNextRender()` | Después del próximo renderizado | Una sola vez |
| `afterRender()` | Después de CADA renderizado | Múltiples veces (en cada ciclo de detección de cambios) |

**Casos de uso:**
- `afterNextRender()`: Inicializar librerías de terceros, enfocar inputs, registrar event listeners globales.
- `afterRender()`: Medir dimensiones de elementos tras cambios de layout, sincronizar estado con librerías externas.

#### Variables de entorno en SSR

Las variables de entorno funcionan de forma diferente en el cliente y en el servidor:

```typescript
// environment.ts (valores por defecto, disponibles en cliente)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  googleMapsKey: 'TU_API_KEY'
};

// En el servidor, podemos sobreescribir variables de entorno con process.env
// server.ts
import { environment } from './src/environments/environment';

// En el servidor, sobreescribir desde variables de entorno del sistema
environment.apiUrl = process.env['API_URL'] || environment.apiUrl;
environment.production = true;
```

**Buenas prácticas para variables de entorno en SSR:**

1. No incluyas secretos (API keys privadas) en el código que llega al cliente.
2. Usa `process.env` en el lado del servidor para secretos.
3. Crea un servicio que abstraiga el acceso a variables de entorno:

```typescript
// config.service.ts
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private platformId = inject(PLATFORM_ID);

  get apiUrl(): string {
    if (isPlatformServer(this.platformId)) {
      return process.env['API_URL'] || 'http://localhost:3000/api';
    }
    return '/api'; // En cliente, usar proxy
  }

  get googleMapsKey(): string {
    // Esta API key es pública y puede estar en el bundle del cliente
    return 'TU_API_KEY_PUBLICA';
  }

  get stripeSecretKey(): string {
    // Este secreto SOLO debe estar disponible en el servidor
    if (isPlatformServer(this.platformId)) {
      return process.env['STRIPE_SECRET_KEY'] || '';
    }
    return ''; // Nunca exponer en el cliente
  }
}
```

### NgOptimizedImage

`NgOptimizedImage` es una directiva de Angular que reemplaza al atributo `src` estándar con `ngSrc`, implementando automáticamente las mejores prácticas de carga de imágenes: lazy loading, prevención de layout shift, formatos modernos (WebP, AVIF), y carga adaptativa según el tamaño de pantalla.

#### Directiva ngSrc en lugar de src

```html
<!-- ❌ Imagen tradicional -->
<img src="/assets/foto.jpg" alt="Descripción" />

<!-- ✅ Imagen optimizada con NgOptimizedImage -->
<img
  ngSrc="/assets/foto.jpg"
  width="800"
  height="600"
  alt="Descripción"
  priority
/>
```

**Requisitos para usar NgOptimizedImage:**

1. Importar `NgOptimizedImage` en el componente standalone o módulo.
2. Usar `ngSrc` en lugar de `src`.
3. Especificar `width` y `height` (obligatorio para prevenir layout shift / Cumulative Layout Shift).
4. Opcionalmente, marcar imágenes LCP (Largest Contentful Paint) con `priority`.

```typescript
import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [NgOptimizedImage],
  template: `
    <h1>Galería de Imágenes</h1>
    <div class="grid">
      <img ngSrc="/assets/foto1.jpg" width="400" height="300" alt="Foto 1" />
      <img ngSrc="/assets/foto2.jpg" width="400" height="300" alt="Foto 2" />
    </div>
  `
})
export class GaleriaComponent {}
```

#### Proveedores de imágenes (IMAGE_LOADER)

Un `ImageLoader` es una función que transforma una ruta de imagen relativa en una URL absoluta optimizada. Angular lo usa para:

- Generar diferentes tamaños de imagen (responsive images).
- Convertir a formatos modernos (WebP, AVIF).
- Añadir firma de CDN.

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    // Proveedor de imágenes personalizado
    {
      provide: IMAGE_LOADER,
      useFactory: (config: ImageLoaderConfig) => {
        // Configuramos las URLs base por ancho
        const anchosDisponibles = [400, 800, 1200, 1600];

        // Si la imagen tiene marca de prioridad, cargar tamaño grande
        const ancho = config.width || anchosDisponibles[0];

        // Ejemplo con un CDN como Cloudinary, Imgix, Cloudflare Images, etc.
        return `https://cdn.mitienda.com/images/${config.src}?w=${ancho}&format=webp`;
      }
    }
  ]
};
```

**Configuraciones comunes de ImageLoader:**

```typescript
// Sin transformación (usar la ruta tal cual)
useFactory: (config: ImageLoaderConfig) => config.src

// Con CDN de Cloudinary
useFactory: (config: ImageLoaderConfig) =>
  `https://res.cloudinary.com/mi-cloud/image/upload/w_${config.width}/${config.src}`

// Con CDN de Imgix
useFactory: (config: ImageLoaderConfig) =>
  `https://mi-dominio.imgix.net/${config.src}?w=${config.width}&auto=format`
```

#### Placeholders y LCP

**El problema del LCP (Largest Contentful Paint):**

El LCP mide cuándo se renderiza el elemento de contenido más grande visible en el viewport. En muchas páginas, el LCP es una imagen grande (hero, banner, producto principal). Si esta imagen tarda en cargarse, el LCP empeora.

**Solución: atributo `priority`**

```html
<!-- Imagen crítica (hero, banner principal) -->
<img
  ngSrc="/assets/hero-banner.jpg"
  width="1200"
  height="600"
  alt="Bienvenidos a Mi Tienda"
  priority
/>

<!-- Imágenes secundarias (carga lazy por defecto) -->
<img ngSrc="/assets/producto1.jpg" width="400" height="300" alt="Producto 1" />
<img ngSrc="/assets/producto2.jpg" width="400" height="300" alt="Producto 2" />
```

El atributo `priority`:

- Marca la imagen como prioritaria (se carga inmediatamente, no con lazy loading).
- Añade `fetchpriority="high"` al tag `<img>`.
- Establece `loading="eager"`.
- Hace que el `ImageLoader` solicite el tamaño adecuado para el viewport visible.
- Previene el layout shift estableciendo dimensiones explícitas.

**Placeholders:**

`NgOptimizedImage` no proporciona placeholders nativos (a diferencia de Next.js). Para implementar placeholders, puedes combinar `NgOptimizedImage` con CSS:

```css
img {
  background: #f0f0f0; /* Color de placeholder */
  transition: opacity 0.3s ease;
}
img[ngSrc] {
  opacity: 0; /* Ocultar hasta que cargue */
}
img[ngSrc].cargada {
  opacity: 1; /* Mostrar cuando cargue */
}
```

O usando un componente wrapper:

```typescript
@Component({
  selector: 'app-imagen-optimizada',
  standalone: true,
  imports: [NgOptimizedImage],
  template: `
    <div class="imagen-wrapper" [style.aspect-ratio]="ancho + '/' + alto">
      @if (!cargada()) {
        <div class="placeholder"></div>
      }
      <img
        [ngSrc]="src"
        [width]="ancho"
        [height]="alto"
        [alt]="alt"
        [priority]="prioridad"
        (load)="cargada.set(true)"
        [class.cargada]="cargada()"
      />
    </div>
  `,
  styles: [`
    .imagen-wrapper {
      position: relative;
      overflow: hidden;
      background: #f0f0f0;
    }
    .placeholder {
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity 0.3s;
    }
    img.cargada {
      opacity: 1;
    }
  `]
})
export class ImagenOptimizadaComponent {
  @Input() src = '';
  @Input() ancho = 400;
  @Input() alto = 300;
  @Input() alt = '';
  @Input() prioridad = false;

  cargada = signal(false);
}
```

---

## Ejemplos guiados

### Ejemplo 1: Configurar SSR en un proyecto desde cero

```bash
# Crear un nuevo proyecto con SSR
ng new mi-tienda-ssr --ssr --standalone --style=css
cd mi-tienda-ssr

# Si ya tienes un proyecto sin SSR, añádelo:
# ng add @angular/ssr
```

**Comandos disponibles tras la configuración:**

```bash
# Desarrollo con SSR (con hot reload)
npm run dev:ssr

# Build para producción con SSR
npm run build

# Servir la versión de producción con SSR
npm run serve:ssr

# Solo pre-renderizar rutas estáticas (sin servidor)
npm run prerender
```

**Verificación de que el SSR funciona:**

```bash
npm run build
npm run serve:ssr

# En otro terminal, comprobar que el HTML contiene el contenido renderizado:
curl http://localhost:4000 | grep "<h1"
```

### Ejemplo 2: Implementar meta tags dinámicos para SEO

```typescript
// seo.service.ts
import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private title = inject(Title);
  private meta = inject(Meta);
  private router = inject(Router);

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // Al navegar, actualizar la meta description por defecto
        this.meta.updateTag({
          name: 'description',
          content: 'Tienda online de productos electrónicos. Los mejores precios en portátiles, smartphones y más.'
        });
      });
  }

  setSeo(config: {
    titulo: string;
    descripcion: string;
    imagen?: string;
    url?: string;
    tipo?: string;
    keywords?: string;
  }): void {
    this.title.setTitle(`${config.titulo} | Mi Tienda Online`);

    this.meta.updateTag({ name: 'description', content: config.descripcion });

    if (config.keywords) {
      this.meta.updateTag({ name: 'keywords', content: config.keywords });
    }

    if (config.imagen) {
      this.meta.updateTag({ property: 'og:image', content: config.imagen });
      this.meta.updateTag({ name: 'twitter:image', content: config.imagen });
    }

    this.meta.updateTag({ property: 'og:title', content: config.titulo });
    this.meta.updateTag({ property: 'og:description', content: config.descripcion });
    this.meta.updateTag({ property: 'og:type', content: config.tipo || 'website' });

    if (config.url) {
      this.meta.updateTag({ property: 'og:url', content: config.url });
    }

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: config.titulo });
    this.meta.updateTag({ name: 'twitter:description', content: config.descripcion });
  }
}
```

**Uso en un componente de producto:**

```typescript
// producto-detalle.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SeoService } from '../../services/seo.service';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  template: `
    @if (producto(); as prod) {
      <h1>{{ prod.nombre }}</h1>
      <p>{{ prod.descripcion }}</p>
      <strong>{{ prod.precio | currency:'EUR' }}</strong>
    }
  `,
})
export class ProductoDetalleComponent implements OnInit {
  private seo = inject(SeoService);
  private productoService = inject(ProductoService);
  private route = inject(ActivatedRoute);

  producto = signal<Producto | null>(null);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.cargarProducto(id);
    });
  }

  private cargarProducto(id: number): void {
    this.productoService.obtenerPorId(id).subscribe(prod => {
      this.producto.set(prod);
      this.seo.setSeo({
        titulo: prod.nombre,
        descripcion: `${prod.descripcion}. Precio: ${prod.precio}€.`,
        imagen: `https://mitienda.com/images/productos/${prod.id}.jpg`,
        url: `https://mitienda.com/productos/${prod.id}`,
        tipo: 'product',
        keywords: `comprar ${prod.nombre}, ${prod.categoria}, tienda online`
      });
    });
  }
}
```

### Ejemplo 3: Usar @defer para cargar un componente pesado (gráficos)

```html
<!-- dashboard.component.html -->
<div class="dashboard">
  <!-- Contenido crítico: se carga inmediatamente -->
  <header class="dashboard-header">
    <h1>Dashboard</h1>
    <app-selector-rango-fechas />
  </header>

  <div class="dashboard-grid">
    <!-- Tarjeta de métricas: se carga inmediatamente -->
    <app-tarjeta-metricas [datos]="metricas()" />

    <!-- Gráfico de ventas: se difiere hasta que es visible o el usuario interactúa -->
    @defer (on viewport; on interaction; prefetch on idle) {
      <app-grafico-ventas [datos]="datosVentas()" />
    } @placeholder {
      <div class="card-placeholder">
        <h3>Ventas mensuales</h3>
        <div class="chart-skeleton">
          <div class="bar" style="height: 60%"></div>
          <div class="bar" style="height: 80%"></div>
          <div class="bar" style="height: 40%"></div>
          <div class="bar" style="height: 90%"></div>
          <div class="bar" style="height: 70%"></div>
        </div>
      </div>
    } @loading (minimum 500ms; after 200ms) {
      <div class="card-placeholder">
        <h3>Ventas mensuales</h3>
        <app-spinner mensaje="Cargando gráfico..." />
      </div>
    } @error {
      <div class="card-placeholder error">
        <p>No se pudo cargar el gráfico.</p>
        <button (click)="recargarGrafico()">Reintentar</button>
      </div>
    }
  </div>
</div>
```

**Estilos CSS para los esqueletos de carga:**

```css
.card-placeholder {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  min-height: 300px;
  background: #fafafa;
}

.chart-skeleton {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  height: 200px;
  padding-top: 2rem;
}

.chart-skeleton .bar {
  flex: 1;
  background: linear-gradient(180deg, #3498db, #2980b9);
  border-radius: 4px 4px 0 0;
  animation: pulse 2s infinite;
  opacity: 0.6;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 0.9; }
}
```

### Ejemplo 4: Configurar isPlatformBrowser para código solo-cliente

```typescript
// window-ref.service.ts
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class WindowRefService {
  private platformId = inject(PLATFORM_ID);

  get nativeWindow(): Window | null {
    if (isPlatformBrowser(this.platformId)) {
      return window;
    }
    return null; // En el servidor, no hay window
  }

  get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  scrollTo(options: ScrollToOptions): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(options);
    }
  }

  getLocationHref(): string {
    if (isPlatformBrowser(this.platformId)) {
      return window.location.href;
    }
    return ''; // En el servidor, no hay location
  }

  setLocalStorage(key: string, value: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, value);
    }
  }
}
```

### Ejemplo 5: NgOptimizedImage para imágenes optimizadas

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),

    // Proveedor de imágenes configurable
    {
      provide: IMAGE_LOADER,
      useFactory: (config: ImageLoaderConfig) => {
        const ancho = config.width || 800;
        return `https://cdn.mitienda.com/${config.src}?w=${ancho}&format=auto`;
      }
    }
  ]
};
```

**Uso en plantillas:**

```html
<!-- Imagen de héroe (LCP) - marcada como prioritaria -->
<img
  ngSrc="hero-banner.jpg"
  width="1200"
  height="600"
  alt="Bienvenidos a Mi Tienda"
  priority
  class="hero-image"
/>

<!-- Grid de productos - carga lazy implícita -->
<div class="productos-grid">
  @for (producto of productos(); track producto.id) {
    <div class="producto-card">
      <img
        [ngSrc]="'productos/' + producto.imagen"
        [width]="400"
        [height]="300"
        [alt]="producto.nombre"
        class="producto-imagen"
      />
      <h3>{{ producto.nombre }}</h3>
      <p>{{ producto.precio | currency:'EUR' }}</p>
    </div>
  }
</div>
```

---

## Ejercicios resueltos

### Ejercicio 1: Convertir proyecto existente a SSR y corregir errores de plataforma

**Enunciado:** Tienes un proyecto Angular que usa `window`, `document` y `localStorage` en varios componentes. Conviértelo a SSR y corrige todos los errores.

**Solución paso a paso:**

1. Añadir SSR al proyecto:

```bash
ng add @angular/ssr
```

2. Crear un servicio `PlatformService` para verificar la plataforma:

```typescript
// platform.service.ts
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class PlatformService {
  private platformId = inject(PLATFORM_ID);

  readonly isBrowser = isPlatformBrowser(this.platformId);
  readonly isServer = !this.isBrowser;

  get safeWindow(): Window | null {
    return this.isBrowser ? window : null;
  }

  get safeDocument(): Document | null {
    return this.isBrowser ? document : null;
  }

  get localStorage(): Storage | null {
    return this.isBrowser ? window.localStorage : null;
  }
}
```

3. Refactorizar componentes que acceden al DOM:

```typescript
// Antes: acceso directo al DOM (roto en SSR)
export class ComponenteAntiguo implements OnInit {
  ngOnInit(): void {
    const ancho = window.innerWidth; // ❌ Falla en SSR
    const tema = localStorage.getItem('tema'); // ❌ Falla en SSR
  }
}

// Después: acceso seguro mediante PlatformService
export class ComponenteNuevo implements OnInit {
  private platform = inject(PlatformService);

  anchoVentana = signal(0);
  tema = signal('light');

  ngOnInit(): void {
    if (this.platform.isBrowser) {
      this.anchoVentana.set(window.innerWidth);
      this.tema.set(localStorage.getItem('tema') || 'light');
    }
  }
}
```

4. Usar `afterNextRender` para inicialización de librerías:

```typescript
import { afterNextRender } from '@angular/core';

export class ComponenteConLibreria {
  constructor() {
    afterNextRender(() => {
      // Inicializar librería de gráficos, mapas, etc.
      this.inicializarChart();
    });
  }
}
```

5. Verificar que todo funciona:

```bash
npm run build
npm run serve:ssr
# Visitar http://localhost:4000 - no debe haber errores en la consola
```

### Ejercicio 2: Implementar deferred loading en una landing page

**Enunciado:** Una landing page tiene 5 secciones: Hero, Características, Testimonios, Precios, y FAQ. Solo Hero es contenido crítico. Implementa `@defer` para las secciones restantes con placeholders y prefetch inteligente.

```html
<!-- landing.component.html -->
<main class="landing">
  <!-- SECCIÓN 1: Hero - Contenido crítico, carga inmediata -->
  <app-hero />

  <!-- SECCIÓN 2: Características - Carga en idle -->
  @defer (on idle; prefetch on idle) {
    <app-seccion-caracteristicas />
  } @placeholder {
    <app-seccion-esqueleto titulo="Características" columnas="3" />
  } @loading (after 200ms; minimum 400ms) {
    <app-seccion-esqueleto titulo="Características" columnas="3" [animado]="true" />
  }

  <!-- SECCIÓN 3: Testimonios - Carga al hacer scroll -->
  @defer (on viewport; prefetch on idle) {
    <app-seccion-testimonios />
  } @placeholder {
    <app-seccion-esqueleto titulo="Lo que dicen nuestros clientes" tipo="horizontal" />
  }

  <!-- SECCIÓN 4: Planes de precios - Carga al hacer click -->
  @defer (on interaction) {
    <app-seccion-precios />
  } @placeholder {
    <div class="cta-section">
      <h2>Descubre nuestros planes</h2>
      <p>Tenemos el plan perfecto para ti.</p>
      <button class="btn-primary">Ver planes y precios</button>
    </div>
  }

  <!-- SECCIÓN 5: FAQ - Carga cuando el usuario baja casi al final -->
  @defer (on viewport) {
    <app-seccion-faq />
  } @placeholder {
    <app-seccion-esqueleto titulo="Preguntas frecuentes" tipo="lista" items="5" />
  }
</main>
```

**Componente esqueleto reutilizable:**

```typescript
// seccion-esqueleto.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-seccion-esqueleto',
  standalone: true,
  template: `
    <section class="seccion-esqueleto" [class.animado]="animado">
      <h2>{{ titulo }}</h2>
      <div class="esqueleto-grid" [class]="tipo">
        @for (i of [].constructor(items); track i) {
          <div class="esqueleto-item">
            <div class="esqueleto-bloque"></div>
            <div class="esqueleto-linea"></div>
            <div class="esqueleto-linea corta"></div>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .seccion-esqueleto {
      padding: 4rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    .esqueleto-grid {
      display: grid;
      gap: 1.5rem;
      margin-top: 2rem;
    }
    .esqueleto-grid.columnas { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
    .esqueleto-grid.horizontal { grid-template-columns: 1fr; }
    .esqueleto-grid.lista { grid-template-columns: 1fr; }
    .esqueleto-bloque {
      width: 100%;
      height: 180px;
      background: #e0e0e0;
      border-radius: 8px;
      margin-bottom: 0.75rem;
    }
    .esqueleto-linea {
      height: 16px;
      background: #e0e0e0;
      border-radius: 4px;
      margin-bottom: 0.5rem;
    }
    .esqueleto-linea.corta { width: 60%; }
    .animado .esqueleto-bloque,
    .animado .esqueleto-linea {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `]
})
export class SeccionEsqueletoComponent {
  @Input() titulo = '';
  @Input() tipo: 'columnas' | 'horizontal' | 'lista' = 'columnas';
  @Input() items = 3;
  @Input() animado = false;
}
```

---

## Actividades propuestas

1. **Proyecto con SSR y SEO:** Crea un proyecto Angular con SSR de una tienda online de 5 productos. Implementa meta tags dinámicos para cada página de producto usando el servicio `Title` y `Meta`. Añade Open Graph tags para compartir en redes sociales y JSON-LD para datos estructurados (producto, precio, disponibilidad). Verifica que los tags aparecen en el HTML renderizado por el servidor.

2. **Landing page con @defer y métricas de rendimiento:** Construye una landing page corporativa con 5 secciones que usen `@defer` con distintos triggers (viewport, idle, interaction). Implementa placeholders con esqueletos animados. Usa Lighthouse para medir el rendimiento antes y después de implementar `@defer`. Documenta las diferencias.

3. **Migración de proyecto a SSR:** Toma un proyecto Angular existente (de ejercicios anteriores) que use `localStorage`, `window` y APIs del DOM. Migralo a SSR. Identifica y corrige todos los errores de plataforma usando `isPlatformBrowser()` y `afterNextRender()`. Crea servicios de abstracción para `localStorage` y APIs del navegador.

4. **Galería de imágenes optimizada:** Implementa una galería de imágenes responsiva usando `NgOptimizedImage`. Configura un `IMAGE_LOADER` personalizado que sirva imágenes desde diferentes URLs según el ancho. Marca las imágenes del viewport inicial con `priority`. Implementa lazy loading para el resto. Compara el LCP con y sin optimización.

5. **Blog con pre-renderizado de artículos:** Crea un blog con 10 artículos (datos mock). Configura el pre-renderizado (`prerender`) en `angular.json` para generar HTML estático de todos los artículos y la página principal. Habilita `discoverRoutes` para que Angular rastree automáticamente los `routerLink` durante el pre-renderizado.

## Actividades de ampliación

1. **Sistema de internacionalización con SSR por dominio:** Implementa una aplicación multilingüe donde cada idioma tenga su propio subdominio (`es.tienda.com`, `en.tienda.com`). Configura el servidor Express para detectar el subdominio y servir la versión i18n correspondiente generada con SSR. Implementa `withI18nSupport()` en la hydration y traduce los meta tags dinámicamente.

2. **Dashboard con CSR y landing con SSR en el mismo proyecto:** Configura un proyecto Angular que combine diferentes modos de renderizado: la landing page y las páginas de producto usan SSR/pre-renderizado para SEO, mientras que el dashboard (/admin/*) se renderiza solo en cliente (CSR) por estar detrás de autenticación. Implementa la transición suave entre ambos modos.

3. **CDN personalizado con ImageLoader y transformación de imágenes:** Integra un servicio de transformación de imágenes (como Cloudinary o un proxy propio) con el `IMAGE_LOADER` de Angular. Implementa generación automática de diferentes resoluciones, formatos modernos (WebP, AVIF) con fallback a JPEG, y crop inteligente basado en el punto focal del sujeto. Mide el ahorro de ancho de banda conseguido.

## Buenas prácticas profesionales

1. **Siempre verifica `isPlatformBrowser()` antes de acceder a APIs del navegador.** Envuelve cualquier acceso a `window`, `document`, `localStorage` o `navigator` en una comprobación de plataforma. Crea servicios de abstracción como `WindowRefService` y `StorageService`.

2. **Usa `afterNextRender()` para código que manipula el DOM.** Esta función garantiza que el código solo se ejecuta en el navegador y después de que el DOM esté disponible. Es preferible a `ngAfterViewInit` para SSR.

3. **Marca las imágenes LCP con `priority` en `NgOptimizedImage`.** Identifica la imagen más grande del viewport inicial y añade el atributo `priority`. Esto mejora significativamente el LCP.

4. **Usa `@defer` para todo lo que no sea crítico para la primera pantalla.** Cualquier componente fuera del viewport inicial, gráficos pesados, secciones de comentarios, mapas y widgets de terceros deben cargarse de forma diferida.

5. **Configura correctamente `width` y `height` en todas las imágenes.** Esto previene el Cumulative Layout Shift (CLS), una métrica importante del Core Web Vitals. `NgOptimizedImage` hace obligatorios estos atributos.

6. **Implementa JSON-LD para datos estructurados en páginas de producto, artículo y breadcrumbs.** Los rich snippets en los resultados de búsqueda mejoran el CTR (Click-Through Rate). Usa el servicio `Renderer2` para inyectar el script en el `<head>`.

7. **No incluyas secretos ni claves de API privadas en el bundle del cliente.** Usa `process.env` en el servidor y expón solo las claves públicas necesarias. Las claves secretas nunca deben llegar al navegador.

8. **Pre-renderiza páginas estáticas importantes para SEO.** La página de inicio, landing pages, páginas "Acerca de" y artículos de blog son candidatos ideales para pre-renderizado. No necesitan SSR dinámico y se sirven más rápido como archivos estáticos.

## Errores frecuentes

1. **Acceder a `window`, `document` o `localStorage` sin verificar la plataforma.** Es el error más común al implementar SSR. Siempre envuelve estos accesos en `if (isPlatformBrowser(platformId))`.

2. **Usar `@defer` dentro de otros bloques `@defer` o en elementos que siempre están ocultos.** `@defer` no puede anidarse. Si el placeholder nunca es visible (por `display: none` o estar fuera del viewport real), el trigger `on viewport` nunca se activará.

3. **Olvidar añadir `provideClientHydration()` en la configuración de la aplicación.** Sin este provider, Angular no realizará hydration y reconstruirá el DOM desde cero, anulando gran parte de los beneficios del SSR y provocando un posible flicker visual.

4. **No configurar correctamente el `ImageLoader` dejando `ngSrc` sin transformación.** Si no configuras el `IMAGE_LOADER`, Angular usará un loader por defecto que puede no ser óptimo para tu infraestructura. Configura un loader que apunte a tu CDN o servidor de imágenes.

5. **Usar `Alert`, `Confirm` o `Prompt` en código que puede ejecutarse en el servidor.** Estas APIs del navegador no existen en Node.js. Verifica siempre `isPlatformBrowser()` antes de mostrar diálogos nativos.

6. **Incluir en el servidor código que depende de la geolocalización o del `userAgent` del navegador.** En el servidor, el cliente HTTP es la IP del centro de datos, no la ubicación real del usuario. Usa headers del request (como `x-forwarded-for` o `accept-language`) para información del cliente en el servidor.

7. **No limpiar event listeners añadidos mediante `afterRender()`.** `afterRender()` se ejecuta tras cada ciclo de detección de cambios. Si añades un event listener dentro de `afterRender` sin limpiar el anterior, tendrás múltiples listeners duplicados, causando memory leaks y comportamientos inesperados.

8. **Esperar que los query params y fragmentos de la URL estén disponibles en el servidor.** En SSR, la URL incluye query params que se pasan desde el request HTTP. Sin embargo, el fragmento (`#seccion`) nunca se envía al servidor (es una convención del navegador). No dependas del fragmento para lógica en el servidor.

## Resumen

El Server-Side Rendering (SSR) es una tecnología fundamental para construir aplicaciones Angular que necesiten buen SEO y rendimiento inicial. En este capítulo hemos cubierto:

- **Fundamentos del SSR:** Renderizado en servidor vs. cliente. El servidor ejecuta Angular, genera HTML completo y lo envía al navegador. La hydration reutiliza ese DOM sin regenerarlo.

- **Configuración:** `ng add @angular/ssr` configura automáticamente el proyecto. Los archivos clave son `server.ts`, `main.server.ts` y `app.config.server.ts`.

- **Hydration:** Proceso que permite a Angular tomar el control del DOM generado en el servidor sin destruirlo. Se configura con `provideClientHydration()`, `withEventReplay()` y `withI18nSupport()`.

- **Renderizado híbrido:** Combinación de pre-renderizado (HTML estático), SSR dinámico y CSR dentro de la misma aplicación mediante `serverRoutes`.

- **SEO:** Uso de los servicios `Title` y `Meta` de Angular para gestionar dinámicamente el título, meta description, Open Graph tags y Twitter Cards. Inyección de JSON-LD para datos estructurados.

- **@defer:** Sistema de carga diferida para componentes no críticos con múltiples triggers (`on idle`, `on viewport`, `on interaction`, `on hover`, `on timer`, `when condition`). Bloques `@placeholder`, `@loading` y `@error` para gestionar la UX durante la carga.

- **Código compatible:** Uso de `isPlatformBrowser()`, `isPlatformServer()`, `afterRender()` y `afterNextRender()` para escribir código que funcione en ambos entornos.

- **NgOptimizedImage:** Directiva para optimizar la carga de imágenes con lazy loading, formatos modernos y prevención de layout shift.

La combinación de SSR + Hydration + @defer + NgOptimizedImage proporciona una base sólida para construir aplicaciones Angular que ofrecen gran rendimiento, SEO óptimo y una excelente experiencia de usuario.

## Recursos adicionales

- [Documentación oficial de SSR en Angular](https://angular.dev/guide/ssr)
- [Guía de Hydration en Angular](https://angular.dev/guide/hydration)
- [Deferrable Views (@defer)](https://angular.dev/guide/defer)
- [NgOptimizedImage - Documentación oficial](https://angular.dev/guide/image-optimization)
- [Angular SEO Guide](https://angular.dev/guide/seo)
- [Meta Tags y Open Graph - Referencia](https://ogp.me/)
- [JSON-LD para datos estructurados - Schema.org](https://schema.org/)
- [Core Web Vitals y Angular](https://web.dev/vitals/)
