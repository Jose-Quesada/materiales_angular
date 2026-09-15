# Proyecto Integrador Final

## Objetivos de aprendizaje

Al finalizar este proyecto, el alumnado será capaz de:

- Diseñar y desarrollar una Single Page Application (SPA) completa con Angular utilizando standalone components.
- Aplicar el patrón de gestión de estado reactivo mediante Signals, Computed Signals y Effects.
- Implementar una arquitectura escalable basada en features modules con separación smart/dumb components.
- Configurar lazy loading por feature para optimizar el rendimiento de la aplicación.
- Integrar Reactive Forms y Signal Forms para formularios con validación avanzada.
- Consumir APIs REST mediante HttpClient con interceptores para autenticación y manejo de errores.
- Implementar autenticación con JWT y protección de rutas mediante guards funcionales.
- Aplicar pipes personalizados, proyección de contenido y directivas para una UI reutilizable.
- Configurar Server-Side Rendering (SSR) y estrategias de carga diferida con @defer.
- Utilizar Angular Material para crear interfaces de usuario profesionales y responsive.
- Desplegar una aplicación Angular completa demostrando competencia en todas las áreas del curso.

## Resultados de aprendizaje

Según los currículos oficiales de los ciclos formativos de grado superior en Andalucía:

**Módulo: Desarrollo Web en Entorno Cliente (DWEC)**
- **RA1.** Selecciona las arquitecturas y tecnologías de programación web en entorno cliente, analizando sus capacidades y características propias.
- **RA2.** Desarrolla aplicaciones web enriquecidas utilizando frameworks del entorno cliente, justificando su elección.
- **RA3.** Integra librerías y frameworks de terceros, justificando su elección y configurando su uso.
- **RA4.** Aplica mecanismos de almacenamiento y comunicación con servicios remotos.
- **RA5.** Implementa mecanismos de seguridad en aplicaciones web.

**Módulo: Desarrollo Web en Entorno Servidor (DWES)**
- **RA3.** Realiza operaciones de consulta y manipulación de datos almacenados en bases de datos relacionales.
- **RA4.** Gestiona sesiones y mecanismos de autenticación en aplicaciones web.

**Módulo: Despliegue de Aplicaciones Web (DAW)**
- **RA1.** Prepara entornos de desarrollo y despliegue de aplicaciones web.
- **RA2.** Despliega aplicaciones web en servidores de aplicaciones.
- **RA4.** Configura servidores web y de aplicaciones para el despliegue de aplicaciones.

**Módulo: Diseño de Interfaces Web (DIW)**
- **RA4.** Crea interfaces web con frameworks de diseño, aplicando los estándares de accesibilidad y usabilidad.
- **RA6.** Desarrolla aplicaciones web responsivas, adaptables a diferentes dispositivos.

---

## Introducción

El Proyecto Integrador Final constituye la culminación del módulo de Desarrollo Web en Entorno Cliente. A lo largo de las 16 unidades anteriores, hemos explorado de forma modular cada concepto de Angular: componentes, plantillas, signals, pipes, formularios, routing, servicios HTTP, SSR y mucho más. Es el momento de unificar todos estos conocimientos en una sola aplicación profesional completa.

Este proyecto simula un encargo real de desarrollo: construir un **Marketplace de Productos**, una plataforma de compraventa donde los usuarios pueden navegar por un catálogo, añadir productos al carrito, realizar pedidos, gestionar su perfil y, en el caso de los administradores, gestionar el inventario completo.

La aplicación se construirá siguiendo el paradigma **Angular Standalone**, aprovechando las últimas características del framework: Signals para el estado reactivo, el nuevo Control Flow (@if, @for, @switch), carga diferida con @defer, y soporte para Server-Side Rendering. Utilizaremos Angular Material para conseguir una interfaz moderna y accesible, y RxJS para el manejo avanzado de operaciones asíncronas.

La metodología de trabajo está dividida en fases bien definidas, cada una con objetivos claros y entregables concretos. Al finalizar, dispondrás de una aplicación completa que podrás incluir en tu portfolio profesional, demostrando competencia en el stack Angular moderno.

---

## Enunciado del proyecto

### Descripción general

Desarrollar una aplicación SPA (Single Page Application) de compraventa de productos con las siguientes funcionalidades:

1. **Página de inicio** con productos destacados, banner promocional y categorías populares.
2. **Catálogo de productos** con búsqueda, filtros por categoría y precio, y paginación.
3. **Detalle de producto** con galería de imágenes, descripción, valoraciones y productos relacionados.
4. **Carrito de compras** con gestión de cantidades, cálculo automático de totales y persistencia en localStorage.
5. **Proceso de checkout** con formulario de dirección, resumen de pedido y confirmación.
6. **Autenticación de usuarios** (registro, login, logout) con JWT.
7. **Panel de usuario** con historial de pedidos, datos de perfil y opciones de cuenta.
8. **Panel de administración** protegido para gestión de productos (CRUD) y pedidos (cambio de estado).
9. **Diseño responsive** mobile-first que funcione correctamente en móvil, tablet y escritorio.
10. **SEO básico** mediante SSR/prerender y meta tags dinámicos.

### Requisitos técnicos obligatorios

Cada requisito debe estar implementado correctamente para la superación del proyecto:

1. **Angular Standalone:** toda la aplicación utiliza `standalone: true`. No se usa `NgModule` en ningún componente, pipe o directiva nuevo.
2. **Signals para estado:** el carrito, la autenticación y otros estados compartidos se gestionan mediante Signals en servicios inyectables.
3. **Computed Signals:** valores derivados como el total del carrito, el número de items o los filtros aplicados se implementan con `computed()`.
4. **Effects:** efectos secundarios como persistir el carrito en localStorage o registrar eventos de analítica se implementan con `effect()`.
5. **Angular Material:** la interfaz utiliza componentes de Angular Material (mat-card, mat-table, mat-form-field, mat-dialog, mat-snack-bar, mat-toolbar, mat-sidenav, mat-icon, mat-badge, mat-paginator, mat-chip, etc.).
6. **Routing con lazy loading:** cada feature (home, products, cart, checkout, auth, user, admin) se carga de forma perezosa mediante `loadComponent` o `loadChildren`.
7. **Reactive Forms:** formularios de login, registro y checkout implementados con `FormBuilder`, `FormGroup`, `FormArray` y validadores síncronos/asíncronos.
8. **Signal Forms:** formularios simples como los filtros de búsqueda utilizan Signals enlazados con `ngModel` o el nuevo enfoque de Signal Forms de Angular.
9. **Inyección con inject():** todos los servicios y dependencias se inyectan usando la función `inject()` en lugar de la inyección por constructor.
10. **HttpClient:** todas las operaciones con la API REST utilizan el servicio `HttpClient` de Angular.
11. **RxJS avanzado:** operadores como `debounceTime`, `distinctUntilChanged`, `switchMap`, `catchError`, `retry`, `forkJoin` para manejo de operaciones asíncronas complejas.
12. **Interceptors funcionales:** implementación de interceptores usando el nuevo enfoque funcional (`withInterceptors`) para:
    - Añadir token JWT a las peticiones.
    - Manejar errores globalmente y mostrar notificaciones.
    - Mostrar/ocultar un spinner de carga.
13. **Autenticación JWT:** integración con un servicio de autenticación (Firebase Auth o API simulada), almacenamiento del token, y envío en cabeceras.
14. **Pipes personalizados:** al menos dos pipes propios (filtro de productos por categoría/texto, formato de precio en euros con símbolo).
15. **Proyección de contenido:** uso de `<ng-content>` (single y multi-slot) en componentes reutilizables como cards, modales y layouts.
16. **ViewChild / ContentChild:** donde sea necesario para acceder a elementos del DOM o componentes hijos.
17. **SSR configurado:** la aplicación soporta Server-Side Rendering y al menos la página de inicio está prerenderizada.
18. **@defer:** carga diferida de componentes pesados como el mapa, la galería de imágenes o el panel de administración.
19. **Control Flow moderno:** uso exclusivo de `@if`, `@for` (con `track`), `@switch` en lugar de las directivas estructurales antiguas (`*ngIf`, `*ngFor`, `*ngSwitch`).
20. **Arquitectura escalable:** estructura feature-based con carpetas `core`, `shared` y `features`. Componentes divididos en smart (contenedores) y dumb (presentacionales).

---

## Estructura del proyecto propuesta

```
marketplace/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── cart.service.ts
│   │   │   │   ├── notification.service.ts
│   │   │   │   ├── producto.service.ts
│   │   │   │   ├── pedido.service.ts
│   │   │   │   └── usuario.service.ts
│   │   │   ├── interceptors/
│   │   │   │   ├── auth.interceptor.ts
│   │   │   │   ├── error.interceptor.ts
│   │   │   │   └── loading.interceptor.ts
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts
│   │   │   │   └── admin.guard.ts
│   │   │   ├── models/
│   │   │   │   ├── usuario.model.ts
│   │   │   │   ├── producto.model.ts
│   │   │   │   ├── carrito.model.ts
│   │   │   │   └── pedido.model.ts
│   │   │   └── core.config.ts
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   ├── card-producto/
│   │   │   │   ├── modal-confirmacion/
│   │   │   │   ├── spinner/
│   │   │   │   ├── layout/
│   │   │   │   ├── header/
│   │   │   │   └── footer/
│   │   │   ├── pipes/
│   │   │   │   ├── filtro-productos.pipe.ts
│   │   │   │   └── formato-precio.pipe.ts
│   │   │   ├── directives/
│   │   │   │   └── destacado.directive.ts
│   │   │   └── validators/
│   │   │       ├── password-match.validator.ts
│   │   │       └── dni.validator.ts
│   │   ├── features/
│   │   │   ├── home/
│   │   │   │   └── home.page.ts
│   │   │   ├── products/
│   │   │   │   ├── products.page.ts
│   │   │   │   ├── product-detail.page.ts
│   │   │   │   └── components/
│   │   │   │       ├── product-card/
│   │   │   │       ├── product-filters/
│   │   │   │       └── product-list/
│   │   │   ├── cart/
│   │   │   │   ├── cart.page.ts
│   │   │   │   └── components/
│   │   │   │       └── cart-item/
│   │   │   ├── checkout/
│   │   │   │   └── checkout.page.ts
│   │   │   ├── auth/
│   │   │   │   ├── login.page.ts
│   │   │   │   └── register.page.ts
│   │   │   ├── user/
│   │   │   │   ├── user-dashboard.page.ts
│   │   │   │   └── components/
│   │   │   │       ├── perfil/
│   │   │   │       └── pedidos-list/
│   │   │   └── admin/
│   │   │       ├── admin-dashboard.page.ts
│   │   │       ├── admin-productos.page.ts
│   │   │       └── admin-pedidos.page.ts
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── assets/
│   │   └── images/
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.development.ts
│   ├── index.html
│   ├── main.ts
│   ├── main.server.ts
│   ├── app.config.server.ts
│   └── styles.scss
├── server.ts
├── angular.json
├── package.json
└── tsconfig.json
```

