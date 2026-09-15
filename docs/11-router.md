# Router de Angular

## Objetivos de aprendizaje

Al finalizar este capítulo, el alumnado será capaz de:

- Configurar el sistema de enrutamiento en aplicaciones Angular standalone.
- Definir rutas básicas y avanzadas utilizando el array `Routes`.
- Implementar navegación declarativa con `RouterLink` y programática con el servicio `Router`.
- Gestionar parámetros de ruta, query params y datos estáticos en las rutas.
- Proteger rutas mediante guardias funcionales modernas (CanActivate, CanDeactivate, CanMatch).
- Implementar carga perezosa (Lazy Loading) para optimizar el rendimiento de la aplicación.
- Configurar páginas 404 y redirecciones.
- Comprender el ciclo de vida del router y el estado de las rutas.

## Resultados de aprendizaje

1. Configura y gestiona la navegación en aplicaciones SPA utilizando el router de Angular.
2. Define rutas con parámetros dinámicos, rutas anidadas y rutas con datos estáticos.
3. Implementa guardias funcionales para controlar el acceso a rutas.
4. Aplica técnicas de carga perezosa para mejorar los tiempos de carga inicial.
5. Utiliza redirecciones y rutas comodín para gestionar páginas no encontradas.

## Introducción

El enrutamiento es uno de los pilares fundamentales de las aplicaciones de una sola página (SPA). En una SPA, no se realizan recargas completas del navegador al navegar entre secciones; en su lugar, el contenido se intercambia dinámicamente dentro de una zona designada de la página. Esto proporciona una experiencia de usuario fluida y similar a la de una aplicación nativa.

Angular dispone de un router propio, potente y altamente configurable, que permite gestionar la navegación de forma declarativa y programática. El router de Angular se encarga de interpretar la URL del navegador, determinar qué componente debe mostrarse y renderizarlo en la posición adecuada del DOM. Además, ofrece funcionalidades avanzadas como guardias de seguridad, carga perezosa de módulos y componentes, resolución de datos previa a la navegación, y gestión de parámetros tanto obligatorios como opcionales.

En este capítulo, aprenderemos a configurar el router desde cero en aplicaciones standalone (sin NgModules), definiremos rutas básicas y avanzadas, implementaremos navegación con `RouterLink` y con el servicio `Router`, y exploraremos las guardias funcionales modernas que han sustituido a las antiguas guardias basadas en clases. Finalmente, abordaremos el concepto de carga perezosa y cómo organizar un proyecto Angular grande con lazy loading.

Es importante destacar que a partir de Angular 15, el framework ha apostado por un enfoque standalone por defecto, eliminando la obligatoriedad de los NgModules. Todas las configuraciones de enrutamiento que veremos se basan en este enfoque moderno.

---

## Desarrollo teórico

### SECCIÓN 1 - Enrutamiento básico

#### Configuración inicial (provideRouter en app.config.ts, RouterModule vs standalone)

En una aplicación Angular standalone, el router se configura en el archivo `app.config.ts` mediante la función `provideRouter()`. Esta función recibe como argumento un array de objetos `Route` que definen la correspondencia entre URLs y componentes.

**app.config.ts:**

```typescript
// Archivo: src/app/app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

// Importamos las rutas definidas en otro archivo
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes) // Configuración del router con las rutas
  ]
};
```

El enfoque antiguo basado en NgModules utilizaba `RouterModule.forRoot(routes)` dentro del array `imports` del módulo raíz. Aunque este enfoque sigue siendo compatible, Angular recomienda migrar progresivamente a componentes standalone y usar `provideRouter()`, que es más ligero y fácil de configurar.

La función `provideRouter()` acepta un segundo parámetro opcional con configuración adicional, como `withRouterConfig()`, `withDebugTracing()`, `withComponentInputBinding()` y otras características que veremos a lo largo del capítulo.

```typescript
// Configuración avanzada del router
import { provideRouter, withDebugTracing, withComponentInputBinding } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withDebugTracing(),          // Traza eventos del router en consola
      withComponentInputBinding()  // Vincula params e inputs a @Input()
    )
  ]
};
```

También necesitamos asegurarnos de incluir la directiva `<router-outlet />` en el componente principal de la aplicación.

**app.component.ts:**

```typescript
// Archivo: src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav>
      <a routerLink="/">Inicio</a>
      <a routerLink="/productos">Productos</a>
      <a routerLink="/contacto">Contacto</a>
    </nav>
    <!-- Aquí se renderizará el componente correspondiente a la ruta activa -->
    <router-outlet />
  `
})
export class AppComponent {}
```

#### Definición de rutas (array Routes, path, component, redirectTo, pathMatch)

Las rutas se definen en un array de objetos `Route`. Cada objeto representa una correspondencia entre una URL y un componente o una acción (como una redirección).

**app.routes.ts:**

```typescript
// Archivo: src/app/app.routes.ts
import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { ContactoComponent } from './pages/contacto/contacto.component';

export const routes: Routes = [
  // Ruta raíz: redirige a /inicio
  {
    path: '',
    redirectTo: '/inicio',
    pathMatch: 'full' // La URL debe coincidir exactamente con ''
  },
  // Ruta para la página de inicio
  {
    path: 'inicio',
    component: InicioComponent,
    // Podemos añadir datos estáticos que se pueden consumir después
    data: {
      titulo: 'Inicio',
      descripcion: 'Página principal de la aplicación'
    }
  },
  // Ruta para productos
  {
    path: 'productos',
    component: ProductosComponent
  },
  // Ruta para contacto
  {
    path: 'contacto',
    component: ContactoComponent
  }
];
```

El atributo `pathMatch` tiene dos valores posibles:

- `'full'`: La URL debe coincidir exactamente con el path especificado. Se usa típicamente para la ruta vacía `''` para evitar que todas las rutas hagan match con ella.
- `'prefix'`: La URL debe empezar con el path especificado. Es el valor por defecto. Si no ponemos `pathMatch: 'full'` en la ruta `''`, todas las URLs harían match (porque todas empiezan con `''`), y la redirección se ejecutaría en bucle.

También podemos definir un título para cada ruta mediante la propiedad `title`, que actualiza automáticamente el título del navegador:

```typescript
{
  path: 'inicio',
  component: InicioComponent,
  title: 'Mi Aplicación - Inicio' // Actualiza document.title automáticamente
}
```

#### RouterOutlet (la directiva que renderiza el componente activo)

`RouterOutlet` es una directiva que actúa como marcador de posición donde el router renderizará el componente correspondiente a la ruta activa. Sin esta directiva, Angular no sabría dónde insertar el componente en el DOM.

En aplicaciones complejas, podemos tener múltiples `RouterOutlet` nombrados para renderizar componentes en diferentes zonas de la página simultáneamente.

**Outlet principal (sin nombre):**

```html
<!-- En la plantilla del componente que contiene el router -->
<main>
  <router-outlet />
</main>
```

**Outlets nombrados:**

```typescript
// Rutas que usan outlets nombrados
export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: 'chat',        // Se renderiza en el outlet principal
        component: ChatComponent
      },
      {
        path: 'ayuda',       // Se renderiza en el outlet llamado 'sidebar'
        outlet: 'sidebar',
        component: AyudaComponent
      }
    ]
  }
];
```

```html
<!-- dashboard.component.html -->
<div class="dashboard">
  <div class="main-content">
    <!-- Outlet principal (sin nombre) -->
    <router-outlet />
  </div>
  <div class="sidebar">
    <!-- Outlet nombrado 'sidebar' -->
    <router-outlet name="sidebar" />
  </div>
</div>
```

Para navegar a un outlet nombrado de forma declarativa, usamos un objeto con la propiedad `outlets`:

```html
<a [routerLink]="[{ outlets: { sidebar: ['ayuda'] } }]">Abrir ayuda en sidebar</a>
```

#### RouterLink (navegación declarativa)

`RouterLink` es una directiva que permite la navegación declarativa desde las plantillas HTML. Sustituye al atributo `href` de los enlaces tradicionales, evitando la recarga completa de la página.

**Uso básico:**

```html
<!-- Navegación simple -->
<a routerLink="/inicio">Inicio</a>
<a routerLink="/productos">Productos</a>

<!-- Navegación con parámetros -->
<a [routerLink]="['/productos', productoId]">Ver producto</a>
<a [routerLink]="['/productos', productoId, 'editar']">Editar producto</a>

