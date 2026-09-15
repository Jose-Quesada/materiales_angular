# Servicios e Inyección de Dependencias

## Objetivos de aprendizaje

1. Comprender el concepto de servicio en Angular como clase TypeScript con responsabilidad específica y bien definida.
2. Dominar el sistema de Inyección de Dependencias de Angular y su jerarquía de inyectores.
3. Aprender la forma moderna de inyectar dependencias mediante la función `inject()`.
4. Configurar servicios con el decorador `@Injectable()` y sus distintos ámbitos (`providedIn`).
5. Implementar servicios compartidos como mecanismo de estado entre componentes.
6. Construir un patrón simple de store utilizando servicios con Signals.
7. Entender el árbol de inyectores y los diferentes niveles de scope de los servicios.

## Resultados de aprendizaje

Al finalizar esta unidad, el alumnado será capaz de:

- Identificar la necesidad de un servicio y crear uno con `@Injectable()`.
- Inyectar dependencias usando la función `inject()` en componentes, servicios y funciones.
- Configurar el ámbito de un servicio mediante `providedIn: 'root'`, `'any'` y providers en componentes.
- Implementar servicios compartidos para gestionar el estado de la aplicación.
- Aplicar el patrón store simple combinando servicios y Signals.
- Diferenciar entre instancias singleton y múltiples instancias de un servicio.
- Comprender cómo Angular resuelve las dependencias en su árbol de inyectores.

## Introducción

En el corazón de Angular late un potente sistema de Inyección de Dependencias (DI) que constituye uno de los pilares arquitectónicos del framework. Si los componentes son la cara visible de una aplicación Angular y las plantillas son el lienzo donde se pinta la interfaz, los servicios son el motor silencioso que ejecuta la lógica de negocio, accede a los datos y coordina la comunicación entre partes de la aplicación.

La Inyección de Dependencias es un patrón de diseño que implementa el principio de Inversión de Control: en lugar de que una clase cree sus propias dependencias, estas le son proporcionadas desde fuera. En Angular, el "desde fuera" es el Inyector, una pieza de infraestructura del framework que sabe cómo crear instancias de servicios y entregarlas a quien las solicite.

Esta unidad explora en profundidad el ecosistema de servicios en Angular. Comenzaremos entendiendo qué es un servicio y por qué separar la lógica de negocio de los componentes es fundamental para construir aplicaciones mantenibles. Profundizaremos en el sistema de DI, incluyendo la jerarquía de inyectores que determina el ciclo de vida y el ámbito (scope) de cada servicio.

Dedicaremos especial atención a la función `inject()`, la forma moderna y recomendada de solicitar dependencias, que ha transformado la manera en que escribimos servicios en Angular. También cubriremos el uso de Signals dentro de servicios para crear stores simples pero potentes, que permiten compartir estado entre componentes sin necesidad de bibliotecas externas de gestión de estado.

## Desarrollo teórico

### 1. Qué es un servicio en Angular

Un servicio es una clase TypeScript que encapsula una responsabilidad específica dentro de la aplicación. A diferencia de los componentes, los servicios no tienen plantilla ni interfaz de usuario propia. Su función es contener la lógica de negocio, gestionar el acceso a datos y proporcionar funcionalidades transversales que pueden ser utilizadas por múltiples componentes.

**Características de un buen servicio:**

- **Responsabilidad única:** Cada servicio debe tener un propósito claro y bien definido (SRP - Principio de Responsabilidad Única).
- **Reutilizable:** Diseñado para ser usado por cualquier componente que lo necesite.
- **Testeable de forma aislada:** Al no depender de templates ni del DOM, se puede probar fácilmente con tests unitarios.
- **Inyectable:** Se integra con el sistema de DI de Angular para ser proporcionado automáticamente.

**Ejemplo de servicio simple:**

```typescript
// services/calculadora.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalculadoraService {

  /**
   * Suma dos números y devuelve el resultado.
   */
  sumar(a: number, b: number): number {
    return a + b;
  }

  /**
   * Calcula el precio con IVA incluido (21%).
   */
  calcularPrecioConIVA(precioSinIVA: number, porcentajeIVA: number = 21): number {
    return precioSinIVA * (1 + porcentajeIVA / 100);
  }

  /**
   * Aplica un descuento a un precio.
   * @param precio - Precio original
   * @param descuento - Porcentaje de descuento (0-100)
   */
  aplicarDescuento(precio: number, descuento: number): number {
    if (descuento < 0 || descuento > 100) {
      throw new Error('El descuento debe estar entre 0 y 100');
    }
    return precio * (1 - descuento / 100);
  }

  /**
   * Redondea un número a un número específico de decimales.
   */
  redondear(valor: number, decimales: number = 2): number {
    const factor = Math.pow(10, decimales);
    return Math.round(valor * factor) / factor;
  }
}
```

### 2. Dependency Injection (DI)

#### 2.1. Concepto: Inversión de Control

La Inyección de Dependencias es una forma de Inversión de Control (IoC). Tradicionalmente, cuando una clase necesita otra clase para funcionar, la crea ella misma:

```typescript
// Sin DI (acoplamiento fuerte)
class ReportService {
  private logger = new ConsoleLogger(); // Crea su dependencia

  generarReporte(): void {
    this.logger.log('Generando reporte...');
    // ... lógica del reporte
  }
}
```

Con DI, la clase declara lo que necesita y el framework se lo proporciona:

```typescript
// Con DI (acoplamiento débil)
@Injectable({ providedIn: 'root' })
class ReportService {
  constructor(private logger: LoggerService) {} // Recibe su dependencia

  generarReporte(): void {
    this.logger.log('Generando reporte...');
    // ... lógica del reporte
  }
}
```

**Ventajas de la DI:**

- **Desacoplamiento:** Las clases no necesitan saber cómo crear sus dependencias.
- **Testeabilidad:** Se pueden sustituir dependencias reales por mocks en tests.
- **Flexibilidad:** Se puede cambiar la implementación de una dependencia sin modificar el código que la usa.
- **Gestión del ciclo de vida:** El inyector gestiona cuándo se crean y destruyen las instancias.

#### 2.2. Sistema de DI de Angular

El sistema de DI de Angular se basa en tres conceptos clave:

**InjectionToken:** Es un identificador único que sirve para registrar y localizar una dependencia. Las clases en sí mismas actúan como tokens (el tipo de la clase es el token), pero también se pueden crear tokens explícitos con `InjectionToken` para valores que no son clases.

```typescript
import { InjectionToken } from '@angular/core';

// Token para un valor de configuración (no es una clase)
export const API_URL = new InjectionToken<string>('URL base de la API', {
  factory: () => 'https://api.miapp.com'
});

export const CONFIGURACION_APP = new InjectionToken<AppConfig>('Configuración de la aplicación');
```