### Smart Components vs Dumb Components

| Tipo | Smart (Contenedor) | Dumb (Presentacional) |
|------|-------------------|----------------------|
| **Ubicación** | `features/*/page.ts` | `shared/components/` o `features/*/components/` |
| **Responsabilidad** | Lógica de negocio, estado, llamadas API | Recibir inputs y emitir outputs |
| **Inyección** | Servicios, HttpClient | Ninguno (solo inputs/outputs) |
| **Ejemplos** | `ProductsPage`, `CartPage`, `CheckoutPage` | `ProductCard`, `CartItem`, `Spinner` |

---

## Fases del desarrollo

### Fase 1: Configuración inicial (30 minutos estimados)

#### Paso 1: Crear el proyecto Angular

```bash
# Crear un nuevo proyecto Angular standalone con routing, SCSS y SSR
ng new marketplace \
  --standalone \
  --routing \
  --style=scss \
  --ssr \
  --directory=marketplace

cd marketplace
```

Explicación de las flags:
- `--standalone`: crea el proyecto con standalone components por defecto.
- `--routing`: genera el fichero de rutas principal.
- `--style=scss`: usa SCSS como preprocesador de estilos.
- `--ssr`: configura Server-Side Rendering.

#### Paso 2: Instalar Angular Material

```bash
ng add @angular/material
```

Durante la instalación interactiva, seleccionar:
- Tema: **Indigo/Pink** (o **Deep Purple/Amber**).
- Typography: **Sí**.
- Animations: **Sí**.

Esto añade automáticamente las dependencias, configura el tema en `styles.scss` e importa los providers necesarios.

#### Paso 3: Configurar estructura de carpetas

Crear las carpetas principales según la estructura propuesta:

```bash
mkdir -p src/app/{core/{services,interceptors,guards,models},shared/{components,pipes,directives,validators},features/{home,products/components,cart/components,checkout,auth,user/components,admin}}
```

#### Paso 4: Configurar ESLint y Prettier (opcional pero recomendado)

```bash
ng add @angular-eslint/schematics
npm install --save-dev prettier eslint-config-prettier
```

#### Paso 5: Configurar variables de entorno

```typescript
// Archivo: src/environments/environment.development.ts
export const environment = {
  production: false,
  apiUrl: 'https://fakestoreapi.com',
  // Para un backend personalizado se usaría la URL local
  // apiUrl: 'http://localhost:3000/api',
  authTokenKey: 'auth_token',
  usuarioKey: 'usuario_actual'
};
```

```typescript
// Archivo: src/environments/environment.ts
export const environment = {
  production: true,
  apiUrl: 'https://fakestoreapi.com',
  authTokenKey: 'auth_token',
  usuarioKey: 'usuario_actual'
};
```

---

### Fase 2: Core y Shared (60 minutos estimados)

#### Modelos de datos

```typescript
// Archivo: src/app/core/models/producto.model.ts
export interface Producto {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

// DTO para crear/actualizar producto
export interface ProductoDTO {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}
```

```typescript
// Archivo: src/app/core/models/carrito.model.ts
import { Producto } from './producto.model';

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}
```

```typescript
// Archivo: src/app/core/models/pedido.model.ts
export interface Pedido {
  id: number;
  userId: number;
  productos: {
    productId: number;
    quantity: number;
  }[];
  fecha: string;
  estado: 'pendiente' | 'confirmado' | 'enviado' | 'entregado' | 'cancelado';
  total: number;
  direccionEnvio: DireccionEnvio;
}

export interface DireccionEnvio {
  nombre: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  telefono: string;
}
```

```typescript
// Archivo: src/app/core/models/usuario.model.ts
export interface Usuario {
  id: number;
  email: string;
  username: string;
  nombre: string;
  apellidos: string;
  direccion?: string;
  telefono?: string;
  rol: 'usuario' | 'admin';
}
```

#### CartService con Signals

Este servicio es el corazón de la funcionalidad de comercio electrónico. Utiliza Signals para estado reactivo y Effects para persistencia:

```typescript
// Archivo: src/app/core/services/cart.service.ts
import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Producto } from '../models/producto.model';
import { ItemCarrito } from '../models/carrito.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private readonly notificaciones = inject(NotificationService);

  // --- Estado: Signal privado de escritura ---
  private readonly itemsState = signal<ItemCarrito[]>(this.cargarDeStorage());

  // --- Selectores públicos de solo lectura ---
  readonly items = this.itemsState.asReadonly();

  // --- Computed: valores derivados reactivos ---

  /** Número total de items distintos en el carrito */
  readonly cantidadItems = computed(() => this.itemsState().length);

  /** Cantidad total de productos (suma de cantidades) */
  readonly cantidadTotal = computed(() =>
    this.itemsState().reduce((total, item) => total + item.cantidad, 0)
  );

  /** Suma total del carrito en euros */
  readonly totalCarrito = computed(() =>
    this.itemsState().reduce(
      (total, item) => total + item.producto.price * item.cantidad,
      0
    )
  );

  /** ¿Está vacío el carrito? */
  readonly estaVacio = computed(() => this.itemsState().length === 0);

  // --- Effect: persistencia automática en localStorage ---
  private readonly persistirEffect = effect(() => {
    // Cada vez que cambia itemsState, se guarda en localStorage
    const items = this.itemsState();
    localStorage.setItem('marketplace_cart', JSON.stringify(items));
    console.log(`[CartService] Carrito actualizado: ${items.length} items, total: ${this.totalCarrito().toFixed(2)} €`);
  });

  /**
   * Recupera el carrito guardado en localStorage al iniciar
   */
  private cargarDeStorage(): ItemCarrito[] {
    try {
      const datos = localStorage.getItem('marketplace_cart');
      return datos ? JSON.parse(datos) : [];
    } catch {
      return [];
    }
  }

  /**
   * Añade un producto al carrito. Si ya existe, incrementa la cantidad.
   */
  agregarProducto(producto: Producto, cantidad: number = 1): void {
    this.itemsState.update((items) => {
      const existente = items.find((i) => i.producto.id === producto.id);
      if (existente) {
        return items.map((i) =>
          i.producto.id === producto.id
            ? { ...i, cantidad: i.cantidad + cantidad }
            : i
        );
      }
      return [...items, { producto, cantidad }];
    });

    this.notificaciones.toast(`${producto.title} añadido al carrito`);
  }

  /**
   * Elimina un producto del carrito por su ID
   */
  eliminarProducto(productoId: number): void {
    this.itemsState.update((items) =>
      items.filter((i) => i.producto.id !== productoId)
    );
  }

  /**
   * Actualiza la cantidad de un producto en el carrito
   */
  actualizarCantidad(productoId: number, cantidad: number): void {
    if (cantidad <= 0) {
      this.eliminarProducto(productoId);
      return;
    }
    this.itemsState.update((items) =>
      items.map((i) =>
        i.producto.id === productoId ? { ...i, cantidad } : i
      )
    );
  }

  /**
   * Vacía completamente el carrito
   */
  vaciarCarrito(): void {
    this.itemsState.set([]);
    this.notificaciones.info('Carrito vaciado');
  }

  /**
   * Obtiene los items preparados para enviar al API de pedidos
   */
  obtenerItemsParaPedido(): { productId: number; quantity: number }[] {
    return this.itemsState().map((item) => ({
      productId: item.producto.id,
      quantity: item.cantidad
    }));
  }
}
```

#### ProductoService