<!-- Navegación con query params -->
<a
  [routerLink]="['/productos']"
  [queryParams]="{ categoria: 'electronica', orden: 'precio' }">
  Electrónica ordenada por precio
</a>

<!-- Navegación con fragmento (hash) -->
<a
  [routerLink]="['/productos']"
  fragment="ofertas">
  Ver ofertas
</a>
```

**routerLinkActive y routerLinkActiveOptions:**

`routerLinkActive` permite añadir clases CSS al enlace cuando la ruta asociada está activa. Es especialmente útil para resaltar el elemento de navegación correspondiente a la página actual.

```html
<nav>
  <a
    routerLink="/inicio"
    routerLinkActive="active"
    [routerLinkActiveOptions]="{ exact: true }">
    Inicio
  </a>
  <a
    routerLink="/productos"
    routerLinkActive="active">
    Productos
  </a>
</nav>
```

La opción `{ exact: true }` garantiza que la clase `active` solo se aplica cuando la ruta coincide exactamente. Sin esta opción, la ruta `/` siempre se consideraría activa porque todas las URLs empiezan con `/`.

Podemos pasar múltiples clases CSS separadas por espacios o como array:

```html
<a
  routerLink="/productos"
  routerLinkActive="bg-primary text-white fw-bold">
  Productos
</a>
```

También podemos vincular la directiva a una template variable para usar el estado activo en otros contextos:

```html
<a
  routerLink="/inicio"
  routerLinkActive="active"
  #rla="routerLinkActive">
  Inicio
  @if (rla.isActive) {
    <span class="badge">Activo</span>
  }
</a>
```

#### Router (navegación programática)

El servicio `Router` permite navegar programáticamente desde el código TypeScript. Esto es útil cuando necesitamos navegar como resultado de una lógica de negocio, después de una operación asíncrona, o desde guardias e interceptores.

**Inyección del servicio:**

```typescript
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <form (ngSubmit)="iniciarSesion()">
      <!-- campos del formulario -->
      <button type="submit">Iniciar sesión</button>
    </form>
  `
})
export class LoginComponent {
  private router = inject(Router);

  iniciarSesion(): void {
    // Lógica de autenticación...
    const autenticado = true; // Simulación

    if (autenticado) {
      // Navegación simple por URL
      this.router.navigateByUrl('/dashboard');
    }
  }
}
```

**Métodos principales del servicio Router:**

```typescript
// navigateByUrl: navega a una URL absoluta (string)
this.router.navigateByUrl('/productos/42');
this.router.navigateByUrl('/productos?categoria=electronica');

// navigate: navega usando un array de comandos (similar a routerLink)
this.router.navigate(['/productos']);
this.router.navigate(['/productos', productoId]);
this.router.navigate(['/productos', productoId, 'editar']);

// navigate con opciones avanzadas
this.router.navigate(
  ['/productos'],
  {
    queryParams: { categoria: 'electronica', pagina: 2 },
    fragment: 'ofertas',
    // Opciones de navegación
    replaceUrl: true,              // No añade entrada al historial
    skipLocationChange: true,      // No cambia la URL en la barra del navegador
    state: { datos: 'algún dato' } // Pasa estado interno (no visible en URL)
  }
);
```

**Diferencia entre navigate y navigateByUrl:**

- `navigateByUrl()` recibe una cadena de texto con la URL completa, similar a `routerLink` con cadena.
- `navigate()` recibe un array de segmentos de ruta, similar a `routerLink` con array. Es más flexible para construir rutas dinámicamente.

**Manejo del resultado de la navegación:**

Ambos métodos devuelven una `Promise<boolean>` que se resuelve a `true` si la navegación tuvo éxito o a `false` si falló (por ejemplo, por un guard que lo impidió).

```typescript
async guardarYRedirigir(): Promise<void> {
  await this.productoService.guardar(this.formulario.value);
  const navegacionExitosa = await this.router.navigate(['/productos']);
  if (!navegacionExitosa) {
    console.error('La navegación fue bloqueada por un guard');
  }
}
```

#### Página 404 (comodín ** al final de las rutas)

Para gestionar las URLs que no coinciden con ninguna ruta definida, utilizamos una ruta comodín con el path `'**'`. Esta ruta debe ser la última del array, ya que el router evalúa las rutas en orden y la ruta comodín captura cualquier URL.

```typescript
import { Routes } from '@angular/router';
import { PaginaNoEncontradaComponent } from './pages/pagina-no-encontrada.component';

export const routes: Routes = [
  // ... otras rutas

  // La ruta comodín SIEMPRE debe ser la última
  {
    path: '**',
    component: PaginaNoEncontradaComponent,
    title: '404 - Página no encontrada'
  }
];
```

El componente de página no encontrada puede ofrecer al usuario la opción de volver a la página principal:

```typescript
// pagina-no-encontrada.component.ts
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagina-no-encontrada',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="error-404">
      <h1>404</h1>
      <h2>Página no encontrada</h2>
      <p>La página que buscas no existe o ha sido movida.</p>
      <a routerLink="/">Volver al inicio</a>
    </div>
  `,
  styles: [`
    .error-404 {
      text-align: center;
      padding: 4rem 2rem;
    }
    .error-404 h1 {
      font-size: 8rem;
      color: #e74c3c;
      margin: 0;
    }
    .error-404 h2 {
      font-size: 2rem;
      color: #333;
    }
  `]
})
export class PaginaNoEncontradaComponent {}
```

También podemos redirigir a una ruta específica en lugar de mostrar un componente:

```typescript
{
  path: '**',
  redirectTo: '/inicio' // Redirige a inicio si la ruta no existe
}
```

#### Rutas anidadas (children: [])

Las rutas anidadas permiten crear jerarquías de navegación donde un componente padre contiene su propio `<router-outlet />` para renderizar componentes hijos. Esto es esencial para interfaces con layouts complejos como paneles de administración.

**Ejemplo de rutas anidadas:**

```typescript
export const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    // Las rutas hijas se renderizan dentro del router-outlet de AdminLayout
    children: [
      {
        path: '',                    // Ruta por defecto: /admin
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',           // /admin/dashboard
        component: AdminDashboardComponent,
        title: 'Admin - Dashboard'
      },
      {
        path: 'usuarios',            // /admin/usuarios
        component: AdminUsuariosComponent
      },
      {
        path: 'usuarios/:id',        // /admin/usuarios/42
        component: AdminUsuarioDetalleComponent
      },
      {
        path: 'configuracion',       // /admin/configuracion
        component: AdminConfigComponent
      }
    ]
  }
];
```

**Plantilla del componente padre (AdminLayoutComponent):**

```html
<!-- admin-layout.component.html -->
<div class="admin-layout">
  <aside class="admin-sidebar">
    <h3>Administración</h3>
    <nav>
      <a routerLink="dashboard" routerLinkActive="active">Dashboard</a>
      <a routerLink="usuarios" routerLinkActive="active">Usuarios</a>
      <a routerLink="configuracion" routerLinkActive="active">Configuración</a>
    </nav>
  </aside>
  <main class="admin-content">
    <!-- Las rutas hijas se renderizan aquí -->
    <router-outlet />
  </main>
</div>
```

Observa que los `routerLink` en las rutas hijas usan rutas relativas (sin la barra `/` inicial). Esto hace que las rutas sean portables: si cambiamos el path del padre de `admin` a `administracion`, los enlaces hijos seguirán funcionando correctamente.

#### RouterOutlet dentro de otro RouterOutlet

No hay límite en la profundidad de anidamiento de `RouterOutlet`. Podemos tener tantos niveles de anidamiento como necesitemos. El router de Angular se encarga de construir el árbol de rutas activas y renderizar los componentes correspondientes en cada outlet.

```
Ruta: /admin/usuarios/42/permisos

AppComponent
  └── <router-outlet />           → AdminLayoutComponent
        └── <router-outlet />     → AdminUsuarioDetalleComponent
              └── <router-outlet /> → PermisosComponent
