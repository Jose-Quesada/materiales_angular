---
icon: lucide/globe
title: 09. CountryApp - Rutas y Layout
---

# Sección 09: CountryApp — Rutas Hijas, Layout y DaisyUI

En esta sección iniciamos la construcción de **CountryApp**, una Single Page Application (SPA) modular y profesional orientada a la exploración geográfica mundial. Aprenderemos a estructurar proyectos medianos mediante **módulos de rutas desacoplados por funcionalidad (*feature routing*)**, diseñar un **Layout Shell reutilizable**, integrar **Tailwind CSS junto con DaisyUI** para interfaces estilizadas de alta velocidad, implementar navegación activa con iconos vectoriales y crear componentes atómicos de entrada y tabla conectados mediante **Signal Inputs y Signal Outputs**.

---

## 📋 Ficha Técnica y Objetivos Didácticos

* **Proyecto:** `country-app` (SPA de países basada en la API de REST Countries).
* **Stack Tecnológico:** Angular 19 - 22, Tailwind CSS 3/4, DaisyUI, Iconify / SVG Icons, Standalone Components.
* **Patrones Arquitectónicos:**
    * **Feature-Driven Architecture:** Organización por carpetas de funcionalidad (`src/app/country/...`).
    * **Nested Routing & Child Routes:** Subárbol de rutas cargado perezosamente mediante `loadChildren`.
    * **Layout Wrapper Pattern:** Componente cascarón (`CountryLayoutComponent`) con `<router-outlet />`.
    * **Presentational vs Container Components:** Separación estricta entre vistas contenedor y componentes tontos reutilizables (`SearchInputComponent`, `CountryTableComponent`).