```typescript
// Archivo: src/app/core/services/producto.service.ts
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { Producto, ProductoDTO } from '../models/producto.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/products`;

  // Signal para caché local de categorías
  readonly categorias = signal<string[]>([]);

  constructor() {
    this.cargarCategorias();
  }

  /**
   * Obtiene todos los productos (con límite opcional)
   */
  obtenerProductos(limite?: number): Observable<Producto[]> {
    let params = new HttpParams();
    if (limite) {
      params = params.set('limit', limite.toString());
    }
    return this.http.get<Producto[]>(this.apiUrl, { params });
  }

  /**
   * Obtiene un producto por su ID
   */
  obtenerProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtiene productos filtrados por categoría
   */
  obtenerPorCategoria(categoria: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/category/${categoria}`);
  }

  /**
   * Crea un nuevo producto (admin)
   */
  crearProducto(producto: ProductoDTO): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto);
  }

  /**
   * Actualiza un producto existente (admin)
   */
  actualizarProducto(id: number, producto: ProductoDTO): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, producto);
  }

  /**
   * Elimina un producto (admin)
   */
  eliminarProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Carga las categorías disponibles desde la API
   */
  private cargarCategorias(): void {
    this.http.get<string[]>(`${this.apiUrl}/categories`).subscribe({
      next: (cats) => this.categorias.set(cats),
      error: (err) => console.error('Error al cargar categorías:', err)
    });
  }
}
```

#### AuthService con Signals

```typescript
// Archivo: src/app/core/services/auth.service.ts
import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { environment } from '../../../environments/environment.development';
import { Router } from '@angular/router';

interface LoginRequest {
  username: string;
  password: string;
}

interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = environment.apiUrl;

  // --- Estado de autenticación ---
  readonly usuarioActual = signal<Usuario | null>(null);
  readonly token = signal<string | null>(null);

  // --- Computed ---
  readonly estaAutenticado = computed(() => this.token() !== null);
  readonly esAdmin = computed(() => this.usuarioActual()?.rol === 'admin');
  readonly nombreUsuario = computed(() => this.usuarioActual()?.nombre ?? '');

  // --- Effect: persistir token ---
  constructor() {
    effect(() => {
      const t = this.token();
      if (t) {
        localStorage.setItem(environment.authTokenKey, t);
      } else {
        localStorage.removeItem(environment.authTokenKey);
      }
    });

    // Restaurar sesión al iniciar
    this.restaurarSesion();
  }

  /**
   * Inicio de sesión contra la API
   */
  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, {
      username,
      password
    }).pipe(
      tap((respuesta) => {
        this.token.set(respuesta.token);
        // Tras login, obtenemos datos del usuario
        this.cargarPerfilUsuario();
        this.router.navigate(['/']);
      }),
      catchError((error) => {
        console.error('Error en login:', error);
        throw error;
      })
    );
  }

  /**
   * Registro de nuevo usuario
   */
  registro(datos: {
    email: string;
    username: string;
    password: string;
    nombre: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, {
      email: datos.email,
      username: datos.username,
      password: datos.password,
      name: {
        firstname: datos.nombre.split(' ')[0],
        lastname: datos.nombre.split(' ').slice(1).join(' ')
      }
    }).pipe(
      tap(() => {
        // Tras registro, auto-login
        this.login(datos.username, datos.password).subscribe();
      })
    );
  }

  /**
   * Carga los datos del perfil del usuario autenticado
   */
  private cargarPerfilUsuario(): void {
    this.http.get<Usuario>(`${this.apiUrl}/users/1`) // Simplificado: perfil fijo
      .subscribe({
        next: (usuario) => {
          usuario.rol = 'usuario';
          this.usuarioActual.set(usuario);
          localStorage.setItem(environment.usuarioKey, JSON.stringify(usuario));
        },
        error: (err) => console.error('Error al cargar perfil:', err)
      });
  }

  /**
   * Cierra la sesión del usuario
   */
  cerrarSesion(): void {
    this.token.set(null);
    this.usuarioActual.set(null);
    localStorage.removeItem(environment.usuarioKey);
    this.router.navigate(['/auth/login']);
  }

  /**
   * Intenta restaurar una sesión previa desde localStorage
   */
  private restaurarSesion(): void {
    const tokenGuardado = localStorage.getItem(environment.authTokenKey);
    const usuarioGuardado = localStorage.getItem(environment.usuarioKey);

    if (tokenGuardado && usuarioGuardado) {
      try {
        this.token.set(tokenGuardado);
        this.usuarioActual.set(JSON.parse(usuarioGuardado));
      } catch {
        localStorage.removeItem(environment.authTokenKey);
        localStorage.removeItem(environment.usuarioKey);
      }
    }
  }

  /**
   * Obtiene las cabeceras HTTP con el token de autorización
   */
  obtenerCabecerasAuth(): HttpHeaders {
    const t = this.token();
    return new HttpHeaders({
      Authorization: t ? `Bearer ${t}` : ''
    });
  }
}
```

#### Interceptor de autenticación (funcional)

```typescript
// Archivo: src/app/core/interceptors/auth.interceptor.ts
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Interceptor funcional que añade el token JWT automáticamente
 * a todas las peticiones salientes.
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  const token = authService.token();

  // Si hay token, clonamos la petición añadiendo la cabecera Authorization
  if (token) {
    const peticionAutenticada = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(peticionAutenticada);
  }

  // Sin token, la petición sigue sin modificar
  return next(req);
};
```

#### Interceptor de errores (funcional)

```typescript
// Archivo: src/app/core/interceptors/error.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificaciones = inject(NotificationService);
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let mensaje = 'Ha ocurrido un error inesperado.';

      switch (error.status) {
        case 0:
          mensaje = 'No se puede conectar con el servidor. Verifica tu conexión a Internet.';
          break;
        case 400:
          mensaje = error.error?.message || 'Datos inválidos. Revisa el formulario.';
          break;
        case 401:
          mensaje = 'Sesión expirada. Inicia sesión de nuevo.';
          authService.cerrarSesion();
          router.navigate(['/auth/login']);
          break;
        case 403:
          mensaje = 'No tienes permisos para realizar esta acción.';
          break;
        case 404:
          mensaje = 'Recurso no encontrado.';
          break;
        case 409:
          mensaje = 'Conflicto: el recurso ya existe.';
          break;
        case 422:
          mensaje = 'Error de validación en el servidor.';
          break;
        case 429:
          mensaje = 'Demasiadas peticiones. Espera un momento.';
          break;
        case 500:
        case 502:
        case 503:
          mensaje = 'Error del servidor. Inténtalo más tarde.';
          break;
      }

      notificaciones.error(mensaje);
      return throwError(() => error);
    })
  );
};
```

#### Interceptor de carga (spinner)

```typescript
// Archivo: src/app/core/interceptors/loading.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

/**
 * Interceptor que rastrea las peticiones HTTP activas
 * para mostrar/ocultar un spinner de carga global.
 */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // Ignoramos ciertas URLs que no deben mostrar spinner
  const ignorar = req.url.includes('/auth/refresh') || req.url.includes('/api/status');
  if (!ignorar) {
    loadingService.incrementarPeticion();
  }

  return next(req).pipe(
    finalize(() => {
      if (!ignorar) {
        loadingService.decrementarPeticion();
      }
    })
  );
};
```

```typescript
// Archivo: src/app/core/services/loading.service.ts
import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private peticionesActivas = signal(0);
  readonly cargando = computed(() => this.peticionesActivas() > 0);

  incrementarPeticion(): void {
    this.peticionesActivas.update((n) => n + 1);
  }

  decrementarPeticion(): void {
    this.peticionesActivas.update((n) => Math.max(0, n - 1));
  }
}
```

#### Guards funcionales

```typescript
// Archivo: src/app/core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard funcional: permite el acceso solo a usuarios autenticados.
 * Redirige a /auth/login si no hay sesión activa.
 */
export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.estaAutenticado()) {
    return true;
  }

  // Guardamos la URL para redirigir tras login
  return router.createUrlTree(['/auth/login']);
};
```

```typescript
// Archivo: src/app/core/guards/admin.guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

/**
 * Guard funcional: permite el acceso solo a administradores.
 */
export const adminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificaciones = inject(NotificationService);

  if (authService.esAdmin()) {
    return true;
  }

  notificaciones.advertencia('Acceso restringido a administradores.');
  return router.createUrlTree(['/']);
};
```

#### Pipes personalizados

```typescript
// Archivo: src/app/shared/pipes/formato-precio.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatoPrecio',
  standalone: true
})
export class FormatoPrecioPipe implements PipeTransform {

  /**
   * Formatea un número como precio en euros
   * @param valor - El valor numérico a formatear
   * @param simbolo - Símbolo de moneda (por defecto '€')
   * @returns Cadena formateada: "1.234,56 €"
   */
  transform(valor: number | null | undefined, simbolo: string = '€'): string {
    if (valor === null || valor === undefined || isNaN(valor)) {
      return `0,00 ${simbolo}`;
    }

    const formateado = valor
      .toFixed(2)
      .replace('.', ',')
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `${formateado} ${simbolo}`;
  }
}
```

```typescript
// Archivo: src/app/shared/pipes/filtro-productos.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { Producto } from '../../core/models/producto.model';

@Pipe({
  name: 'filtroProductos',
  standalone: true,
  // pure: false permitiría detección de cambios más agresiva
  // pero no es recomendable por rendimiento. Usar signals en su lugar.
})
export class FiltroProductosPipe implements PipeTransform {

  /**
   * Filtra productos por texto de búsqueda y categoría
   */
  transform(
    productos: Producto[] | null,
    terminoBusqueda: string = '',
    categoria: string = ''
  ): Producto[] {
    if (!productos) return [];

    let resultado = productos;

    if (terminoBusqueda.trim()) {
      const termino = terminoBusqueda.toLowerCase().trim();
      resultado = resultado.filter(
        (p) =>
          p.title.toLowerCase().includes(termino) ||
          p.description.toLowerCase().includes(termino)
      );
    }

    if (categoria && categoria !== 'todas') {
      resultado = resultado.filter((p) => p.category === categoria);
    }

    return resultado;
  }
}
```

#### Configuración de la aplicación (app.config.ts con SSR)

```typescript
// Archivo: src/app/app.config.ts
import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Router con preloading de todos los módulos lazy
    provideRouter(routes, withPreloading(PreloadAllModules)),

    // HttpClient con interceptores funcionales y fetch API (para SSR)
    provideHttpClient(
      withFetch(),
      withInterceptors([
        authInterceptor,
        errorInterceptor,
        loadingInterceptor
      ])
    ),

    // Animaciones de Angular Material
    provideAnimationsAsync(),

    // Client hydration para SSR
    provideClientHydration(withEventReplay()),

    // Zoneless (opcional, mejora rendimiento eliminando Zone.js)
    // provideExperimentalZonelessChangeDetection(),
  ]
};
```

#### Configuración de rutas principal

```typescript
// Archivo: src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  // Ruta por defecto: página de inicio
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.page').then((m) => m.HomePage)
  },

  // Catálogo de productos
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/products.page').then((m) => m.ProductsPage)
  },

  // Detalle de producto con parámetro dinámico
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./features/products/product-detail.page').then(
        (m) => m.ProductDetailPage
      )
  },

  // Carrito de compras
  {
    path: 'cart',
    loadComponent: () =>
      import('./features/cart/cart.page').then((m) => m.CartPage)
  },

  // Checkout (requiere autenticación)
  {
    path: 'checkout',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/checkout/checkout.page').then((m) => m.CheckoutPage)
  },

  // Autenticación (login y registro)
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES)
  },

  // Panel de usuario (requiere autenticación)
  {
    path: 'user',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/user/user.routes').then((m) => m.USER_ROUTES)
  },

  // Panel de administración (requiere rol admin)
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () =>
      import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES)
  },

  // Página no encontrada
  {
    path: '**',
    loadComponent: () =>
      import('./shared/components/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      )
  }
];
```

---

### Fase 3: Autenticación (60 minutos estimados)

#### Login Page con Reactive Forms

```typescript
// Archivo: src/app/features/auth/login.page.ts
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { RouterModule, Router } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="auth-container">
      <mat-card class="auth-card">
        <mat-card-header>
          <mat-card-title>Iniciar sesión</mat-card-title>
          <mat-card-subtitle>Accede a tu cuenta de Marketplace</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Usuario</mat-label>
              <input matInput formControlName="username" placeholder="Tu nombre de usuario" />
              <mat-icon matPrefix>person</mat-icon>
              @if (loginForm.get('username')?.invalid && loginForm.get('username')?.touched) {
                <mat-error>El usuario es obligatorio</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Contraseña</mat-label>
              <input matInput formControlName="password"
                     [type]="ocultarPassword() ? 'password' : 'text'" />
              <mat-icon matPrefix>lock</mat-icon>
              <button mat-icon-button matSuffix type="button"
                      (click)="ocultarPassword.set(!ocultarPassword())">
                <mat-icon>{{ ocultarPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                <mat-error>La contraseña debe tener al menos 6 caracteres</mat-error>
              }
            </mat-form-field>

            @if (enviando()) {
              <mat-progress-spinner mode="indeterminate" diameter="30" class="spinner-auth"></mat-progress-spinner>
            }

            <button mat-raised-button color="primary" type="submit"
                    class="full-width" [disabled]="loginForm.invalid || enviando()">
              Iniciar sesión
            </button>
          </form>

          <div class="auth-links">
            <p>¿No tienes cuenta? <a routerLink="/auth/register">Regístrate aquí</a></p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 120px);
      padding: 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .auth-card {
      width: 100%;
      max-width: 420px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    }
    .full-width { width: 100%; }
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-top: 16px;
    }
    .auth-links { text-align: center; margin-top: 16px; }
    .spinner-auth { margin: 0 auto; }
  `]
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notificaciones = inject(NotificationService);

  // Estado local
  enviando = signal(false);
  ocultarPassword = signal(true);

  // Formulario reactivo
  loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.getRawValue();
    this.enviando.set(true);

    this.authService.login(username, password).subscribe({
      next: () => {
        this.notificaciones.exito('¡Bienvenido/a de nuevo!');
        this.router.navigate(['/']);
      },
      error: () => {
        this.enviando.set(false);
        this.notificaciones.error('Usuario o contraseña incorrectos.');
      }
    });
  }
}
```

#### Register Page

```typescript
// Archivo: src/app/features/auth/register.page.ts
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';
import { passwordMatchValidator } from '../../shared/validators/password-match.validator';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="auth-container">
      <mat-card class="auth-card">
        <mat-card-header>
          <mat-card-title>Crear cuenta</mat-card-title>
          <mat-card-subtitle>Únete a Marketplace</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nombre completo</mat-label>
              <input matInput formControlName="nombre" />
              <mat-icon matPrefix>badge</mat-icon>
              @if (campoInvalido('nombre')) {
                <mat-error>El nombre es obligatorio</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Correo electrónico</mat-label>
              <input matInput formControlName="email" type="email" />
              <mat-icon matPrefix>email</mat-icon>
              @if (campoInvalido('email')) {
                <mat-error>Introduce un email válido</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nombre de usuario</mat-label>
              <input matInput formControlName="username" />
              <mat-icon matPrefix>person</mat-icon>
              @if (campoInvalido('username')) {
                <mat-error>Mínimo 3 caracteres</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Contraseña</mat-label>
              <input matInput formControlName="password" type="password" />
              <mat-icon matPrefix>lock</mat-icon>
              @if (campoInvalido('password')) {
                <mat-error>Mínimo 6 caracteres</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Confirmar contraseña</mat-label>
              <input matInput formControlName="confirmarPassword" type="password" />
              <mat-icon matPrefix>lock</mat-icon>
              @if (registerForm.hasError('passwordMismatch') && registerForm.get('confirmarPassword')?.touched) {
                <mat-error>Las contraseñas no coinciden</mat-error>
              }
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit"
                    class="full-width" [disabled]="registerForm.invalid">
              Crear cuenta
            </button>
          </form>
          <div class="auth-links">
            <p>¿Ya tienes cuenta? <a routerLink="/auth/login">Inicia sesión</a></p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [/* Mismos estilos que login */]
})
export class RegisterPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly notificaciones = inject(NotificationService);
  private readonly router = inject(Router);

  registerForm = this.fb.nonNullable.group(
    {
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', [Validators.required]]
    },
    {
      validators: [passwordMatchValidator('password', 'confirmarPassword')]
    }
  );

  campoInvalido(campo: string): boolean {
    const control = this.registerForm.get(campo);
    return !!(control?.invalid && control?.touched);
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { nombre, email, username, password } = this.registerForm.getRawValue();
    this.authService.registro({ nombre, email, username, password }).subscribe({
      next: () => {
        this.notificaciones.exito('Cuenta creada correctamente');
        this.router.navigate(['/']);
      },
      error: () => {
        this.notificaciones.error('Error al crear la cuenta.');
      }
    });
  }
}
```

#### Validador personalizado: contraseñas coincidentes

```typescript
// Archivo: src/app/shared/validators/password-match.validator.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(
  passwordControlName: string,
  confirmPasswordControlName: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get(passwordControlName);
    const confirmPassword = control.get(confirmPasswordControlName);

    if (!password || !confirmPassword) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ ...confirmPassword.errors, passwordMismatch: true });
      return { passwordMismatch: true };
    }

    // Limpiar error si las contraseñas ya coinciden
    if (confirmPassword.hasError('passwordMismatch')) {
      const errors = { ...confirmPassword.errors };
      delete errors['passwordMismatch'];
      confirmPassword.setErrors(Object.keys(errors).length ? errors : null);
    }

    return null;
  };
}
```

---

### Fase 4: Catálogo de productos (90 minutos estimados)

#### ProductsPage (Smart Component)

```typescript
// Archivo: src/app/features/products/products.page.ts
import { Component, inject, OnInit, signal, computed, effect } from '@angular/core';
import { ProductoService } from '../../core/services/producto.service';
import { CartService } from '../../core/services/cart.service';
import { Producto } from '../../core/models/producto.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FiltroProductosPipe } from '../../shared/pipes/filtro-productos.pipe';
import { FormatoPrecioPipe } from '../../shared/pipes/formato-precio.pipe';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatBadgeModule,
    MatTooltipModule,
    FormsModule,
    RouterModule,
    FiltroProductosPipe,
    FormatoPrecioPipe
  ],
  template: `
    <div class="products-page">
      <h1>Catálogo de Productos</h1>

      <!-- Filtros y búsqueda -->
      <div class="filters-container">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar productos</mat-label>
          <input matInput [(ngModel)]="terminoBusqueda"
                 placeholder="Ej: camiseta, electrónica..."
                 (input)="onBusquedaChange($event)" />
          <mat-icon matPrefix>search</mat-icon>
          @if (terminoBusqueda()) {
            <button mat-icon-button matSuffix (click)="terminoBusqueda.set('')">
              <mat-icon>close</mat-icon>
            </button>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Categoría</mat-label>
          <mat-select [(ngModel)]="categoriaSeleccionada">
            <mat-option value="todas">Todas las categorías</mat-option>
            @for (cat of productoService.categorias(); track cat) {
              <mat-option [value]="cat">{{ cat | titlecase }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      </div>

      <!-- Spinner de carga -->
      @if (cargando()) {
        <div class="spinner-container">
          <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
        </div>
      }

      <!-- Grid de productos con nuevo @for y track -->
      @if (!cargando()) {
        <div class="products-grid">
          @for (producto of productosFiltrados(); track producto.id) {
            <mat-card class="product-card" appearance="outlined">
              <div class="product-image-container"
                   [routerLink]="['/products', producto.id]">
                <img mat-card-image [src]="producto.image"
                     [alt]="producto.title" loading="lazy" />
              </div>
              <mat-card-content>
                <mat-chip-set>
                  <mat-chip>{{ producto.category }}</mat-chip>
                </mat-chip-set>
                <h3 class="product-title" [routerLink]="['/products', producto.id]">
                  {{ producto.title }}
                </h3>
                <div class="product-rating">
                  <mat-icon class="star-icon">star</mat-icon>
                  <span>{{ producto.rating.rate }} ({{ producto.rating.count }})</span>
                </div>
                <p class="product-price">{{ producto.price | formatoPrecio }}</p>
              </mat-card-content>
              <mat-card-actions>
                <button mat-raised-button color="primary"
                        (click)="agregarAlCarrito(producto)">
                  <mat-icon>add_shopping_cart</mat-icon>
                  Añadir al carrito
                </button>
              </mat-card-actions>
            </mat-card>
          } @empty {
            <div class="no-results">
              <mat-icon>search_off</mat-icon>
              <p>No se encontraron productos con los filtros actuales.</p>
            </div>
          }
        </div>
      }

      <!-- Paginación -->
      @if (!cargando() && productosFiltrados().length > 0) {
        <mat-paginator
          [length]="productosFiltrados().length"
          [pageSize]="pageSize()"
          [pageSizeOptions]="[8, 12, 24, 48]"
          (page)="onPageChange($event)">
        </mat-paginator>
      }
    </div>
  `,
  styles: [`
    .products-page { padding: 24px; max-width: 1400px; margin: 0 auto; }
    .filters-container {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    .search-field { flex: 1; min-width: 250px; }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
    }
    .product-card {
      display: flex;
      flex-direction: column;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .product-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }
    .product-image-container {
      cursor: pointer;
      height: 260px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      background: #fafafa;
      overflow: hidden;
    }
    .product-image-container img {
      max-height: 100%;
      max-width: 100%;
      object-fit: contain;
    }
    .product-title {
      cursor: pointer;
      font-size: 1rem;
      margin: 8px 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .product-price {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1976d2;
    }
    .product-rating {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #666;
      font-size: 0.875rem;
    }
    .star-icon { color: #ffc107; font-size: 1rem; width: 16px; height: 16px; }
    .spinner-container {
      display: flex;
      justify-content: center;
      padding: 80px 0;
    }
    .no-results {
      text-align: center;
      padding: 60px 0;
      color: #999;
    }
  `]
})
export class ProductsPage implements OnInit {