```

**Configuración de rutas con múltiples niveles:**

```typescript
export const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'usuarios',
        component: AdminUsuariosComponent
      },
      {
        path: 'usuarios/:id',
        component: AdminUsuarioDetalleComponent,
        // Tercer nivel de anidamiento
        children: [
          {
            path: 'permisos',
            component: UsuarioPermisosComponent
          },
          {
            path: 'historial',
            component: UsuarioHistorialComponent
          }
        ]
      }
    ]
  }
];
```

#### Rutas con parámetros de ruta obligatorios (:id)

Los parámetros de ruta se definen precediendo el nombre del parámetro con dos puntos `:`. Estos parámetros son obligatorios y forman parte de la URL.

```typescript
export const routes: Routes = [
  {
    path: 'productos',
    children: [
      {
        path: '',
        component: ProductoListaComponent
      },
      {
        path: ':id',            // Parámetro obligatorio id
        component: ProductoDetalleComponent
      },
      {
        path: ':id/editar',     // Parámetro id + subruta editar
        component: ProductoEditarComponent
      }
    ]
  }
];
```

#### ActivatedRoute (paramMap, snapshot vs observable)

El servicio `ActivatedRoute` proporciona información sobre la ruta activa: parámetros, query params, datos estáticos, fragmento, etc. Podemos acceder a esta información de dos formas: mediante el snapshot (valor puntual) o mediante observables (reactivo, recomendado).

**Acceso mediante snapshot (valor estático, no reacciona a cambios):**

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  template: `
    <h1>Producto {{ productoId }}</h1>
  `,
})
export class ProductoDetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  productoId: string | null = '';

  ngOnInit(): void {
    // Snapshot: captura el valor en el momento de la creación del componente
    this.productoId = this.route.snapshot.paramMap.get('id');
  }
}
```

El problema con `snapshot` es que si navegamos de `/productos/1` a `/productos/2`, Angular reutiliza el mismo componente y `ngOnInit` no se vuelve a ejecutar. Por tanto, el `productoId` seguiría siendo `1`.

**Acceso mediante observable (reactivo, recomendado):**

```typescript
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  template: `
    @if (producto(); as prod) {
      <h1>{{ prod.nombre }}</h1>
      <p>Precio: {{ prod.precio | currency:'EUR' }}</p>
    }
  `,
})
export class ProductoDetalleComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private productoService = inject(ProductoService);
  private sub?: Subscription;

  producto = signal<Producto | null>(null);

  ngOnInit(): void {
    // paramMap es un Observable que emite cada vez que cambia el parámetro
    this.sub = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.cargarProducto(Number(id));
      }
    });
  }

  private cargarProducto(id: number): void {
    this.productoService.obtenerPorId(id).subscribe(prod => {
      this.producto.set(prod);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe(); // Importante: cancelar la suscripción
  }
}
```

**Uso con takeUntilDestroyed (Angular 16+) para simplificar la limpieza:**

```typescript
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({...})
export class ProductoDetalleComponent {
  private route = inject(ActivatedRoute);
  private productoService = inject(ProductoService);
  producto = signal<Producto | null>(null);

  constructor() {
    this.route.paramMap
      .pipe(takeUntilDestroyed())
      .subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.cargarProducto(Number(id));
        }
      });
  }
}
```

**Diferencia entre params y paramMap:**

- `params` y `paramMap` emiten objetos con los parámetros de la ruta.
- `paramMap` devuelve un objeto `ParamMap` con métodos `.get()`, `.getAll()`, `.has()`, `.keys`.
- Desde Angular 13+, se recomienda usar `paramMap` en lugar de `params`.

```typescript
this.route.paramMap.subscribe(map => {
  const id = map.get('id');      // Devuelve string | null
  const ids = map.getAll('id');  // Devuelve string[] (cuando hay varios)
  const tieneId = map.has('id'); // Devuelve boolean
  const todas = map.keys;         // Devuelve string[]
});
```

#### Query Params (queryParams, queryParamMap)

Los query params son parámetros opcionales que se añaden a la URL después del signo `?`. A diferencia de los parámetros de ruta, no se definen en la configuración de rutas y son ideales para filtros, paginación, ordenación, etc.

**URL con query params:** `/productos?categoria=electronica&pagina=2&orden=precio`

**Navegación con query params:**

```html
<!-- Desde la plantilla -->
<a
  [routerLink]="['/productos']"
  [queryParams]="{ categoria: 'electronica', orden: 'precio' }">
  Electrónica
</a>
```

```typescript
// Desde el código
this.router.navigate(
  ['/productos'],
  { queryParams: { categoria: 'electronica', orden: 'precio' } }
);

// Mantener query params existentes y añadir/sobrescribir algunos
this.router.navigate(
  [],
  {
    queryParams: { pagina: 3 },
    queryParamsHandling: 'merge' // 'merge' o 'preserve'
  }
);
```

- `queryParamsHandling: 'merge'`: fusiona los nuevos query params con los existentes.
- `queryParamsHandling: 'preserve'`: mantiene los query params actuales sin añadir nuevos.

**Lectura de query params en el componente:**

```typescript
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-producto-lista',
  standalone: true,
  template: `
    <h1>Productos</h1>
    <div class="filtros">
      <button (click)="filtrar('electronica')">Electrónica</button>
      <button (click)="filtrar('hogar')">Hogar</button>
      <button (click)="limpiarFiltros()">Todos</button>
    </div>
    <p>Mostrando categoría: {{ categoria() }}</p>
    <p>Página: {{ pagina() }}</p>
  `
})
export class ProductoListaComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  categoria = signal<string>('');
  pagina = signal<number>(1);

  constructor() {
    // Reactividad: reacciona a cambios en query params
    this.route.queryParamMap
      .pipe(takeUntilDestroyed())
      .subscribe(params => {
        this.categoria.set(params.get('categoria') || 'todas');
        this.pagina.set(Number(params.get('pagina')) || 1);
      });
  }

  filtrar(categoria: string): void {
    this.router.navigate([], {
      queryParams: { categoria, pagina: 1 }, // Resetear página al filtrar
      queryParamsHandling: 'merge'
    });
  }

  limpiarFiltros(): void {
    this.router.navigate([], {
      queryParams: {} // Elimina todos los query params
    });
  }
}
```

#### Router state (ActivatedRouteSnapshot, RouterStateSnapshot)

El router de Angular mantiene un árbol de estado que representa la ruta actual. `ActivatedRouteSnapshot` es una instantánea inmutable de la ruta activa, mientras que `ActivatedRoute` es el observable reactivo. El `RouterStateSnapshot` contiene el árbol completo de rutas activas.

```typescript
// Acceso al state desde un guard
export const authGuard: CanActivateFn = (route, state) => {
  console.log('URL solicitada:', state.url);               // '/admin/usuarios/42'
  console.log('Ruta raíz:', state.root);                  // ActivatedRouteSnapshot
  console.log('Query params:', route.queryParams);        // { orden: 'precio' }
  console.log('Parámetros heredados:', route.params);    // desde la ruta padre
  return true;
};
```

#### data en rutas (datos estáticos para breadcrumbs, títulos, etc.)

La propiedad `data` permite asociar datos estáticos a una ruta. Estos datos se pueden consumir en componentes, guardias o para generar breadcrumbs y metadatos.

```typescript
export const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    data: {
      icono: 'shield',
      breadcrumb: 'Administración',
      rolesPermitidos: ['ADMIN', 'SUPERVISOR'],
      mostrarEnMenu: true
    },
    children: [
      {
        path: 'usuarios',
        component: AdminUsuariosComponent,
        data: {
          breadcrumb: 'Usuarios',
          rolesPermitidos: ['ADMIN']
        }
      }
    ]
  }
];
```

**Consumo de data en el componente:**

```typescript
export class AdminUsuariosComponent implements OnInit {
  private route = inject(ActivatedRoute);
  breadcrumb = signal<string>('');

  ngOnInit(): void {
    // Acceso por snapshot
    const breadcrumbSnapshot = this.route.snapshot.data['breadcrumb'];

    // Acceso reactivo
    this.route.data.subscribe(data => {
      this.breadcrumb.set(data['breadcrumb']);
      document.title = `Admin - ${data['breadcrumb']}`;
    });
  }
}
```

Se puede acceder a los datos de las rutas padres a través del árbol de `ActivatedRoute`:

```typescript
constructor() {
  let route = this.route;
  while (route.firstChild) {
    route = route.firstChild;
  }
  // route es ahora la ruta más profunda (hoja del árbol)
  route.data.subscribe(data => console.log(data));
}
```

#### resolve en rutas (pre-carga de datos antes de mostrar el componente)