**Provider:** Es una receta que le dice al inyector cómo crear una instancia de una dependencia. Un provider asocia un token con una fábrica, un valor o una clase existente.

**Injector:** Es el contenedor que mantiene las instancias de los servicios y las entrega cuando se solicitan. Los inyectores forman una jerarquía.

#### 2.3. Jerarquía de inyectores

Angular organiza los inyectores en una jerarquía. Cuando un componente o servicio solicita una dependencia, Angular la busca en el inyector más cercano y, si no la encuentra, asciende por la jerarquía hasta llegar al inyector raíz.

La jerarquía de inyectores es:

```
NullInjector (lanza error si no encuentra)
    ↑
PlatformInjector (inyector de plataforma)
    ↑
RootInjector (inyector raíz de la aplicación - providedIn: 'root')
    ↑
ModuleInjector (inyectores de NgModules - en desuso en standalone)
    ↑
NodeInjector (inyectores de componentes - providers en @Component)
```

**Cómo Angular resuelve una dependencia:**

1. Comienza por el `NodeInjector` del componente que solicita la dependencia.
2. Si no se encuentra, sube al inyector del componente padre.
3. Continúa ascendiendo por el árbol de componentes.
4. Si llega al componente raíz sin encontrar la dependencia, busca en el `RootInjector`.
5. Si no se encuentra en ningún nivel, el `NullInjector` lanza un error.

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    // Estos van al RootInjector
    { provide: API_URL, useValue: 'https://api.miapp.com/v2' },
    // provideHttpClient() añade providers al RootInjector
  ]
};
```

**Visualización del árbol de inyectores:**

```
ApplicationRef (RootInjector)
├── providers: [LoggerService, ApiService]  ← Singleton global
│
├── AppComponent (NodeInjector)
│   ├── providers: [ThemeService]  ← Solo AppComponent y sus hijos
│   │
│   ├── HeaderComponent
│   │   └── providers: []  ← Hereda del padre
│   │
│   └── ProductPageComponent
│       ├── providers: [ProductFilterService]  ← Solo esta rama
│       │
│       └── ProductListComponent
│           └── providers: []  ← Hereda de ancestros
```

### 3. inject(): La forma moderna de inyectar dependencias

#### 3.1. Concepto y sintaxis

La función `inject()` es la forma moderna y recomendada de inyectar dependencias en Angular. A diferencia de la inyección por constructor, `inject()` puede usarse en cualquier lugar donde haya un contexto de inyección válido.

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggerService } from './logger.service';

@Injectable({ providedIn: 'root' })
export class ProductService {
  // Inyección moderna con inject()
  private http = inject(HttpClient);
  private logger = inject(LoggerService);

  obtenerProductos(): Observable<Producto[]> {
    this.logger.log('Obteniendo productos...');
    return this.http.get<Producto[]>('/api/productos');
  }
}
```

**Ventajas de inject() sobre la inyección por constructor:**

1. **Menos boilerplate:** No es necesario declarar el constructor ni parámetros.
2. **Herencia más limpia:** Las clases que extienden otras no necesitan pasar dependencias al constructor padre.
3. **Uso en funciones:** Se puede usar `inject()` en funciones fuera de clases (composables, guards, interceptors funcionales).
4. **Código más conciso:** Menos líneas de código con la misma funcionalidad.

**Comparación: Constructor vs inject():**

```typescript
// Forma tradicional (constructor)
@Injectable({ providedIn: 'root' })
class UserServiceTradicional {
  constructor(
    private http: HttpClient,
    private logger: LoggerService,
    private auth: AuthService,
    private config: ConfigService
  ) {}

  getProfile(): Observable<UserProfile> {
    this.logger.log('Obteniendo perfil');
    return this.http.get<UserProfile>(this.config.apiUrl + '/profile');
  }
}

// Forma moderna (inject)
@Injectable({ providedIn: 'root' })
class UserServiceModerno {
  private http = inject(HttpClient);
  private logger = inject(LoggerService);
  private auth = inject(AuthService);
  private config = inject(ConfigService);

  getProfile(): Observable<UserProfile> {
    this.logger.log('Obteniendo perfil');
    return this.http.get<UserProfile>(this.config.apiUrl + '/profile');
  }
}
```

Ambas formas son funcionalmente equivalentes. `inject()` es simplemente una alternativa más moderna y flexible.

#### 3.2. Injection Context

El "contexto de inyección" es el ámbito donde `inject()` puede ejecutarse. No todos los lugares en una aplicación Angular tienen un contexto de inyección activo.

**Lugares donde SÍ se puede usar `inject()`:**

- Constructor de un servicio o componente.
- Campos de clase inicializados con `inject()` (dentro de una clase con `@Injectable` o `@Component`).
- Fábricas de providers.
- Guards funcionales (router).
- Interceptors funcionales (HTTP).
- Dentro de `effect()` (si la clase tiene contexto de inyección).

**Lugares donde NO se puede usar `inject()`:**

- Funciones sueltas fuera del alcance de Angular.
- En `ngOnInit` o cualquier método de ciclo de vida (ya hay contexto, pero no se recomienda).
- En constructores de clases que no forman parte del sistema DI de Angular.

```typescript
// ERROR: No hay contexto de inyección aquí
function utilidadExterna() {
  const http = inject(HttpClient); // Error en ejecución
}

// CORRECTO: La función se llama dentro de un contexto válido
function crearGuard(): CanActivateFn {
  return () => {
    const auth = inject(AuthService); // Válido: dentro de un guard funcional
    return auth.estaAutenticado();
  };
}
```

**Uso de `inject()` fuera de clases (patrón composable):**

Uno de los casos de uso más interesantes de `inject()` es la creación de funciones composables que encapsulan lógica con dependencias:

```typescript
// composables/use-auth.composable.ts
import { inject, signal, computed } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export function useAuth() {
  const authService = inject(AuthService);
  const router = inject(Router);

  const cargando = signal(false);
  const error = signal<string | null>(null);

  const usuario = computed(() => authService.usuarioActual());
  const estaAutenticado = computed(() => authService.estaAutenticado());

  async function iniciarSesion(email: string, password: string): Promise<void> {
    cargando.set(true);
    error.set(null);
    try {
      await authService.login(email, password);
      router.navigate(['/dashboard']);
    } catch (err: any) {
      error.set(err.message || 'Error al iniciar sesión');
    } finally {
      cargando.set(false);
    }
  }

  async function cerrarSesion(): Promise<void> {
    await authService.logout();
    router.navigate(['/login']);
  }

  return {
    usuario,
    estaAutenticado,
    cargando,
    error,
    iniciarSesion,
    cerrarSesion
  };
}
```

