# Directivas en Angular

## Objetivos de aprendizaje

1. Dominar el nuevo Control Flow de Angular (`@if`, `@for`, `@switch`) como reemplazo moderno de las directivas estructurales clásicas.
2. Comprender y aplicar directivas de atributos integradas (`NgClass`, `NgStyle`) para manipular la apariencia de elementos.
3. Diferenciar entre property binding directo (`[class]`, `[style]`) y las directivas `NgClass`/`NgStyle`.
4. Crear directivas de atributo personalizadas utilizando `@Directive`, `ElementRef`, `@HostListener` y `@HostBinding`.
5. Entender el concepto de directivas estructurales y su relación con `ng-template` y el asterisco (*).
6. Conocer los casos de uso apropiados para cada tipo de directiva.

## Resultados de aprendizaje

Al finalizar esta unidad, el alumnado será capaz de:

- Utilizar `@if`, `@else`, `@else if` para renderizado condicional en plantillas.
- Implementar iteraciones eficientes con `@for` y `track by`, incluyendo `@empty` para estados vacíos.
- Manejar múltiples casos condicionales con `@switch`, `@case` y `@default`.
- Aplicar estilos dinámicos mediante `NgClass` y `NgStyle` en sus tres sintaxis (string, array, objeto).
- Construir directivas de atributo personalizadas que interactúen con el DOM de forma segura.
- Identificar cuándo es apropiado crear una directiva personalizada frente a un componente.
- Comprender la evolución desde las directivas estructurales clásicas (`*ngIf`, `*ngFor`, `*ngSwitch`) al nuevo Control Flow.

## Introducción

Las directivas son uno de los tres bloques fundamentales de Angular, junto con los componentes y los servicios. Mientras que los componentes son directivas con plantilla, las directivas "puras" son instrucciones que modifican el comportamiento o la apariencia de elementos del DOM sin tener una plantilla propia.

Históricamente, Angular ha contado con dos grandes familias de directivas: las estructurales (que modifican la estructura del DOM añadiendo o eliminando elementos) y las de atributo (que cambian la apariencia o comportamiento de un elemento existente). Las directivas estructurales clásicas como `*ngIf`, `*ngFor` y `*ngSwitch` han sido herramientas fundamentales durante años.

Sin embargo, a partir de Angular 17, el framework introdujo una nueva sintaxis de Control Flow (`@if`, `@for`, `@switch`) que reemplaza progresivamente a las directivas estructurales clásicas. Esta nueva sintaxis, que forma parte de las plantillas como bloques nativos (no como directivas), ofrece mejor rendimiento, mejor experiencia de desarrollo y una sintaxis más cercana a JavaScript/TypeScript.

En esta unidad, exploraremos en profundidad tanto el nuevo Control Flow como las directivas de atributo, prestando especial atención a cuándo y por qué usar cada herramienta. También aprenderemos a crear nuestras propias directivas personalizadas, una capacidad que permite extender Angular de forma elegante para resolver necesidades específicas de interacción con el DOM.

## Desarrollo teórico

### PARTE 1 - Control Flow moderno (@if, @for, @switch)

#### 1.1. Diferencias con las directivas estructurales antiguas

Las directivas estructurales clásicas (`*ngIf`, `*ngFor`, `*ngSwitch`) presentaban varias limitaciones:

- **Sintaxis compleja con asterisco (*):** El `*` es azúcar sintáctico que oculta el uso real de `<ng-template>`, lo que resultaba confuso para principiantes.
- **Necesidad de importar `CommonModule`:** Para usar estas directivas, era necesario importar `CommonModule` o `BrowserModule`.
- **Dificultad con condicionales múltiples:** Implementar `if/else if/else` requería múltiples `<ng-template>` con nombres de referencia.
- **Rendimiento:** Las directivas estructurales clásicas implican la creación de templates embebidos y operaciones adicionales de detección de cambios.

El nuevo Control Flow soluciona estos problemas:

- **Sintaxis nativa del template:** Bloques `@if`, `@for`, `@switch` que recuerdan a JavaScript.
- **Sin imports adicionales:** El Control Flow está integrado en el compilador de Angular.
- **Mejor rendimiento:** El compilador optimiza directamente el DOM generado.
- **Mejor DX:** Los IDEs pueden proporcionar mejor autocompletado y validación.
- **Soporte nativo para `@else`, `@else if`, `@empty`.**

**Tabla comparativa:**

| Característica | Directivas clásicas | Control Flow (@) |
|---|---|---|
| `@if` / `*ngIf` | `<div *ngIf="condicion">` | `@if (condicion) { <div></div> }` |
| `@for` / `*ngFor` | `<div *ngFor="let item of items">` | `@for (item of items; track item.id) { <div></div> }` |
| `@switch` / `*ngSwitch` | `[ngSwitch]="valor"` + `*ngSwitchCase` | `@switch (valor) { @case ('a') { <div></div> } }` |
| Else | `*ngIf="cond; else templateRef"` | `@else { <div></div> }` |
| Else if | Múltiples `<ng-template>` | `@else if (cond2) { <div></div> }` |
| Empty state | `*ngIf="items.length === 0"` | `@empty { <div>Vacío</div> }` |

#### 1.2. @if: renderizado condicional

El bloque `@if` permite mostrar u ocultar condicionalmente partes de la plantilla. A diferencia de `*ngIf`, soporta múltiples ramas condicionales de forma nativa sin necesidad de templates con nombre.

**Sintaxis básica:**

```html
@if (usuario.estaAutenticado) {
  <div class="dashboard">
    <h2>Bienvenido, {{ usuario.nombre }}</h2>
    <p>Accede a tu panel de control.</p>
  </div>
}
```

**@else y @else if:**

```html
@if (puntuacion >= 90) {
  <p class="grade excelente">Sobresaliente</p>
} @else if (puntuacion >= 70) {
  <p class="grade notable">Notable</p>
} @else if (puntuacion >= 50) {
  <p class="grade aprobado">Aprobado</p>
} @else {
  <p class="grade suspenso">Suspenso</p>
}
```

**Expresiones condicionales con `as` (alias):**

Una característica exclusiva del nuevo Control Flow es la capacidad de almacenar el resultado de una expresión condicional compleja en una variable local usando `as`:

```html
@if (usuarios$ | async; as usuarios) {
  @if (usuarios.length > 0) {
    <ul>
      @for (user of usuarios; track user.id) {
        <li>{{ user.nombre }}</li>
      }
    </ul>
  } @else {
    <p>No hay usuarios registrados.</p>
  }
} @else {
  <p>Cargando usuarios...</p>
}
```

En este ejemplo, `usuarios$ | async` puede devolver `null` mientras se carga. Usando `as usuarios`, la expresión se evalúa una sola vez y está disponible como variable local. Si el valor es `null` o `undefined`, se muestra el `@else`.

**Condiciones con señales (signals):**

El Control Flow se integra perfectamente con las Signals de Angular:

```typescript
@Component({...})
export class MiComponente {
  cargando = signal(true);
  datos = signal<Dato[]>([]);
  error = signal<string | null>(null);
}
```

```html
@if (cargando()) {
  <app-spinner />
} @else if (error(); as mensajeError) {
  <app-error-message [mensaje]="mensajeError" />
} @else {
  <app-tabla-datos [datos]="datos()" />
}
```

#### 1.3. @for: iteración de colecciones

El bloque `@for` itera sobre colecciones de forma similar a `*ngFor`, pero con mejoras significativas en sintaxis y rendimiento.

**Sintaxis básica:**

La sintaxis del `@for` es: `@for (elemento of coleccion; track elemento.propiedadIdentificadora)`. El `track` es **obligatorio** y no puede omitirse.

```html
<ul>
  @for (tarea of tareas; track tarea.id) {
    <li class="tarea-item" [class.completada]="tarea.completada">
      <span class="titulo">{{ tarea.titulo }}</span>
      <span class="fecha">{{ tarea.fechaCreacion | date:'shortDate' }}</span>
    </li>
  }
</ul>
```

**Por qué usar `track` (y por qué es obligatorio):**

El `track` permite a Angular identificar de forma única cada elemento de la lista. Cuando la colección cambia (se añaden, eliminan o reordenan elementos), Angular usa el valor de `track` para determinar qué elementos del DOM deben crearse, destruirse o reutilizarse.

Sin `track`, Angular no tiene forma de saber si un elemento es el mismo después de una actualización, lo que puede resultar en:
- Recreación innecesaria de nodos DOM (mal rendimiento).
- Pérdida de estado de los elementos (focus, animaciones, scroll).
- Comportamiento incorrecto en listas que cambian frecuentemente.

```html
<!-- track con propiedad simple -->
@for (producto of productos; track producto.id) { ... }

<!-- track con propiedad compuesta -->
@for (entrada of entradas; track entrada.autor + '-' + entrada.fecha) { ... }

<!-- track con índice ($index) - solo si no hay propiedad única -->
@for (item of items; track $index) { ... }
```