`Resolve` permite cargar datos necesarios antes de que se muestre el componente. El componente no se renderiza hasta que el resolver completa su trabajo. Esto evita mostrar pantallas vacías mientras se cargan datos.

**Resolver funcional (forma moderna):**

```typescript
// Archivo: src/app/resolvers/producto.resolver.ts
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ProductoService } from '../services/producto.service';
import { Producto } from '../models/producto.model';

export const productoResolver: ResolveFn<Producto | null> = (
  route: ActivatedRouteSnapshot
): Observable<Producto | null> => {
  const productoService = inject(ProductoService);
  const id = route.paramMap.get('id');

  if (!id) {
    return of(null);
  }

  return productoService.obtenerPorId(Number(id));
};
```

**Uso del resolver en las rutas:**

```typescript
export const routes: Routes = [
  {
    path: 'productos/:id',
    component: ProductoDetalleComponent,
    resolve: {
      producto: productoResolver // La clave 'producto' será el nombre en ActivatedRoute.data
    }
  }
];
```

**Consumo en el componente:**

```typescript
export class ProductoDetalleComponent {
  private route = inject(ActivatedRoute);
  producto = signal<Producto | null>(null);

  constructor() {
    // El dato resuelto está disponible en route.data
    this.route.data
      .pipe(takeUntilDestroyed())
      .subscribe(data => {
        this.producto.set(data['producto']);
      });
  }
}
```

**Ventajas de los resolvers:**

1. El componente recibe los datos ya cargados, sin estados de carga intermedios.
2. Si el resolver falla (error en la petición), la navegación se cancela y podemos redirigir a una página de error.
3. Centraliza la lógica de carga de datos, separándola del componente.

**Manejo de errores en resolvers:**

```typescript
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ProductoService } from '../services/producto.service';
import { Producto } from '../models/producto.model';

export const productoResolver: ResolveFn<Producto | null> = (
  route: ActivatedRouteSnapshot
) => {
  const productoService = inject(ProductoService);
  const router = inject(Router);
  const id = route.paramMap.get('id');

  if (!id) {
    router.navigate(['/productos']);
    return of(null);
  }

  return productoService.obtenerPorId(Number(id)).pipe(
    catchError(() => {
      router.navigate(['/404']);
      return of(null);
    })
  );
};
```

---

### SECCIÓN 2 - Route Guards (Guardias funcionales - forma moderna)

Los guards son funciones que controlan la navegación, decidiendo si se permite o no acceder a una ruta determinada. Desde Angular 15+, la forma recomendada de escribir guards es mediante funciones (no clases), aprovechando `inject()` para acceder a los servicios necesarios.

#### CanActivate (proteger acceso a rutas)

`CanActivate` se ejecuta antes de que se active una ruta y permite o deniega la navegación. Es el guard más utilizado para proteger rutas que requieren autenticación.

```typescript
// Archivo: src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.estaAutenticado()) {
    return true; // Permite la navegación
  }

  // Redirige al login, guardando la URL de retorno
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};

// Uso en las rutas
export const routes: Routes = [
  {
    path: 'perfil',
    component: PerfilComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [/* ... */]
  }
];
```

**Servicio de autenticación de ejemplo:**

```typescript
// Archivo: src/app/services/auth.service.ts
import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Estado de autenticación usando Signals
  private usuarioActual = signal<{ nombre: string; rol: string } | null>(null);
  readonly usuario = this.usuarioActual.asReadonly();
  readonly estaAutenticado = computed(() => this.usuarioActual() !== null);
  readonly esAdmin = computed(
    () => this.usuarioActual()?.rol === 'ADMIN'
  );

  iniciarSesion(nombre: string, password: string): boolean {
    // Simulación de autenticación
    if (nombre === 'admin' && password === 'admin') {
      this.usuarioActual.set({ nombre: 'Admin', rol: 'ADMIN' });
      return true;
    }
    return false;
  }

  cerrarSesion(): void {
    this.usuarioActual.set(null);
  }
}
```

#### CanActivateChild (proteger rutas hijas)

`CanActivateChild` se ejecuta antes de activar cualquier ruta hija de una ruta padre. Es útil cuando un conjunto de rutas hijas comparten la misma lógica de protección.

```typescript
import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateChildFn = (childRoute, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.esAdmin()) {
    return true;
  }

  // Usuario autenticado pero sin permisos -> página de acceso denegado
  if (authService.estaAutenticado()) {
    return router.createUrlTree(['/acceso-denegado']);
  }

  // No autenticado -> login
  return router.createUrlTree(['/login']);
};

// Uso en las rutas
{
  path: 'admin',
  component: AdminLayoutComponent,
  canActivate: [authGuard],
  canActivateChild: [adminGuard], // Protege TODAS las rutas hijas
  children: [
    { path: 'usuarios', component: AdminUsuariosComponent },
    { path: 'configuracion', component: AdminConfigComponent }
  ]
}
```

#### CanDeactivate (prevenir salida de formulario sin guardar)

`CanDeactivate` se ejecuta antes de abandonar una ruta. Es especialmente útil para prevenir la pérdida de datos no guardados en formularios.

```typescript
// Archivo: src/app/guards/salir-sin-guardar.guard.ts
import { CanDeactivateFn } from '@angular/router';
import { Observable } from 'rxjs';

// Interfaz que debe implementar el componente que queremos proteger
export interface PuedeDesactivar {
  puedeSalir: () => boolean | Observable<boolean> | Promise<boolean>;
}

export const salirSinGuardarGuard: CanDeactivateFn<PuedeDesactivar> = (
  component,
  currentRoute,
  currentState,
  nextState
) => {
  return component.puedeSalir ? component.puedeSalir() : true;
};
```

**Componente que implementa la interfaz:**

```typescript
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { PuedeDesactivar } from '../../guards/salir-sin-guardar.guard';

@Component({
  selector: 'app-formulario-contacto',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <h1>Formulario de Contacto</h1>
    <form [formGroup]="formulario" (ngSubmit)="enviar()">
      <input formControlName="nombre" placeholder="Nombre" />
      <textarea formControlName="mensaje" placeholder="Mensaje"></textarea>
      <button type="submit" [disabled]="formulario.invalid">
        Enviar
      </button>
    </form>
    @if (mensajeGuardado()) {
      <p class="exito">Cambios guardados correctamente</p>
    }
  `,
})
export class FormularioContactoComponent implements PuedeDesactivar {
  private fb = inject(FormBuilder);
  private cambiosGuardados = signal<boolean>(false);

  formulario = this.fb.group({
    nombre: ['', Validators.required],
    mensaje: ['', Validators.required]
  });

  puedeSalir(): boolean {
    // Si el formulario está limpio (no ha sido tocado) o ya se guardó, permitir salir
    if (this.formulario.pristine || this.cambiosGuardados()) {
      return true;
    }
    // Preguntar al usuario antes de salir
    return confirm('Tienes cambios sin guardar. ¿Estás seguro de salir?');
  }

  async enviar(): Promise<void> {
    if (this.formulario.valid) {
      // Simular envío a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.cambiosGuardados.set(true);
      this.formulario.reset();
    }
  }
}
```

**Uso en las rutas:**

```typescript
{
  path: 'contacto/nuevo',
  component: FormularioContactoComponent,
  canDeactivate: [salirSinGuardarGuard]
}
```

#### CanMatch (decidir qué ruta coincide)

`CanMatch` se ejecuta antes de que el router intente hacer match con una ruta. Permite decidir si una ruta es candidata para hacer match. Es útil para rutas que comparten el mismo path pero deben cargar diferentes configuraciones según condiciones.

```typescript
import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Solo permite hacer match si el usuario es admin
export const soloAdminMatch: CanMatchFn = (route, segments) => {
  const authService = inject(AuthService);
  return authService.esAdmin();
};