**Uso en un componente:**

```typescript
@Component({
  standalone: true,
  template: `
    @if (auth.cargando()) {
      <p>Iniciando sesión...</p>
    }
    @if (auth.error()) {
      <p class="error">{{ auth.error() }}</p>
    }
    <form (submit)="login()">
      <input [(ngModel)]="email" placeholder="Email" />
      <input type="password" [(ngModel)]="password" placeholder="Contraseña" />
      <button>Entrar</button>
    </form>
  `
})
export class LoginComponent {
  auth = useAuth(); // El composable inyecta sus dependencias automáticamente
  email = '';
  password = '';

  login(): void {
    this.auth.iniciarSesion(this.email, this.password);
  }
}
```

### 4. @Injectable() decorator

#### 4.1. providedIn: 'root'

`providedIn: 'root'` registra el servicio en el inyector raíz de la aplicación. Esto significa que habrá una **única instancia** (singleton) disponible para toda la aplicación.

```typescript
@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private logs: string[] = [];

  log(mensaje: string): void {
    const timestamp = new Date().toISOString();
    const entrada = `[${timestamp}] ${mensaje}`;
    this.logs.push(entrada);
    console.log(entrada);
  }

  obtenerLogs(): string[] {
    return [...this.logs];
  }

  limpiarLogs(): void {
    this.logs = [];
  }
}
```

**Ventajas de `providedIn: 'root'`:**

- **Tree-shakable:** Si ningún componente usa el servicio, el compilador lo elimina del bundle final.
- **Singleton automático:** Una instancia para toda la app sin configuración adicional.
- **Simplicidad:** No requiere añadir el servicio manualmente a ningún array `providers`.

#### 4.2. providedIn: 'any'

`providedIn: 'any'` crea una instancia del servicio por cada inyector que lo solicite por primera vez. Es útil para módulos lazy que necesitan su propia instancia de un servicio sin compartirla con el resto de la aplicación.

```typescript
@Injectable({
  providedIn: 'any'
})
export class ModuloContadorService {
  private contador = signal(0);

  readonly valor = this.contador.asReadonly();

  incrementar(): void {
    this.contador.update(c => c + 1);
  }
}
```

#### 4.3. providedIn: 'platform'

Registra el servicio en el inyector de plataforma. Los servicios con `providedIn: 'platform'` son compartidos entre **todas** las aplicaciones Angular que se ejecuten en la misma página. Es un caso de uso poco común, principalmente para compartir servicios entre micro frontends Angular.

#### 4.4. Sin providedIn (providers array)

Si no se especifica `providedIn`, el servicio **no es tree-shakable** y debe declararse explícitamente en el array `providers` de un componente, módulo o configuración de aplicación:

```typescript
@Injectable() // Sin providedIn
export class CarritoService {
  items = signal<CartItem[]>([]);
}

@Component({
  selector: 'app-tienda',
  standalone: true,
  providers: [CarritoService], // Declarado explícitamente aquí
  template: `...`
})
export class TiendaComponent {
  private carrito = inject(CarritoService);
}
```

### 5. Singleton pattern en servicios Angular

Cuando un servicio se registra con `providedIn: 'root'`, Angular garantiza que solo exista una instancia en toda la aplicación. Pero, ¿cómo funciona esto exactamente?

```typescript
@Injectable({ providedIn: 'root' })
export class ContadorGlobalService {
  private valor = signal(0);

  readonly contador = this.valor.asReadonly();

  incrementar(): void {
    this.valor.update(v => v + 1);
  }
}

// Componente A
@Component({
  template: `<button (click)="contador.incrementar()">
    Incrementar ({{ contador.contador() }})
  </button>`
})
export class ComponenteA {
  contador = inject(ContadorGlobalService);
}

// Componente B
@Component({
  template: `<p>Valor actual: {{ contador.contador() }}</p>`
})
export class ComponenteB {
  contador = inject(ContadorGlobalService);
}
```

Ambos componentes comparten la misma instancia. Si el Componente A incrementa, el Componente B ve el cambio.

**Múltiples instancias (rompiendo el singleton):**

Es posible forzar múltiples instancias declarando el servicio en los `providers` de un componente:

```typescript
@Component({
  providers: [ContadorGlobalService] // Crea una NUEVA instancia para este componente
})
export class ComponenteAislado {
  contador = inject(ContadorGlobalService); // Diferente instancia del root
}
```

### 6. Servicios compartidos: estado entre componentes

Uno de los usos más comunes de los servicios en Angular es compartir estado entre componentes. Veamos varios patrones:

#### 6.1. Patrón de servicio como store simple

```typescript
// services/tareas-store.service.ts
import { Injectable, signal, computed } from '@angular/core';

export interface Tarea {
  id: number;
  titulo: string;
  completada: boolean;
  fechaCreacion: Date;
}

@Injectable({ providedIn: 'root' })
export class TareasStoreService {
  // Estado
  private tareas = signal<Tarea[]>([]);

  // Selectores (datos derivados, de solo lectura)
  readonly todasLasTareas = this.tareas.asReadonly();

  readonly tareasPendientes = computed(() =>
    this.tareas().filter(t => !t.completada)
  );

  readonly tareasCompletadas = computed(() =>
    this.tareas().filter(t => t.completada)
  );

  readonly totalTareas = computed(() => this.tareas().length);

  readonly progreso = computed(() =>
    this.totalTareas() === 0
      ? 0
      : (this.tareasCompletadas().length / this.totalTareas()) * 100
  );

  // Acciones (métodos que modifican el estado)
  agregarTarea(titulo: string): void {
    const nuevaTarea: Tarea = {
      id: Date.now(),
      titulo,
      completada: false,
      fechaCreacion: new Date()
    };
    this.tareas.update(tareas => [...tareas, nuevaTarea]);
  }

  toggleTarea(id: number): void {
    this.tareas.update(tareas =>
      tareas.map(t =>
        t.id === id ? { ...t, completada: !t.completada } : t
      )
    );
  }

  eliminarTarea(id: number): void {
    this.tareas.update(tareas => tareas.filter(t => t.id !== id));
  }

  eliminarCompletadas(): void {
    this.tareas.update(tareas => tareas.filter(t => !t.completada));
  }
}
```

**Uso en componentes:**