> **Advertencia:** Usar `track $index` solo cuando la colección es estática (no cambia de orden ni se añaden/eliminan elementos). Si la lista es dinámica, preferir una propiedad identificadora real.

**Variables implícitas de @for:**

El bloque `@for` expone variables locales que proporcionan metadatos sobre la posición y estado del elemento dentro de la colección:

| Variable | Tipo | Descripción |
|---|---|---|
| `$index` | `number` | Índice del elemento actual (basado en 0) |
| `$count` | `number` | Número total de elementos en la colección |
| `$first` | `boolean` | `true` si es el primer elemento |
| `$last` | `boolean` | `true` si es el último elemento |
| `$even` | `boolean` | `true` si el índice es par |
| `$odd` | `boolean` | `true` si el índice es impar |

**Uso de variables implícitas:**

```html
<table>
  <thead>
    <tr>
      <th>#</th>
      <th>Nombre</th>
      <th>Acciones</th>
    </tr>
  </thead>
  <tbody>
    @for (alumno of alumnos; track alumno.id; let i = $index; let primero = $first; let ultimo = $last) {
      <tr
        [class.primero]="primero"
        [class.ultimo]="ultimo"
        [class.par]="$even"
        [class.impar]="$odd"
      >
        <td>{{ i + 1 }} de {{ $count }}</td>
        <td>{{ alumno.nombre }} {{ alumno.apellidos }}</td>
        <td>
          @if (!primero) {
            <button (click)="moverArriba(i)">Subir</button>
          }
          @if (!ultimo) {
            <button (click)="moverAbajo(i)">Bajar</button>
          }
        </td>
      </tr>
    }
  </tbody>
</table>
```

En este ejemplo, usamos `$index` para numerar los elementos, `$count` para mostrar el total, `$first` y `$last` para mostrar/ocultar botones de reordenación, y `$even`/`$odd` para alternar estilos de fila.

**@empty: estado para listas vacías**

Una de las mejoras más notables del nuevo `@for` es el bloque `@empty`, que se muestra cuando la colección no tiene elementos:

```html
<div class="resultados-busqueda">
  @for (resultado of resultados; track resultado.id) {
    <app-resultado-card [resultado]="resultado" />
  } @empty {
    <div class="empty-state">
      <h3>No se encontraron resultados</h3>
      <p>Prueba con otros términos de búsqueda o utiliza filtros diferentes.</p>
      <button (click)="limpiarFiltros()">Limpiar filtros</button>
    </div>
  }
</div>
```

**Rendimiento del @for:**

El `@for` del nuevo Control Flow es significativamente más rápido que `*ngFor` porque:

1. El compilador de Angular puede optimizar el código generado al ser una sintaxis nativa.
2. El `track` obligatorio garantiza que Angular siempre sepa qué elementos reutilizar.
3. La detección de cambios es más eficiente porque Angular conoce exactamente qué parte de la colección cambió.

#### 1.4. @switch: selección entre múltiples casos

El bloque `@switch` reemplaza a `[ngSwitch]` + `*ngSwitchCase` + `*ngSwitchDefault` con una sintaxis más limpia y familiar.

**Sintaxis:**

```html
@switch (estadoPedido) {
  @case ('pendiente') {
    <div class="status pendiente">
      <span class="indicator"></span>
      Tu pedido está pendiente de confirmación.
    </div>
  }
  @case ('enviado') {
    <div class="status enviado">
      <span class="indicator"></span>
      Tu pedido ha sido enviado. Llegará en 2-3 días.
    </div>
  }
  @case ('entregado') {
    <div class="status entregado">
      <span class="indicator"></span>
      Pedido entregado correctamente.
    </div>
  }
  @case ('cancelado') {
    <div class="status cancelado">
      <span class="indicator"></span>
      Este pedido fue cancelado.
    </div>
  }
  @default {
    <div class="status desconocido">
      <span class="indicator"></span>
      Estado de pedido desconocido.
    </div>
  }
}
```

**Múltiples valores en un mismo @case:**

Se pueden listar múltiples valores en un mismo `@case` separados por comas, sin necesidad de duplicar código o usar fall-through:

```html
@switch (diaSemana) {
  @case ('sabado', 'domingo') {
    <p class="fin-semana">Es fin de semana. Disfruta del descanso.</p>
  }
  @case ('lunes') {
    <p class="inicio-semana">Comienza la semana con energía.</p>
  }
  @case ('viernes') {
    <p class="viernes">Viernes. Casi termina la semana.</p>
  }
  @default {
    <p class="dia-laboral">Día laboral normal.</p>
  }
}
```

**@switch con señales:**

```typescript
@Component({...})
export class VisorDocumentoComponent {
  tipoDocumento = signal<'pdf' | 'word' | 'excel' | 'imagen' | 'desconocido'>('pdf');
}
```

```html
@switch (tipoDocumento()) {
  @case ('pdf') {
    <app-pdf-viewer [documento]="doc" />
  }
  @case ('word') {
    <app-word-viewer [documento]="doc" />
  }
  @case ('excel') {
    <app-excel-viewer [documento]="doc" />
  }
  @case ('imagen') {
    <app-image-viewer [documento]="doc" />
  }
  @default {
    <p>Formato de documento no soportado.</p>
  }
}
```

### PARTE 2 - Directivas de atributos

#### 2.1. NgClass

`NgClass` es una directiva de atributo que añade o elimina clases CSS de un elemento de forma dinámica. Soporta tres sintaxis diferentes:

**Sintaxis 1: String (cadena de texto)**

Útil cuando se quiere aplicar una clase o un conjunto fijo de clases basado en una variable:

```html
<!-- Clase única desde variable -->
<div [ngClass]="claseTema">Contenido con tema dinámico</div>

<!-- Múltiples clases fijas desde variable -->
<div [ngClass]="'tarjeta destacada sombra'">Tarjeta estilizada</div>
```

```typescript
export class MiComponente {
  claseTema = 'tema-oscuro';

  cambiarTema(): void {
    this.claseTema = this.claseTema === 'tema-claro' ? 'tema-oscuro' : 'tema-claro';
  }
}
```

**Sintaxis 2: Array**

Permite aplicar múltiples clases especificadas individualmente:

```html
<div
  [ngClass]="['tarjeta', esDestacada ? 'destacada' : '', 'sombra']"
>
  Contenido de la tarjeta
</div>
```

El array puede contener strings, variables y expresiones ternarias. Las cadenas vacías o valores `null`/`undefined` son ignorados por Angular.

```html
<div [ngClass]="[
  'producto-card',
  producto.enOferta ? 'en-oferta' : '',
  producto.novedad ? 'novedad' : '',
  'categoria-' + producto.categoria.toLowerCase()
]">
  <!-- Contenido -->
</div>
```

**Sintaxis 3: Objeto (la más flexible)**

Permite establecer clases condicionalmente mediante pares clave-valor, donde la clave es el nombre de la clase y el valor es un booleano que indica si se aplica:

```html
<div
  [ngClass]="{
    'tarea-completada': tarea.estado === 'completada',
    'tarea-pendiente': tarea.estado === 'pendiente',
    'tarea-urgente': tarea.prioridad === 'alta',
    'tarea-vencida': tarea.fechaLimite < fechaActual
  }"
>
  <span>{{ tarea.titulo }}</span>
</div>
```

**Ejemplo completo con las tres sintaxis:**