// Solo permite hacer match si el usuario NO está autenticado
export const soloInvitadoMatch: CanMatchFn = () => {
  const authService = inject(AuthService);
  return !authService.estaAutenticado();
};
```

**Ejemplo de uso con dos dashboards diferentes:**

```typescript
export const routes: Routes = [
  // Si el usuario es admin, carga el dashboard de admin
  {
    path: 'dashboard',
    canMatch: [soloAdminMatch],
    loadComponent: () => import('./dashboards/admin-dashboard.component')
      .then(m => m.AdminDashboardComponent)
  },
  // Si el usuario no es admin, carga el dashboard de usuario normal
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboards/usuario-dashboard.component')
      .then(m => m.UsuarioDashboardComponent)
  }
];
```

El router evalúa las rutas en orden. Si la primera no hace match (porque `canMatch` devuelve `false`), pasa a la siguiente.

#### Guards funcionales vs Guards de clase (deprecados)

Hasta Angular 14, los guards se implementaban como clases que implementaban interfaces como `CanActivate`, `CanDeactivate`, etc., y se decoraban con `@Injectable()`. A partir de Angular 15, este enfoque está **deprecado** a favor de los guards funcionales.

**Comparativa:**

```typescript
// ❌ ENFOQUE DEPRECADO (basado en clases)
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    if (this.authService.estaAutenticado()) { return true; }
    return this.router.createUrlTree(['/login']);
  }
}

// Uso
{ path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard] }

// ✅ ENFOQUE MODERNO (funcional)
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.estaAutenticado()) { return true; }
  return router.createUrlTree(['/login']);
};

// Uso
{ path: 'perfil', component: PerfilComponent, canActivate: [authGuard] }
```

**Ventajas del enfoque funcional:**

1. Código más conciso y legible.
2. No requiere decoradores ni interfaces de clase.
3. Usa `inject()` para inyección de dependencias, consistente con el resto de APIs funcionales de Angular (interceptores, resolvers).
4. Mejor tree-shaking: el bundler puede eliminar funciones no usadas.

#### Composición de guards (múltiples guards en una ruta)

Podemos combinar múltiples guards en una misma ruta. Todos deben devolver `true` (o `UrlTree`) para que la navegación se permita. Si alguno devuelve `false`, la navegación se cancela.

```typescript
{
  path: 'admin/usuarios',
  component: AdminUsuariosComponent,
  canActivate: [
    authGuard,           // 1. ¿Está autenticado?
    adminRoleGuard,      // 2. ¿Tiene rol de admin?
    cuentaActivaGuard    // 3. ¿Su cuenta está activa?
  ]
}
```

Los guards se ejecutan en orden secuencial. Si el primero falla, los siguientes no se ejecutan.

```typescript
// Guard que verifica el rol del usuario
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminRoleGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.esAdmin()) {
    return true;
  }
  return router.createUrlTree(['/acceso-denegado']);
};

// Guard que verifica que la cuenta del usuario esté activa
export const cuentaActivaGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.usuario()?.cuentaActiva) {
    return true;
  }
  return router.createUrlTree(['/cuenta-inactiva']);
};
```

#### Redirecciones desde guards (inject(Router).createUrlTree())

Cuando un guard deniega el acceso, no basta con devolver `false`; debemos proporcionar una ruta alternativa. Para ello, usamos `router.createUrlTree()` que construye una `UrlTree` (árbol de URL) y redirige al usuario.

```typescript
// Devolver true para permitir navegación
return true;

// Devolver false para cancelar la navegación (el usuario se queda donde está)
return false;

// Devolver UrlTree para redirigir a otra ruta
return router.createUrlTree(['/login'], {
  queryParams: { returnUrl: state.url } // Guardamos la URL de retorno
});

// También podemos devolver un Observable<boolean | UrlTree>
return of(router.createUrlTree(['/login']));
```

**Componente de login que usa el returnUrl después de autenticarse:**

```typescript
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  iniciarSesion(): void {
    const exito = this.authService.iniciarSesion('admin', 'admin');
    if (exito) {
      // Recuperamos la URL de retorno de los query params
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
      this.router.navigateByUrl(returnUrl);
    }
  }
}
```

#### Uso de inject() dentro de guards funcionales

`inject()` es la función que permite la inyección de dependencias en contextos funcionales. En los guards funcionales, podemos usar `inject()` para obtener cualquier servicio que necesitemos.

```typescript
export const authGuard: CanActivateFn = (route, state) => {
  // ✅ Correcto: inject() funciona porque el guard se ejecuta dentro del contexto de inyección
  const authService = inject(AuthService);
  const router = inject(Router);
  const logger = inject(LoggerService);

  logger.log(`Verificando acceso a: ${state.url}`);

  if (authService.estaAutenticado()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
```

**Importante:** `inject()` solo funciona dentro del contexto de inyección de Angular (durante la construcción de componentes, servicios, guards, interceptores, etc.). No funciona en cualquier función aleatoria, sino solo en aquellas que Angular invoca dentro de su contexto de inyección.

---

### SECCIÓN 3 - Lazy Loading

#### Concepto de lazy loading (carga perezosa)

El lazy loading (carga perezosa) es una técnica que consiste en cargar el código de ciertas partes de la aplicación solo cuando el usuario las necesita, en lugar de cargar todo el código al inicio. Esto reduce drásticamente el tamaño del bundle inicial y mejora el tiempo de carga de la aplicación.

En el contexto de Angular, el lazy loading se aplica a nivel de rutas: los componentes asociados a una ruta no se descargan hasta que el usuario navega a esa ruta por primera vez.

Imaginemos una aplicación con las siguientes secciones:

- **Inicio** (visitada por todos los usuarios)
- **Productos** (visitada frecuentemente)
- **Administración** (solo acceden administradores, raramente visitada)
- **Reportes** (funcionalidad avanzada con gráficos pesados)

Sin lazy loading, los cuatro módulos se descargarían al abrir la aplicación, aunque el 90% de los usuarios nunca visite Administración ni Reportes. Con lazy loading, solo se descarga Inicio (y quizás Productos con una estrategia de precarga), dejando Administración y Reportes para cuando realmente se necesiten.

#### Lazy Loading Standalone (loadComponent, loadChildren)

En Angular standalone, existen dos formas de implementar lazy loading:

**loadComponent** - para cargar un componente individual de forma perezosa:

```typescript
export const routes: Routes = [
  // Carga eager (inmediata): el componente se incluye en el bundle principal
  {
    path: 'inicio',
    component: InicioComponent
  },
  // Carga lazy (perezosa): el componente se carga al navegar a la ruta
  {
    path: 'configuracion',
    loadComponent: () => import('./pages/configuracion/configuracion.component')
      .then(m => m.ConfiguracionComponent)
  }
];
```

**loadChildren** - para cargar un conjunto de rutas hijas de forma perezosa:

```typescript
// Archivo: src/app/app.routes.ts
export const routes: Routes = [
  { path: 'inicio', component: InicioComponent },

  // Carga lazy de todas las rutas de administración
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes')
      .then(m => m.adminRoutes)
  }
];
```

```typescript
// Archivo: src/app/admin/admin.routes.ts
import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-layout.component')
      .then(m => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/admin-dashboard.component')
          .then(m => m.AdminDashboardComponent)
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./usuarios/admin-usuarios.component')
          .then(m => m.AdminUsuariosComponent)
      },
      {
        path: 'usuarios/:id',
        loadComponent: () => import('./usuarios/admin-usuario-detalle.component')
          .then(m => m.AdminUsuarioDetalleComponent)
      }
    ]
  }
];
```

#### Beneficios: bundles separados por feature, menor tiempo de carga inicial

Con lazy loading, el bundler (esbuild o webpack) genera archivos separados para cada ruta lazy. Esto produce múltiples beneficios:

1. **Menor tiempo de carga inicial**: el archivo principal (main.js) es más pequeño porque no incluye código de rutas perezosas.
2. **Carga bajo demanda**: el código solo se descarga cuando el usuario navega a la ruta.
3. **Mejor experiencia en dispositivos lentos y redes móviles**.
4. **Organización lógica del código**: cada feature es un bundle independiente.

**Estructura de bundles generados:**

```
main.js           ← Bundle principal (código común + rutas eager)
inicio-XXXX.js    ← Bundle de la página de inicio (eager)
admin-XXXX.js     ← Bundle de administración (lazy: solo cuando se visita /admin)
productos-XXXX.js ← Bundle de productos (lazy)
```

#### Visualización en DevTools (Network tab, bundles separados)

Para verificar que el lazy loading funciona correctamente, abrimos las herramientas de desarrollo del navegador (F12), vamos a la pestaña **Network** (Red) y recargamos la página. Observaremos que solo se descargan los bundles correspondientes a las rutas iniciales (eager). Al navegar a una ruta lazy, veremos cómo se descarga un nuevo archivo JavaScript correspondiente a esa feature.

También podemos usar la pestaña **Sources** (Fuentes) para inspeccionar los archivos disponibles en el navegador antes y después de navegar a rutas lazy.

#### Prefetching (estrategias de precarga)

El prefetching (precarga) es una estrategia que descarga los bundles de las rutas lazy en segundo plano, después de que la aplicación se ha cargado, sin esperar a que el usuario navegue a ellas. Esto combina lo mejor de ambos mundos: carga inicial rápida y navegación instantánea entre secciones.

Angular ofrece estrategias de precarga configurables:

**1. Sin precarga (por defecto):**

```typescript
import { provideRouter } from '@angular/router';