  readonly productoService = inject(ProductoService);
  readonly cartService = inject(CartService);

  // --- Estado con Signals ---
  productos = signal<Producto[]>([]);
  cargando = signal(true);
  terminoBusqueda = signal('');
  categoriaSeleccionada = signal('todas');

  // Paginación
  pageSize = signal(12);
  paginaActual = signal(0);

  // RxJS Subject para debounce en la búsqueda
  private busquedaSubject = new Subject<string>();
  private busquedaSubscription: any;

  ngOnInit(): void {
    this.cargarProductos();

    // Configurar debounce para el buscador
    this.busquedaSubscription = this.busquedaSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((termino) => {
        this.terminoBusqueda.set(termino);
      });
  }

  private cargarProductos(): void {
    this.cargando.set(true);
    this.productoService.obtenerProductos(50).subscribe({
      next: (productos) => {
        this.productos.set(productos);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
      }
    });
  }

  // --- Filtrado reactivo con computed ---
  readonly productosFiltrados = computed(() => {
    let resultado = this.productos();

    const termino = this.terminoBusqueda().toLowerCase().trim();
    if (termino) {
      resultado = resultado.filter(
        (p) =>
          p.title.toLowerCase().includes(termino) ||
          p.description.toLowerCase().includes(termino) ||
          p.category.toLowerCase().includes(termino)
      );
    }

    const categoria = this.categoriaSeleccionada();
    if (categoria && categoria !== 'todas') {
      resultado = resultado.filter((p) => p.category === categoria);
    }

    return resultado;
  });

  // --- Eventos ---
  onBusquedaChange(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    this.busquedaSubject.next(valor);
  }