* **Código Fuente de Referencia:** [GitHub - DevTalles CountryApp (fin-seccion-09)](https://github.com/DevTalles-corp/angular-country-app/tree/fin-seccion-09)

``` mermaid
flowchart TD
    subgraph Shell ["1. Estructura Shell y Enrutamiento Global"]
        Root["<b>AppComponent</b><br/>Punto de entrada de la SPA"] --> AppRoutes["<b>app.routes.ts</b><br/>Carga perezosa de rutas: <code>loadChildren</code>"]
    end

    subgraph FeatureRouting ["2. Feature Routing: Módulo Country"]
        AppRoutes --> Layout["<b>CountryLayoutComponent</b><br/>Navbar superior DaisyUI + router-outlet central"]
        Layout --> CRoutes["<b>country.routes.ts</b><br/>Subárbol de rutas hijas"]
    end

    subgraph Pages ["3. Vistas de Navegación (Páginas)"]
        CRoutes --> P1["<b>ByCapitalPageComponent</b><br/>Búsqueda por capital"]
        CRoutes --> P2["<b>ByCountryPageComponent</b><br/>Búsqueda por país"]
        CRoutes --> P3["<b>ByRegionPageComponent</b><br/>Búsqueda por región"]
        CRoutes --> P4["<b>CountryPageComponent</b><br/>Ficha de detalle: <code>by/:code</code>"]
    end

    subgraph Reusable ["4. Componentes Atómicos Reutilizables"]
        P1 -.-> Search["<b>SearchInputComponent</b><br/>Input reactivo con <code>output()</code>"]
        P1 -.-> Table["<b>CountryTableComponent</b><br/>Tabla DaisyUI con <code>input()</code>"]
        P2 -.-> Search
        P2 -.-> Table
        P3 -.-> Table
    end

    Shell ==> FeatureRouting ==> Pages
```

---

## 1. Creación del Proyecto y Configuración de Tailwind CSS con DaisyUI

!!! info "📖 Para saber más: Manual de Referencia"
    Para repasar la creación de proyectos y la integración de utilidades CSS en Angular, consulta los capítulos:
    * **[Manual de Referencia: 02. Creación del Proyecto](manual/02-crear-proyecto.md)**
    * **[Manual de Referencia: 16. Integración de Librerías y UI](manual/16-integracion-librerias.md)**

### 1.1. Generación de la Aplicación
Generamos un nuevo proyecto standalone con enrutamiento activado y sin SSR para focalizarnos en el cliente:

```bash
ng new country-app --routing --style=css --ssr=false
cd country-app
```

### 1.2. Instalación de Tailwind CSS y DaisyUI
Tailwind CSS proporciona clases de utilidad atómicas, mientras que **DaisyUI** añade componentes semánticos prefabricados (`btn`, `navbar`, `card`, `table`) construidos puramente sobre Tailwind:

```bash
# Instalación de Tailwind y dependencias de procesamiento
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init

# Instalación de la librería de componentes DaisyUI
npm install -D daisyui@latest
```

### 1.3. Configuración de `tailwind.config.js`
Añadimos `daisyui` como plugin y configuramos el escaneo de plantillas HTML y archivos TypeScript:

```javascript title="tailwind.config.js"
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: ["dark", "light"], // Temas soportados
  }
}
```

### 1.4. Inclusión de Directivas en `src/styles.css`
Reemplazamos el contenido de `src/styles.css` con las tres directivas fundamentales de Tailwind:

```css title="src/styles.css"
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 2. Arquitectura de Rutas Hijas y Carga Perezosa

Una de las mejores prácticas en aplicaciones medianas y grandes es **evitar volcar todas las rutas en un único archivo gigante `app.routes.ts`**. En su lugar, aislamos las rutas propias de una funcionalidad (*feature*) en su propio archivo `country.routes.ts`.

!!! info "📖 Para saber más: Manual de Referencia"
    Para dominar la carga perezosa (`loadChildren`, `loadComponent`), redirecciones y estrategias de carga, consulta el **[Manual de Referencia: 11. Angular Router y Navegación](manual/11-router.md)**.

### 2.1. El Archivo de Rutas de la Funcionalidad: `country.routes.ts`
Creamos `src/app/country/country.routes.ts`. Definimos un componente contenedor de diseño (`CountryLayoutComponent`) que envuelve a todas las páginas hijas:

```typescript title="src/app/country/country.routes.ts"
import { Routes } from '@angular/router';
import { CountryLayoutComponent } from './layouts/country-layout/country-layout.component';

export const countryRoutes: Routes = [
  {
    path: '',
    component: CountryLayoutComponent,
    children: [
      {
        path: 'by-capital',
        loadComponent: () => import('./pages/by-capital-page/by-capital-page.component'),
      },
      {
        path: 'by-country',
        loadComponent: () => import('./pages/by-country-page/by-country-page.component'),
      },
      {
        path: 'by-region',
        loadComponent: () => import('./pages/by-region-page/by-region-page.component'),
      },
      {
        path: 'by/:code',
        loadComponent: () => import('./pages/country-page/country-page.component'),
      },
      {
        path: '**',
        redirectTo: 'by-capital',
      },
    ],
  },
];

export default countryRoutes;
```

### 2.2. Registro en el Árbol Principal: `src/app/app.routes.ts`
Conectamos el subárbol completo de países utilizando `loadChildren` con una ruta padre `country`:

```typescript title="src/app/app.routes.ts"
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'country',
    loadChildren: () => import('./country/country.routes'),
  },
  {
    path: '**',
    redirectTo: 'country',
  },
];
```

---

## 3. El Componente Layout con DaisyUI

El patrón **Layout Wrapper** permite que todas las páginas de países compartan la misma barra de navegación superior sin tener que repetir el HTML en cada pantalla.

```
[CountryLayoutComponent]
┌────────────────────────────────────────────────────────┐
│  Navbar Superior (Logo, By Capital, By Country, etc.)   │
├────────────────────────────────────────────────────────┤
│                                                        │
│  <router-outlet />  ===> Se proyecta la página activa   │
│  (ByCapitalPageComponent / ByCountryPageComponent)      │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### 3.1. Implementación de `CountryLayoutComponent`
Creamos `src/app/country/layouts/country-layout/country-layout.component.ts`:

```typescript title="src/app/country/layouts/country-layout/country-layout.component.ts"
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-country-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './country-layout.component.html',
})
export class CountryLayoutComponent {}
```

### 3.2. Plantilla con Navbar y Menús de DaisyUI
Utilizamos las clases `navbar`, `bg-base-100`, `menu` y enlaces enriquecidos con `routerLinkActive="btn-primary"`:

```html title="src/app/country/layouts/country-layout/country-layout.component.html"
<!-- Barra de navegación DaisyUI -->
<header class="navbar bg-base-200 shadow-lg px-4 sm:px-8">
  <div class="flex-1">
    <a routerLink="/country" class="btn btn-ghost text-xl font-bold flex items-center gap-2">
      🌍 <span>CountryApp</span>
    </a>
  </div>

  <nav class="flex-none">
    <ul class="menu menu-horizontal px-1 gap-2">
      <li>
        <a 
          routerLink="by-capital" 
          routerLinkActive="btn-primary text-white font-semibold"
          class="btn btn-ghost btn-sm">
          Por Capital
        </a>
      </li>
      <li>
        <a 
          routerLink="by-country" 
          routerLinkActive="btn-primary text-white font-semibold"
          class="btn btn-ghost btn-sm">
          Por País
        </a>
      </li>
      <li>
        <a 
          routerLink="by-region" 
          routerLinkActive="btn-primary text-white font-semibold"
          class="btn btn-ghost btn-sm">
          Por Región
        </a>
      </li>
    </ul>
  </nav>
</header>

<!-- Contenedor del Outlet Central -->
<main class="container mx-auto px-4 py-6 max-w-6xl">
  <router-outlet />
</main>
```