provideRouter(routes) // No hay precarga. Los bundles se cargan al navegar.
```

**2. Precargar todos los módulos (PreloadAllModules):**

```typescript
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withPreloading(PreloadAllModules)
    )
  ]
};
```

Con `PreloadAllModules`, todos los bundles lazy se descargan en segundo plano inmediatamente después de la carga inicial. Es adecuado para aplicaciones pequeñas donde todos los bundles suman poco peso.

**3. Estrategia de precarga personalizada:**

```typescript
import { Injectable, inject } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

// Estrategia que solo precarga rutas marcadas con data.preload = true
@Injectable({ providedIn: 'root' })
export class PreloadService implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    if (route.data && route.data['preload']) {
      return load(); // Precarga esta ruta
    }
    return of(null); // No precarga
  }
}

// Uso en la configuración
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withPreloading(PreloadService)
    )
  ]
};

// Marcar rutas para precarga
{
  path: 'productos',
  loadChildren: () => import('./productos/routes').then(m => m.routes),
  data: { preload: true } // Esta ruta se precargará
},
{
  path: 'admin',
  loadChildren: () => import('./admin/routes').then(m => m.routes),
  // No tiene data.preload, por lo que NO se precargará
}
```

**4. Precarga condicional con lógica de negocio (OptInPreloadStrategy):**

```typescript
@Injectable({ providedIn: 'root' })
export class OptInPreloadStrategy implements PreloadingStrategy {
  private authService = inject(AuthService);

  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    // Solo precarga si el usuario tiene un rol específico
    const rolRequerido = route.data?.['preloadForRole'];
    if (rolRequerido && this.authService.usuario()?.rol === rolRequerido) {
      return load();
    }
    return of(null);
  }
}
```

#### Organización de features con lazy loading

Para proyectos grandes, se recomienda organizar el código en features independientes, cada una con su propio archivo de rutas y estructura de carpetas. Esta organización facilita el mantenimiento y permite que equipos diferentes trabajen en features distintas sin conflictos.

**Estructura de carpetas recomendada:**

```
src/
├── app/
│   ├── app.component.ts
│   ├── app.config.ts
│   ├── app.routes.ts              # Rutas raíz con loadChildren
│   │
│   ├── core/                      # Código compartido por toda la app
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   └── api.service.ts
│   │   ├── guards/
│   │   │   ├── auth.guard.ts
│   │   │   └── admin.guard.ts
│   │   └── models/
│   │       └── usuario.model.ts
│   │
│   ├── shared/                    # Componentes compartidos
│   │   ├── components/
│   │   │   ├── header/
│   │   │   ├── footer/
│   │   │   └── loading-spinner/
│   │   └── pipes/
│   │
│   ├── features/                  # Features lazy-loaded
│   │   ├── inicio/
│   │   │   ├── inicio.component.ts
│   │   │   └── inicio.routes.ts   # Rutas internas de inicio
│   │   │
│   │   ├── productos/
│   │   │   ├── pages/
│   │   │   │   ├── producto-lista/
│   │   │   │   ├── producto-detalle/
│   │   │   │   └── producto-editar/
│   │   │   ├── services/
│   │   │   │   └── producto.service.ts
│   │   │   ├── models/
│   │   │   │   └── producto.model.ts
│   │   │   └── productos.routes.ts
│   │   │
│   │   └── admin/
│   │       ├── pages/
│   │       ├── services/
│   │       ├── guards/
│   │       └── admin.routes.ts
│   │
│   └── pages/                     # Rutas eager o componentes simples
│       ├── login/
│       ├── pagina-no-encontrada/
│       └── acceso-denegado/
```

**Archivo de rutas raíz (app.routes.ts):**

```typescript
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Rutas eager (se cargan en el bundle principal)
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login.component') },
  { path: 'acceso-denegado', loadComponent: () => import('./pages/acceso-denegado/acceso-denegado.component') },

  // Rutas lazy (se cargan bajo demanda)
  {
    path: 'inicio',
    loadChildren: () => import('./features/inicio/inicio.routes').then(m => m.inicioRoutes)
  },
  {
    path: 'productos',
    loadChildren: () => import('./features/productos/productos.routes').then(m => m.productosRoutes)
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes),
    data: { preload: false } // No precargar admin por defecto
  },

  // Página 404
  { path: '**', loadComponent: () => import('./pages/pagina-no-encontrada/pagina-no-encontrada.component') }
];
```

#### defaultExport en loadComponent

Cuando un componente se exporta como exportación por defecto (`export default class ...`), podemos simplificar la sintaxis de `loadComponent` usando `defaultExport`:

```typescript
// Componente con exportación por defecto
// producto-detalle.component.ts
@Component({...})
export default class ProductoDetalleComponent { }

// En las rutas, simplificamos la carga
{
  path: 'productos/:id',
  loadComponent: () => import('./producto-detalle/producto-detalle.component')
  // No necesitamos .then(m => m.ProductoDetalleComponent)
  // Angular asume que el módulo exporta el componente como default
}
```

---

## Ejemplos guiados

### Ejemplo 1: Configuración de rutas básicas con RouterOutlet y RouterLink

**Objetivo:** Crear una aplicación con tres páginas (Inicio, Acerca de, Contacto) y navegación entre ellas.

**Paso 1: Configurar el router en app.config.ts**

```typescript
// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)]
};
```

**Paso 2: Definir las rutas**

```typescript
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { AcercaDeComponent } from './pages/acerca-de/acerca-de.component';
import { ContactoComponent } from './pages/contacto/contacto.component';

export const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent, title: 'Inicio' },
  { path: 'acerca-de', component: AcercaDeComponent, title: 'Acerca de' },
  { path: 'contacto', component: ContactoComponent, title: 'Contacto' },
  { path: '**', redirectTo: '/inicio' }
];
```

**Paso 3: Crear la plantilla del componente raíz con RouterOutlet y RouterLink**

```typescript
// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav class="navbar">
      <a
        routerLink="/inicio"
        routerLinkActive="active"
        [routerLinkActiveOptions]="{ exact: true }">
        Inicio
      </a>
      <a routerLink="/acerca-de" routerLinkActive="active">Acerca de</a>
      <a routerLink="/contacto" routerLinkActive="active">Contacto</a>
    </nav>

    <main class="container">
      <router-outlet />
    </main>
  `,
  styles: [`
    .navbar {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      background-color: #2c3e50;
    }
    .navbar a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
    }
    .navbar a.active {
      background-color: #3498db;
    }
    .navbar a:hover {
      background-color: #34495e;
    }
    .container {
      padding: 2rem;
    }
  `]
})
export class AppComponent {}
```

### Ejemplo 2: Rutas con parámetros y ActivatedRoute

**Objetivo:** Crear una página de detalle de producto que reciba el ID como parámetro de ruta.

```typescript
// producto-detalle.component.ts
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
}

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (producto(); as prod) {
      <h1>{{ prod.nombre }}</h1>
      <p><strong>ID:</strong> {{ prod.id }}</p>
      <p><strong>Precio:</strong> {{ prod.precio | currency:'EUR' }}</p>
      <p>{{ prod.descripcion }}</p>
      <a routerLink="/productos">Volver al listado</a>
    } @else {
      <p>Cargando producto...</p>
    }
  `
})
export class ProductoDetalleComponent {
  private route = inject(ActivatedRoute);

  producto = signal<Producto | null>(null);

  // Simulamos una base de datos de productos
  private productos: Producto[] = [
    { id: 1, nombre: 'Portátil HP', precio: 799, descripcion: 'Portátil de 15 pulgadas' },
    { id: 2, nombre: 'Monitor Dell', precio: 299, descripcion: 'Monitor 4K de 27 pulgadas' },
    { id: 3, nombre: 'Teclado Mecánico', precio: 89, descripcion: 'Teclado retroiluminado RGB' }
  ];