  onPageChange(event: PageEvent): void {
    this.paginaActual.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  agregarAlCarrito(producto: Producto): void {
    this.cartService.agregarProducto(producto);
  }
}
```

#### ProductDetailPage con @defer

```typescript
// Archivo: src/app/features/products/product-detail.page.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductoService } from '../../core/services/producto.service';
import { CartService } from '../../core/services/cart.service';
import { Producto } from '../../core/models/producto.model';
import { FormatoPrecioPipe } from '../../shared/pipes/formato-precio.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    FormatoPrecioPipe
  ],
  template: `
    <div class="product-detail">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <a routerLink="/">Inicio</a> /
        <a routerLink="/products">Productos</a> /
        <span>{{ producto()?.title }}</span>
      </nav>

      @if (cargando()) {
        <div class="spinner-container">
          <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
        </div>
      } @else if (producto()) {
        <div class="product-layout">
          <!-- Galería de imágenes (carga diferida) -->
          <div class="product-gallery">
            @defer (on viewport) {
              <img [src]="producto()?.image" [alt]="producto()?.title"
                   class="main-image" />
            } @placeholder {
              <div class="image-placeholder">
                <mat-icon>image</mat-icon>
                <span>Cargando imagen...</span>
              </div>
            }
          </div>

          <!-- Detalles del producto -->
          <div class="product-info">
            <mat-chip-set>
              <mat-chip>{{ producto()?.category }}</mat-chip>
            </mat-chip-set>

            <h1 class="product-name">{{ producto()?.title }}</h1>

            <div class="rating-section">
              <mat-icon class="star">star</mat-icon>
              <strong>{{ producto()?.rating?.rate }}</strong>
              <span class="text-muted">({{ producto()?.rating?.count }} valoraciones)</span>
            </div>

            <div class="price-section">
              <span class="price">{{ producto()?.price | formatoPrecio }}</span>
              <span class="iva-label">IVA incluido</span>
            </div>

            <mat-divider></mat-divider>

            <div class="description-section">
              <h3>Descripción</h3>
              <p>{{ producto()?.description }}</p>
            </div>

            <mat-divider></mat-divider>

            <div class="actions-section">
              <mat-form-field class="quantity-field" appearance="outline">
                <mat-label>Cantidad</mat-label>
                <input matInput type="number" [ngModel]="cantidad()"
                       (ngModelChange)="actualizarCantidad($event)" min="1" max="99" />
              </mat-form-field>

              <button mat-raised-button color="primary" class="add-to-cart-btn"
                      (click)="agregarAlCarrito()">
                <mat-icon>add_shopping_cart</mat-icon>
                Añadir al carrito
              </button>
            </div>

            <div class="extra-info">
              <div class="info-item">
                <mat-icon>local_shipping</mat-icon>
                <span>Envío gratis en pedidos superiores a 50 €</span>
              </div>
              <div class="info-item">
                <mat-icon>verified</mat-icon>
                <span>Producto verificado</span>
              </div>
              <div class="info-item">
                <mat-icon>undo</mat-icon>
                <span>Devolución gratuita en 30 días</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Productos relacionados (carga diferida) -->
        @defer (on viewport) {
          <div class="related-products">
            <h2>Productos relacionados</h2>
            <!-- Aquí se cargarían productos de la misma categoría -->
          </div>
        } @placeholder {
          <div class="related-placeholder">
            <p>Cargando productos relacionados...</p>
          </div>
        }
      } @else {
        <div class="not-found">
          <mat-icon>error_outline</mat-icon>
          <h2>Producto no encontrado</h2>
          <a routerLink="/products">Volver al catálogo</a>
        </div>
      }
    </div>
  `,
  styles: [`
    .product-detail { max-width: 1200px; margin: 0 auto; padding: 24px; }
    .breadcrumb { margin-bottom: 24px; color: #666; }
    .breadcrumb a { color: #1976d2; text-decoration: none; }
    .product-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }
    @media (max-width: 768px) { .product-layout { grid-template-columns: 1fr; } }
    .product-gallery { background: #fafafa; padding: 24px; border-radius: 12px; }
    .main-image { width: 100%; height: auto; object-fit: contain; }
    .image-placeholder {
      width: 100%; height: 400px; display: flex; flex-direction: column;
      align-items: center; justify-content: center; background: #f0f0f0;
    }
    .price-section { margin: 16px 0; }
    .price { font-size: 2rem; font-weight: 700; color: #1976d2; }
    .iva-label { font-size: 0.875rem; color: #666; margin-left: 8px; }
    .description-section { margin: 16px 0; }
    .actions-section { display: flex; gap: 16px; align-items: center; margin: 16px 0; }
    .quantity-field { width: 100px; }
    .add-to-cart-btn { flex: 1; }
    .extra-info { margin-top: 24px; }
    .info-item { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; color: #555; }
    .not-found { text-align: center; padding: 60px 0; }
  `]
})
export class ProductDetailPage implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly productoService = inject(ProductoService);
  private readonly cartService = inject(CartService);

  producto = signal<Producto | null>(null);
  cargando = signal(true);
  cantidad = signal(1);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.productoService.obtenerProducto(id).subscribe({
        next: (producto) => {
          this.producto.set(producto);
          this.cargando.set(false);
        },
        error: () => {
          this.cargando.set(false);
        }
      });
    }
  }

  actualizarCantidad(valor: number): void {
    if (valor >= 1 && valor <= 99) {
      this.cantidad.set(valor);
    }
  }

  agregarAlCarrito(): void {
    const prod = this.producto();
    if (prod) {
      this.cartService.agregarProducto(prod, this.cantidad());
    }
  }
}
```

---

### Fase 5: Carrito de compras (60 minutos estimados)

#### CartPage

```typescript
// Archivo: src/app/features/cart/cart.page.ts
import { Component, inject } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { NotificationService } from '../../core/services/notification.service';
import { RouterModule, Router } from '@angular/router';
import { FormatoPrecioPipe } from '../../shared/pipes/formato-precio.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    FormatoPrecioPipe
  ],
  template: `
    <div class="cart-page">
      <h1>Tu carrito de compras</h1>

      @if (cartService.estaVacio()) {
        <div class="empty-cart">
          <mat-icon class="empty-icon">shopping_cart</mat-icon>
          <h2>Tu carrito está vacío</h2>
          <p>Añade productos desde nuestro catálogo</p>
          <a mat-raised-button color="primary" routerLink="/products">
            Ir al catálogo
          </a>
        </div>
      } @else {
        <div class="cart-layout">
          <!-- Lista de items -->
          <div class="cart-items">
            @for (item of cartService.items(); track item.producto.id) {
              <mat-card class="cart-item" appearance="outlined">
                <div class="item-layout">
                  <img [src]="item.producto.image"
                       [alt]="item.producto.title"
                       class="item-image" />
                  <div class="item-details">
                    <h3 class="item-title">{{ item.producto.title }}</h3>
                    <p class="item-category">{{ item.producto.category }}</p>
                    <p class="item-price">
                      {{ item.producto.price | formatoPrecio }}
                    </p>
                  </div>
                  <div class="item-actions">
                    <div class="quantity-controls">
                      <button mat-icon-button
                              (click)="cartService.actualizarCantidad(item.producto.id, item.cantidad - 1)"
                              [disabled]="item.cantidad <= 1">
                        <mat-icon>remove</mat-icon>
                      </button>
                      <span class="quantity">{{ item.cantidad }}</span>
                      <button mat-icon-button
                              (click)="cartService.actualizarCantidad(item.producto.id, item.cantidad + 1)">
                        <mat-icon>add</mat-icon>
                      </button>
                    </div>
                    <p class="item-subtotal">
                      {{ (item.producto.price * item.cantidad) | formatoPrecio }}
                    </p>
                    <button mat-icon-button color="warn"
                            (click)="confirmarEliminar(item.producto.id, item.producto.title)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </div>
              </mat-card>
            }
          </div>

          <!-- Resumen del carrito -->
          <mat-card class="cart-summary" appearance="outlined">
            <mat-card-header>
              <mat-card-title>Resumen del pedido</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="summary-row">
                <span>Productos ({{ cartService.cantidadItems() }})</span>
                <span>{{ cartService.totalCarrito() | formatoPrecio }}</span>
              </div>
              <div class="summary-row">
                <span>Envío</span>
                <span class="free-shipping">
                  {{ cartService.totalCarrito() > 50 ? 'Gratis' : (5.99 | formatoPrecio) }}
                </span>
              </div>
              <mat-divider></mat-divider>
              <div class="summary-row total">
                <span>Total</span>
                <span>{{ totalConEnvio() | formatoPrecio }}</span>
              </div>

              <button mat-raised-button color="primary" class="checkout-btn full-width"
                      routerLink="/checkout">
                <mat-icon>shopping_cart_checkout</mat-icon>
                Proceder al pago
              </button>

              <button mat-button color="warn" class="full-width"
                      (click)="vaciarCarrito()">
                <mat-icon>delete_sweep</mat-icon>
                Vaciar carrito
              </button>
            </mat-card-content>
          </mat-card>
        </div>
      }
    </div>
  `,
  styles: [`
    .cart-page { max-width: 1200px; margin: 0 auto; padding: 24px; }
    .cart-layout {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 24px;
      align-items: start;
    }
    @media (max-width: 768px) { .cart-layout { grid-template-columns: 1fr; } }
    .empty-cart { text-align: center; padding: 80px 0; }
    .empty-icon { font-size: 64px; width: 64px; height: 64px; color: #ccc; }
    .cart-item { margin-bottom: 16px; }
    .item-layout { display: flex; gap: 16px; padding: 16px; align-items: center; }
    .item-image { width: 90px; height: 90px; object-fit: contain; }
    .item-details { flex: 1; }
    .item-title { font-size: 1rem; margin: 0; }
    .item-category { color: #888; font-size: 0.8rem; }
    .item-actions { display: flex; flex-direction: column; align-items: center; gap: 8px; }
    .quantity-controls { display: flex; align-items: center; }
    .quantity { font-size: 1.1rem; font-weight: 600; min-width: 30px; text-align: center; }
    .item-subtotal { font-weight: 700; color: #1976d2; font-size: 1.1rem; }
    .cart-summary { position: sticky; top: 24px; }
    .summary-row { display: flex; justify-content: space-between; margin: 12px 0; }
    .total { font-size: 1.2rem; font-weight: 700; }
    .free-shipping { color: #2e7d32; font-weight: 600; }
    .checkout-btn { margin: 16px 0 8px; }
    .full-width { width: 100%; }
  `]
})
export class CartPage {
  readonly cartService = inject(CartService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  // Computed para total con envío
  totalConEnvio = computed(() => {
    const subtotal = this.cartService.totalCarrito();
    return subtotal > 50 ? subtotal : subtotal + 5.99;
  });

  async confirmarEliminar(id: number, nombre: string): Promise<void> {
    const confirmado = await this.notificationService.confirmar(
      `¿Eliminar "${nombre}" del carrito?`
    );
    if (confirmado) {
      this.cartService.eliminarProducto(id);
    }
  }

  async vaciarCarrito(): Promise<void> {
    const confirmado = await this.notificationService.confirmar(
      '¿Estás seguro de que quieres vaciar el carrito completo?'
    );
    if (confirmado) {
      this.cartService.vaciarCarrito();
    }
  }
}
```

---

### Fase 6: Checkout y pedidos (60 minutos estimados)

#### CheckoutPage con Reactive Forms y validación

```typescript
// Archivo: src/app/features/checkout/checkout.page.ts
import { Component, inject, computed } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { PedidoService } from '../../core/services/pedido.service';
import { NotificationService } from '../../core/services/notification.service';
import { Router } from '@angular/router';
import { FormatoPrecioPipe } from '../../shared/pipes/formato-precio.pipe';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    MatDividerModule,
    MatRadioModule,
    FormatoPrecioPipe
  ],
  template: `
    <div class="checkout-page">
      <h1>Finalizar pedido</h1>

      @if (cartService.estaVacio()) {
        <div class="empty-checkout">
          <mat-icon>shopping_basket</mat-icon>
          <p>No hay productos en tu carrito.</p>
          <a mat-raised-button color="primary" routerLink="/products">Ir al catálogo</a>
        </div>
      } @else {
        <mat-horizontal-stepper linear #stepper>
          <!-- Paso 1: Dirección de envío -->
          <mat-step [stepControl]="direccionForm" label="Dirección de envío">
            <form [formGroup]="direccionForm">
              <div class="form-grid">
                <mat-form-field appearance="outline">
                  <mat-label>Nombre completo</mat-label>
                  <input matInput formControlName="nombre" />
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Teléfono</mat-label>
                  <input matInput formControlName="telefono" type="tel" />
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-grid">
                  <mat-label>Dirección</mat-label>
                  <input matInput formControlName="direccion" />
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Ciudad</mat-label>
                  <input matInput formControlName="ciudad" />
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Código postal</mat-label>
                  <input matInput formControlName="codigoPostal" />
                </mat-form-field>
              </div>

              <div class="step-actions">
                <button mat-button matStepperNext [disabled]="direccionForm.invalid">
                  Siguiente
                </button>
              </div>
            </form>
          </mat-step>

          <!-- Paso 2: Resumen y confirmación -->
          <mat-step label="Confirmar pedido">
            <div class="confirmation-section">
              <h3>Dirección de envío</h3>
              <p>{{ direccionForm.get('nombre')?.value }}</p>
              <p>{{ direccionForm.get('direccion')?.value }}</p>
              <p>{{ direccionForm.get('ciudad')?.value }}, {{ direccionForm.get('codigoPostal')?.value }}</p>
              <p>Tel: {{ direccionForm.get('telefono')?.value }}</p>

              <mat-divider></mat-divider>

              <h3>Productos</h3>
              @for (item of cartService.items(); track item.producto.id) {
                <div class="confirm-item">
                  <img [src]="item.producto.image" width="50" />
                  <span>{{ item.producto.title }} x{{ item.cantidad }}</span>
                  <span>{{ (item.producto.price * item.cantidad) | formatoPrecio }}</span>
                </div>
              }

              <mat-divider></mat-divider>

              <div class="total-section">
                <span>Total a pagar</span>
                <span class="total-amount">{{ cartService.totalCarrito() | formatoPrecio }}</span>
              </div>

              <div class="step-actions">
                <button mat-button matStepperPrevious>Volver</button>
                <button mat-raised-button color="primary"
                        (click)="confirmarPedido()"
                        [disabled]="procesando()">
                  @if (procesando()) {
                    <mat-icon class="spin">sync</mat-icon>
                    Procesando...
                  } @else {
                    <mat-icon>check</mat-icon>
                    Confirmar pedido
                  }
                </button>
              </div>
            </div>
          </mat-step>

          <!-- Paso 3: Confirmación -->
          <mat-step label="Pedido realizado">
            <div class="success-section">
              <mat-icon class="success-icon">check_circle</mat-icon>
              <h2>¡Pedido confirmado!</h2>
              <p>Tu pedido ha sido procesado correctamente.</p>
              <p>Recibirás un email con los detalles del envío.</p>
              <button mat-raised-button color="primary" routerLink="/">
                Volver a la tienda
              </button>
            </div>
          </mat-step>
        </mat-horizontal-stepper>
      }
    </div>
  `,
  styles: [`
    .checkout-page { max-width: 900px; margin: 0 auto; padding: 24px; }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .full-grid { grid-column: 1 / -1; }
    @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } }
    .step-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; }
    .confirm-item { display: flex; align-items: center; gap: 16px; margin: 8px 0; }
    .total-section { display: flex; justify-content: space-between; margin: 16px 0; }
    .total-amount { font-size: 1.5rem; font-weight: 700; color: #1976d2; }
    .success-section { text-align: center; padding: 40px; }
    .success-icon { font-size: 80px; width: 80px; height: 80px; color: #4caf50; }
    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { 100% { transform: rotate(360deg); } }
  `]
})
export class CheckoutPage {
  private readonly fb = inject(FormBuilder);
  readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);
  private readonly pedidoService = inject(PedidoService);
  private readonly notificaciones = inject(NotificationService);
  private readonly router = inject(Router);

  procesando = signal(false);

  direccionForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    telefono: ['', [Validators.required, Validators.pattern(/^[6-9]\d{8}$/)]],
    direccion: ['', [Validators.required, Validators.minLength(5)]],
    ciudad: ['', [Validators.required]],
    codigoPostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]]
  });

  async confirmarPedido(): Promise<void> {
    if (this.direccionForm.invalid) {
      this.notificaciones.error('Revisa los campos del formulario.');
      return;
    }

    const confirmado = await this.notificaciones.confirmar(
      '¿Confirmas el pedido? Se procesará el pago.'
    );
    if (!confirmado) return;

    this.procesando.set(true);

    const direccion = this.direccionForm.getRawValue();
    const usuario = this.authService.usuarioActual();

    if (!usuario) {
      this.notificaciones.error('Debes iniciar sesión para realizar un pedido.');
      this.procesando.set(false);
      return;
    }

    this.pedidoService.crearPedido({
      userId: usuario.id,
      productos: this.cartService.obtenerItemsParaPedido(),
      direccionEnvio: direccion
    }).subscribe({
      next: () => {
        this.cartService.vaciarCarrito();
        this.procesando.set(false);
      },
      error: () => {
        this.procesando.set(false);
        this.notificaciones.error('Error al procesar el pedido.');
      }
    });
  }
}
```

---

### Fase 7: Panel de administración (60 minutos estimados)

```typescript
// Archivo: src/app/features/admin/admin-productos.page.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductoService } from '../../core/services/producto.service';
import { NotificationService } from '../../core/services/notification.service';
import { Producto } from '../../core/models/producto.model';
import { FormatoPrecioPipe } from '../../shared/pipes/formato-precio.pipe';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatProgressSpinnerModule,
    FormatoPrecioPipe
  ],
  template: `
    <div class="admin-page">
      <h1>Gestión de Productos</h1>

      <!-- Formulario de nuevo producto -->
      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>{{ editandoId() ? 'Editar producto' : 'Nuevo producto' }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="productoForm" (ngSubmit)="guardarProducto()"
                class="producto-form">
            <div class="form-grid">
              <mat-form-field appearance="outline" class="full-grid">
                <mat-label>Título</mat-label>
                <input matInput formControlName="title" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Precio</mat-label>
                <input matInput formControlName="price" type="number" step="0.01" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Categoría</mat-label>
                <input matInput formControlName="category" />
              </mat-form-field>
              <mat-form-field appearance="outline" class="full-grid">
                <mat-label>Descripción</mat-label>
                <textarea matInput formControlName="description" rows="3"></textarea>
              </mat-form-field>
              <mat-form-field appearance="outline" class="full-grid">
                <mat-label>URL de imagen</mat-label>
                <input matInput formControlName="image" />
              </mat-form-field>
            </div>

            <div class="form-actions">
              @if (editandoId()) {
                <button mat-button type="button" (click)="cancelarEdicion()">
                  Cancelar
                </button>
              }
              <button mat-raised-button color="primary" type="submit"
                      [disabled]="productoForm.invalid">
                {{ editandoId() ? 'Actualizar' : 'Crear producto' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Tabla de productos -->
      @if (cargando()) {
        <div class="spinner-container">
          <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
        </div>
      } @else {
        <table mat-table [dataSource]="productos()" class="productos-table">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>ID</th>
            <td mat-cell *matCellDef="let p">{{ p.id }}</td>
          </ng-container>
          <ng-container matColumnDef="imagen">
            <th mat-header-cell *matHeaderCellDef>Imagen</th>
            <td mat-cell *matCellDef="let p">
              <img [src]="p.image" width="40" alt="" />
            </td>
          </ng-container>
          <ng-container matColumnDef="titulo">
            <th mat-header-cell *matHeaderCellDef>Título</th>
            <td mat-cell *matCellDef="let p">{{ p.title }}</td>
          </ng-container>
          <ng-container matColumnDef="precio">
            <th mat-header-cell *matHeaderCellDef>Precio</th>
            <td mat-cell *matCellDef="let p">{{ p.price | formatoPrecio }}</td>
          </ng-container>
          <ng-container matColumnDef="categoria">
            <th mat-header-cell *matHeaderCellDef>Categoría</th>
            <td mat-cell *matCellDef="let p">{{ p.category }}</td>
          </ng-container>
          <ng-container matColumnDef="acciones">
            <th mat-header-cell *matHeaderCellDef>Acciones</th>
            <td mat-cell *matCellDef="let p">
              <button mat-icon-button color="primary"
                      (click)="editarProducto(p)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn"
                      (click)="eliminarProducto(p.id, p.title)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="columnas"></tr>
          <tr mat-row *matRowDef="let row; columns: columnas;"></tr>
        </table>
      }
    </div>
  `,
  styles: [`
    .admin-page { padding: 24px; max-width: 1200px; margin: 0 auto; }
    .form-card { margin-bottom: 32px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .full-grid { grid-column: 1 / -1; }
    .form-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; }
    .productos-table { width: 100%; }
    .spinner-container { display: flex; justify-content: center; padding: 40px; }
  `]
})
export class AdminProductosPage implements OnInit {