---

## 4. Componentes Reutilizables de Presentación

Una arquitectura limpia exige que la tabla y la caja de búsqueda sean componentes independientes y desacoplados. No deben saber nada sobre llamadas HTTP ni sobre la API de REST Countries; solo reciben datos y emiten eventos.

!!! info "📖 Para saber más: Manual de Referencia"
    Para profundizar en la comunicación entre componentes con las nuevas APIs reactivas, consulta el **[Manual de Referencia: 07. Comunicación entre Componentes](manual/07-anidar-componentes.md)**.

### 4.1. Componente Atómico de Búsqueda: `SearchInputComponent`
Creamos `src/app/country/components/search-input/search-input.component.ts`.

Utilizamos **Signal Inputs** (`input()`) para el placeholder y **Signal Outputs** (`output()`) para emitir el valor cuando el usuario pulsa Enter o hace clic en buscar:

```typescript title="src/app/country/components/search-input/search-input.component.ts"
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'country-search-input',
  template: `
    <div class="flex gap-2 w-full max-w-lg mb-6">
      <input
        #txtQuery
        type="text"
        [placeholder]="placeholder()"
        class="input input-bordered w-full focus:input-primary"
        (keyup.enter)="emitValue(txtQuery.value)"
      />
      <button 
        type="button" 
        class="btn btn-primary"
        (click)="emitValue(txtQuery.value)">
        Buscar
      </button>
    </div>
  `,
})
export class SearchInputComponent {
  // Signal Input con valor por defecto
  placeholder = input<string>('Buscar...');

  // Signal Output: emite el término buscado al componente padre
  value = output<string>();

  emitValue(query: string) {
    const trimmed = query.trim();
    if (!trimmed) return;
    this.value.emit(trimmed);
  }
}
```

> [!TIP] Regla de la Guía Oficial de Estilos de Angular: Nombres de Outputs
> **No prefijes los eventos con `on`** (evita `onValue` o `onSearch`). El prefijo `on` se reserva tradicionalmente para el método manejador en el padre (`(value)="onSearch($event)"`). Nombra tus outputs directamente con la acción o el dato que emiten (`value`, `search`, `selectionChange`).

---

### 4.2. Componente de Visualización: `CountryTableComponent`
Creamos `src/app/country/components/country-table/country-table.component.ts`. Recibe la lista de países mediante `input.required`:

```typescript title="src/app/country/components/country-table/country-table.component.ts"
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';

// Interfaz temporal para maquetar la tabla
export interface CountryItem {
  cca2: string;
  flag: string;
  name: string;
  capital: string;
  population: number;
}

@Component({
  selector: 'country-table',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './country-table.component.html',
})
export class CountryTableComponent {
  // Signal Input obligatorio con la lista de países
  countries = input.required<CountryItem[]>();
}
```

```html title="src/app/country/components/country-table/country-table.component.html"
<div class="overflow-x-auto bg-base-100 shadow-md rounded-box border border-base-300">
  <table class="table table-zebra w-full">
    <thead>
      <tr class="bg-base-200 text-base">
        <th>#</th>
        <th>Bandera</th>
        <th>Nombre</th>
        <th>Capital</th>
        <th>Población</th>
        <th class="text-center">Detalle</th>
      </tr>
    </thead>
    <tbody>
      @for (country of countries(); track country.cca2; let i = $index) {
        <tr class="hover">
          <td>{{ i + 1 }}</td>
          <td class="text-2xl">{{ country.flag }}</td>
          <td class="font-semibold">{{ country.name }}</td>
          <td>{{ country.capital }}</td>
          <td>{{ country.population | number }}</td>
          <td class="text-center">
            <a 
              [routerLink]="['/country/by', country.cca2]" 
              class="btn btn-outline btn-sm btn-info">
              Ver más
            </a>
          </td>
        </tr>
      } @empty {
        <tr>
          <td colspan="6" class="text-center py-8 text-base-content/60">
            <div class="flex flex-col items-center gap-2">
              <span class="text-3xl">🔎</span>
              <p>No hay países para mostrar. Realiza una búsqueda.</p>
            </div>
          </td>
        </tr>
      }
    </tbody>
  </table>
</div>
```

---

## 5. Integración en la Página: `ByCapitalPageComponent`