```typescript
@Component({
  selector: 'app-tareas',
  standalone: true,
  template: `
    <div class="tareas-container">
      <h2>Tareas ({{ store.totalTareas() }})</h2>

      <div class="progreso">
        <div class="barra" [style.width.%]="store.progreso()"></div>
      </div>

      <form (submit)="agregar()">
        <input [value]="nuevaTarea()" (input)="nuevaTarea.set($any($event.target).value)" />
        <button type="submit">Anadir</button>
      </form>

      <ul>
        @for (tarea of store.todasLasTareas(); track tarea.id) {
          <li [class.completada]="tarea.completada">
            <input type="checkbox" [checked]="tarea.completada"
              (change)="store.toggleTarea(tarea.id)" />
            <span>{{ tarea.titulo }}</span>
            <button (click)="store.eliminarTarea(tarea.id)">X</button>
          </li>
        }
      </ul>

      <button (click)="store.eliminarCompletadas()">
        Eliminar completadas
      </button>
    </div>
  `
})
export class TareasComponent {
  store = inject(TareasStoreService);
  nuevaTarea = signal('');
  // Cualquier componente puede inyectar este store y compartir el estado

  agregar(): void {
    const titulo = this.nuevaTarea().trim();
    if (titulo) {
      this.store.agregarTarea(titulo);
      this.nuevaTarea.set('');
    }
  }
}
```

### 7. Providers: diferentes niveles de scope

#### 7.1. Providers en bootstrapApplication (app.config.ts)

Los providers definidos en `app.config.ts` se registran en el `RootInjector` y están disponibles en toda la aplicación:

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    { provide: API_URL, useValue: 'https://api.miapp.com' },
    // LoggerService está en providedIn: 'root', no necesita estar aquí
  ]
};
```

#### 7.2. Providers en componentes

Los providers declarados en el array `providers` de un componente crean una instancia del servicio para ese componente y sus hijos:

```typescript
@Component({
  selector: 'app-formulario-complejo',
  standalone: true,
  providers: [FormStateService], // Instancia local para este subárbol
  template: `
    <app-paso-1-formulario />
    <app-paso-2-formulario />
    <app-resumen-formulario />
  `
})
export class FormularioComplejoComponent {
  // Todos los componentes hijos comparten la misma instancia de FormStateService
}
```

#### 7.3. Providers en rutas

Los providers de ruta crean servicios disponibles para una ruta específica y sus rutas hijas:

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'admin',
    providers: [AdminGuardService, AdminDataService],
    loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes)
  },
  {
    path: 'clientes',
    providers: [ClienteDataService],
    loadChildren: () => import('./clientes/clientes.routes').then(m => m.clienteRoutes)
  }
];
```

### 8. Gestión del estado con servicios + Signals

Angular proporciona una solución nativa para la gestión del estado mediante la combinación de servicios inyectables y Signals. Este patrón, conocido como "Signal Store" o "Service-based Store", ofrece muchas de las ventajas de bibliotecas como NgRx o Elf sin complejidad adicional.

#### 8.1. Comparación con otras soluciones de gestión de estado

| Característica | Servicios + Signals | NgRx (Redux) | Elf |
|---|---|---|---|
| Complejidad | Baja | Alta | Media |
| Boilerplate | Mínimo | Mucho | Medio |
| Curva de aprendizaje | Suave | Pronunciada | Moderada |
| DevTools | No nativas | Sí | Sí |
| Type Safety | Excelente | Excelente | Excelente |
| Bundle size | 0 KB extra | ~50 KB | ~15 KB |
| Patrón | Flexible | Redux estricto | Observable Store |
| Adecuado para | Apps pequeñas-medias | Apps grandes | Apps medias-grandes |

#### 8.2. Patrón simple de store con servicios + Signals

```typescript
// stores/tienda.store.ts
import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  stock: number;
}

interface EstadoTienda {
  productos: Producto[];
  cargando: boolean;
  error: string | null;
  filtroCategoria: string;
  terminoBusqueda: string;
}

@Injectable({ providedIn: 'root' })
export class TiendaStore {
  private http = inject(HttpClient);

  private estado = signal<EstadoTienda>({
    productos: [],
    cargando: false,
    error: null,
    filtroCategoria: 'todas',
    terminoBusqueda: ''
  });

  // Selectores
  readonly productos = computed(() => this.estado().productos);
  readonly cargando = computed(() => this.estado().cargando);
  readonly error = computed(() => this.estado().error);

  readonly categorias = computed(() =>
    [...new Set(this.productos().map(p => p.categoria))]
  );

  readonly productosFiltrados = computed(() => {
    const { productos, filtroCategoria, terminoBusqueda } = this.estado();
    let resultado = productos;

    if (filtroCategoria !== 'todas') {
      resultado = resultado.filter(p => p.categoria === filtroCategoria);
    }

    if (terminoBusqueda) {
      const termino = terminoBusqueda.toLowerCase();
      resultado = resultado.filter(p =>
        p.nombre.toLowerCase().includes(termino)
      );
    }

    return resultado;
  });

  // Acciones
  cargarProductos(): void {
    this.estado.update(e => ({ ...e, cargando: true, error: null }));

    this.http.get<Producto[]>('/api/productos').subscribe({
      next: (productos) => {
        this.estado.update(e => ({ ...e, productos, cargando: false }));
      },
      error: (err) => {
        this.estado.update(e => ({
          ...e,
          error: 'Error al cargar: ' + err.message,
          cargando: false
        }));
      }
    });
  }

  establecerFiltroCategoria(categoria: string): void {
    this.estado.update(e => ({ ...e, filtroCategoria: categoria }));
  }

  establecerBusqueda(termino: string): void {
    this.estado.update(e => ({ ...e, terminoBusqueda: termino }));
  }
}
```

## Ejemplos guiados

### Ejemplo 1: Servicio de logging (LoggerService) con inject()