  private readonly productoService = inject(ProductoService);
  private readonly notificationService = inject(NotificationService);
  private readonly fb = inject(FormBuilder);

  productos = signal<Producto[]>([]);
  cargando = signal(true);
  editandoId = signal<number | null>(null);

  columnas = ['id', 'imagen', 'titulo', 'precio', 'categoria', 'acciones'];

  productoForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0.01)]],
    description: ['', Validators.required],
    category: ['', Validators.required],
    image: ['', Validators.required]
  });

  ngOnInit(): void {
    this.cargarProductos();
  }

  private cargarProductos(): void {
    this.productoService.obtenerProductos(50).subscribe({
      next: (productos) => {
        this.productos.set(productos);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  guardarProducto(): void {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    const datos = this.productoForm.getRawValue();
    const id = this.editandoId();

    const operacion = id
      ? this.productoService.actualizarProducto(id, datos)
      : this.productoService.crearProducto(datos);

    operacion.subscribe({
      next: () => {
        this.notificationService.exito(
          id ? 'Producto actualizado correctamente' : 'Producto creado correctamente'
        );
        this.cancelarEdicion();
        this.cargarProductos();
      },
      error: () => this.notificationService.error('Error al guardar el producto.')
    });
  }

  editarProducto(producto: Producto): void {
    this.editandoId.set(producto.id);
    this.productoForm.patchValue({
      title: producto.title,
      price: producto.price,
      description: producto.description,
      category: producto.category,
      image: producto.image
    });
  }

  cancelarEdicion(): void {
    this.editandoId.set(null);
    this.productoForm.reset();
  }

  async eliminarProducto(id: number, nombre: string): Promise<void> {
    const confirmado = await this.notificationService.confirmar(
      `¿Eliminar "${nombre}" permanentemente?`
    );
    if (confirmado) {
      this.productoService.eliminarProducto(id).subscribe({
        next: () => {
          this.notificationService.toast('Producto eliminado');
          this.cargarProductos();
        },
        error: () => this.notificationService.error('Error al eliminar.')
      });
    }
  }
}
```

---

### Fase 8: SSR y optimización (30 minutos estimados)

#### Configuración SSR

Verificar `angular.json` (la configuración de SSR ya se añade con `ng new --ssr`):

```json
{
  "projects": {
    "marketplace": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "outputPath": "dist/marketplace",
            "index": "src/index.html",
            "browser": "src/main.ts",
            "server": "src/main.server.ts",
            "ssr": {
              "entry": "server.ts"
            },
            "prerender": {
              "routes": ["/", "/products"]
            }
          }
        }
      }
    }
  }
}
```

Verificar `server.ts`:

```typescript
import 'zone.js/dist/zone-node';
import { ngExpressEngine } from '@angular/ssr';
import express from 'express';
import { join } from 'path';
import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';