  constructor() {
    this.route.paramMap
      .pipe(takeUntilDestroyed())
      .subscribe(params => {
        const id = Number(params.get('id'));
        const encontrado = this.productos.find(p => p.id === id);
        this.producto.set(encontrado || null);
      });
  }
}
```

### Ejemplo 3: Implementación de auth guard funcional

**Objetivo:** Proteger la ruta de perfil de usuario, redirigiendo al login si no está autenticado.

```typescript
// Archivo: src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.estaAutenticado()) {
    return true;
  }

  // Guardamos la URL que el usuario intentaba visitar para volver tras login
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};

// Servicio de autenticación simplificado
// Archivo: src/app/services/auth.service.ts
import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private usuarioActual = signal<{ email: string } | null>(null);
  readonly usuario = this.usuarioActual.asReadonly();
  readonly estaAutenticado = computed(() => this.usuarioActual() !== null);

  iniciarSesion(email: string, password: string): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        if (email === 'admin@example.com' && password === 'admin123') {
          this.usuarioActual.set({ email });
          resolve(true);
        } else {
          resolve(false);
        }
      }, 800);
    });
  }

  cerrarSesion(): void {
    this.usuarioActual.set(null);
  }
}

// Uso del guard en las rutas
// Archivo: src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { InicioComponent } from './pages/inicio/inicio.component';
import { LoginComponent } from './pages/login/login.component';
import { PerfilComponent } from './pages/perfil/perfil.component';

export const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'perfil',
    component: PerfilComponent,
    canActivate: [authGuard] // Solo accesible si está autenticado
  },
  { path: '**', redirectTo: '/inicio' }
];
```

### Ejemplo 4: Lazy loading de un módulo de administración

```typescript
// Archivo: src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },

  {
    path: 'inicio',
    loadComponent: () =>
      import('./pages/inicio/inicio.component').then(m => m.InicioComponent)
  },

  // Lazy loading del módulo de administración completo
  {
    path: 'admin',
    canActivate: [authGuard],
    canActivateChild: [adminGuard],
    loadChildren: () =>
      import('./features/admin/admin.routes').then(m => m.adminRoutes)
  },

  { path: '**', redirectTo: '/inicio' }
];

// Archivo: src/app/features/admin/admin.routes.ts
import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./components/admin-usuarios.component').then(m => m.AdminUsuariosComponent)
      },
      {
        path: 'reportes',
        loadComponent: () =>
          import('./components/admin-reportes.component').then(m => m.AdminReportesComponent)
      }
    ]
  }
];
```

---

## Ejercicios resueltos

### Ejercicio 1: Aplicación de navegación con páginas y 404

**Enunciado:** Crea una aplicación Angular con las siguientes rutas:

- `/` redirige a `/inicio`
- `/inicio` muestra el componente InicioComponent
- `/productos` muestra ProductosListaComponent
- `/productos/:id` muestra ProductosDetalleComponent
- `/contacto` muestra ContactoComponent
- Cualquier ruta no definida muestra Pagina404Component
- Navegación con RouterLink en un menú superior
- Resaltar la página activa con routerLinkActive

**Solución:**

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { ProductosListaComponent } from './pages/productos-lista/productos-lista.component';
import { ProductosDetalleComponent } from './pages/productos-detalle/productos-detalle.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { Pagina404Component } from './pages/pagina404/pagina404.component';

export const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent, title: 'Inicio' },
  { path: 'productos', component: ProductosListaComponent, title: 'Productos' },
  { path: 'productos/:id', component: ProductosDetalleComponent, title: 'Detalle Producto' },
  { path: 'contacto', component: ContactoComponent, title: 'Contacto' },
  { path: '**', component: Pagina404Component, title: '404 - No encontrado' }
];

// app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <header>
      <h1>Mi Tienda Online</h1>
      <nav>
        <a routerLink="/inicio"
           routerLinkActive="active"
           [routerLinkActiveOptions]="{ exact: true }">Inicio</a>
        <a routerLink="/productos"
           routerLinkActive="active">Productos</a>
        <a routerLink="/contacto"
           routerLinkActive="active"
           [routerLinkActiveOptions]="{ exact: true }">Contacto</a>
      </nav>
    </header>
    <main>
      <router-outlet />
    </main>
    <footer>
      <p>&copy; 2025 Mi Tienda Online</p>
    </footer>
  `,
  styles: [`
    nav a { margin-right: 1rem; text-decoration: none; color: #333; }
    nav a.active { color: #e74c3c; font-weight: bold; border-bottom: 2px solid #e74c3c; }
    main { padding: 2rem; min-height: 60vh; }
  `]
})
export class AppComponent {}

// pagina404.component.ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagina404',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found">
      <h1>404</h1>
      <p>Lo sentimos, la página que buscas no existe.</p>
      <a routerLink="/" class="btn">Volver al inicio</a>
    </div>
  `
})
export class Pagina404Component {}
```

### Ejercicio 2: Proteger rutas de perfil con guard de autenticación

**Enunciado:** Implementa un guard funcional que proteja las rutas `/perfil` y `/pedidos`, redirigiendo al usuario no autenticado a `/login`. Tras iniciar sesión, el usuario debe ser redirigido a la página que intentaba visitar originalmente.

**Solución:**

```typescript
// auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.estaAutenticado()) {
    return true;
  }

  // Almacenar URL intentada para redirigir tras login
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};

// auth.service.ts (usa señales para estado reactivo)
import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private usuarioActual = signal<{ email: string; nombre: string } | null>(null);
  readonly usuario = this.usuarioActual.asReadonly();
  readonly estaAutenticado = computed(() => this.usuarioActual() !== null);

  async iniciarSesion(email: string, password: string): Promise<boolean> {
    // Simulación: en un entorno real esto sería una llamada HTTP
    if (email && password.length >= 6) {
      this.usuarioActual.set({ email, nombre: email.split('@')[0] });
      return true;
    }
    return false;
  }

  cerrarSesion(): void {
    this.usuarioActual.set(null);
  }
}

// login.component.ts
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <h1>Iniciar Sesión</h1>
    <form [formGroup]="formulario" (ngSubmit)="iniciarSesion()">
      <label>Email:</label>
      <input type="email" formControlName="email" placeholder="tu@email.com" />

      <label>Contraseña:</label>
      <input type="password" formControlName="password" placeholder="Mínimo 6 caracteres" />

      @if (error()) {
        <p class="error">{{ error() }}</p>
      }

      <button type="submit" [disabled]="formulario.invalid || cargando()">
        @if (cargando()) {
          Iniciando sesión...
        } @else {
          Iniciar Sesión
        }
      </button>
    </form>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  formulario = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  cargando = signal(false);
  error = signal<string | null>(null);

  async iniciarSesion(): Promise<void> {
    if (this.formulario.invalid) return;

    this.cargando.set(true);
    this.error.set(null);

    const { email, password } = this.formulario.value;
    const exito = await this.authService.iniciarSesion(email!, password!);

    this.cargando.set(false);

    if (exito) {
      // Redirigir a la URL de retorno o al inicio por defecto
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/inicio';
      this.router.navigateByUrl(returnUrl);
    } else {
      this.error.set('Credenciales inválidas. Inténtalo de nuevo.');
    }
  }
}
```

---

## Actividades propuestas

1. **Aplicación de blog con navegación:** Crea una aplicación de blog con las siguientes rutas: `/` (lista de artículos), `/articulo/:slug` (artículo individual con parámetro slug), `/categorias` (lista de categorías), `/categorias/:nombre` (artículos de una categoría). Implementa navegación con `RouterLink`, resaltado de enlace activo y página 404.

2. **Sistema de autenticación completo:** Implementa un sistema de login/logout con guards funcionales. Crea tres roles de usuario (visitante, usuario registrado, admin). Protege las rutas `/perfil`, `/pedidos` y `/admin` con guards apropiados. Tras el login, el usuario debe ser redirigido a la página que intentaba visitar.

3. **Lazy loading de features:** Divide una aplicación de e-commerce en tres features independientes cargadas con lazy loading: catálogo de productos, panel de usuario y administración. Configura una estrategia de precarga personalizada que solo precargue el catálogo (por ser la feature más visitada) pero no el panel de administración.