```typescript
// services/logger.service.ts
import { Injectable, inject, InjectionToken } from '@angular/core';

export type NivelLog = 'debug' | 'info' | 'warn' | 'error';

export interface ConfigLogger {
  nivelMinimo: NivelLog;
  incluirTimestamp: boolean;
  persistirEnLocalStorage: boolean;
  maxEntradas: number;
}

export const CONFIG_LOGGER = new InjectionToken<ConfigLogger>('Configuración del Logger', {
  factory: () => ({
    nivelMinimo: 'info',
    incluirTimestamp: true,
    persistirEnLocalStorage: false,
    maxEntradas: 1000
  })
});

interface EntradaLog {
  timestamp: string;
  nivel: NivelLog;
  mensaje: string;
  datos?: any;
}

@Injectable({ providedIn: 'root' })
export class LoggerService {
  private config = inject(CONFIG_LOGGER);
  private entradas: EntradaLog[] = [];

  private readonly NIVELES: Record<NivelLog, number> = {
    debug: 0, info: 1, warn: 2, error: 3
  };

  debug(mensaje: string, datos?: any): void {
    this.escribirLog('debug', mensaje, datos);
  }

  info(mensaje: string, datos?: any): void {
    this.escribirLog('info', mensaje, datos);
  }

  warn(mensaje: string, datos?: any): void {
    this.escribirLog('warn', mensaje, datos);
  }

  error(mensaje: string, datos?: any): void {
    this.escribirLog('error', mensaje, datos);
  }

  private escribirLog(nivel: NivelLog, mensaje: string, datos?: any): void {
    if (this.NIVELES[nivel] < this.NIVELES[this.config.nivelMinimo]) {
      return;
    }

    const entrada: EntradaLog = {
      timestamp: this.config.incluirTimestamp ? new Date().toISOString() : '',
      nivel,
      mensaje,
      datos
    };

    this.entradas.push(entrada);

    // Limitar el número de entradas
    if (this.entradas.length > this.config.maxEntradas) {
      this.entradas = this.entradas.slice(-this.config.maxEntradas);
    }

    // Persistir en localStorage si está configurado
    if (this.config.persistirEnLocalStorage) {
      try {
        localStorage.setItem('app_logs', JSON.stringify(this.entradas));
      } catch {
        // localStorage puede fallar (cuota llena, navegación privada)
      }
    }

    // Output a consola con estilo según nivel
    const estilo = this.obtenerEstiloConsola(nivel);
    const prefijo = `[${nivel.toUpperCase()}]`;
    console.log(`%c${prefijo} %c${mensaje}`, estilo, '', datos || '');
  }

  private obtenerEstiloConsola(nivel: NivelLog): string {
    switch (nivel) {
      case 'debug': return 'color: #9e9e9e';
      case 'info': return 'color: #1976d2';
      case 'warn': return 'color: #f57c00; font-weight: bold;';
      case 'error': return 'color: #d32f2f; font-weight: bold;';
    }
  }

  obtenerEntradas(filtroNivel?: NivelLog): EntradaLog[] {
    if (!filtroNivel) return [...this.entradas];
    return this.entradas.filter(e => e.nivel === filtroNivel);
  }

  limpiarEntradas(): void {
    this.entradas = [];
    localStorage.removeItem('app_logs');
  }
}
```

### Ejemplo 2: Servicio de carrito de compras con Signals

```typescript
// services/carrito.service.ts
import { Injectable, signal, computed, inject } from '@angular/core';
import { LoggerService } from './logger.service';

export interface ItemCarrito {
  productoId: number;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
  imagenUrl: string;
}

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private logger = inject(LoggerService);

  private items = signal<ItemCarrito[]>([]);

  // Selectores
  readonly itemsCarrito = this.items.asReadonly();

  readonly totalItems = computed(() =>
    this.items().reduce((total, item) => total + item.cantidad, 0)
  );

  readonly subtotal = computed(() =>
    this.items().reduce(
      (total, item) => total + item.precioUnitario * item.cantidad,
      0
    )
  );

  readonly iva = computed(() => this.subtotal() * 0.21);

  readonly total = computed(() => this.subtotal() + this.iva());

  readonly estaVacio = computed(() => this.items().length === 0);

  // Acciones
  agregarProducto(
    productoId: number,
    nombre: string,
    precio: number,
    imagenUrl: string,
    cantidad: number = 1
  ): void {
    this.items.update(items => {
      const existente = items.find(i => i.productoId === productoId);
      if (existente) {
        return items.map(i =>
          i.productoId === productoId
            ? { ...i, cantidad: i.cantidad + cantidad }
            : i
        );
      }
      return [...items, { productoId, nombre, precioUnitario: precio, cantidad, imagenUrl }];
    });
    this.logger.info(`Producto agregado al carrito: ${nombre} x${cantidad}`);
  }

  eliminarProducto(productoId: number): void {
    const item = this.items().find(i => i.productoId === productoId);
    this.items.update(items => items.filter(i => i.productoId !== productoId));
    if (item) {
      this.logger.info(`Producto eliminado del carrito: ${item.nombre}`);
    }
  }

  actualizarCantidad(productoId: number, cantidad: number): void {
    if (cantidad <= 0) {
      this.eliminarProducto(productoId);
      return;
    }
    this.items.update(items =>
      items.map(i =>
        i.productoId === productoId ? { ...i, cantidad } : i
      )
    );
  }

  vaciarCarrito(): void {
    this.items.set([]);
    this.logger.info('Carrito vaciado');
  }
}
```

### Ejemplo 3: Servicio de autenticación con estado reactivo

```typescript
// services/auth.service.ts
import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { LoggerService } from './logger.service';

export interface Usuario {
  id: number;
  email: string;
  nombre: string;
  rol: 'admin' | 'usuario' | 'editor';
  avatarUrl?: string;
}

interface CredencialesLogin {
  email: string;
  password: string;
}

interface RespuestaLogin {
  token: string;
  usuario: Usuario;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private logger = inject(LoggerService);

  // Estado de autenticación
  private usuarioSignal = signal<Usuario | null>(null);
  private tokenSignal = signal<string | null>(null);
  private cargandoSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  // Selectores públicos
  readonly usuarioActual = this.usuarioSignal.asReadonly();
  readonly cargando = this.cargandoSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  readonly estaAutenticado = computed(() =>
    this.usuarioSignal() !== null && this.tokenSignal() !== null
  );

  readonly esAdmin = computed(() =>
    this.usuarioSignal()?.rol === 'admin'
  );

  constructor() {
    // Intentar recuperar sesión de localStorage al iniciar
    this.recuperarSesion();
  }

  private recuperarSesion(): void {
    try {
      const token = localStorage.getItem('auth_token');
      const usuario = localStorage.getItem('auth_usuario');
      if (token && usuario) {
        this.tokenSignal.set(token);
        this.usuarioSignal.set(JSON.parse(usuario));
        this.logger.info('Sesión recuperada de localStorage');
      }
    } catch {
      this.logger.warn('No se pudo recuperar la sesión');
    }
  }

  login(credenciales: CredencialesLogin): Observable<RespuestaLogin> {
    this.cargandoSignal.set(true);
    this.errorSignal.set(null);

    return this.http.post<RespuestaLogin>('/api/auth/login', credenciales).pipe(
      tap(respuesta => {
        this.tokenSignal.set(respuesta.token);
        this.usuarioSignal.set(respuesta.usuario);

        // Persistir sesión
        localStorage.setItem('auth_token', respuesta.token);
        localStorage.setItem('auth_usuario', JSON.stringify(respuesta.usuario));

        this.cargandoSignal.set(false);
        this.logger.info(`Usuario autenticado: ${respuesta.usuario.email}`);
      }),
      catchError(err => {
        this.cargandoSignal.set(false);
        this.errorSignal.set(err.error?.mensaje || 'Error al iniciar sesión');
        this.logger.error('Error de login', err);
        return of(err);
      })
    );
  }

  logout(): void {
    this.usuarioSignal.set(null);
    this.tokenSignal.set(null);
    this.errorSignal.set(null);

    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_usuario');

    this.logger.info('Sesión cerrada');
    this.router.navigate(['/login']);
  }

  obtenerToken(): string | null {
    return this.tokenSignal();
  }
}
```