export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/marketplace/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? 'index.original.html'
    : 'index';

  server.engine('html', ngExpressEngine({ bootstrap: AppServerModule }));
  server.set('view engine', 'html');
  server.set('views', distFolder);

  server.get('*.*', express.static(distFolder));
  server.get('*', (req, res) => {
    res.render(indexHtml, {
      req,
      providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }]
    });
  });

  return server;
}
```

#### Meta tags dinámicos para SEO

```typescript
// Archivo: src/app/core/services/seo.service.ts
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  actualizarMetaTags(config: {
    titulo: string;
    descripcion: string;
    imagen?: string;
    url?: string;
  }): void {
    this.title.setTitle(`${config.titulo} | Marketplace DAW`);

    this.meta.updateTag({ name: 'description', content: config.descripcion });
    this.meta.updateTag({ property: 'og:title', content: config.titulo });
    this.meta.updateTag({ property: 'og:description', content: config.descripcion });
    if (config.imagen) {
      this.meta.updateTag({ property: 'og:image', content: config.imagen });
    }
  }
}
```

Se inyecta en las páginas (por ejemplo, `ProductDetailPage`) para establecer meta tags específicos según el contenido.

#### @defer en componentes pesados

El uso de `@defer` se ha demostrado en `ProductDetailPage`. Otros lugares donde aplicarlo:

```html
<!-- Panel de administración completo: solo carga si el usuario navega allí -->
@defer (on viewport) {
  <app-admin-dashboard />
} @placeholder {
  <div class="admin-placeholder">Cargando panel de administración...</div>
}