```typescript
// componente TypeScript
import { Component } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-ejemplo-ngclass',
  standalone: true,
  imports: [NgClass],
  template: `
    <h2>Ejemplos de NgClass</h2>

    <!-- String -->
    <div [ngClass]="temaSeleccionado">
      <p>Tema seleccionado: <strong>{{ temaSeleccionado }}</strong></p>
      <button (click)="alternarTema()">Alternar tema</button>
    </div>

    <!-- Array -->
    <div [ngClass]="[
      'mensaje',
      tipoMensaje === 'exito' ? 'mensaje-exito' : '',
      tipoMensaje === 'error' ? 'mensaje-error' : '',
      tipoMensaje === 'info' ? 'mensaje-info' : ''
    ]">
      <p>Este es un mensaje de tipo: <strong>{{ tipoMensaje }}</strong></p>
      <select (change)="tipoMensaje = $any($event.target).value">
        <option value="info">Info</option>
        <option value="exito">Exito</option>
        <option value="error">Error</option>
      </select>
    </div>

    <!-- Objeto -->
    <div [ngClass]="{
      'panel-activo': panelVisible,
      'panel-colapsado': !panelVisible,
      'con-borde': true
    }">
      <p>Panel {{ panelVisible ? 'visible' : 'oculto' }}</p>
      <button (click)="panelVisible = !panelVisible">
        {{ panelVisible ? 'Ocultar' : 'Mostrar' }} panel
      </button>
    </div>
  `,
  styles: [`
    .tema-claro { background: white; color: #333; padding: 1rem; }
    .tema-oscuro { background: #333; color: white; padding: 1rem; }
    .mensaje { padding: 1rem; margin: 1rem 0; border-radius: 8px; }
    .mensaje-exito { background: #e8f5e9; border: 1px solid #388e3c; }
    .mensaje-error { background: #fbe9e7; border: 1px solid #d32f2f; }
    .mensaje-info { background: #e3f2fd; border: 1px solid #1976d2; }
    .panel-activo { max-height: 500px; overflow: visible; padding: 1rem; }
    .panel-colapsado { max-height: 0; overflow: hidden; padding: 0 1rem; }
    .con-borde { border: 1px solid #ccc; border-radius: 8px; margin: 1rem 0; }
  `]
})
export class EjemploNgClassComponent {
  temaSeleccionado = 'tema-claro';
  tipoMensaje = 'info';
  panelVisible = true;

  alternarTema(): void {
    this.temaSeleccionado = this.temaSeleccionado === 'tema-claro'
      ? 'tema-oscuro'
      : 'tema-claro';
  }
}
```

#### 2.2. NgStyle

`NgStyle` permite aplicar estilos CSS inline dinámicamente mediante un objeto donde las claves son propiedades CSS y los valores son los valores de esas propiedades.

```html
<div [ngStyle]="{
  'background-color': colorFondo,
  'color': colorTexto,
  'font-size.px': tamanoFuente,
  'border-radius.px': borderRadius,
  'padding.px': padding
}">
  Contenido con estilos dinámicos
</div>
```

**Uso de unidades:**

Se pueden especificar unidades para propiedades numéricas usando la notación de punto: `.px`, `.em`, `.rem`, `.%`, etc. Si no se especifica unidad, Angular asume píxeles para ciertas propiedades conocidas.

```html
<div [ngStyle]="{
  'width.px': ancho,
  'height.px': alto,
  'margin-top.rem': margenSuperior,
  'opacity': nivelOpacidad
}">
</div>
```

**Ejemplo: panel configurable por el usuario:**

```typescript
@Component({
  selector: 'app-panel-configurable',
  standalone: true,
  imports: [NgStyle, FormsModule],
  template: `
    <h3>Personaliza tu panel</h3>

    <div class="controls">
      <label>Color de fondo: <input type="color" [(ngModel)]="colorFondo" /></label>
      <label>Color de texto: <input type="color" [(ngModel)]="colorTexto" /></label>
      <label>Ancho (px): <input type="range" min="200" max="800" [(ngModel)]="ancho" /></label>
      <label>Alto (px): <input type="range" min="100" max="400" [(ngModel)]="alto" /></label>
      <label>Radio de borde (px): <input type="range" min="0" max="50" [(ngModel)]="radioBorde" /></label>
      <label>Opacidad: <input type="range" min="0" max="1" step="0.1" [(ngModel)]="opacidad" /></label>
    </div>

    <div
      class="panel-preview"
      [ngStyle]="{
        'background-color': colorFondo,
        'color': colorTexto,
        'width.px': ancho,
        'height.px': alto,
        'border-radius.px': radioBorde,
        'opacity': opacidad,
        'display': 'flex',
        'align-items': 'center',
        'justify-content': 'center',
        'transition': 'all 0.3s ease'
      }"
    >
      <p>Panel personalizado</p>
    </div>
  `,
  styles: [/* ... */]
})
export class PanelConfigurableComponent {
  colorFondo = '#1976d2';
  colorTexto = '#ffffff';
  ancho = 400;
  alto = 200;
  radioBorde = 8;
  opacidad = 1;
}
```

#### 2.3. [class] y [style] vs NgClass y NgStyle

Angular también permite manipular clases y estilos mediante bindings individuales, que son más eficientes cuando solo se necesita cambiar una propiedad:

**Binding de clase individual:**

```html
<!-- Aplicar una clase condicionalmente -->
<div [class.activo]="estaActivo">Elemento</div>

<!-- Aplicar múltiples bindings de clase -->
<div
  [class.tema-oscuro]="tema === 'oscuro'"
  [class.tema-claro]="tema === 'claro'"
  [class.destacado]="esDestacado"
>
  Contenido
</div>
```

**Binding de estilo individual:**

```html
<!-- Un estilo individual -->
<div [style.background-color]="colorFondo">Elemento</div>

<!-- Con unidad -->
<div [style.font-size.px]="tamanoFuente">Texto</div>

<!-- Múltiples bindings de estilo -->
<div
  [style.color]="colorTexto"
  [style.background-color]="colorFondo"
  [style.padding.px]="padding"
>
  Contenido con estilos
</div>
```

**Cuándo usar cada opción:**

| Situación | Recomendación |
|---|---|
| Una o dos clases/estilos condicionales | `[class.nombre]` / `[style.propiedad]` |
| Múltiples clases condicionales | `[ngClass]="{ ... }"` |
| Conjunto de clases fijas desde variable | `[ngClass]="variable"` |
| Múltiples estilos dinámicos | `[ngStyle]="{ ... }"` |
| Cálculos complejos de estilos | `[ngStyle]="metodoQueCalculaEstilos()"` |

### PARTE 3 - Directivas personalizadas

#### 3.1. Creación con @Directive

Una directiva personalizada es una clase TypeScript decorada con `@Directive`. El decorador requiere al menos un `selector` CSS que determina a qué elementos se aplica.

```typescript
// directivas/borde-destacado.directive.ts
import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appBordeDestacado]',  // Se aplica como atributo: <div appBordeDestacado>
  standalone: true
})
export class BordeDestacadoDirective {
  constructor(private elementRef: ElementRef) {
    // Accedemos al elemento nativo del DOM
    const elemento = this.elementRef.nativeElement as HTMLElement;

    // Modificamos su estilo
    elemento.style.border = '2px solid #1976d2';
    elemento.style.borderRadius = '8px';
    elemento.style.padding = '16px';
    elemento.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
  }
}
```

**Uso en plantilla:**

```html
<div appBordeDestacado>
  Este div tendrá un borde azul destacado.
</div>

<p appBordeDestacado>
  También funciona en párrafos.
</p>

<section appBordeDestacado>
  Y en cualquier elemento HTML.
</section>
```

#### 3.2. Acceso al elemento nativo con ElementRef

`ElementRef` es un servicio que proporciona acceso directo al elemento DOM nativo. Se inyecta en el constructor de la directiva:

```typescript
import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]',
  standalone: true
})
export class AutoFocusDirective implements OnInit {
  constructor(private elementRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    // Enfoca automáticamente el elemento cuando se renderiza
    this.elementRef.nativeElement.focus();
  }
}
```

```html
<input type="text" appAutoFocus placeholder="Este input se enfoca automáticamente" />
```

> **Precaución:** El acceso directo al DOM nativo debe usarse con moderación. Para la mayoría de casos, Angular proporciona mecanismos más seguros como `Renderer2` o las propias plantillas. El acceso directo puede causar problemas en entornos como Web Workers o Angular Universal (SSR), donde no hay un DOM real.

#### 3.3. Reacción a eventos con @HostListener

`@HostListener` permite escuchar eventos del elemento anfitrión (el elemento que tiene la directiva):

```typescript
import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appContadorClicks]',
  standalone: true
})
export class ContadorClicksDirective {
  private clicks = 0;

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  @HostListener('click')
  manejarClick(): void {
    this.clicks++;
    this.elementRef.nativeElement.setAttribute(
      'data-clicks',
      this.clicks.toString()
    );

    // Cambiar el color según el número de clicks
    const elemento = this.elementRef.nativeElement;
    if (this.clicks >= 10) {
      elemento.style.backgroundColor = '#ff5722';
    } else if (this.clicks >= 5) {
      elemento.style.backgroundColor = '#ffc107';
    } else {
      elemento.style.backgroundColor = '#81c784';
    }
  }
}
```

**Escuchar eventos específicos en elementos hijos:**

`@HostListener` también puede escuchar eventos que burbujean desde elementos hijos:

```typescript
@Directive({
  selector: '[appEscuchadorFormulario]',
  standalone: true
})
export class EscuchadorFormularioDirective {
  @HostListener('submit', ['$event'])
  alEnviarFormulario(evento: SubmitEvent): void {
    evento.preventDefault();
    console.log('Formulario enviado desde directiva');
    // Validación personalizada, logging, etc.
  }

  @HostListener('input', ['$event.target'])
  alCambiarInput(elemento: HTMLInputElement): void {
    console.log(`Campo "${elemento.name}" cambiado a: ${elemento.value}`);
  }
}
```

#### 3.4. Vinculación de propiedades con @HostBinding

`@HostBinding` vincula una propiedad de la directiva con una propiedad, atributo o clase del elemento anfitrión:

```typescript
import { Directive, HostBinding, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[appHoverResaltar]',
  standalone: true
})
export class HoverResaltarDirective {
  // Vincula la propiedad 'class.resaltado' del elemento host
  // Si estaResaltado es true, se añade la clase CSS 'resaltado'
  @HostBinding('class.resaltado') estaResaltado = false;

  // Vincula el estilo de fondo
  @HostBinding('style.backgroundColor') colorFondo = 'transparent';

  // Vincula el estilo de transformación
  @HostBinding('style.transform') transformacion = 'scale(1)';

  // Vincula un atributo ARIA para accesibilidad
  @HostBinding('attr.aria-expanded') ariaExpandido = 'false';

  @HostListener('mouseenter')
  alEntrarRaton(): void {
    this.estaResaltado = true;
    this.colorFondo = '#e3f2fd';
    this.transformacion = 'scale(1.02)';
    this.ariaExpandido = 'true';
  }

  @HostListener('mouseleave')
  alSalirRaton(): void {
    this.estaResaltado = false;
    this.colorFondo = 'transparent';
    this.transformacion = 'scale(1)';
    this.ariaExpandido = 'false';
  }
}
```

```css
/* Estilos en el componente o en styles.css global */
.resaltado {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  z-index: 10;
  position: relative;
}
```

#### 3.5. Ejemplo completo: directiva de highlight con parámetros

```typescript
// directivas/resaltar.directive.ts
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appResaltar]',
  standalone: true
})
export class ResaltarDirective {
  // Color de resaltado configurable desde la plantilla
  @Input('appResaltar') colorResaltado: string = '#fff176';

  // Color por defecto (configurable)
  @Input() colorBase: string = 'transparent';

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    // Color inicial
    this.elementRef.nativeElement.style.backgroundColor = this.colorBase;
    this.elementRef.nativeElement.style.transition = 'background-color 0.3s ease';
    this.elementRef.nativeElement.style.cursor = 'pointer';
    this.elementRef.nativeElement.style.padding = '8px 12px';
    this.elementRef.nativeElement.style.borderRadius = '4px';
  }

  @HostListener('mouseenter')
  alEntrar(): void {
    this.elementRef.nativeElement.style.backgroundColor = this.colorResaltado;
  }

  @HostListener('mouseleave')
  alSalir(): void {
    this.elementRef.nativeElement.style.backgroundColor = this.colorBase;
  }
}
```

**Uso:**

```html
<!-- Color de resaltado por defecto (amarillo) -->
<p appResaltar>Párrafo con resaltado amarillo al pasar el ratón</p>

<!-- Color de resaltado personalizado -->
<p [appResaltar]="'#90caf9'" [colorBase]="'#e3f2fd'">
  Párrafo con resaltado azul al pasar el ratón
</p>

<!-- En una tabla -->
<tr appResaltar="#ffccbc" colorBase="#fff3e0">
  <td>Fila resaltable</td>
</tr>
```

### PARTE 4 - Directivas estructurales (conceptos teóricos)

Aunque hoy se prefiere el Control Flow moderno, es importante entender los conceptos subyacentes ya que parte del ecosistema de Angular (bibliotecas, código legacy) aún usa directivas estructurales.

#### 4.1. El asterisco (*) como azúcar sintáctico

Cuando escribimos:

```html
<div *ngIf="condicion">Contenido</div>
```

Angular lo transforma (desugariza) internamente en:

```html
<ng-template [ngIf]="condicion">
  <div>Contenido</div>
</ng-template>
```

El `*` es una abreviatura que evita escribir explícitamente el `<ng-template>`. La directiva `NgIf` recibe la condición como input y decide si renderizar o no el contenido del template.

#### 4.2. ng-template y ng-container

- **`<ng-template>`:** Define un fragmento de plantilla que no se renderiza por sí mismo. Solo se muestra cuando una directiva estructural lo instancia explícitamente.
- **`<ng-container>`:** Es un elemento lógico que no genera ningún nodo en el DOM. Útil para agrupar elementos cuando no se quiere añadir un elemento HTML extra.

```html
<!-- Si no queremos un div extra como wrapper -->
<ng-container *ngIf="mostrarDatos">
  <h2>Título de sección</h2>
  <p>Contenido de la sección</p>
  <span>Otro elemento</span>
</ng-container>
<!-- No genera ningún div wrapper en el DOM -->
```

#### 4.3. Por qué hoy se prefiere el Control Flow moderno

El nuevo Control Flow (`@if`, `@for`, `@switch`) se implementa a nivel del compilador de Angular, mientras que las directivas estructurales se implementan a nivel de runtime. Esto proporciona varias ventajas:

- **Mejor rendimiento:** El compilador genera código optimizado directamente.
- **Mejor detección de errores:** El compilador puede validar la sintaxis en tiempo de compilación.
- **Sintaxis más familiar:** Más parecida a JavaScript/TypeScript estándar.
- **No necesita imports adicionales:** Siempre disponible.
- **Soporte nativo para @empty:** Resuelve elegantemente el estado de listas vacías.

## Ejemplos guiados

### Ejemplo 1: Lista de tareas con @if y @for

```typescript
// todo-list.component.ts
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

interface Tarea {
  id: number;
  titulo: string;
  completada: boolean;
  prioridad: 'alta' | 'media' | 'baja';
  fechaCreacion: Date;
}

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [FormsModule, DatePipe],
  template: `
    <div class="todo-container">
      <h1>Lista de Tareas</h1>

      <!-- Formulario para añadir tarea -->
      <div class="add-tarea">
        <input
          type="text"
          placeholder="Nueva tarea..."
          [value]="nuevaTarea()"
          (input)="nuevaTarea.set($any($event.target).value)"
          (keyup.enter)="agregarTarea()"
        />
        <select [value]="prioridadSeleccionada()"
          (change)="prioridadSeleccionada.set($any($event.target).value)">
          <option value="alta">Alta</option>
          <option value="media" selected>Media</option>
          <option value="baja">Baja</option>
        </select>
        <button (click)="agregarTarea()">Anadir</button>
      </div>

      <!-- Filtros -->
      <div class="filtros">
        <button (click)="filtro.set('todas')" [class.active]="filtro() === 'todas'">
          Todas ({{ tareas().length }})
        </button>
        <button (click)="filtro.set('pendientes')" [class.active]="filtro() === 'pendientes'">
          Pendientes ({{ tareasPendientes() }})
        </button>
        <button (click)="filtro.set('completadas')" [class.active]="filtro() === 'completadas'">
          Completadas ({{ tareasCompletadas() }})
        </button>
      </div>

      <!-- Lista de tareas con @for y @empty -->
      <ul class="tareas-lista">
        @for (tarea of tareasFiltradas(); track tarea.id; let i = $index) {
          <li
            class="tarea-item"
            [class.completada]="tarea.completada"
            [class.prioridad-alta]="tarea.prioridad === 'alta'"
          >
            <input
              type="checkbox"
              [checked]="tarea.completada"
              (change)="toggleTarea(tarea.id)"
            />
            <span class="tarea-titulo">{{ tarea.titulo }}</span>
            <span class="tarea-prioridad prioridad-{{ tarea.prioridad }}">
              {{ tarea.prioridad }}
            </span>
            <span class="tarea-fecha">{{ tarea.fechaCreacion | date:'shortDate' }}</span>
            <button class="btn-eliminar" (click)="eliminarTarea(tarea.id)">X</button>
          </li>
        } @empty {
          <li class="estado-vacio">
            @if (filtro() === 'todas') {
              <p>No hay tareas. Anade una nueva tarea.</p>
            } @else if (filtro() === 'pendientes') {
              <p>Todas las tareas estan completadas.</p>
            } @else {
              <p>No hay tareas completadas.</p>
            }
          </li>
        }
      </ul>
    </div>
  `,
  styles: [`
    .todo-container { max-width: 700px; margin: 2rem auto; }
    h1 { color: #333; margin-bottom: 1.5rem; }
    .add-tarea { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
    .add-tarea input { flex: 1; padding: 0.5rem; border: 1px solid #ccc; border-radius: 6px; }
    .add-tarea select { padding: 0.5rem; border: 1px solid #ccc; border-radius: 6px; }
    .add-tarea button {
      padding: 0.5rem 1rem;
      background: #1976d2;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }
    .filtros { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
    .filtros button {
      padding: 0.35rem 0.75rem;
      border: 1px solid #ccc;
      border-radius: 16px;
      background: white;
      cursor: pointer;
    }
    .filtros button.active { background: #1976d2; color: white; border-color: #1976d2; }
    .tareas-lista { list-style: none; padding: 0; }
    .tarea-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      border: 1px solid #eee;
      border-radius: 8px;
      margin-bottom: 0.5rem;
      background: white;
    }
    .tarea-item.completada { opacity: 0.6; }
    .tarea-item.completada .tarea-titulo { text-decoration: line-through; }
    .tarea-item.prioridad-alta { border-left: 4px solid #f44336; }
    .tarea-titulo { flex: 1; }
    .tarea-prioridad {
      font-size: 0.75rem;
      padding: 0.15rem 0.5rem;
      border-radius: 10px;
      font-weight: 600;
    }
    .prioridad-alta { background: #fbe9e7; color: #bf360c; }
    .prioridad-media { background: #fff8e1; color: #f57f17; }
    .prioridad-baja { background: #e8f5e9; color: #1b5e20; }
    .tarea-fecha { font-size: 0.8rem; color: #999; min-width: 80px; text-align: right; }
    .btn-eliminar {
      background: none; border: none; color: #e53935;
      cursor: pointer; font-weight: bold;
    }
    .estado-vacio { text-align: center; padding: 2rem; color: #999; }
  `]
})
export class TodoListComponent {
  tareas = signal<Tarea[]>([]);
  nuevaTarea = signal('');
  prioridadSeleccionada = signal<'alta' | 'media' | 'baja'>('media');
  filtro = signal<'todas' | 'pendientes' | 'completadas'>('todas');

  private siguienteId = 1;

  tareasPendientes = computed(() =>
    this.tareas().filter(t => !t.completada).length
  );

  tareasCompletadas = computed(() =>
    this.tareas().filter(t => t.completada).length
  );

  tareasFiltradas = computed(() => {
    const filtro = this.filtro();
    const todas = this.tareas();
    switch (filtro) {
      case 'pendientes': return todas.filter(t => !t.completada);
      case 'completadas': return todas.filter(t => t.completada);
      default: return todas;
    }
  });

  agregarTarea(): void {
    const titulo = this.nuevaTarea().trim();
    if (!titulo) return;

    this.tareas.update(current => [
      ...current,
      {
        id: this.siguienteId++,
        titulo,
        completada: false,
        prioridad: this.prioridadSeleccionada(),
        fechaCreacion: new Date()
      }
    ]);
    this.nuevaTarea.set('');
  }

  toggleTarea(id: number): void {
    this.tareas.update(current =>
      current.map(t => t.id === id ? { ...t, completada: !t.completada } : t)
    );
  }

  eliminarTarea(id: number): void {
    this.tareas.update(current => current.filter(t => t.id !== id));
  }
}
```

### Ejemplo 2: Sistema de temas con NgClass

```typescript
// theme-switcher.component.ts
import { Component, signal, computed } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [NgClass],
  template: `
    <div
      class="app-shell"
      [ngClass]="{
        'tema-claro': tema() === 'claro',
        'tema-oscuro': tema() === 'oscuro',
        'tema-alto-contraste': tema() === 'contraste',
        'fuente-grande': fuenteGrande(),
        'fuente-normal': !fuenteGrande()
      }"
    >
      <header class="app-header">
        <h1>Aplicacion con Temas Dinamicos</h1>

        <div class="theme-controls">
          <div class="control-group">
            <span>Tema:</span>
            <button
              [class.active]="tema() === 'claro'"
              (click)="cambiarTema('claro')"
            >Claro</button>
            <button
              [class.active]="tema() === 'oscuro'"
              (click)="cambiarTema('oscuro')"
            >Oscuro</button>
            <button
              [class.active]="tema() === 'contraste'"
              (click)="cambiarTema('contraste')"
            >Alto contraste</button>
          </div>

          <div class="control-group">
            <span>Tamano de fuente:</span>
            <button (click)="fuenteGrande.set(!fuenteGrande())">
              {{ fuenteGrande() ? 'Normal' : 'Grande' }}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section class="card">
          <h2>Seccion de ejemplo</h2>
          <p>Este texto cambia su apariencia segun el tema seleccionado.</p>
        </section>

        <section class="card">
          <h2>Botones de accion</h2>
          <button class="btn btn-primary">Accion primaria</button>
          <button class="btn btn-secondary">Accion secundaria</button>
          <button class="btn btn-danger">Accion peligrosa</button>
        </section>

        <section class="card">
          <h2>Tabla de datos</h2>
          <table>
            <thead>
              <tr><th>Columna 1</th><th>Columna 2</th><th>Columna 3</th></tr>
            </thead>
            <tbody>
              <tr><td>Dato 1</td><td>Dato 2</td><td>Dato 3</td></tr>
              <tr><td>Dato 4</td><td>Dato 5</td><td>Dato 6</td></tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  `,
  styles: [`
    /* Tema Claro */
    .tema-claro {
      --bg-primary: #ffffff;
      --bg-secondary: #f5f5f5;
      --text-primary: #212121;
      --text-secondary: #757575;
      --border-color: #e0e0e0;
      --accent: #1976d2;
    }
    /* Tema Oscuro */
    .tema-oscuro {
      --bg-primary: #121212;
      --bg-secondary: #1e1e1e;
      --text-primary: #e0e0e0;
      --text-secondary: #9e9e9e;
      --border-color: #333333;
      --accent: #64b5f6;
    }
    /* Tema Alto Contraste */
    .tema-alto-contraste {
      --bg-primary: #000000;
      --bg-secondary: #1a1a1a;
      --text-primary: #ffffff;
      --text-secondary: #cccccc;
      --border-color: #ffffff;
      --accent: #ffff00;
    }
    /* Base */
    .app-shell {
      background: var(--bg-primary);
      color: var(--text-primary);
      min-height: 100vh;
      transition: all 0.3s ease;
    }
    .fuente-grande { font-size: 1.2rem; }
    .fuente-normal { font-size: 1rem; }
    .app-header {
      background: var(--bg-secondary);
      padding: 1.5rem 2rem;
      border-bottom: 1px solid var(--border-color);
    }
    .theme-controls { margin-top: 1rem; display: flex; gap: 2rem; }
    .control-group { display: flex; align-items: center; gap: 0.5rem; }
    .control-group button {
      padding: 0.35rem 0.75rem;
      border: 1px solid var(--border-color);
      background: var(--bg-primary);
      color: var(--text-primary);
      border-radius: 4px;
      cursor: pointer;
    }
    .control-group button.active { background: var(--accent); color: white; }
    main { padding: 2rem; max-width: 900px; margin: 0 auto; }
    .card {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }
    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      margin-right: 0.5rem;
    }
    .btn-primary { background: var(--accent); color: white; }
    .btn-secondary { background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); }
    .btn-danger { background: #d32f2f; color: white; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid var(--border-color); }
  `]
})
export class ThemeSwitcherComponent {
  tema = signal<'claro' | 'oscuro' | 'contraste'>('claro');
  fuenteGrande = signal(false);

  cambiarTema(nuevoTema: 'claro' | 'oscuro' | 'contraste'): void {
    this.tema.set(nuevoTema);
  }
}
```

### Ejemplo 3: Directiva personalizada para lazy loading de imágenes

```typescript
// directivas/lazy-img.directive.ts
import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: 'img[appLazyImg]',
  standalone: true
})
export class LazyImgDirective implements OnInit, OnDestroy {
  @Input('appLazyImg') urlImagen: string = '';

  // URL de placeholder mientras carga
  @Input() placeholder: string = '';

  private observer?: IntersectionObserver;
  private cargada = false;
  private esNavegador: boolean;

  constructor(
    private elementRef: ElementRef<HTMLImageElement>,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.esNavegador = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    const img = this.elementRef.nativeElement;

    // Establecer placeholder inmediatamente
    if (this.placeholder) {
      img.src = this.placeholder;
    }

    // Añadir estilos de transición
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.5s ease';

    if (this.esNavegador && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && !this.cargada) {
              this.cargarImagen(img);
            }
          });
        },
        {
          rootMargin: '100px', // Cargar 100px antes de que sea visible
          threshold: 0.01
        }
      );

      this.observer.observe(img);
    } else {
      // Fallback para navegadores sin IntersectionObserver
      this.cargarImagen(img);
    }
  }

  private cargarImagen(img: HTMLImageElement): void {
    this.cargada = true;

    // Crear una imagen temporal para precargar
    const imgTemporal = new Image();
    imgTemporal.onload = () => {
      img.src = this.urlImagen;
      img.style.opacity = '1';
      img.classList.add('cargada');
    };
    imgTemporal.onerror = () => {
      // Si falla, mantener el placeholder o mostrar imagen de error
      img.style.opacity = '1';
      console.warn(`LazyImg: no se pudo cargar ${this.urlImagen}`);
    };
    imgTemporal.src = this.urlImagen;

    // Dejar de observar este elemento
    this.observer?.unobserve(img);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
```

**Uso:**

```html
<img
  [appLazyImg]="'https://ejemplo.com/imagen-real.jpg'"
  placeholder="assets/placeholder.svg"
  alt="Imagen con carga diferida"
  width="400"
  height="300"
/>
```

### Ejemplo 4: Directiva personalizada para permisos

```typescript
// directivas/permisos.directive.ts
import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnInit,
  OnDestroy,
  inject
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appPermisos]',
  standalone: true
})
export class PermisosDirective implements OnInit, OnDestroy {
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);
  private authService = inject(AuthService);

  private subscription?: Subscription;

  // Roles y/o permisos requeridos (separados por comas)
  @Input('appPermisos') permisosRequeridos: string = '';

  // Modo: 'mostrar' (por defecto) o 'ocultar' (invertir logica)
  @Input() modoPermisos: 'mostrar' | 'ocultar' = 'mostrar';

  ngOnInit(): void {
    this.evaluarPermisos();

    // Suscribirse a cambios en la sesion/usuario
    this.subscription = this.authService.cambiosUsuario$.subscribe(() => {
      this.evaluarPermisos();
    });
  }

  private evaluarPermisos(): void {
    const permisosNecesarios = this.permisosRequeridos
      .split(',')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    if (permisosNecesarios.length === 0) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      return;
    }

    const usuario = this.authService.usuarioActual();
    const tienePermiso = permisosNecesarios.some(
      permiso => usuario?.roles?.includes(permiso) || usuario?.permisos?.includes(permiso)
    );

    const debeMostrar = this.modoPermisos === 'mostrar' ? tienePermiso : !tienePermiso;

    this.viewContainer.clear();
    if (debeMostrar) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
```

**Uso:**

```html
<!-- Mostrar solo si el usuario es admin -->
<button *appPermisos="'admin'" (click)="eliminarTodo()">
  Eliminar todos los registros
</button>

<!-- Mostrar si tiene cualquiera de estos roles -->
<div *appPermisos="'admin, editor, moderador'">
  <h3>Panel de administracion</h3>
  <p>Solo visible para administradores, editores y moderadores.</p>
</div>

<!-- Ocultar si es admin (invertido) -->
<p *appPermisos="'admin'; modoPermisos: 'ocultar'">
  Este texto no se muestra a administradores.
</p>
```

## Ejercicios resueltos

### Ejercicio 1: Menú de navegación con @for y @if

**Enunciado:** Crear un sistema de navegación con items de menú que pueden tener submenús. Usar @for para iterar los items y @if/@else para mostrar/ocultar submenús desplegables. Implementar la funcionalidad de colapsar/expandir submenús.

```typescript
// navigation.component.ts
import { Component, signal } from '@angular/core';
import { NgClass } from '@angular/common';

interface MenuItem {
  id: string;
  etiqueta: string;
  icono: string;
  ruta?: string;
  hijos?: MenuItem[];
}

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [NgClass],
  template: `
    <nav class="sidebar-nav">
      <div class="nav-header">
        <h2>Panel de Control</h2>
      </div>

      <ul class="nav-list">
        @for (item of itemsMenu; track item.id) {
          <li class="nav-item">
            @if (item.hijos && item.hijos.length > 0) {
              <!-- Item con submenú desplegable -->
              <button
                class="nav-link has-children"
                [ngClass]="{ 'expanded': submenusExpandidos().has(item.id) }"
                (click)="toggleSubmenu(item.id)"
              >
                <span class="nav-icon">{{ item.icono }}</span>
                <span class="nav-label">{{ item.etiqueta }}</span>
                <span class="nav-arrow">
                  {{ submenusExpandidos().has(item.id) ? '&#9660;' : '&#9654;' }}
                </span>
              </button>

              @if (submenusExpandidos().has(item.id)) {
                <ul class="subnav-list">
                  @for (hijo of item.hijos; track hijo.id) {
                    <li>
                      <a class="subnav-link" [routerLink]="hijo.ruta">
                        <span class="nav-icon">{{ hijo.icono }}</span>
                        <span>{{ hijo.etiqueta }}</span>
                      </a>
                    </li>
                  }
                </ul>
              }
            } @else {
              <!-- Item simple sin submenú -->
              <a class="nav-link" [routerLink]="item.ruta">
                <span class="nav-icon">{{ item.icono }}</span>
                <span class="nav-label">{{ item.etiqueta }}</span>
              </a>
            }
          </li>
        }
      </ul>

      <div class="nav-footer">
        <p v1.0.0 - Panel de Administracion</p>
      </div>
    </nav>
  `,
  styles: [`
    .sidebar-nav {
      width: 260px;
      background: #1a237e;
      color: white;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .nav-header {
      padding: 1.5rem;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .nav-header h2 { margin: 0; font-size: 1.25rem; }
    .nav-list { list-style: none; padding: 0; margin: 0; flex: 1; }
    .nav-link, .subnav-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1.5rem;
      color: rgba(255,255,255,0.8);
      text-decoration: none;
      border: none;
      width: 100%;
      cursor: pointer;
      background: none;
      font-size: 0.95rem;
      transition: background 0.2s;
    }
    .nav-link:hover, .subnav-link:hover {
      background: rgba(255,255,255,0.1);
      color: white;
    }
    .nav-link.has-children { justify-content: space-between; }
    .nav-arrow { font-size: 0.7rem; }
    .subnav-list { list-style: none; padding: 0; background: rgba(0,0,0,0.2); }
    .subnav-link { padding-left: 3.5rem; font-size: 0.9rem; }
    .nav-footer { padding: 1rem 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.75rem; color: rgba(255,255,255,0.5); }
  `]
})
export class NavigationComponent {
  // Conjunto de IDs de submenús expandidos
  submenusExpandidos = signal<Set<string>>(new Set());

  itemsMenu: MenuItem[] = [
    {
      id: 'dashboard', etiqueta: 'Dashboard', icono: 'E',
      ruta: '/dashboard'
    },
    {
      id: 'productos', etiqueta: 'Productos', icono: '#',
      hijos: [
        { id: 'prod-list', etiqueta: 'Listado', icono: '-', ruta: '/productos' },
        { id: 'prod-add', etiqueta: 'Anadir nuevo', icono: '+', ruta: '/productos/nuevo' },
        { id: 'prod-cat', etiqueta: 'Categorias', icono: '=', ruta: '/productos/categorias' }
      ]
    },
    {
      id: 'usuarios', etiqueta: 'Usuarios', icono: '@',
      hijos: [
        { id: 'user-list', etiqueta: 'Todos los usuarios', icono: '-', ruta: '/usuarios' },
        { id: 'user-roles', etiqueta: 'Gestion de roles', icono: '*', ruta: '/usuarios/roles' }
      ]
    },
    {
      id: 'pedidos', etiqueta: 'Pedidos', icono: '$',
      ruta: '/pedidos'
    },
    {
      id: 'config', etiqueta: 'Configuracion', icono: '%',
      hijos: [
        { id: 'cfg-general', etiqueta: 'General', icono: '-', ruta: '/configuracion' },
        { id: 'cfg-tema', etiqueta: 'Tema', icono: '-', ruta: '/configuracion/tema' },
        { id: 'cfg-correo', etiqueta: 'Plantillas de correo', icono: '-', ruta: '/configuracion/correo' }
      ]
    }
  ];

  toggleSubmenu(id: string): void {
    this.submenusExpandidos.update(expandidos => {
      const nuevo = new Set(expandidos);
      if (nuevo.has(id)) {
        nuevo.delete(id);
      } else {
        nuevo.add(id);
      }
      return nuevo;
    });
  }
}
```

### Ejercicio 2: Directiva para validar fuerza de contraseña en tiempo real

```typescript
// directivas/fortaleza-password.directive.ts
import {
  Directive,
  ElementRef,
  HostListener,
  Renderer2,
  Input
} from '@angular/core';

interface ResultadoFortaleza {
  puntuacion: number;    // 0-100
  nivel: 'debil' | 'media' | 'fuerte' | 'muy-fuerte';
  color: string;
  etiqueta: string;
  requisitos: { texto: string; cumple: boolean }[];
}

@Directive({
  selector: '[appFortalezaPassword]',
  standalone: true
})
export class FortalezaPasswordDirective {
  @Input() longitudMinima: number = 8;
  @Input() mostrarRequisitos: boolean = true;

  private barraProgreso!: HTMLDivElement;
  private textoFortaleza!: HTMLSpanElement;
  private listaRequisitos!: HTMLUListElement;

  constructor(
    private elementRef: ElementRef<HTMLInputElement>,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.crearIndicadorFortaleza();
  }

  private crearIndicadorFortaleza(): void {
    const input = this.elementRef.nativeElement;
    const padre = input.parentElement;

    if (!padre) return;

    // Crear contenedor del indicador
    const contenedor = this.renderer.createElement('div');
    this.renderer.addClass(contenedor, 'fortaleza-password-container');
    this.renderer.setStyle(contenedor, 'margin-top', '0.5rem');

    // Barra de progreso
    this.barraProgreso = this.renderer.createElement('div');
    this.renderer.addClass(this.barraProgreso, 'fortaleza-barra');
    this.renderer.setStyle(this.barraProgreso, 'height', '6px');
    this.renderer.setStyle(this.barraProgreso, 'border-radius', '3px');
    this.renderer.setStyle(this.barraProgreso, 'background', '#e0e0e0');
    this.renderer.setStyle(this.barraProgreso, 'transition', 'all 0.3s ease');
    this.renderer.setStyle(this.barraProgreso, 'overflow', 'hidden');

    // Relleno de la barra
    const relleno = this.renderer.createElement('div');
    this.renderer.setStyle(relleno, 'height', '100%');
    this.renderer.setStyle(relleno, 'width', '0%');
    this.renderer.setStyle(relleno, 'transition', 'all 0.3s ease');
    this.renderer.setStyle(relleno, 'border-radius', '3px');
    this.renderer.appendChild(this.barraProgreso, relleno);

    // Texto de fortaleza
    this.textoFortaleza = this.renderer.createElement('span');
    this.renderer.setStyle(this.textoFortaleza, 'display', 'block');
    this.renderer.setStyle(this.textoFortaleza, 'margin-top', '0.35rem');
    this.renderer.setStyle(this.textoFortaleza, 'font-size', '0.8rem');
    this.renderer.setStyle(this.textoFortaleza, 'font-weight', '600');

    // Lista de requisitos
    this.listaRequisitos = this.renderer.createElement('ul');
    this.renderer.setStyle(this.listaRequisitos, 'list-style', 'none');
    this.renderer.setStyle(this.listaRequisitos, 'padding', '0');
    this.renderer.setStyle(this.listaRequisitos, 'margin', '0.35rem 0 0 0');
    this.renderer.setStyle(this.listaRequisitos, 'font-size', '0.75rem');

    // Ensamblar
    this.renderer.appendChild(contenedor, this.barraProgreso);
    this.renderer.appendChild(contenedor, this.textoFortaleza);
    this.renderer.appendChild(contenedor, this.listaRequisitos);
    this.renderer.appendChild(padre, contenedor);
  }

  @HostListener('input')
  alEscribir(): void {
    const password = this.elementRef.nativeElement.value;
    const resultado = this.evaluarFortaleza(password);

    // Actualizar barra de progreso
    const relleno = this.barraProgreso.firstChild as HTMLElement;
    if (relleno) {
      this.renderer.setStyle(relleno, 'width', `${resultado.puntuacion}%`);
      this.renderer.setStyle(relleno, 'background-color', resultado.color);
    }

    // Actualizar texto
    this.textoFortaleza.textContent = resultado.etiqueta;
    this.renderer.setStyle(this.textoFortaleza, 'color', resultado.color);

    // Actualizar requisitos
    this.actualizarRequisitos(resultado.requisitos);
  }

  private evaluarFortaleza(password: string): ResultadoFortaleza {
    if (!password) {
      return {
        puntuacion: 0,
        nivel: 'debil',
        color: '#e0e0e0',
        etiqueta: 'Escribe una contrasena',
        requisitos: this.obtenerRequisitos(password)
      };
    }

    let puntuacion = 0;

    // Longitud (hasta 30 puntos)
    const puntosLongitud = Math.min(password.length / this.longitudMinima * 30, 30);
    puntuacion += puntosLongitud;

    // Mayúsculas (15 puntos)
    if (/[A-Z]/.test(password)) puntuacion += 15;

    // Minúsculas (15 puntos)
    if (/[a-z]/.test(password)) puntuacion += 15;

    // Números (20 puntos)
    if (/\d/.test(password)) puntuacion += 20;

    // Caracteres especiales (20 puntos)
    if (/[^A-Za-z0-9]/.test(password)) puntuacion += 20;

    // Penalización si solo tiene un tipo de carácter
    const tipos = [/[A-Z]/, /[a-z]/, /\d/, /[^A-Za-z0-9]/]
      .filter(regex => regex.test(password)).length;
    if (tipos === 1 && password.length > 0) puntuacion = Math.min(puntuacion, 20);

    // Determinar nivel
    let nivel: ResultadoFortaleza['nivel'];
    let color: string;
    let etiqueta: string;

    if (puntuacion < 30) {
      nivel = 'debil';
      color = '#f44336';
      etiqueta = 'Debil';
    } else if (puntuacion < 60) {
      nivel = 'media';
      color = '#ff9800';
      etiqueta = 'Media';
    } else if (puntuacion < 80) {
      nivel = 'fuerte';
      color = '#4caf50';
      etiqueta = 'Fuerte';
    } else {
      nivel = 'muy-fuerte';
      color = '#2e7d32';
      etiqueta = 'Muy fuerte';
    }

    return {
      puntuacion: Math.min(100, puntuacion),
      nivel,
      color,
      etiqueta,
      requisitos: this.obtenerRequisitos(password)
    };
  }

  private obtenerRequisitos(password: string): { texto: string; cumple: boolean }[] {
    return [
      {
        texto: `Al menos ${this.longitudMinima} caracteres`,
        cumple: password.length >= this.longitudMinima
      },
      {
        texto: 'Al menos una mayuscula',
        cumple: /[A-Z]/.test(password)
      },
      {
        texto: 'Al menos una minuscula',
        cumple: /[a-z]/.test(password)
      },
      {
        texto: 'Al menos un numero',
        cumple: /\d/.test(password)
      },
      {
        texto: 'Al menos un caracter especial',
        cumple: /[^A-Za-z0-9]/.test(password)
      }
    ];
  }

  private actualizarRequisitos(requisitos: { texto: string; cumple: boolean }[]): void {
    // Limpiar lista actual
    while (this.listaRequisitos.firstChild) {
      this.renderer.removeChild(this.listaRequisitos, this.listaRequisitos.firstChild);
    }

    // Añadir items de requisitos
    for (const req of requisitos) {
      const item = this.renderer.createElement('li');
      this.renderer.setStyle(item, 'display', 'flex');
      this.renderer.setStyle(item, 'align-items', 'center');
      this.renderer.setStyle(item, 'gap', '0.35rem');
      this.renderer.setStyle(item, 'margin-bottom', '0.15rem');

      const icono = req.cumple ? 'E' : 'X';
      const color = req.cumple ? '#4caf50' : '#f44336';

      const spanIcono = this.renderer.createElement('span');
      spanIcono.textContent = icono;
      this.renderer.setStyle(spanIcono, 'color', color);
      this.renderer.setStyle(spanIcono, 'font-weight', 'bold');

      const spanTexto = this.renderer.createElement('span');
      spanTexto.textContent = req.texto;
      this.renderer.setStyle(spanTexto, 'color', color);

      this.renderer.appendChild(item, spanIcono);
      this.renderer.appendChild(item, spanTexto);
      this.renderer.appendChild(this.listaRequisitos, item);
    }
  }
}
```

**Uso:**

```html
<form>
  <div class="form-group">
    <label for="password">Contrasena:</label>
    <input
      type="password"
      id="password"
      appFortalezaPassword
      [longitudMinima]="8"
      [mostrarRequisitos]="true"
      placeholder="Escribe tu contrasena"
    />
  </div>
</form>
```

## Actividades propuestas

### Actividad 1: Galería de imágenes con filtros usando Control Flow (Nivel básico)

**Descripción:** Crear un componente de galería de imágenes con categorías, usando `@for` y `@if`.

**Tareas:**
1. Definir un array de imágenes (al menos 12) con propiedades: id, url, titulo, categoria, favorita.
2. Usar `@for` con `track` para mostrar la galería.
3. Implementar filtros de categoría con botones (usar `@if`/`@else` o `@switch`).
4. Usar `@empty` para mostrar mensaje cuando no haya imágenes en una categoría.
5. Implementar toggle de favorito con `@HostListener` en una directiva personalizada.
6. Añadir estilos condicionales con NgClass para imágenes favoritas.

**Duración estimada:** 1.5 horas.

### Actividad 2: Tabla de datos dinámica con ordenación (Nivel medio)

**Descripción:** Implementar una tabla de datos genérica que permita ordenar por columnas usando Control Flow y directivas personalizadas.

**Tareas:**
1. Crear un componente `DataTable` que reciba columnas (config) y filas (datos) como inputs.
2. Usar `@for` con variables implícitas (`$index`, `$first`, etc.) para la tabla.
3. Crear una directiva `appSortable` para cabeceras de columna que permita ordenar.
4. Implementar ordenación ascendente/descendente con señales.
5. Usar `@empty` para el estado sin datos.
6. Añadir estilos `$even`/`$odd` para filas alternas con NgClass.

**Duración estimada:** 2 horas.

### Actividad 3: Acordeón (accordion) reutilizable con directivas (Nivel medio)

**Descripción:** Construir un sistema de acordeón usando directivas personalizadas y Control Flow.

**Tareas:**
1. Crear una directiva `appAccordionItem` que gestione el estado expandido/colapsado de cada item.
2. Crear un componente `AccordionGroup` que orqueste múltiples items.
3. Implementar animación de apertura/cierre con transiciones CSS.
4. Soportar modo "single" (solo un item abierto) y "multiple" (varios items abiertos).
5. Usar `@HostBinding` para el estado visual y `@HostListener` para clicks.

**Duración estimada:** 2 horas.

### Actividad 4: Sistema de tabs con contenido dinámico (Nivel medio)

**Descripción:** Implementar un componente de pestañas (tabs) usando `@switch` para el contenido.

**Tareas:**
1. Crear un componente `TabGroup` y componentes `Tab`.
2. Usar `@switch` para mostrar el contenido de la pestaña activa.
3. Implementar navegación entre pestañas con teclado (ArrowLeft/ArrowRight) usando `@HostListener`.
4. Añadir animaciones de transición entre pestañas.
5. Soportar pestañas dinámicas (añadir/eliminar).
6. Usar señales para el estado de pestaña activa.

**Duración estimada:** 1.5 horas.

### Actividad 5: Formulario con validación visual en tiempo real (Nivel avanzado)

**Descripción:** Crear un formulario de registro que muestre feedback visual en tiempo real usando NgClass y directivas personalizadas.

**Tareas:**
1. Crear campos: nombre, email, contraseña, confirmar contraseña, teléfono.
2. Usar NgClass para reflejar estados: `ng-valid`, `ng-invalid`, `ng-touched`, `ng-dirty`.
3. Crear una directiva `appValidacionCampo` que añada clases dinámicas según estado.
4. Crear una directiva `appCoincidirCon` para validar que dos campos coincidan.
5. Mostrar mensajes de error condicionales con `@if`.

**Duración estimada:** 2 horas.

## Actividades de ampliación

### Actividad de ampliación 1: Biblioteca de directivas reutilizables

**Descripción:** Crear una pequeña biblioteca de directivas de uso común.

**Tareas:**
1. `appScrollReveal`: revela elementos con animación al hacer scroll.
2. `appTooltip`: muestra tooltip personalizado al hacer hover.
3. `appCopyToClipboard`: copia texto al portapapeles al hacer clic.
4. `appCurrencyInput`: formatea un input como moneda mientras se escribe.
5. Empaquetarlas como una librería Angular (secondary entry point).

**Duración estimada:** 3 horas.

### Actividad de ampliación 2: Sistema de drag and drop con directivas

**Descripción:** Implementar un sistema de arrastrar y soltar usando directivas personalizadas.

**Tareas:**
1. Crear directiva `appDraggable` para elementos arrastrables.
2. Crear directiva `appDroppable` para zonas donde soltar.
3. Implementar feedback visual durante el arrastre.
4. Soportar restricciones (solo mover dentro de cierta zona).
5. Emitir eventos al soltar con los datos transferidos.

**Duración estimada:** 3 horas.

### Actividad de ampliación 3: Editor WYSIWYG mínimo con ContentEditable

**Descripción:** Crear directivas que habiliten un editor de texto enriquecido básico.

**Tareas:**
1. Directiva `appContentEditable` para hacer un div editable.
2. Directiva `appFormatCommand` para aplicar formato (negrita, cursiva, subrayado).
3. Barra de herramientas que use las directivas de formato.
4. Sincronizar contenido con FormControl de Angular.
5. Sanitizar el HTML generado para evitar XSS.

**Duración estimada:** 3.5 horas.

## Buenas prácticas profesionales

1. **Usar el nuevo Control Flow siempre que sea posible:** El Control Flow moderno (`@if`, `@for`, `@switch`) ofrece mejor rendimiento, sintaxis más clara y no requiere imports adicionales. Migrar gradualmente el código legacy que use `*ngIf`, `*ngFor`, `*ngSwitch`.

2. **Track by con identificadores únicos:** En `@for`, usar siempre un identificador único de negocio (como `producto.id`) en lugar de `track $index`, a menos que la lista sea estática. Esto garantiza la correcta reutilización del DOM y evita comportamientos inesperados.

3. **Evitar lógica compleja en las plantillas:** Las expresiones dentro de `@if` y `@for` deben ser simples. Si se necesita lógica compleja (filtrado, mapeo, cálculos), usar `computed()` en el componente y exponer el resultado como signal o propiedad.

4. **Preferir [class.nombre] y [style.propiedad] para bindings individuales:** Son más eficientes que `NgClass`/`NgStyle` cuando solo se necesita modificar una o dos propiedades. Reservar `NgClass`/`NgStyle` para casos con múltiples clases o estilos dinámicos.

5. **Directivas con selectores CSS precisos:** Usar selectores que minimicen falsos positivos. Por ejemplo, `[appTooltip]` es mejor que `[tooltip]` para evitar colisiones con atributos HTML nativos o de otras bibliotecas.

6. **Usar Renderer2 en lugar de manipulación directa del DOM:** Para aplicaciones que puedan ejecutarse en entornos sin DOM (SSR con Angular Universal, Web Workers), usar `Renderer2` para manipular elementos de forma segura y compatible.

   ```typescript
   // En lugar de:
   element.nativeElement.style.backgroundColor = 'red';
   // Usar:
   renderer.setStyle(element.nativeElement, 'background-color', 'red');
   ```

7. **Limpiar recursos en ngOnDestroy:** Si una directiva crea listeners, observers o suscripciones, debe limpiarlos en `ngOnDestroy` para evitar memory leaks.

8. **Documentar directivas personalizadas:** Especificar claramente el selector, los inputs disponibles, el comportamiento esperado y ejemplos de uso mediante JSDoc.

## Errores frecuentes

1. **Olvidar el `track` en `@for`:** El compilador de Angular exige `track`. No compilará sin él. Si no hay propiedad única, se puede usar `track $index`, pero esto debe ser una decisión consciente por las razones ya mencionadas.

2. **Manipular el DOM directamente sin Renderer2:** `elementRef.nativeElement.style.property = 'value'` funciona en el navegador, pero rompe en SSR y dificulta los tests. Usar `Renderer2` para operaciones DOM.

3. **Usar `NgClass` con lógica compleja en el template:** Poner ternarios anidados o métodos que calculan clases directamente en `[ngClass]` es difícil de leer y depurar. Es mejor mover esa lógica al componente:

   ```typescript
   // Mal en template:
   [ngClass]="item.activo ? 'activo' : item.pendiente ? 'pendiente' : 'inactivo'"

   // Mejor en componente:
   claseEstado = computed(() => {
     if (this.item().activo) return 'activo';
     if (this.item().pendiente) return 'pendiente';
     return 'inactivo';
   });
   // Template: [ngClass]="claseEstado()"
   ```

4. **Crear directivas cuando un componente es mejor opción:** Si la funcionalidad necesita una plantilla o una interfaz de usuario significativa, probablemente debería ser un componente, no una directiva. Las directivas son ideales para comportamientos (hover, focus, scroll) o modificaciones de atributos.

5. **No importar las directivas standalone:** Al igual que con los pipes y componentes standalone, las directivas standalone deben importarse explícitamente en el array `imports` del componente donde se usan. Angular no las descubre automáticamente.

6. **No manejar el caso `@empty`:** Es fácil olvidar el bloque `@empty` y dejar que la lista simplemente no muestre nada cuando está vacía, lo que confunde al usuario. Siempre proporcionar feedback visual para listas vacías.

7. **Anidar demasiados bloques @if/@for:** Cuando los bloques de Control Flow se anidan 3-4 niveles, la plantilla se vuelve difícil de leer. Extraer partes en componentes separados.

8. **Sobrecargar NgClass con muchas clases condicionales:** Si un elemento tiene más de 5-6 clases aplicadas condicionalmente mediante NgClass, considerar si el diseño se puede simplificar o si algunas clases pueden combinarse en una sola clase semántica.

## Resumen

Las directivas son un pilar fundamental de Angular que permite extender el comportamiento del DOM de forma declarativa y reutilizable. Con la introducción del nuevo Control Flow (`@if`, `@for`, `@switch`), Angular ha dado un paso adelante en claridad y rendimiento, reemplazando progresivamente a las directivas estructurales clásicas.

El Control Flow moderno ofrece una sintaxis más limpia y cercana a JavaScript, con ventajas como el `track` obligatorio en `@for` (que garantiza un rendimiento óptimo), el bloque `@empty` para estados vacíos, y la capacidad de almacenar resultados condicionales con `as`.

Las directivas de atributo como `NgClass` y `NgStyle` siguen siendo herramientas valiosas para aplicar estilos dinámicos, complementadas por los bindings individuales `[class.nombre]` y `[style.propiedad]` para casos más simples.

La creación de directivas personalizadas abre un mundo de posibilidades para encapsular comportamientos reutilizables: desde efectos visuales (hover, scroll) hasta interacciones complejas como drag and drop o validación en tiempo real. Con `@HostListener`, `@HostBinding` y `ElementRef`, las directivas pueden reaccionar a eventos del DOM y modificar el elemento anfitrión de forma segura y mantenible.

## Recursos adicionales

- [Documentación oficial: Control Flow (@if, @for, @switch)](https://angular.dev/guide/templates/control-flow)
- [Documentación oficial: NgClass](https://angular.dev/api/common/NgClass)
- [Documentación oficial: NgStyle](https://angular.dev/api/common/NgStyle)
- [Documentación oficial: Directivas de atributo](https://angular.dev/guide/directives/attribute-directives)
- [Documentación oficial: Directivas estructurales](https://angular.dev/guide/directives/structural-directives)
- [Angular Blog: Introducing the new Control Flow](https://blog.angular.dev/meet-angulars-new-control-flow-a02c6eee7843)
- [Guía de migración de directivas estructurales a Control Flow](https://angular.dev/guide/templates/control-flow#migration-guide)
- [Intersection Observer API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