### Ejemplo 4: Múltiples instancias vs singleton

```typescript
// services/contador.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable() // Sin providedIn - debe declararse en providers
export class ContadorService {
  private contador = signal(0);
  readonly valor = this.contador.asReadonly();

  incrementar(): void {
    this.contador.update(c => c + 1);
  }
}

// componente-a.component.ts
@Component({
  selector: 'app-componente-a',
  standalone: true,
  providers: [ContadorService], // Instancia PROPIA para este subárbol
  template: `
    <div class="box">
      <h3>Componente A</h3>
      <p>Contador: {{ contador.valor() }}</p>
      <button (click)="contador.incrementar()">+</button>
    </div>
  `
})
export class ComponenteAComponent {
  contador = inject(ContadorService);
}

// componente-b.component.ts
@Component({
  selector: 'app-componente-b',
  standalone: true,
  providers: [ContadorService], // OTRA instancia, independiente de A
  template: `
    <div class="box">
      <h3>Componente B</h3>
      <p>Contador: {{ contador.valor() }}</p>
      <button (click)="contador.incrementar()">+</button>
    </div>
  `
})
export class ComponenteBComponent {
  contador = inject(ContadorService);
}

// componente-padre.component.ts
@Component({
  selector: 'app-componente-padre',
  standalone: true,
  // Sin providers para ContadorService aquí
  // Si lo pusiera aquí, A y B compartirían la misma instancia
  imports: [ComponenteAComponent, ComponenteBComponent],
  template: `
    <h2>Demostración de instancias independientes</h2>
    <app-componente-a />
    <app-componente-b />
    <p>Cada componente A y B tiene su propia instancia del servicio contador.</p>
  `
})
export class ComponentePadreComponent {}
```

## Ejercicios resueltos

### Ejercicio 1: Servicio de notificaciones (toast) con cola

**Enunciado:** Crear un servicio de notificaciones toast que gestione una cola de mensajes con diferentes tipos (success, error, warning, info) y auto-dismiss configurable.

```typescript
// services/notificaciones.service.ts
import { Injectable, signal, computed } from '@angular/core';

export type TipoNotificacion = 'success' | 'error' | 'warning' | 'info';

export interface Notificacion {
  id: string;
  tipo: TipoNotificacion;
  titulo: string;
  mensaje: string;
  duracion: number; // milisegundos, 0 = no auto-dismiss
  timestamp: number;
}

@Injectable({ providedIn: 'root' })
export class NotificacionesService {
  private notificaciones = signal<Notificacion[]>([]);

  readonly notificacionesActivas = this.notificaciones.asReadonly();

  readonly cantidad = computed(() => this.notificaciones().length);

  readonly tieneNotificaciones = computed(() => this.cantidad() > 0);

  private contadorId = 0;

  /**
   * Muestra una notificación.
   * @param tipo - Tipo de notificación
   * @param titulo - Título breve
   * @param mensaje - Mensaje detallado
   * @param duracion - Duración en ms (0 = no auto-dismiss, por defecto 5000)
   */
  mostrar(
    tipo: TipoNotificacion,
    titulo: string,
    mensaje: string,
    duracion: number = 5000
  ): string {
    const id = `notif_${++this.contadorId}_${Date.now()}`;
    const notificacion: Notificacion = {
      id, tipo, titulo, mensaje, duracion,
      timestamp: Date.now()
    };

    this.notificaciones.update(notifs => [...notifs, notificacion]);

    // Auto-dismiss
    if (duracion > 0) {
      setTimeout(() => this.eliminar(id), duracion);
    }

    return id;
  }

  success(titulo: string, mensaje: string, duracion: number = 5000): string {
    return this.mostrar('success', titulo, mensaje, duracion);
  }

  error(titulo: string, mensaje: string, duracion: number = 8000): string {
    return this.mostrar('error', titulo, mensaje, duracion);
  }

  warning(titulo: string, mensaje: string, duracion: number = 5000): string {
    return this.mostrar('warning', titulo, mensaje, duracion);
  }

  info(titulo: string, mensaje: string, duracion: number = 4000): string {
    return this.mostrar('info', titulo, mensaje, duracion);
  }

  eliminar(id: string): void {
    this.notificaciones.update(notifs =>
      notifs.filter(n => n.id !== id)
    );
  }

  eliminarTodas(): void {
    this.notificaciones.set([]);
  }
}
```

```typescript
// components/toast-container.component.ts
import { Component, inject } from '@angular/core';
import { NgClass, DatePipe } from '@angular/common';
import { NotificacionesService, TipoNotificacion } from '../../services/notificaciones.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="toast-container" aria-live="polite">
      @for (notif of notificacionesService.notificacionesActivas(); track notif.id) {
        <div
          class="toast toast-{{ notif.tipo }}"
          [ngClass]="{ 'toast-entrando': true }"
          role="alert"
        >
          <div class="toast-icono">{{ obtenerIcono(notif.tipo) }}</div>
          <div class="toast-contenido">
            <strong>{{ notif.titulo }}</strong>
            <p>{{ notif.mensaje }}</p>
          </div>
          <button
            class="toast-cerrar"
            (click)="notificacionesService.eliminar(notif.id)"
            aria-label="Cerrar notificación"
          >X</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 420px;
    }
    .toast {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 1rem;
      border-radius: 8px;
      background: white;
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease;
    }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .toast-success { border-left: 4px solid #388e3c; }
    .toast-error { border-left: 4px solid #d32f2f; }
    .toast-warning { border-left: 4px solid #f57c00; }
    .toast-info { border-left: 4px solid #1976d2; }
    .toast-icono { font-size: 1.5rem; flex-shrink: 0; }
    .toast-contenido { flex: 1; }
    .toast-contenido strong { display: block; margin-bottom: 0.25rem; }
    .toast-contenido p { margin: 0; font-size: 0.9rem; color: #666; }
    .toast-cerrar {
      background: none;
      border: none;
      cursor: pointer;
      color: #999;
      font-weight: bold;
      flex-shrink: 0;
    }
  `]
})
export class ToastContainerComponent {
  notificacionesService = inject(NotificacionesService);