4. **Formulario con guardia de salida (CanDeactivate):** Crea un formulario de registro extenso con varios campos. Implementa un `CanDeactivate` funcional que muestre un diálogo de confirmación si el usuario intenta salir sin guardar. El diálogo debe permitir cancelar la navegación o continuar.

5. **Dashboard con rutas anidadas y parámetros:** Diseña un panel de dashboard con layout de sidebar y contenido principal. Implementa rutas anidadas para las secciones: resumen, productos (con detalle de producto por ID), usuarios y configuración. Cada sección debe tener su propio título dinámico en la pestaña del navegador.

## Actividades de ampliación

1. **Sistema de breadcrumbs dinámico:** Implementa un componente de breadcrumbs (migas de pan) que se genere automáticamente a partir de los datos `data.breadcrumb` de cada ruta. El componente debe suscribirse a los eventos del router y construir la ruta de breadcrumbs para cualquier profundidad de anidamiento.

2. **Animaciones de transición entre rutas:** Utiliza el módulo de animaciones de Angular (`@angular/animations`) para crear transiciones suaves entre páginas. Implementa efectos de fade, slide y zoom controlados por datos en la configuración de rutas. Asegúrate de que las animaciones funcionen correctamente tanto con rutas eager como con lazy loading.

3. **Internacionalización con router:** Configura el router para soportar internacionalización (i18n) mediante un prefijo de idioma en la URL (`/es/inicio`, `/en/home`). Implementa una estrategia que detecte el idioma preferido del usuario y redirija automáticamente. Adapta los guards para que respeten el parámetro de idioma.

## Buenas prácticas profesionales

1. **Centralizar las rutas en archivos dedicados:** No definas las rutas en `main.ts` o `app.config.ts`. Crea un archivo `app.routes.ts` y, para features grandes, archivos de rutas propios (`feature.routes.ts`). Esto mejora la legibilidad y mantenibilidad.

2. **Usar siempre lazy loading para features no críticas:** No cargues eager todo el código de la aplicación. Identifica las features que no son necesarias en la carga inicial (paneles de administración, configuraciones avanzadas, reportes) y cárgalas con `loadChildren` o `loadComponent`.

3. **Preferir guardias funcionales sobre guardias de clase:** Las guardias basadas en clases están deprecadas. Usa siempre funciones con `inject()` para acceder a dependencias. El código es más conciso y Angular lo optimiza mejor.

4. **Usar `takeUntilDestroyed()` para gestionar suscripciones:** En componentes standalone, evita gestionar manualmente las suscripciones con `ngOnDestroy` y `Subscription`. Usa el operador `takeUntilDestroyed()` de `@angular/core/rxjs-interop` para una limpieza automática y segura.

5. **Almacenar la URL de retorno tras autenticación:** Cuando redirijas a `/login` desde un guard, pasa la URL original como query param (`?returnUrl=/ruta-original`). Tras el login exitoso, navega a esa URL. Esto mejora significativamente la experiencia de usuario.

6. **Definir títulos de página dinámicos:** Usa la propiedad `title` en la definición de rutas para actualizar automáticamente el título del navegador. Para títulos dinámicos (que dependan de datos), implementa un `TitleStrategy` personalizado.

7. **Mantener las rutas ordenadas de más específica a menos específica:** El router evalúa las rutas en orden. Coloca las rutas con parámetros dinámicos (`:id`) después de las rutas estáticas (`nuevo`) para evitar capturas incorrectas. La ruta comodín `**` siempre debe ir al final.

8. **Usar `withComponentInputBinding()` para simplificar la recepción de parámetros:** Esta feature opcional del router permite vincular los parámetros de ruta y query params directamente a `@Input()` del componente, eliminando la necesidad de inyectar `ActivatedRoute` para casos simples.

## Errores frecuentes

1. **Olvidar `pathMatch: 'full'` en la ruta de redirección desde `''`:** Sin `pathMatch: 'full'`, la ruta vacía hace match con todas las URLs (porque todas empiezan con `''`), lo que provoca un bucle infinito de redirecciones. Solución: `{ path: '', redirectTo: '/inicio', pathMatch: 'full' }`.

2. **Usar `snapshot` en lugar de observable para parámetros de ruta que cambian:** Cuando navegas de `productos/1` a `productos/2`, Angular reutiliza el mismo componente. Si usas `snapshot.paramMap`, el valor no se actualizará. Solución: suscríbete a `this.route.paramMap` para reaccionar a cambios.

3. **Colocar la ruta comodín `**` antes que otras rutas:** El router evalúa las rutas en orden. Si `**` está antes que otras rutas, capturará todas las URLs y ninguna otra ruta funcionará. Solución: la ruta `**` siempre debe ser la última del array.

4. **No cancelar suscripciones a ActivatedRoute:** Las suscripciones a observables del router que no se cancelan pueden causar memory leaks y comportamientos inesperados. Solución: usa `takeUntilDestroyed()` o gestiona la cancelación en `ngOnDestroy`.

5. **Olvidar importar `RouterLink`, `RouterOutlet` o `ReactiveFormsModule` en componentes standalone:** En el enfoque standalone, cada componente debe declarar sus propias dependencias. Un error común es usar `routerLink` en la plantilla sin importar `RouterLink` en el componente. Solución: revisa siempre el array `imports` del decorador `@Component`.

6. **Confundir `navigate()` con `navigateByUrl()`:** `navigate()` espera un array de comandos (como `routerLink` con array), mientras que `navigateByUrl()` espera una cadena de URL completa. Usar `navigate('/productos')` en lugar de `navigate(['/productos'])` o `navigateByUrl('/productos')` es un error común.

7. **No proteger rutas de API que corresponden a rutas protegidas del frontend:** Los guards del router solo protegen la navegación en el cliente. Las APIs del backend deben tener su propia lógica de autenticación/autorización. Los guards de Angular no sustituyen la seguridad del servidor.

8. **Usar rutas absolutas en `routerLink` en componentes hijos reutilizables:** Si un componente se usa en diferentes contextos de ruta, usar rutas absolutas (`/admin/usuarios`) rompe la reusabilidad. Solución: usa rutas relativas (`usuarios` o `../usuarios`) en `routerLink`.

## Resumen

El router de Angular es una herramienta poderosa y flexible para gestionar la navegación en SPAs. En este capítulo hemos aprendido:

- **Configuración inicial:** Cómo usar `provideRouter()` en `app.config.ts` para configurar el router en aplicaciones standalone.
- **Rutas básicas:** Definición de rutas con `path`, `component`, `redirectTo` y `pathMatch`. Uso de `RouterOutlet` para renderizar componentes y `RouterLink` para navegación declarativa.
- **Navegación programática:** Uso del servicio `Router` con `navigate()` y `navigateByUrl()`.
- **Parámetros de ruta:** Definición con `:id` y acceso mediante `ActivatedRoute.paramMap` (observable, recomendado) o `snapshot.paramMap` (estático).
- **Query params:** Parámetros opcionales en la URL para filtros, paginación y ordenación.
- **Rutas anidadas:** Jerarquías de rutas con `children` y múltiples `RouterOutlet` anidados.
- **Guardias funcionales:** Protección de rutas con `CanActivate`, `CanActivateChild`, `CanDeactivate` y `CanMatch` usando funciones modernas con `inject()`.
- **Lazy loading:** Carga perezosa de features con `loadComponent` y `loadChildren` para mejorar el rendimiento inicial.
- **Precarga:** Estrategias de prefetching (`PreloadAllModules` y personalizadas) para descargar bundles en segundo plano.

El router es, junto con los componentes y los servicios, uno de los tres pilares de cualquier aplicación Angular no trivial. Dominar su configuración y sus opciones avanzadas es esencial para construir aplicaciones robustas, seguras y con buena experiencia de usuario.

## Recursos adicionales

- [Documentación oficial de Angular Router](https://angular.dev/guide/routing)
- [Angular Router: Tour of Heroes (tutorial oficial)](https://angular.dev/tutorials/first-app)
- [Lazy loading en Angular](https://angular.dev/guide/ngmodules/lazy-loading)
- [Preloading Strategies](https://angular.dev/api/router/PreloadAllModules)
- [Guards funcionales en Angular](https://angular.dev/api/router/CanActivateFn)
- [Angular Router: The Ultimate Guide (libro online)](https://angular-router.io/)
- [withComponentInputBinding para binding automático de parámetros](https://angular.dev/api/router/withComponentInputBinding)