<!-- Galería de imágenes del producto -->
@defer (on viewport; prefetch on idle) {
  <app-product-gallery [images]="producto().images" />
} @loading (after 100ms; minimum 1s) {
  <mat-progress-spinner mode="indeterminate" diameter="40" />
}
```

#### Verificar hydration

Ejecutar en desarrollo y verificar que no hay errores de hidratación (diferencias entre servidor y cliente):

```bash
npm run dev:ssr
# o
ng serve
```

---

### Fase 9: Testing y pulido (30 minutos estimados)

#### Revisar errores de consola

Abrir DevTools (F12) y verificar:
- Sin errores en consola.
- Sin peticiones fallidas (Network: 200/201/204).
- Sin memory leaks (Performance Monitor).

#### Verificar responsive

Usar las herramientas de desarrollo responsive de Chrome/Edge para probar:
- Móvil (375px).
- Tablet (768px).
- Escritorio (1024px+).

Comprobar que todos los elementos son accesibles y legibles en cada breakpoint.

#### Probar flujos completos

Ejecutar la aplicación en local y probar:

1. Navegar por el catálogo de productos.
2. Filtrar por categoría y buscar un producto concreto.
3. Ver detalle de un producto y añadir al carrito.
4. Modificar cantidades en el carrito.
5. Ir al checkout y rellenar el formulario.
6. Confirmar el pedido.
7. Iniciar sesión / Registrarse.
8. Acceder al panel de usuario.
9. Acceder al panel de administración (si es admin).
10. Cerrar sesión.

#### Construir para producción

```bash
ng build --configuration=production
```

Verificar el tamaño del bundle con:

```bash
ng build --configuration=production --stats-json
npx webpack-bundle-analyzer dist/marketplace/stats.json
```

---

## Rúbrica de evaluación

| Criterio | Peso | Excelente (10) | Notable (7) | Suficiente (5) | Insuficiente (3) |
|---|---|---|---|---|---|
| **Estructura y arquitectura** | 15% | Organización feature-based con smart/dumb components, separación core/shared/features perfecta. Sin deuda técnica. | Buena organización pero con alguna inconsistencia en la separación de responsabilidades. | Estructura básica funcional, carpetas genéricas sin separación clara de features. | Sin estructura clara, todo en la misma carpeta, código espagueti. |
| **Signals y gestión de estado** | 15% | Uso correcto y extensivo de signals, computed y effects. Servicios con estado centralizado. Efectos bien definidos para side effects. | Signals presente en los servicios principales, pero sin computed/effects o con uso incorrecto. | Uso básico de signals como sustituto de variables. Sin computed ni effects. | No usa la API de signals, usa variables planas o BehaviorSubject sin patrón claro. |
| **Routing y lazy loading** | 10% | Lazy loading por feature con loadComponent/loadChildren. Guards funcionales correctamente implementados. Redirecciones post-login. | Lazy loading parcial (algunas features, otras no). Guards implementados pero básicos. | Rutas definidas pero sin lazy loading real. Guards con lógica muy simple. | No usa routing de Angular o usa solo el routerLink sin configuración de rutas. |
| **Formularios reactivos y validación** | 10% | Reactive Forms con FormBuilder, validadores síncronos y asíncronos, validadores personalizados reutilizables. Signal Forms integrados. | Formularios funcionales con validación básica (required, minLength). | Formularios con ngModel sin validación estructurada. | No usa formularios Angular (usa formularios HTML nativos). |
| **HTTP e interceptores** | 10% | Interceptores funcionales para auth, errores y loading. Manejo granular de códigos de error. Retry y cacheo básico. | HttpClient con interceptores básicos (auth al menos). Manejo de errores genérico. | HttpClient con peticiones básicas. Sin interceptores. | No consume API REST. Datos hardcodeados. |
| **Angular Material / UI** | 10% | Uso extenso y coherente de Material. Tema personalizado. Diseño responsive mobile-first. Animaciones fluidas. | Uso adecuado de componentes Material principales. Diseño con cierto responsive. | Uso de Material básico (botones, inputs). Poco responsive. | No usa Angular Material o usa solo algún componente suelto sin criterio. |
| **SSR y rendimiento** | 5% | SSR configurado y funcional. Prerender en rutas clave. @defer en componentes pesados. Meta tags dinámicos. Hydration correcta. | SSR configurado aunque no completamente optimizado. Algún uso de @defer. | SSR añadido pero no verificado (puede tener errores de hidratación). | No hay configuración SSR. |
| **Funcionalidad** | 15% | Todas las funcionalidades descritas en el enunciado completas, probadas y funcionando sin errores. | Mayoría de funcionalidades completas. Alguna feature menor sin implementar. | Funcionalidad básica (catálogo, carrito, login). Faltan features importantes. | Apenas funciona. La mayoría de features no están implementadas o fallan. |
| **Código y buenas prácticas** | 10% | Código limpio, bien tipado, con nombres descriptivos. DRY. Sin duplicación. Control Flow moderno (@if/@for/@switch). Inyección con inject(). | Código aceptable. Tipado en la mayoría de casos. Algún uso de directivas antiguas. | Código funcional pero con poca atención a buenas prácticas. Mezcla de enfoques. | Código desordenado. Sin tipado. Uso excesivo de any. Violaciones de principios básicos. |

### Baremo de calificación

| Puntuación ponderada | Calificación | Equivalencia |
|---------------------|-------------|--------------|
| 9.0 - 10.0 | Sobresaliente (9-10) | Excelente, supera las expectativas |
| 7.0 - 8.9 | Notable (7-8) | Buen trabajo, cumple ampliamente |
| 5.0 - 6.9 | Suficiente (5-6) | Aceptable, cumple los mínimos |
| < 5.0 | Insuficiente (<5) | No alcanza los objetivos mínimos |

---

## Criterios de evaluación oficiales (FP Andalucía)

### Módulo DWEC (Desarrollo Web en Entorno Cliente)

| Resultado de Aprendizaje | Criterio de evaluación | Evidencia en el proyecto |
|--------------------------|----------------------|-------------------------|
| RA1. Selecciona arquitecturas y tecnologías | a) Se han caracterizado las tecnologías de programación en entorno cliente. | Uso de Angular con TypeScript, justificación de standalone. |
| RA2. Desarrolla aplicaciones con frameworks | a) Se han identificado las ventajas del uso de frameworks. b) Se ha utilizado la sintaxis del framework. c) Se han creado componentes. | Componentes standalone, signals, pipes, directivas. |
| RA3. Integra librerías y frameworks | a) Se ha evaluado la idoneidad de librerías. b) Se han integrado en la aplicación. | Angular Material integrado. |
| RA4. Almacenamiento y comunicación con servicios remotos | a) Se han utilizado APIs REST. b) Se han gestionado respuestas asíncronas. | HttpClient, RxJS, interceptores. |
| RA5. Mecanismos de seguridad | a) Se ha implementado autenticación. b) Se ha controlado el acceso a recursos. | AuthService, guards, interceptores JWT. |

### Módulo DIW (Diseño de Interfaces Web)

| Resultado de Aprendizaje | Criterio de evaluación | Evidencia en el proyecto |
|--------------------------|----------------------|-------------------------|
| RA4. Crea interfaces con frameworks | a) Se ha utilizado un framework de diseño. | Angular Material como framework UI. |
| RA6. Desarrolla aplicaciones responsivas | a) Se ha implementado diseño responsive. b) Se ha verificado en distintos dispositivos. | Diseño mobile-first con breakpoints. |

### Módulo DAW (Despliegue de Aplicaciones Web)

| Resultado de Aprendizaje | Criterio de evaluación | Evidencia en el proyecto |
|--------------------------|----------------------|-------------------------|
| RA1. Prepara entornos de desarrollo | a) Se han configurado herramientas de desarrollo. | Angular CLI, ESLint, Prettier. |
| RA2. Despliega aplicaciones | a) Se ha compilado para producción. b) Se ha desplegado en servidor. | Build producción, configuración SSR. |

---

## Actividades de ampliación

### Ampliación 1: Pasarela de pago simulada

Implementar una simulación de pasarela de pago (Stripe o PayPal) en el proceso de checkout:
- Integrar el SDK de Stripe Elements.
- Crear un formulario de tarjeta de crédito simulado.
- Manejar estados de pago (pendiente, procesando, completado, fallido).
- Mostrar interfaz de confirmación de pago.

### Ampliación 2: Chat en tiempo real

Añadir un sistema de chat para comunicación comprador-vendedor:
- Usar Firebase Realtime Database o Socket.io.
- Crear un componente de chat con lista de mensajes.
- Implementar notificaciones de nuevos mensajes.
- Historia de conversaciones por producto.

### Ampliación 3: Testing

Añadir tests unitarios y de integración:
- Tests unitarios para servicios (AuthService, CartService) con Jasmine/Karma o Jest.
- Tests de componentes con TestBed.
- Tests end-to-end (e2e) con Cypress para flujos principales.
- Alcanzar al menos un 80% de cobertura de código.

### Ampliación 4: Dockerizar la aplicación

Crear una configuración Docker para la aplicación:
- `Dockerfile` multistage para build y producción.
- `docker-compose.yml` con la app Angular y un backend simulado (json-server).
- Desplegar en un VPS o servicio cloud usando Docker.

### Ampliación 5: Desplegar en Vercel/Netlify con SSR

Desplegar la aplicación en un servicio de hosting moderno con soporte SSR:
- Configurar el despliegue desde GitHub.
- Configurar las variables de entorno en el panel de hosting.
- Verificar que el prerender y SSR funcionan en producción.
- Configurar un dominio personalizado.

### Ampliación 6: Convertir a PWA

Convertir la aplicación en una Progressive Web App:
- Añadir `@angular/pwa` (`ng add @angular/pwa`).
- Configurar el Service Worker para cacheo offline.
- Personalizar el manifest.json (nombre, iconos, colores).
- Verificar con Lighthouse que la app es instalable y funciona offline.

### Ampliación 7: App móvil con Capacitor

Convertir el Marketplace en una app móvil:
- Añadir Capacitor al proyecto.
- Configurar plugins nativos (cámara para foto de perfil, geolocalización para direcciones de envío).
- Generar APK para Android y probar en dispositivo real.

---

## Buenas prácticas profesionales

1. **Arquitectura feature-based con smart/dumb components.** Separar componentes contenedores (páginas) de componentes presentacionales. Esto facilita el testing y la reutilización del código.

2. **Servicios con estado mediante Signals y Effects.** Centralizar el estado de la aplicación en servicios inyectables. Usar `signal()` para estado, `computed()` para valores derivados y `effect()` para efectos secundarios como persistencia en localStorage.

3. **Lazy loading por feature.** Cada funcionalidad se carga solo cuando se navega a ella. Esto reduce el tiempo de carga inicial (First Contentful Paint) y mejora la experiencia de usuario.

4. **Interceptores funcionales para preocupaciones transversales.** Autenticación, manejo de errores y estado de carga se gestionan a nivel de infraestructura, no en cada componente. Esto mantiene el código DRY.

5. **Usar el nuevo Control Flow (@if, @for, @switch).** El nuevo control flow de Angular es más eficiente, con mejor rendimiento y más legible que las directivas estructurales clásicas.

6. **Formularios tipados con FormBuilder nonNullable.** Aprovechar el tipado estricto de TypeScript para formularios. Usar `FormBuilder.nonNullable` para evitar nulls innecesarios.

7. **Inyección de dependencias con inject().** Preferir la función `inject()` sobre la inyección por constructor. Es más concisa, permite herencia más limpia y es el estándar del ecosistema para standalone components.

8. **SSR solo donde aporta valor.** No todas las páginas necesitan SSR. Prerenderizar páginas públicas (home, detalle de producto) y mantener como SPA las secciones privadas (panel de admin) es una estrategia óptima.

9. **Uso de @defer para carga diferida.** Componentes pesados o que no son visibles inicialmente deben cargarse de forma diferida. Esto mejora métricas como LCP (Largest Contentful Paint) y TBT (Total Blocking Time).

10. **Código limpio y mantenible.** Nombres descriptivos en español o inglés (decisión de equipo), funciones pequeñas con una sola responsabilidad, y uso consistente de patrones. Documentar con JSDoc los servicios y métodos públicos.

---

## Errores frecuentes

1. **Mezclar Signals y RxJS sin criterio.**
   ```typescript
   // MAL: mezclar signals y BehaviorSubject para lo mismo
   private itemsSubject = new BehaviorSubject<ItemCarrito[]>([]);
   readonly items = signal<ItemCarrito[]>([]);
   // Elige un paradigma: Signals para estado síncrono, RxJS para asíncrono.

   // BIEN: signals para estado, RxJS para flujos HTTP
   ```

2. **No usar `track` en @for.**
   ```html
   <!-- MAL: Angular no puede optimizar el renderizado -->
   @for (producto of productos(); track $index) { ... }

   <!-- BIEN: track por identificador único -->
   @for (producto of productos(); track producto.id) { ... }
   ```

3. **Olvidar `readonly` en los signals expuestos.**
   ```typescript
   // MAL: permite modificar el signal desde fuera del servicio
   items = signal<ItemCarrito[]>([]);

   // BIEN: expone solo lectura
   private readonly itemsState = signal<ItemCarrito[]>([]);
   readonly items = this.itemsState.asReadonly();
   ```

4. **No desuscribirse de observables en componentes.**
   ```typescript
   // MAL: memory leak potencial
   ngOnInit() {
     this.productoService.obtenerProductos().subscribe(p => this.productos.set(p));
   }

   // BIEN: usar async pipe en plantillas o takeUntilDestroyed
   ```

5. **Hacer peticiones HTTP directamente en componentes presentacionales.**
   ```typescript
   // MAL: componente presentacional con lógica de negocio
   // Las peticiones HTTP deben estar en servicios o smart components
   ```

6. **No verificar la hidratación SSR en desarrollo.**
   ```bash
   # Siempre probar:
   npm run dev:ssr
   # Verificar que no hay errores "mismatch" entre servidor y cliente
   ```

7. **Usar `any` en lugar de tipar correctamente.**
   ```typescript
   // MAL
   private http = inject(HttpClient);
   obtenerProductos(): Observable<any> { ... }

   // BIEN
   obtenerProductos(): Observable<Producto[]> { ... }
   ```

8. **No configurar correctamente las variables de entorno.**
   ```typescript
   // MAL: URL hardcodeada
   private apiUrl = 'http://localhost:3000/api';

   // BIEN: desde environment
   import { environment } from '../../../environments/environment';
   private apiUrl = environment.apiUrl;
   ```

---

## Resumen

El Proyecto Integrador Final representa la culminación de todo el aprendizaje del curso de Angular. A través de la construcción de un Marketplace de Productos completo, el alumnado ha aplicado de forma integrada todos los conceptos estudiados:

- **Arquitectura:** organización feature-based con separación core/shared/features y patrón smart/dumb components.
- **Estado reactivo:** Signals para gestión de estado (carrito, autenticación), Computed Signals para valores derivados y Effects para side effects.
- **Routing:** lazy loading por feature con guards funcionales para proteger rutas.
- **Formularios:** Reactive Forms con validadores personalizados para login, registro y checkout; Signal Forms para filtros.
- **HTTP:** HttpClient con interceptores funcionales para autenticación, manejo de errores y loading.
- **UI:** Angular Material como framework de diseño, con componentes responsive mobile-first.
- **Rendimiento:** SSR con prerender, @defer para carga diferida, meta tags dinámicos para SEO.
- **Código moderno:** Control Flow (@if/@for/@switch), inject(), standalone components, tipado estricto.

Este proyecto proporciona una base sólida para el desarrollo profesional con Angular y constituye una pieza destacada del portfolio del alumnado de cara a su inserción laboral como desarrollador/a web frontend.

---

## Recursos adicionales

### Documentación oficial

- [Angular.dev - Documentación oficial](https://angular.dev)
- [Angular Material - Componentes](https://material.angular.io/components/categories)
- [Angular Signals Guide](https://angular.dev/guide/signals)
- [Angular SSR Guide](https://angular.dev/guide/ssr)
- [Angular @defer Guide](https://angular.dev/guide/defer)
- [Fake Store API - Documentación](https://fakestoreapi.com/docs)
- [RxJS - Documentación oficial](https://rxjs.dev/guide/overview)

### Tutoriales y guías

- [Angular University - Blog](https://blog.angular-university.io/)
- [Angular: De cero a experto (Fernando Herrera - Udemy)](https://www.udemy.com/course/angular-fernando-herrera/)
- [Angular Signals: Guía completa (YouTube)](https://www.youtube.com/results?search_query=angular+signals+guia+completa)

### Herramientas

- [Angular CLI](https://angular.dev/cli)
- [Angular DevTools - Extensión Chrome](https://angular.dev/tools/devtools)
- [Lighthouse - Auditoría de rendimiento](https://developer.chrome.com/docs/lighthouse/overview/)
- [Schematica para scaffolding rápido](https://angular.dev/tools/cli/schematics)

### Comunidad

- [Angular en Español - Discord](https://discord.gg/angular)
- [Angular Madrid - Meetup](https://www.meetup.com/es-ES/angular-madrid/)
- [Stack Overflow en Español](https://es.stackoverflow.com/questions/tagged/angular)
- [Angular GitHub](https://github.com/angular/angular)