  obtenerIcono(tipo: TipoNotificacion): string {
    switch (tipo) {
      case 'success': return 'OK';
      case 'error': return 'X';
      case 'warning': return '!';
      case 'info': return 'i';
    }
  }
}
```

### Ejercicio 2: Servicio de tema (dark/light mode) compartido con Signals

```typescript
// services/tema.service.ts
import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type Tema = 'claro' | 'oscuro';

@Injectable({ providedIn: 'root' })
export class TemaService {
  private document = inject(DOCUMENT);

  private temaSignal = signal<Tema>(this.obtenerTemaInicial());

  readonly temaActual = this.temaSignal.asReadonly();

  readonly esOscuro = computed(() => this.temaActual() === 'oscuro');
  readonly esClaro = computed(() => this.temaActual() === 'claro');

  constructor() {
    this.aplicarTemaAlDOM(this.temaActual());

    // Efecto: aplica el tema cuando cambia
    effect(() => {
      const tema = this.temaActual();
      this.aplicarTemaAlDOM(tema);
      this.persistirTema(tema);
    });

    // Escuchar cambios del sistema operativo (preferencia del usuario)
    this.escucharPreferenciaSistema();
  }

  private obtenerTemaInicial(): Tema {
    // 1. Intentar recuperar tema guardado
    const guardado = localStorage.getItem('app_tema') as Tema | null;
    if (guardado === 'claro' || guardado === 'oscuro') {
      return guardado;
    }

    // 2. Usar preferencia del sistema
    if (typeof window !== 'undefined' && window.matchMedia) {
      const prefiereOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefiereOscuro ? 'oscuro' : 'claro';
    }

    return 'claro';
  }

  alternarTema(): void {
    this.temaSignal.update(t => t === 'claro' ? 'oscuro' : 'claro');
  }

  establecerTema(tema: Tema): void {
    this.temaSignal.set(tema);
  }

  private aplicarTemaAlDOM(tema: Tema): void {
    const body = this.document.body;
    if (tema === 'oscuro') {
      body.classList.add('tema-oscuro');
      body.classList.remove('tema-claro');
      this.document.documentElement.style.colorScheme = 'dark';
    } else {
      body.classList.add('tema-claro');
      body.classList.remove('tema-oscuro');
      this.document.documentElement.style.colorScheme = 'light';
    }
  }

  private persistirTema(tema: Tema): void {
    try {
      localStorage.setItem('app_tema', tema);
    } catch {
      // localStorage puede no estar disponible
    }
  }