Ensamblamos el buscador y la tabla en la primera página funcional `src/app/country/pages/by-capital-page/by-capital-page.component.ts`:

```typescript title="src/app/country/pages/by-capital-page/by-capital-page.component.ts"
import { Component, signal } from '@angular/core';
import { SearchInputComponent } from '../../components/search-input/search-input.component';
import { CountryItem, CountryTableComponent } from '../../components/country-table/country-table.component';

@Component({
  selector: 'app-by-capital-page',
  imports: [SearchInputComponent, CountryTableComponent],
  template: `
    <h1 class="text-3xl font-extrabold mb-2">Por Capital</h1>
    <p class="text-base-content/70 mb-6">Encuentra países buscando por el nombre de su capital.</p>

    <!-- Buscador desacoplado -->
    <country-search-input 
      placeholder="Ej: Madrid, Tokyo, Buenos Aires..." 
      (value)="onSearch($event)" 
    />

    <!-- Tabla de resultados -->
    <country-table [countries]="countries()" />
  `,
})
export default class ByCapitalPageComponent {
  // Lista de países simulada (se conectará con la API en la Sección 10)
  countries = signal<CountryItem[]>([
    { cca2: 'ES', flag: '🇪🇸', name: 'España', capital: 'Madrid', population: 47420000 },
    { cca2: 'FR', flag: '🇫🇷', name: 'Francia', capital: 'París', population: 67750000 },
  ]);

  onSearch(query: string) {
    console.log('Buscando países por capital:', query);
    // En la siguiente sección conectaremos el servicio HTTP
  }
}
```

---

## 💡 Evolución Angular 22: Novedades Clave en Enrutamiento y Layout

!!! tip "1. Tipado Estricto de Rutas y Navegación sin Boilerplate"
    En **Angular 22**, el enrutador ofrece inferencia tipada nativa sobre los parámetros de ruta. Cuando declaras una ruta con `:code`, el compilador de plantillas puede validar los argumentos pasados en `[routerLink]="['/country/by', country.cca2]"`, alertando en tiempo de compilación si `country.cca2` fuera nulo o de tipo incompatible.

!!! tip "2. `standalone: true` Implícito en Todos los Componentes"
    En los componentes de esta sección (`SearchInputComponent`, `CountryTableComponent`, etc.) no es necesario declarar `standalone: true` en el decorador `@Component`. En Angular 19 y 22, **todos los componentes son Standalone por defecto**, reduciendo la verbosidad del código.

---

## 📝 Evaluación y Preguntas para el Aula

??? question "¿Por qué es mejor práctica dividir las rutas en un archivo `country.routes.ts` que ponerlas todas en `app.routes.ts`?"
    **Respuesta:** Facilita la **separación de responsabilidades (SoC)** y la **carga perezosa (*Lazy Loading*)**. Al empaquetar las rutas de países en su propio archivo, el navegador solo descarga el código de la sección de países cuando el usuario navega a `/country`, mejorando drásticamente el tiempo de carga inicial (*First Contentful Paint*) de la aplicación.

??? question "¿Cuál es la ventaja de crear un componente `SearchInputComponent` en lugar de poner el `<input>` directamente en cada página?"
    **Respuesta:** **Reutilización y desacoplamiento**. Al extraerlo a un componente tonto (*presentational component*), podemos usarlo exactamente igual en la búsqueda por capital, por país y por región. Si mañana cambiamos el diseño de DaisyUI o añadimos un botón de limpiar, el cambio se aplica instantáneamente en toda la aplicación.

??? question "¿Por qué la guía oficial de Angular desaconseja nombrar un Output como `(onSearch)`?"
    **Respuesta:** Porque en HTML estándar los atributos de evento ya se escuchan con paréntesis `(search)="onSearch($event)"`. Si el Output se llamara `onSearch`, en la plantilla se escribiría `(onSearch)="onSearch()"`, duplicando confusamente la partícula `on`.

---

## 📚 Material de Referencia y Profundización

* [Manual de Referencia: 03. Componentes Standalone](manual/03-componentes.md)
* [Manual de Referencia: 07. Comunicación entre Componentes (Signal Inputs & Outputs)](manual/07-anidar-componentes.md)
* [Manual de Referencia: 11. Angular Router y Navegación](manual/11-router.md)
* [Manual de Referencia: 16. Integración de Librerías y UI (Tailwind & DaisyUI)](manual/16-integracion-librerias.md)
* [Documentación Oficial de DaisyUI](https://daisyui.com/)
* [Guía Oficial de Estilos de Angular: Nomenclatura de Outputs](https://angular.dev/style-guide#dont-prefix-output-properties)