  private escucharPreferenciaSistema(): void {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    mediaQuery.addEventListener('change', (evento) => {
      // Solo cambiar automáticamente si el usuario no ha elegido manualmente
      const guardado = localStorage.getItem('app_tema');
      if (!guardado) {
        this.establecerTema(evento.matches ? 'oscuro' : 'claro');
      }
    });
  }
}
```

## Actividades propuestas

### Actividad 1: Servicio de persistencia local (Nivel básico)

**Descripción:** Implementar un servicio genérico que permita persistir datos en localStorage con tipado seguro y manejo de errores.

**Tareas:**
1. Crear un `StorageService` con métodos genéricos `get<T>(key)`, `set<T>(key, value)`, `remove(key)`.
2. Utilizar `InjectionToken` para configurar un prefijo de clave (namespace).
3. Manejar errores de JSON.parse y cuotas de localStorage.
4. Implementar soporte para TTL (time-to-live) con expiración de datos.
5. Integrar con Signals para crear valores reactivos que se sincronicen con localStorage.

**Duración estimada:** 1.5 horas.

### Actividad 2: Servicio de caché de API (Nivel medio)

**Descripción:** Crear un servicio de caché que intercepte llamadas HTTP y almacene respuestas temporalmente para evitar peticiones repetidas.

**Tareas:**
1. Crear `CacheService` con un Map interno de `clave -> { datos, timestamp, ttl }`.
2. Implementar método `getOrFetch<T>(key, fetcher$, ttl)` que devuelva caché o ejecute la petición.
3. Gestionar invalidación manual de caché.
4. Limpiar caché automáticamente al superar el TTL.
5. Integrar con HttpInterceptor para caché automática de GET (actividad de ampliación parcial).

**Duración estimada:** 2 horas.

### Actividad 3: Servicio de análisis de datos con computed() (Nivel medio)

**Descripción:** Implementar un servicio que gestione datos de ventas y exponga métricas calculadas mediante `computed()`.

**Tareas:**
1. Crear `VentasStoreService` con señal de ventas (array de transacciones).
2. Implementar computed signals para: totalVentas, promedioVenta, ventasPorCategoria, ventasPorMes, topProductos.
3. Métodos para añadir, eliminar y filtrar ventas.
4. Crear un componente dashboard que muestre las métricas en tiempo real.
5. Implementar filtros por rango de fechas.

**Duración estimada:** 2 horas.

### Actividad 4: Servicio de formulario compartido (Nivel medio)

**Descripción:** Crear un servicio que gestione el estado de un formulario multi-paso, compartido entre varios componentes.

**Tareas:**
1. Crear `FormStateService` con signals para cada paso del formulario.
2. Implementar navegación entre pasos (siguiente, anterior, ir a paso N).
3. Validar cada paso antes de permitir avanzar.
4. Método `reiniciar()` para volver al estado inicial.
5. Usar `effect()` para guardar progreso en localStorage (borrador automático).

**Duración estimada:** 1.5 horas.

### Actividad 5: Servicio de eventos global (Event Bus) (Nivel avanzado)

**Descripción:** Implementar un servicio de bus de eventos desacoplado que permita comunicación entre componentes sin relación directa.

**Tareas:**
1. Crear `EventBusService` con un `Subject` interno para emitir eventos tipados.
2. Definir tipos de eventos como unión discriminada (discriminated union).
3. Método `emit<T>(evento: T)` para publicar eventos.
4. Método `on<T>(tipo, callback)` para suscribirse a eventos específicos, devolviendo función para desuscribir.
5. Implementar limpieza automática con `takeUntilDestroyed()`.

**Duración estimada:** 1.5 horas.

## Actividades de ampliación

### Actividad de ampliación 1: Mini-framework de gestión de estado (Signal Store)

**Descripción:** Diseñar una utilidad genérica que facilite la creación de stores con Signals siguiendo un patrón similar a NgRx SignalStore.

**Tareas:**
1. Crear una función `createStore<T>(config)` que reciba estado inicial, selectores y acciones.
2. Soportar features (stores que se combinan).
3. Implementar soporte para efectos asíncronos (acciones que devuelven Observables).
4. Integrar con DevTools mediante un plugin opcional.

**Duración estimada:** 3 horas.

### Actividad de ampliación 2: Sistema de permisos y autorización

**Descripción:** Crear un sistema de control de acceso basado en roles (RBAC) usando servicios y guards.

**Tareas:**
1. Crear `AuthService` con estado de usuario y roles.
2. Crear `PermissionService` que evalúe si el usuario tiene ciertos permisos.
3. Implementar guards funcionales que usen `inject()`.
4. Crear una directiva estructural `*appPuede` que muestre/oculte contenido según permisos.
5. Manejar jerarquía de roles (admin > editor > usuario).

**Duración estimada:** 2.5 horas.

### Actividad de ampliación 3: Servicio de internacionalización con carga dinámica

**Descripción:** Construir un servicio i18n que cargue archivos de traducción dinámicamente mediante lazy loading.

**Tareas:**
1. Crear `I18nService` con señal de idioma actual y traducciones.
2. Cargar archivos JSON de traducción por idioma (es.json, en.json).
3. Implementar pipe `traducir` que use el servicio.
4. Soportar interpolación de variables y pluralización.
5. Detectar idioma del navegador como valor inicial.

**Duración estimada:** 3 horas.

## Buenas prácticas profesionales

1. **Usar `inject()` en lugar de inyección por constructor:** La función `inject()` produce código más conciso, facilita la herencia y permite patrones composables. Es la forma recomendada por el equipo de Angular para nuevos desarrollos.

2. **Cada servicio debe tener una única responsabilidad:** Un `LoggerService` solo gestiona logs. Un `AuthService` solo autenticación. Evitar "servicios navaja suiza" que mezclan preocupaciones no relacionadas.

3. **Exponer Signals como readonly cuando no deben modificarse externamente:** Mantener las signals de estado como privadas y exponer versiones de solo lectura o computadas:

   ```typescript
   private items = signal<Item[]>([]);
   readonly items$ = this.items.asReadonly(); // Solo lectura para el exterior
   ```

4. **Manejar errores de forma centralizada:** Los servicios que realizan operaciones de red o procesamiento deben capturar errores y exponerlos de forma consistente (signal de error, estado de carga).

5. **No exponer Subjects o Signals mutables directamente:** Si un servicio expone un `Subject` o una `WritableSignal`, cualquier componente puede modificarlo. Usar `asReadonly()`, `Observable` o getters que devuelvan copias.

6. **Usar `providedIn: 'root'` por defecto:** La mayoría de servicios deben ser singletons a nivel de aplicación. Solo usar providers locales en componentes cuando sea necesario aislar el estado a un subárbol específico.

7. **Preferir `computed()` a getters manuales:** Las señales computadas son más eficientes (se recalculan solo cuando cambian sus dependencias) y se integran mejor con el sistema de reactividad de Angular que los getters tradicionales.

8. **Documentar el propósito y uso de cada servicio:** Incluir JSDoc en la clase y en los métodos públicos. Especificar el ámbito del servicio (singleton global vs instancia por componente) y ejemplos de uso.

## Errores frecuentes

1. **Olvidar `@Injectable()` en servicios que reciben dependencias:** Si un servicio inyecta otras dependencias pero no tiene `@Injectable()`, Angular no puede crear su instancia correctamente. Siempre decorar los servicios con `@Injectable()`.

2. **Inyectar servicios con scope incorrecto:** Intentar inyectar un servicio declarado en `providers` de un componente hijo en un componente padre resultará en error (`NullInjectorError`). El servicio solo está disponible en el subárbol donde se declaró.

3. **Modificar una señal desde múltiples servicios sin coordinación:** Si dos servicios modifican la misma señal, pueden causar condiciones de carrera. Centralizar la mutación del estado en un único servicio (store).

4. **No limpiar suscripciones en servicios:** Los servicios viven durante toda la vida de la aplicación (con `providedIn: 'root'`). Las suscripciones a Observables no limpiadas causan memory leaks acumulativos.

5. **Usar `inject()` fuera de un contexto de inyección:** La función `inject()` debe ejecutarse dentro del constructor de una clase Angular, en un guard funcional, o en el contexto de `runInInjectionContext`. Llamarla en un método llamado asíncronamente o en un callback puede fallar.

6. **Crear dependencias circulares:** El servicio A depende de B y B depende de A. Angular no puede resolver esta situación. La solución es extraer la lógica común a un tercer servicio C del que dependan ambos.

7. **No usar `providedIn: 'root'` para servicios tree-shakeables:** Si un servicio se registra solo en `providers` de un `@NgModule`, no es tree-shakeable y siempre se incluirá en el bundle, aunque no se use.

8. **Confundir el ciclo de vida de los servicios:** Los servicios con `providedIn: 'root'` son singletons y viven toda la aplicación. Los servicios en `providers` de un componente se crean con el componente y se destruyen con él.

## Resumen

Los servicios y la Inyección de Dependencias constituyen la arquitectura interna de cualquier aplicación Angular. Comprender cómo funciona el árbol de inyectores, cómo se resuelven las dependencias y cuál es el ámbito (scope) de cada servicio es fundamental para diseñar aplicaciones robustas y mantenibles.

La función `inject()` representa la evolución moderna de la DI en Angular, ofreciendo una sintaxis más concisa y flexible que la inyección por constructor tradicional, y habilitando patrones como los composables. El decorador `@Injectable({ providedIn: 'root' })` sigue siendo la forma estándar de registrar servicios como singletons tree-shakeables.

La combinación de servicios con Signals proporciona una solución nativa y ligera para la gestión del estado, adecuada para la mayoría de aplicaciones. Este patrón de "Signal Store" ofrece reactividad, tipado seguro y simplicidad sin necesidad de bibliotecas externas, aunque para aplicaciones muy grandes puede complementarse con soluciones como NgRx SignalStore.

## Recursos adicionales

- [Documentación oficial: Dependency Injection](https://angular.dev/guide/di)
- [Documentación oficial: Injectable](https://angular.dev/api/core/Injectable)
- [Documentación oficial: inject()](https://angular.dev/api/core/inject)
- [Documentación oficial: Signals](https://angular.dev/guide/signals)
- [Angular University: Servicios e Inyección de Dependencias](https://blog.angular-university.io/angular-dependency-injection/)
- [NgRx SignalStore (gestión de estado avanzada)](https://ngrx.io/guide/signals/signal-store)
- [Elf State Management](https://ngneat.github.io/elf/)
- [Inyección de Dependencias - Wikipedia](https://en.wikipedia.org/wiki/Dependency_injection)
