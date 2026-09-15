# Plantillas en Angular

## Objetivos de aprendizaje

Al finalizar esta unidad, el alumnado será capaz de:

1. Dominar la sintaxis de interpolación para mostrar datos dinámicos en plantillas Angular.
2. Utilizar property binding para vincular propiedades de elementos HTML a expresiones del componente.
3. Implementar event binding para responder a interacciones del usuario.
4. Comprender y aplicar two-way binding con `[(ngModel)]`.
5. Utilizar variables locales de plantilla para referenciar elementos del DOM.
6. Diferenciar entre atributos HTML y propiedades DOM, aplicando el binding adecuado.
7. Escribir expresiones de plantilla seguras, idempotentes y eficientes.
8. Aplicar medidas de seguridad para prevenir vulnerabilidades XSS en plantillas.

## Resultados de aprendizaje

Tras completar esta unidad, el estudiante será capaz de:

- Crear formularios interactivos utilizando todos los tipos de binding de Angular.
- Depurar errores comunes de binding en plantillas.
- Utilizar el objeto `$event` para acceder a información detallada de eventos del DOM.
- Implementar filtrado de eventos de teclado para mejorar la experiencia de usuario.
- Aplicar el operador de navegación segura y la aserción non-null en contextos apropiados.
- Construir componentes con comunicación de datos fluida entre la lógica TypeScript y la vista HTML.

## Introducción

Las plantillas (templates) son el puente entre la lógica de negocio (TypeScript) y la interfaz de usuario (HTML) en Angular. Son, probablemente, el aspecto más visible y tangible del framework: lo que el usuario final ve y con lo que interactúa directamente. Una plantilla bien diseñada no solo muestra datos correctamente, sino que lo hace de forma eficiente, segura y mantenible.

Angular extiende el HTML estándar con una sintaxis de binding que permite una conexión dinámica entre el componente y el DOM. Esta sintaxis, que con el tiempo se convierte en algo natural para el desarrollador, es uno de los superpoderes de Angular: permite crear interfaces reactivas sin necesidad de manipular manualmente el DOM con `document.getElementById` o `addEventListener`, como se hacía en la era pre-frameworks.

En esta unidad, vamos a desglosar cada tipo de binding, entender cómo funciona internamente, cuándo usar cada uno y qué errores evitar. Dedicaremos especial atención a la nueva sintaxis de control de flujo (`@if`, `@for`, `@switch`), que ha reemplazado a las directivas estructurales clásicas (`*ngIf`, `*ngFor`, `*ngSwitch`), ofreciendo una experiencia más cercana a los lenguajes de plantillas modernos.

Piensa en las plantillas como el escenario de un teatro. Los actores (componentes) tienen su guion (TypeScript), pero el público (usuarios) solo ve lo que ocurre en el escenario (HTML). Cuanto mejor sea la conexión entre el guion y la puesta en escena, más cautivadora será la función.

## Desarrollo teórico

### Interpolación

La interpolación es la forma más simple de data binding en Angular. Permite mostrar el valor de una propiedad del componente en la plantilla HTML utilizando la sintaxis de dobles llaves `{{ }}`.

#### Sintaxis básica

```typescript
// componente.ts
export class SaludoComponent {
  nombre: string = 'María';
  edad: number = 28;
  activo: boolean = true;
}
```

```html
<!-- componente.html -->
<p>Hola, {{ nombre }}</p>
<p>Edad: {{ edad }}</p>
<p>Estado: {{ activo ? 'Activo' : 'Inactivo' }}</p>
```

Cuando Angular procesa esta plantilla, evalúa las expresiones entre llaves, las convierte a string y las inserta en el DOM. Si el valor de `nombre` cambia (por ejemplo, de 'María' a 'Carlos'), Angular actualiza automáticamente el texto mostrado.

#### ¿Qué se puede poner dentro de {{ }}?

La interpolación acepta **expresiones TypeScript** que cumplan estas características:

**Expresiones permitidas**:

- **Propiedades del componente**: `{{ titulo }}`, `{{ usuario.nombre }}`, `{{ usuario.direccion?.calle }}`
- **Operaciones matemáticas**: `{{ precio * cantidad }}`, `{{ (total / items.length) | number:'1.2-2' }}`
- **Concatenación de strings**: `{{ 'Hola ' + nombre + ' ' + apellido }}`
- **Template literals**: `{{ `Bienvenido/a ${nombre}` }}`
- **Llamadas a métodos del componente** (con precaución): `{{ formatearFecha(fecha) }}`
- **Operadores ternarios**: `{{ isLoggedIn ? nombre : 'Invitado' }}`
- **Operadores lógicos**: `{{ isActive && hasPermission }}`
- **Pipes**: `{{ fecha | date:'dd/MM/yyyy' }}`, `{{ precio | currency:'EUR' }}`

**Expresiones NO permitidas**:

```html
<!-- ❌ Asignaciones -->
{{ nombre = 'Otro' }}

<!-- ❌ Operadores de incremento/decremento -->
{{ contador++ }}
{{ --indice }}

<!-- ❌ Operadores de asignación compuesta -->
{{ precio += 5 }}

<!-- ❌ La palabra clave new -->
{{ new Date() }}

<!-- ❌ Punto y coma (encadenar expresiones) -->
{{ a = 5; b = 10; a + b }}

<!-- ❌ Variables globales del navegador -->
{{ window.location.href }}
{{ document.title }}
{{ console.log(algo) }}
```

La razón de estas restricciones es doble: seguridad (evitar ejecución de código arbitrario) y rendimiento (las expresiones deben ser rápidas e idempotentes).

#### Seguridad XSS (Cross-Site Scripting)

Angular sanitiza automáticamente los valores interpolados para prevenir ataques XSS. Cualquier valor que se muestre mediante interpolación se trata como texto plano, NO como HTML:

```typescript
export class SeguridadComponent {
  entradaUsuario = '<script>alert("HACKED!")</script>';
  htmlMalo = '<img src="x" onerror="alert(\'HACK\')">';
}
```

```html
<!-- Ambos se muestran como TEXTO PLANO, no se ejecutan -->
<p>{{ entradaUsuario }}</p>
<!-- Resultado: se muestra literalmente el texto <script>alert("HACKED!")</script> -->

<p>{{ htmlMalo }}</p>
<!-- Resultado: se muestra literalmente el texto, la imagen NO se crea -->
```

Para renderizar HTML dinámico de forma segura (por ejemplo, contenido de un CMS), Angular proporciona la propiedad `[innerHTML]` con `DomSanitizer`. Pero esto debe usarse con extrema precaución:

```typescript
import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({...})
export class ContenidoComponent {
  htmlSeguro: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {
    const contenido = '<p>Contenido <strong>seguro</strong> del CMS</p>';
    this.htmlSeguro = this.sanitizer.bypassSecurityTrustHtml(contenido);
  }
}
```

```html
<div [innerHTML]="htmlSeguro"></div>
```

**Regla de oro**: nunca uses `bypassSecurityTrustHtml` con datos provenientes del usuario sin sanitizarlos exhaustivamente.

#### Operador de navegación segura (?.) y aserción non-null (!)

El operador `?.` (safe navigation operator) evita errores cuando se accede a propiedades de objetos que pueden ser `null` o `undefined`:

```html
<!-- ❌ Sin operador seguro: error si usuario o direccion es null/undefined -->
<p>{{ usuario.direccion.ciudad }}</p>

<!-- ✅ Con operador seguro: simplemente no muestra nada -->
<p>{{ usuario?.direccion?.ciudad }}</p>

<!-- ✅ Combinado con valores por defecto -->
<p>{{ usuario?.direccion?.ciudad || 'Ciudad no especificada' }}</p>
```

El operador `!` (non-null assertion) le dice al compilador de TypeScript: "confía en mí, esta expresión no es null/undefined":

```html
<p>{{ usuario!.direccion!.ciudad }}</p>
```

**Precaución**: usar `!` en exceso puede ocultar errores reales. Es preferible inicializar las propiedades con valores por defecto o usar el operador `?.`.

#### Uso de pipes en interpolación

Los pipes son funciones que transforman datos para su visualización. Se aplican con el operador `|`:

```html
<!-- Formateo de fechas -->
<p>{{ fechaNacimiento | date:'dd/MM/yyyy' }}</p>
<p>{{ ahora | date:'HH:mm:ss' }}</p>

<!-- Formateo de números y moneda -->
<p>{{ precio | currency:'EUR':'symbol':'1.2-2' }}</p>
<p>{{ ratio | percent:'1.0-1' }}</p>

<!-- Transformación de texto -->
<p>{{ nombre | uppercase }}</p>
<p>{{ descripcion | lowercase }}</p>
<p>{{ texto | titlecase }}</p>
<p>{{ resumen | slice:0:100 }}...</p>

<!-- JSON (debugging) -->
<pre>{{ objetoComplejo | json }}</pre>

<!-- Pipes encadenados -->
<p>{{ fecha | date:'fullDate' | uppercase }}</p>
```

Los pipes son "puros" por defecto: solo se ejecutan cuando detectan un cambio "puro" en la entrada (cambio de referencia para objetos, cambio de valor para primitivos). Esto mejora el rendimiento porque Angular no reevalúa el pipe en cada ciclo de detección de cambios a menos que la entrada haya cambiado.

### Property Binding

El property binding vincula una propiedad del DOM de un elemento HTML con una expresión del componente. Se escribe con corchetes `[propiedad]="expresión"`.

#### Diferencia entre atributo HTML y propiedad DOM

Este es uno de los conceptos más confusos para principiantes, pero es fundamental entenderlo:

- **Atributo HTML**: se define en el HTML estático. Es la configuración inicial del elemento. No cambia después de la renderización inicial.
- **Propiedad DOM**: es el valor actual en el árbol DOM (JavaScript). Cambia dinámicamente con la interacción del usuario y la lógica de la aplicación.

Ejemplo clásico: un campo de texto `<input>`.

```html
<input type="text" value="Nombre inicial">
```

- El **atributo HTML** `value` siempre será `"Nombre inicial"` (valor estático).
- La **propiedad DOM** `value` cambia cada vez que el usuario escribe en el campo.

Angular trabaja con **propiedades DOM**, no con atributos HTML. Por eso el property binding se vincula a la propiedad, no al atributo:

```html
<!-- Property binding: vincula la propiedad DOM 'value' -->
<input [value]="nombre">
```

#### Tipos de Property Binding

##### Property binding estándar

```html
<!-- Vinculación de propiedades de elementos HTML -->
<img [src]="imagenUrl" [alt]="descripcionImagen">
<button [disabled]="formularioInvalido">Guardar</button>
<input [value]="nombre" [placeholder]="textoPlaceholder">
<progress [value]="progreso" [max]="100"></progress>

<!-- Vinculación de propiedades de componentes Angular -->
<app-usuario [nombre]="usuario.nombre" [email]="usuario.email"></app-usuario>
```

##### Attribute binding

Cuando necesitas vincular un atributo HTML (no una propiedad DOM), usas `[attr.atributo]`:

```html
<!-- Atributos que no tienen propiedad DOM equivalente -->
<td [attr.colspan]="numeroColumnas">Contenido</td>
<div [attr.aria-label]="etiquetaAccesibilidad">...</div>
<button [attr.aria-expanded]="expandido">Menú</button>
<svg [attr.viewBox]="viewBox">...</svg>
```

¿Cuándo usar attribute binding en lugar de property binding?

- Atributos de accesibilidad (`aria-*`): algunos no tienen propiedad DOM.
- Atributos de tablas (`colspan`, `rowspan`): no tienen propiedad DOM en todos los navegadores.
- Atributos SVG: muchos no tienen propiedades DOM equivalentes.
- Atributos `data-*` personalizados.

##### Class binding

Controla las clases CSS de un elemento de forma dinámica:

```html
<!-- Clase única: añade 'activo' si la expresión es true -->
<div [class.activo]="isActivo">Contenido</div>

<!-- Múltiples clases individuales -->
<div
  [class.activo]="usuario.activo"
  [class.admin]="usuario.rol === 'admin'"
  [class.premium]="usuario.suscripcion === 'premium'">
  {{ usuario.nombre }}
</div>

<!-- Alternativa: NgClass para múltiples clases -->
<div [ngClass]="{
  'activo': usuario.activo,
  'admin': usuario.rol === 'admin',
  'premium': usuario.suscripcion === 'premium',
  'baneado': usuario.baneado
}">
  {{ usuario.nombre }}
</div>
```

La sintaxis `[class.nombre-clase]="expresión"`:
- Añade la clase si la expresión es `true`.
- Elimina la clase si la expresión es `false`.
- No afecta a otras clases que el elemento ya tenga.

##### Style binding

Controla estilos CSS inline de forma dinámica:

```html
<!-- Estilo individual -->
<div [style.color]="esError ? 'red' : 'inherit'">Mensaje</div>
<div [style.font-size.px]="tamanoFuente">Texto</div>
<div [style.background-color]="colorFondo">Contenedor</div>

<!-- Con unidades (sufijo después del estilo) -->
<div [style.width.px]="ancho">...</div>
<div [style.height.%]="porcentaje">...</div>
<div [style.margin.em]="1.5">...</div>
<div [style.opacity]="transparencia">...</div>

<!-- NgStyle para múltiples estilos -->
<div [ngStyle]="{
  'color': colorTexto,
  'font-size.px': tamanoFuente,
  'background-color': colorFondo,
  'padding': padding + 'px'
}">
  Contenido estilizado dinámicamente
</div>
```

**Precaución**: los estilos inline tienen la máxima especificidad CSS. Si abusas de ellos, te resultará difícil sobrescribirlos con hojas de estilo externas. Siempre que sea posible, prefiere class binding + CSS.

### Event Binding

El event binding permite al componente responder a eventos del DOM (clics, teclado, ratón, etc.) ejecutando métodos definidos en la clase del componente. Se escribe con paréntesis `(evento)="manejador($event)"`.

#### Event binding básico

```typescript
export class BotonComponent {
  contador = 0;
  mensaje = '';

  onClick(): void {
    this.contador++;
    this.mensaje = `Botón pulsado ${this.contador} veces`;
  }

  onMouseEnter(): void {
    console.log('El cursor entró en el botón');
  }

  onMouseLeave(): void {
    console.log('El cursor salió del botón');
  }
}
```

```html
<button
  (click)="onClick()"
  (mouseenter)="onMouseEnter()"
  (mouseleave)="onMouseLeave()">
  {{ mensaje || 'Púlsame' }}
</button>
```

#### El objeto $event

`$event` es una variable especial disponible en los manejadores de eventos que contiene el objeto del evento nativo del DOM. Su tipo depende del evento:

```html
<!-- Eventos de ratón: $event es MouseEvent -->
<div (click)="manejarClick($event)"
     (mousemove)="rastrearRaton($event)"
     (contextmenu)="mostrarContextual($event)">
</div>

<!-- Eventos de teclado: $event es KeyboardEvent -->
<input (keydown)="detectarTecla($event)"
       (keyup)="validarEntrada($event)">

<!-- Eventos de formulario: $event es Event -->
<input (input)="procesarInput($event)"
       (change)="validarCambio($event)"
       (focus)="marcarActivo($event)"
       (blur)="validarCampo($event)">
```

```typescript
export class EventosComponent {
  manejarClick(event: MouseEvent): void {
    console.log('Coordenadas del clic:', event.clientX, event.clientY);
    console.log('Botón usado:', event.button);     // 0=izq, 1=centro, 2=der
    console.log('¿Tecla Shift?', event.shiftKey);
    console.log('Elemento clickeado:', event.target);

    // Prevenir comportamiento por defecto
    event.preventDefault();

    // Detener propagación del evento
    event.stopPropagation();
  }

  detectarTecla(event: KeyboardEvent): void {
    console.log('Tecla presionada:', event.key);
    console.log('Código de tecla:', event.code);

    if (event.key === 'Escape') {
      console.log('Se presionó Escape - cerrando modal');
    }

    if (event.ctrlKey && event.key === 's') {
      console.log('Ctrl+S - guardando');
      event.preventDefault();  // Prevenir el guardado del navegador
    }
  }

  getValue(event: Event): string {
    const input = event.target as HTMLInputElement;
    return input.value;
  }
}
```

#### Eventos de teclado y filtrado

Angular proporciona una sintaxis para filtrar eventos de teclado por tecla específica con la notación `(keydown.tecla)`:

```html
<!-- Escuchar solo teclas específicas -->
<input (keydown.enter)="buscar()">
<input (keydown.escape)="cerrarModal()">
<input (keydown.arrowup)="moverArriba()">
<input (keydown.arrowdown)="moverAbajo()">
<input (keydown.space)="toggleSeleccion()">
<input (keydown.tab)="manejarTab($event)">

<!-- Combinaciones de teclas -->
<textarea (keydown.control.enter)="enviarFormulario()">
<textarea (keydown.shift.enter)="agregarNuevaLinea()">
<textarea (keydown.alt.arrowleft)="anteriorPestana()">

<!-- Filtrado con el evento keyup -->
<input (keyup.enter)="busqueda.set($any($event.target).value)">
```

Lista de teclas soportadas (alias de Angular):
- Letras: `a`, `b`, `c`, ..., `z`
- Números: `0`, `1`, ..., `9`
- Flechas: `arrowup`, `arrowdown`, `arrowleft`, `arrowright`
- Especiales: `enter`, `escape`, `space`, `tab`, `backspace`, `delete`
- Modificadores: `shift`, `control` (o `ctrl`), `alt` (o `meta`)

También puedes combinar modificadores: `(keydown.control.shift.z)` para Ctrl+Shift+Z.

#### Eventos de formulario

```html
<!-- Evento input: se dispara en cada cambio (útil para búsquedas en tiempo real) -->
<input (input)="filtrarResultados($event)">

<!-- Evento change: se dispara al perder el foco (después de terminar de editar) -->
<input (change)="guardarCambio($event)">

<!-- Evento focus/blur -->
<input (focus)="mostrarAyuda()">
<input (blur)="validarCampo($event)">

<!-- Evento submit en formularios -->
<form (ngSubmit)="procesarFormulario()">
  <input name="nombre" [(ngModel)]="modelo.nombre">
  <button type="submit">Enviar</button>
</form>
```

**Importante sobre `(submit)` vs `(ngSubmit)`**:
- `(submit)` es el evento nativo del DOM. Se dispara con el botón submit y con Enter.
- `(ngSubmit)` es un evento de Angular que NO se dispara si el formulario no es válido (cuando se usan validaciones). Es la opción recomendada en formularios Angular.

### Two-way Binding

El two-way binding combina property binding y event binding en una sola sintaxis, permitiendo que los cambios en el template se reflejen automáticamente en el componente y viceversa.

#### Sintaxis "banana in a box"

La sintaxis `[( )]` se conoce coloquialmente como "banana in a box" (un plátano dentro de una caja):

```html
<input [(ngModel)]="nombre">
<!-- 
  Esto es equivalente a:
  <input [ngModel]="nombre" (ngModelChange)="nombre = $event">
-->
```

Para usar `[(ngModel)]`, necesitas importar `FormsModule` en el componente:

```typescript
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [FormsModule],
  // ...
})
```

#### Desglose: cómo funciona

`[(ngModel)]` no es magia. Es azúcar sintáctico que se descompone en:

```html
<!-- Two-way binding: forma corta -->
<input [(ngModel)]="nombre">

<!-- Equivalente: property binding + event binding -->
<input
  [ngModel]="nombre"
  (ngModelChange)="nombre = $event">
```

Esto significa que:
1. `[ngModel]="nombre"`: cuando `nombre` cambia en el componente, el input se actualiza.
2. `(ngModelChange)="nombre = $event"`: cuando el usuario escribe en el input, `nombre` se actualiza en el componente.

#### Two-way binding con diferentes elementos

```html
<!-- Input de texto -->
<input type="text" [(ngModel)]="texto">

<!-- Textarea -->
<textarea [(ngModel)]="descripcion" rows="4"></textarea>

<!-- Checkbox -->
<input type="checkbox" [(ngModel)]="aceptaTerminos">

<!-- Radio buttons -->
<input type="radio" name="genero" value="M" [(ngModel)]="genero"> Masculino
<input type="radio" name="genero" value="F" [(ngModel)]="genero"> Femenino

<!-- Select -->
<select [(ngModel)]="paisSeleccionado">
  <option value="">Selecciona un país</option>
  <option value="ES">España</option>
  <option value="FR">Francia</option>
  <option value="IT">Italia</option>
</select>

<!-- Select múltiple -->
<select [(ngModel)]="idiomasSeleccionados" multiple>
  <option value="es">Español</option>
  <option value="en">Inglés</option>
  <option value="fr">Francés</option>
</select>

<!-- Range slider -->
<input type="range" min="0" max="100" [(ngModel)]="volumen">
<span>{{ volumen }}%</span>

<!-- Date input -->
<input type="date" [(ngModel)]="fechaEvento">

<!-- Color picker -->
<input type="color" [(ngModel)]="colorFavorito">
```

#### Two-way binding entre componentes (Model Inputs)

Como vimos en la unidad de componentes, los Model Inputs permiten two-way binding entre componentes:

```typescript
// Componente hijo
@Component({
  selector: 'app-selector-cantidad',
  standalone: true,
  template: `
    <button (click)="cantidad.set(cantidad() - 1)">-</button>
    <span>{{ cantidad() }}</span>
    <button (click)="cantidad.set(cantidad() + 1)">+</button>
  `
})
export class SelectorCantidadComponent {
  cantidad = model(0);
}

// Componente padre
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SelectorCantidadComponent],
  template: `
    <app-selector-cantidad [(cantidad)]="total"></app-selector-cantidad>
    <p>Total: {{ total }}</p>
  `
})
export class AppComponent {
  total = 5;
}
```

### Variables locales de plantilla

Las variables locales de plantilla (template reference variables) permiten referenciar elementos del DOM, componentes o directivas desde la plantilla HTML, usando la sintaxis `#nombreVariable`.

#### ¿Qué referencia una variable de plantilla?

```html
<!-- Referencia a un elemento HTML nativo -->
<input #inputNombre type="text" placeholder="Nombre">
<button (click)="usarInput(inputNombre)">Usar valor</button>
<!-- inputNombre es HTMLInputElement -->

<!-- Referencia a un componente Angular -->
<app-calendario #calendario></app-calendario>
<button (click)="calendario.irAHoy()">Hoy</button>
<!-- #calendario referencia la instancia de CalendarioComponent -->

<!-- Referencia a una directiva -->
<form #formulario="ngForm" (ngSubmit)="enviar(formulario)">
  <input name="email" ngModel required>
</form>
<!-- #formulario referencia la instancia de NgForm -->

<!-- Referencia a un elemento con ngModel -->
<input #nombreModelo="ngModel" [(ngModel)]="nombre" required>
<p>¿Válido?: {{ nombreModelo.valid }}</p>
<p>Errores: {{ nombreModelo.errors | json }}</p>
<!-- #nombreModelo referencia la instancia de NgModel -->
```

#### Reglas importantes sobre variables de plantilla

1. **Ámbito limitado a la plantilla**: las variables de plantilla solo existen dentro del template HTML. No puedes acceder a `#inputNombre` directamente en el código TypeScript. Para acceder desde la clase, debes pasarla explícitamente a un método o usar `@ViewChild`.

2. **Acceso mediante paso a métodos**:

```html
<input #inputBusqueda type="search">
<button (click)="buscar(inputBusqueda.value)">Buscar</button>
```

```typescript
buscar(termino: string): void {
  console.log('Buscando:', termino);
}
```

3. **Acceso mediante `@ViewChild`**:

```typescript
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({...})
export class BuscadorComponent implements AfterViewInit {
  @ViewChild('inputBusqueda') inputBusqueda!: ElementRef<HTMLInputElement>;

  ngAfterViewInit(): void {
    // El DOM ya está disponible
    this.inputBusqueda.nativeElement.focus();
  }

  buscar(): void {
    const valor = this.inputBusqueda.nativeElement.value;
    console.log('Buscando:', valor);
  }
}
```

4. **`@ViewChild` con Signals (viewChild)**:

```typescript
import { Component, viewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({...})
export class BuscadorComponent implements AfterViewInit {
  inputBusqueda = viewChild<ElementRef<HTMLInputElement>>('inputBusqueda');

  ngAfterViewInit(): void {
    this.inputBusqueda()?.nativeElement.focus();
  }

  buscar(): void {
    const input = this.inputBusqueda();
    if (input) {
      console.log('Buscando:', input.nativeElement.value);
    }
  }
}
```

### Template Expressions

Las expresiones de plantilla son fragmentos de código TypeScript que Angular evalúa para determinar qué mostrar o cómo comportarse. Tienen reglas estrictas diseñadas para mantener el rendimiento y la previsibilidad.

#### Qué NO puede ir en una expresión de plantilla

```html
<!-- ❌ Asignaciones directas -->
{{ nombre = 'Nuevo' }}

<!-- ❌ Incremento / Decremento -->
{{ contador++ }}

<!-- ❌ Operadores de asignación compuesta -->
{{ total += 5 }}

<!-- ❌ La palabra clave new -->
{{ new Date() }}

<!-- ❌ Punto y coma (encadenamiento) -->
{{ a = 5; b = 10; a + b }}

<!-- ❌ Variables globales -->
{{ window.innerWidth }}
{{ document.title }}
{{ localStorage.getItem('token') }}

<!-- ❌ Expresiones con efectos secundarios -->
{{ enviarEmail() }}
{{ guardarEnBaseDeDatos() }}
```

#### Principios de las expresiones de plantilla

**1. Deben ser rápidas**: Angular evalúa las expresiones de plantilla en cada ciclo de detección de cambios. Una expresión lenta ralentiza toda la aplicación.

```typescript
// ✅ BUENO: propiedad simple
get nombreCompleto(): string {
  return `${this.nombre} ${this.apellido}`;
}

// ❌ MALO: operación costosa en getter
get usuariosFiltrados(): Usuario[] {
  return this.usuarios
    .filter(u => u.activo)
    .sort((a, b) => b.puntos - a.puntos)
    .map(u => this.transformarUsuario(u))
    .slice(0, 10);
}
// Este getter se ejecuta en CADA ciclo de detección de cambios.
// Mejor: calcular en ngOnInit y actualizar solo cuando los datos cambian.
```

**2. Deben ser idempotentes**: el resultado debe ser el mismo si se evalúa múltiples veces con los mismos datos. Esto permite a Angular ejecutar la detección de cambios en modo desarrollo dos veces para verificar la estabilidad.

**3. Sin efectos secundarios**: no deben modificar el estado de la aplicación. Los efectos secundarios deben estar en los manejadores de eventos, no en las expresiones de plantilla.

```html
<!-- ✅ BIEN: el efecto secundario está en el evento -->
<button (click)="guardar()">Guardar</button>

<!-- ❌ MAL: efecto secundario en expresión de plantilla -->
<span>{{ registrarVista() }}</span>
```

#### Expresiones útiles y seguras

```html
<!-- Operador ternario -->
<div [class.exito]="estado === 'completado'">
  {{ estado === 'completado' ? '✓' : '○' }}
</div>

<!-- Operadores lógicos -->
<button [disabled]="cargando || !formularioValido">Enviar</button>

<!-- Comparaciones (con nueva sintaxis de control de flujo) -->
@if (stock === 0) {
  <span class="agotado">Agotado</span>
}
@if (stock > 0 && stock < 5) {
  <span class="poco-stock">¡Últimas unidades!</span>
}

<!-- Pipes (más eficiente que métodos) -->
<span>{{ producto.precio | currency:'EUR' }}</span>
<!-- Los pipes puros solo se evalúan cuando cambia la entrada -->
```

## Ejemplos guiados

### Ejemplo 1: Formulario con los 4 tipos de binding

**Objetivo**: Crear un formulario de registro de usuario que demuestre interpolación, property binding, event binding y two-way binding trabajando en conjunto.

```typescript
// registro.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent {
  nombre = '';
  email = '';
  password = '';
  confirmarPassword = '';
  aceptaTerminos = false;
  enviado = false;
  fortalezaPassword = '';

  get formularioValido(): boolean {
    return (
      this.nombre.length >= 3 &&
      this.email.includes('@') &&
      this.password.length >= 8 &&
      this.password === this.confirmarPassword &&
      this.aceptaTerminos
    );
  }

  onSubmit(): void {
    if (!this.formularioValido) return;
    this.enviado = true;
    console.log('Formulario enviado:', {
      nombre: this.nombre,
      email: this.email,
      aceptaTerminos: this.aceptaTerminos
    });
  }

  evaluarFortaleza(): void {
    const pwd = this.password;
    let puntuacion = 0;
    if (pwd.length >= 8) puntuacion++;
    if (pwd.length >= 12) puntuacion++;
    if (/[A-Z]/.test(pwd)) puntuacion++;
    if (/[a-z]/.test(pwd)) puntuacion++;
    if (/[0-9]/.test(pwd)) puntuacion++;
    if (/[^A-Za-z0-9]/.test(pwd)) puntuacion++;

    if (puntuacion <= 2) this.fortalezaPassword = 'débil';
    else if (puntuacion <= 4) this.fortalezaPassword = 'media';
    else this.fortalezaPassword = 'fuerte';
  }

  resetear(): void {
    this.nombre = '';
    this.email = '';
    this.password = '';
    this.confirmarPassword = '';
    this.aceptaTerminos = false;
    this.enviado = false;
    this.fortalezaPassword = '';
  }
}
```

```html
<!-- registro.component.html -->
<div class="registro-container">
  <h2>Crear Cuenta</h2>

  @if (enviado) {
    <div class="mensaje-exito">
      <h3>¡Registro completado!</h3>
      <p>Bienvenido/a, <strong>{{ nombre }}</strong></p>
      <p>Te hemos enviado un correo a {{ email }}</p>
      <button (click)="resetear()">Crear otra cuenta</button>
    </div>
  } @else {
    <form (ngSubmit)="onSubmit()" #formRegistro="ngForm">
      <!-- NOMBRE -->
      <div class="campo">
        <label for="nombre">Nombre completo</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          [(ngModel)]="nombre"
          #inputNombre="ngModel"
          required
          minlength="3"
          [class.valido]="inputNombre.valid && inputNombre.touched"
          [class.invalido]="inputNombre.invalid && inputNombre.touched"
          placeholder="Tu nombre completo"
        />
        @if (inputNombre.invalid && inputNombre.touched) {
          <span class="error">
            @if (inputNombre.errors?.['required']) {
              El nombre es obligatorio.
            }
            @if (inputNombre.errors?.['minlength']) {
              Mínimo {{ inputNombre.errors?.['minlength'].requiredLength }} caracteres.
            }
          </span>
        }
      </div>

      <!-- EMAIL -->
      <div class="campo">
        <label for="email">Correo electrónico</label>
        <input
          type="email"
          id="email"
          name="email"
          [(ngModel)]="email"
          #inputEmail="ngModel"
          required
          email
          [class.valido]="inputEmail.valid && inputEmail.touched"
          [class.invalido]="inputEmail.invalid && inputEmail.touched"
          placeholder="tu@email.com"
        />
        @if (inputEmail.invalid && inputEmail.touched) {
          <span class="error">Introduce un email válido.</span>
        }
      </div>

      <!-- CONTRASEÑA -->
      <div class="campo">
        <label for="password">Contraseña</label>
        <input
          type="password"
          id="password"
          name="password"
          [(ngModel)]="password"
          #inputPassword="ngModel"
          required
          minlength="8"
          (input)="evaluarFortaleza()"
          [class.valido]="inputPassword.valid && inputPassword.touched"
          [class.invalido]="inputPassword.invalid && inputPassword.touched"
          placeholder="Mínimo 8 caracteres"
        />
        @if (password.length > 0) {
          <div class="fortaleza">
            <span>Fortaleza:</span>
            <span
              class="indicador"
              [class.debil]="fortalezaPassword === 'débil'"
              [class.media]="fortalezaPassword === 'media'"
              [class.fuerte]="fortalezaPassword === 'fuerte'"
            >
              {{ fortalezaPassword || 'Evaluando...' }}
            </span>
            <progress
              [value]="password.length"
              [max]="20"
              [class.barra-debil]="fortalezaPassword === 'débil'"
              [class.barra-media]="fortalezaPassword === 'media'"
              [class.barra-fuerte]="fortalezaPassword === 'fuerte'"
            ></progress>
          </div>
        }
      </div>

      <!-- CONFIRMAR CONTRASEÑA -->
      <div class="campo">
        <label for="confirmar">Confirmar contraseña</label>
        <input
          type="password"
          id="confirmar"
          name="confirmar"
          [(ngModel)]="confirmarPassword"
          required
          [class.valido]="confirmarPassword && password === confirmarPassword"
          [class.invalido]="confirmarPassword && password !== confirmarPassword"
          placeholder="Repite la contraseña"
        />
        @if (confirmarPassword && password !== confirmarPassword) {
          <span class="error">Las contraseñas no coinciden.</span>
        }
      </div>

      <!-- TÉRMINOS -->
      <div class="campo-checkbox">
        <input
          type="checkbox"
          id="terminos"
          name="terminos"
          [(ngModel)]="aceptaTerminos"
        />
        <label for="terminos">
          Acepto los <a href="/terminos" target="_blank">términos y condiciones</a>
        </label>
      </div>

      <!-- BOTÓN DE ENVÍO -->
      <button
        type="submit"
        class="btn-enviar"
        [disabled]="!formularioValido"
        [class.deshabilitado]="!formularioValido"
      >
        {{ formularioValido ? 'Crear cuenta' : 'Completa el formulario' }}
      </button>
    </form>
  }
</div>
```

### Ejemplo 2: Uso avanzado de variables de plantilla

**Objetivo**: Demostrar diferentes formas de usar variables de plantilla para acceder a elementos del DOM y componentes.

```typescript
// galeria-lista.component.ts
import { Component, ViewChildren, QueryList, ElementRef } from '@angular/core';

@Component({
  selector: 'app-galeria-lista',
  standalone: true,
  template: `
    <h2>Galería de Imágenes</h2>

    <div class="controles">
      <button (click)="scrollAPrimera()">⏫ Ir a primera</button>
      <button (click)="scrollAUltima()">⏬ Ir a última</button>
      <button (click)="destacarTodas()">✨ Destacar todas</button>
      <button (click)="quitarDestacado()">🔄 Quitar destacado</button>
    </div>

    <div class="galeria">
      @for (imagen of imagenes; track imagen.id; let idx = $index) {
        <div
          class="tarjeta-imagen"
          [id]="'img-' + imagen.id"
          #tarjeta
          (click)="seleccionarImagen(tarjeta, imagen)"
        >
          <div class="placeholder-img">{{ idx + 1 }}</div>
          <p>{{ imagen.titulo }}</p>
          <p class="autor">{{ imagen.autor }}</p>
        </div>
      }
    </div>

    @if (imagenSeleccionada) {
      <div class="info-seleccion">
        <p>
          Seleccionada:
          <strong>{{ imagenSeleccionada.titulo }}</strong>
          por {{ imagenSeleccionada.autor }}
        </p>
      </div>
    }
  `,
  styles: [`
    .galeria {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
      max-height: 400px;
      overflow-y: auto;
      margin: 16px 0;
      padding: 16px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    .tarjeta-imagen {
      border: 2px solid #eee;
      border-radius: 8px;
      padding: 16px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .tarjeta-imagen:hover {
      border-color: #3f51b5;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .destacada {
      border-color: #ffc107;
      background: #fff8e1;
    }
    .placeholder-img {
      width: 100%;
      height: 120px;
      background: #e0e0e0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      color: #999;
      border-radius: 4px;
      margin-bottom: 8px;
    }
    .controles {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .controles button {
      padding: 8px 16px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
      cursor: pointer;
    }
    .controles button:hover { background: #f5f5f5; }
    .info-seleccion {
      padding: 16px;
      background: #e8f5e9;
      border-radius: 8px;
      margin-top: 16px;
    }
  `]
})
export class GaleriaListaComponent {
  imagenes = [
    { id: 1, titulo: 'Atardecer en la playa', autor: 'Ana García' },
    { id: 2, titulo: 'Montañas al amanecer', autor: 'Carlos Ruiz' },
    { id: 3, titulo: 'Retrato urbano', autor: 'María López' },
    { id: 4, titulo: 'Naturaleza salvaje', autor: 'Pedro Sánchez' },
    { id: 5, titulo: 'Arquitectura moderna', autor: 'Lucía Fernández' },
    { id: 6, titulo: 'Mercado tradicional', autor: 'Javier Moreno' },
    { id: 7, titulo: 'Vista aérea', autor: 'Elena Torres' },
    { id: 8, titulo: 'Retrato en blanco y negro', autor: 'David Castillo' },
  ];

  imagenSeleccionada: any = null;

  @ViewChildren('tarjeta') tarjetasRef!: QueryList<ElementRef<HTMLDivElement>>;

  // Usar variable de plantilla pasada desde el HTML
  seleccionarImagen(elemento: HTMLDivElement, imagen: any): void {
    this.imagenSeleccionada = imagen;
    elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  scrollAPrimera(): void {
    const primera = document.getElementById('img-1');
    primera?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollAUltima(): void {
    const ultima = document.getElementById('img-' + this.imagenes.length);
    ultima?.scrollIntoView({ behavior: 'smooth' });
  }

  destacarTodas(): void {
    this.tarjetasRef.forEach(ref => {
      ref.nativeElement.classList.add('destacada');
    });
  }

  quitarDestacado(): void {
    this.tarjetasRef.forEach(ref => {
      ref.nativeElement.classList.remove('destacada');
    });
  }
}
```

### Ejemplo 3: Event binding con $event para formularios

**Objetivo**: Crear un buscador con sugerencias que demuestre el uso del objeto `$event` y eventos de teclado.

```typescript
// buscador.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ResultadoBusqueda {
  id: number;
  titulo: string;
  categoria: string;
}

@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="buscador-container">
      <h2>Buscador de Productos</h2>

      <div class="input-busqueda">
        <input
          type="search"
          #inputBuscar
          [(ngModel)]="terminoBusqueda"
          (input)="filtrarResultados()"
          (keydown.escape)="limpiarBusqueda(inputBuscar)"
          (keydown.arrowdown)="moverSeleccionAbajo()"
          (keydown.arrowup)="moverSeleccionArriba()"
          (keydown.enter)="seleccionarActual()"
          (focus)="mostrarSugerencias = true"
          (blur)="ocultarSugerencias()"
          placeholder="Buscar productos..."
          autocomplete="off"
          aria-label="Buscar productos"
        />
        @if (terminoBusqueda) {
          <button
            class="btn-limpiar"
            (click)="limpiarBusqueda(inputBuscar)"
            aria-label="Limpiar búsqueda">
            ✕
          </button>
        }
      </div>

      @if (mostrarSugerencias && resultadosFiltrados.length > 0) {
        <ul class="sugerencias" role="listbox">
          @for (resultado of resultadosFiltrados; track resultado.id; let idx = $index) {
            <li
              role="option"
              [class.activo]="idx === indiceSeleccionado"
              (click)="seleccionarResultado(resultado)"
              (mouseenter)="indiceSeleccionado = idx"
            >
              <span class="titulo">{{ resultado.titulo }}</span>
              <span class="categoria">en {{ resultado.categoria }}</span>
            </li>
          }
        </ul>
      } @else if (mostrarSugerencias && terminoBusqueda && resultadosFiltrados.length === 0) {
        <div class="sin-resultados">
          <p>No se encontraron resultados para "{{ terminoBusqueda }}"</p>
        </div>
      }

      @if (resultadoSeleccionado) {
        <div class="detalle-seleccion">
          <h3>Producto seleccionado:</h3>
          <p><strong>{{ resultadoSeleccionado.titulo }}</strong></p>
          <p>Categoría: {{ resultadoSeleccionado.categoria }}</p>
          <button (click)="resultadoSeleccionado = null">Cerrar</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .buscador-container {
      max-width: 500px;
      margin: 0 auto;
      font-family: 'Roboto', sans-serif;
    }
    .input-busqueda {
      position: relative;
      display: flex;
      align-items: center;
    }
    .input-busqueda input {
      width: 100%;
      padding: 12px 40px 12px 16px;
      border: 2px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }
    .input-busqueda input:focus {
      outline: none;
      border-color: #3f51b5;
    }
    .btn-limpiar {
      position: absolute;
      right: 8px;
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      color: #999;
      padding: 4px;
      line-height: 1;
    }
    .btn-limpiar:hover { color: #333; }
    .sugerencias {
      list-style: none;
      margin: 4px 0 0;
      padding: 0;
      border: 1px solid #ddd;
      border-radius: 8px;
      max-height: 300px;
      overflow-y: auto;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .sugerencias li {
      padding: 12px 16px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: background 0.15s;
    }
    .sugerencias li:hover, .sugerencias li.activo {
      background: #e8eaf6;
    }
    .sugerencias .titulo { font-weight: 500; }
    .sugerencias .categoria {
      font-size: 0.8rem;
      color: #666;
      background: #f0f0f0;
      padding: 2px 8px;
      border-radius: 12px;
    }
    .sin-resultados {
      padding: 16px;
      text-align: center;
      color: #999;
      border: 1px solid #ddd;
      border-radius: 8px;
      margin-top: 4px;
    }
    .detalle-seleccion {
      margin-top: 16px;
      padding: 16px;
      background: #e8f5e9;
      border-radius: 8px;
    }
    .detalle-seleccion h3 { margin: 0 0 8px; }
    .detalle-seleccion button {
      margin-top: 8px;
      padding: 6px 12px;
      border: 1px solid #4caf50;
      background: white;
      color: #4caf50;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class BuscadorComponent {
  terminoBusqueda = '';
  mostrarSugerencias = false;
  indiceSeleccionado = -1;
  resultadoSeleccionado: ResultadoBusqueda | null = null;

  private todosLosResultados: ResultadoBusqueda[] = [
    { id: 1, titulo: 'Portátil HP Pavilion', categoria: 'Informática' },
    { id: 2, titulo: 'Monitor Dell 27"', categoria: 'Informática' },
    { id: 3, titulo: 'Teclado mecánico Logitech', categoria: 'Periféricos' },
    { id: 4, titulo: 'Ratón inalámbrico MX Master', categoria: 'Periféricos' },
    { id: 5, titulo: 'Auriculares Sony WH-1000XM5', categoria: 'Audio' },
    { id: 6, titulo: 'Altavoz Bluetooth JBL', categoria: 'Audio' },
    { id: 7, titulo: 'Tablet Samsung Galaxy Tab', categoria: 'Móviles' },
    { id: 8, titulo: 'iPhone 15 Pro', categoria: 'Móviles' },
    { id: 9, titulo: 'Cámara Sony Alpha 7 IV', categoria: 'Fotografía' },
    { id: 10, titulo: 'Objetivo Sigma 24-70mm', categoria: 'Fotografía' },
  ];

  resultadosFiltrados: ResultadoBusqueda[] = [];

  filtrarResultados(): void {
    const termino = this.terminoBusqueda.toLowerCase().trim();

    if (!termino) {
      this.resultadosFiltrados = [];
      this.indiceSeleccionado = -1;
      return;
    }

    this.resultadosFiltrados = this.todosLosResultados.filter(r =>
      r.titulo.toLowerCase().includes(termino) ||
      r.categoria.toLowerCase().includes(termino)
    );
    this.indiceSeleccionado = -1;
    this.mostrarSugerencias = true;
  }

  moverSeleccionAbajo(): void {
    if (this.indiceSeleccionado < this.resultadosFiltrados.length - 1) {
      this.indiceSeleccionado++;
    }
  }

  moverSeleccionArriba(): void {
    if (this.indiceSeleccionado > 0) {
      this.indiceSeleccionado--;
    }
  }

  seleccionarActual(): void {
    if (this.indiceSeleccionado >= 0 && this.indiceSeleccionado < this.resultadosFiltrados.length) {
      this.seleccionarResultado(this.resultadosFiltrados[this.indiceSeleccionado]);
    }
  }

  seleccionarResultado(resultado: ResultadoBusqueda): void {
    this.resultadoSeleccionado = resultado;
    this.terminoBusqueda = resultado.titulo;
    this.mostrarSugerencias = false;
    this.resultadosFiltrados = [];
  }

  limpiarBusqueda(input: HTMLInputElement): void {
    this.terminoBusqueda = '';
    this.resultadosFiltrados = [];
    this.mostrarSugerencias = false;
    this.indiceSeleccionado = -1;
    input.focus();
  }

  ocultarSugerencias(): void {
    // Usamos setTimeout para que el click en sugerencia se procese antes de ocultar
    setTimeout(() => {
      this.mostrarSugerencias = false;
    }, 200);
  }
}
```

## Ejercicios resueltos

### Ejercicio 1: Crear un componente de tarjeta de producto interactivo

**Enunciado**: Crea un componente `ProductCardComponent` que muestre información de un producto y permita al usuario interactuar con él mediante diversos tipos de binding. El componente debe mostrar imagen, nombre, precio, descripción y valoración con estrellas. Debe permitir marcar como favorito, seleccionar cantidad antes de añadir al carrito, y cambiar el color del producto.

**Solución**:

```typescript
// product-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

interface ProductColor {
  nombre: string;
  codigo: string;
}

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input({ required: true }) id!: number;
  @Input({ required: true }) nombre!: string;
  @Input() descripcion: string = '';
  @Input({ transform: (v: number) => Math.max(0, Number(v.toFixed(2))) })
  precio: number = 0;
  @Input() imagenUrl: string = 'assets/placeholder.png';
  @Input() rating: number = 0;
  @Input() colores: ProductColor[] = [];
  @Input() stock: number = 10;

  @Output() agregarAlCarrito = new EventEmitter<{
    id: number;
    cantidad: number;
    color: string;
  }>();
  @Output() toggleFavorito = new EventEmitter<number>();

  // Estado local
  cantidad = 1;
  colorSeleccionado = '';
  esFavorito = false;

  // Computed properties
  get estrellas(): number[] {
    // Redondea el rating al 0.5 más cercano y genera array para mostrar estrellas
    const redondeado = Math.round(this.rating * 2) / 2;
    return Array(5).fill(0).map((_, i) => {
      if (i < Math.floor(redondeado)) return 1;       // Estrella llena
      if (i < redondeado) return 0.5;                   // Media estrella
      return 0;                                         // Estrella vacía
    });
  }

  get stockClass(): string {
    if (this.stock === 0) return 'sin-stock';
    if (this.stock <= 3) return 'poco-stock';
    return 'con-stock';
  }

  get stockMensaje(): string {
    if (this.stock === 0) return 'Agotado';
    if (this.stock <= 3) return `¡Solo quedan ${this.stock}!`;
    return `${this.stock} disponibles`;
  }

  get cantidadInvalida(): boolean {
    return this.cantidad < 1 || this.cantidad > this.stock;
  }

  onFavoritoClick(): void {
    this.esFavorito = !this.esFavorito;
    this.toggleFavorito.emit(this.id);
  }

  onAgregarAlCarrito(): void {
    if (this.cantidadInvalida || this.stock === 0) return;

    this.agregarAlCarrito.emit({
      id: this.id,
      cantidad: this.cantidad,
      color: this.colorSeleccionado
    });
  }

  seleccionarColor(color: ProductColor): void {
    this.colorSeleccionado = color.codigo;
  }

  incrementarCantidad(): void {
    if (this.cantidad < this.stock) {
      this.cantidad++;
    }
  }

  decrementarCantidad(): void {
    if (this.cantidad > 1) {
      this.cantidad--;
    }
  }
}
```

```html
<!-- product-card.component.html -->
<div class="tarjeta-producto" [class.agotado]="stock === 0">
  <!-- IMAGEN Y FAVORITO -->
  <div class="imagen-container">
    <img [src]="imagenUrl" [alt]="nombre" class="imagen-producto" />
    <button
      class="btn-favorito"
      [class.activo]="esFavorito"
      (click)="onFavoritoClick()"
      [attr.aria-label]="esFavorito ? 'Quitar de favoritos' : 'Añadir a favoritos'"
    >
      {{ esFavorito ? '❤️' : '🤍' }}
    </button>
    @if (stock <= 3 && stock > 0) {
      <span class="badge-oferta">¡Oferta!</span>
    }
  </div>

  <!-- INFORMACIÓN DEL PRODUCTO -->
  <div class="info-producto">
    <h3>{{ nombre }}</h3>
    <p class="descripcion">{{ descripcion | slice:0:100 }}{{ descripcion.length > 100 ? '...' : '' }}</p>

    <!-- ESTRELLAS -->
    <div class="rating">
      @for (estrella of estrellas; track $index) {
        <span class="estrella">
          @if (estrella === 1) { ⭐ }
          @else if (estrella === 0.5) { ✨ }
          @else { ☆ }
        </span>
      }
      <span class="rating-numero">({{ rating }})</span>
    </div>

    <!-- PRECIO -->
    <div class="precio">
      <span class="valor">{{ precio | currency:'EUR':'symbol':'1.2-2' }}</span>
    </div>

    <!-- STOCK -->
    <div class="stock">
      <span class="indicador" [class]="stockClass"></span>
      <span>{{ stockMensaje }}</span>
    </div>

    <!-- COLORES -->
    @if (colores.length > 0) {
      <div class="colores">
        <span class="label-color">Color:</span>
        <div class="opciones-color">
          @for (color of colores; track color.codigo) {
            <button
              class="color-option"
              [style.background-color]="color.codigo"
              [class.seleccionado]="colorSeleccionado === color.codigo"
              [attr.aria-label]="'Seleccionar color ' + color.nombre"
              (click)="seleccionarColor(color)"
            ></button>
          }
        </div>
      </div>
    }

    <!-- CANTIDAD Y BOTÓN DE COMPRA -->
    <div class="acciones-compra">
      <div class="selector-cantidad">
        <button
          (click)="decrementarCantidad()"
          [disabled]="cantidad <= 1"
          aria-label="Reducir cantidad"
        >−</button>
        <input
          type="number"
          [(ngModel)]="cantidad"
          [min]="1"
          [max]="stock"
          class="input-cantidad"
        />
        <button
          (click)="incrementarCantidad()"
          [disabled]="cantidad >= stock"
          aria-label="Aumentar cantidad"
        >+</button>
      </div>

      <button
        class="btn-agregar"
        [disabled]="cantidadInvalida || stock === 0"
        [class.deshabilitado]="cantidadInvalida || stock === 0"
        (click)="onAgregarAlCarrito()"
      >
        {{ stock === 0 ? 'Agotado' : '🛒 Añadir al carrito' }}
      </button>
    </div>
  </div>
</div>
```

```scss
// product-card.component.scss
.tarjeta-producto {
  max-width: 320px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    transform: translateY(-4px);
  }

  &.agotado {
    opacity: 0.7;
  }
}

.imagen-container {
  position: relative;
  height: 240px;
  background: #f5f5f5;
  overflow: hidden;

  .imagen-producto {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .btn-favorito {
    position: absolute;
    top: 12px;
    right: 12px;
    background: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.15);
    }
  }

  .badge-oferta {
    position: absolute;
    top: 12px;
    left: 12px;
    background: #ff4081;
    color: white;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
  }
}

.info-producto {
  padding: 16px;

  h3 {
    margin: 0 0 4px;
    font-size: 1.1rem;
    color: #333;
  }

  .descripcion {
    margin: 0 0 12px;
    color: #777;
    font-size: 0.9rem;
    line-height: 1.4;
  }

  .rating {
    display: flex;
    align-items: center;
    gap: 2px;
    margin-bottom: 8px;

    .estrella { font-size: 0.9rem; }
    .rating-numero {
      margin-left: 4px;
      color: #999;
      font-size: 0.85rem;
    }
  }

  .precio .valor {
    font-size: 1.3rem;
    font-weight: 700;
    color: #2e7d32;
  }

  .stock {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 8px 0;
    font-size: 0.85rem;

    .indicador {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    .con-stock { background: #4caf50; }
    .poco-stock { background: #ff9800; }
    .sin-stock { background: #f44336; }
  }

  .colores {
    margin: 12px 0;

    .label-color {
      font-size: 0.85rem;
      color: #666;
      margin-right: 8px;
    }

    .opciones-color {
      display: inline-flex;
      gap: 6px;
    }

    .color-option {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 2px solid #ddd;
      cursor: pointer;
      transition: transform 0.2s;

      &.seleccionado {
        border-color: #333;
        transform: scale(1.2);
      }
    }
  }

  .acciones-compra {
    display: flex;
    gap: 8px;
    margin-top: 16px;

    .selector-cantidad {
      display: flex;
      align-items: center;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;

      button {
        width: 36px;
        height: 36px;
        border: none;
        background: #f5f5f5;
        cursor: pointer;
        font-size: 1.1rem;
        transition: background 0.2s;

        &:hover:not(:disabled) { background: #e0e0e0; }
        &:disabled { opacity: 0.3; cursor: not-allowed; }
      }

      .input-cantidad {
        width: 50px;
        text-align: center;
        border: none;
        border-left: 1px solid #ddd;
        border-right: 1px solid #ddd;
        font-size: 1rem;
        padding: 8px 4px;
      }
    }

    .btn-agregar {
      flex: 1;
      padding: 10px;
      background: #3f51b5;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 500;
      transition: background 0.2s;

      &:hover:not(:disabled) { background: #303f9f; }
      &:disabled { background: #ccc; cursor: not-allowed; }
    }
  }
}
```

### Ejercicio 2: Implementar un buscador con two-way binding

**Enunciado**: Crea un componente de búsqueda en tiempo real que filtre una lista de elementos mientras el usuario escribe, usando `[(ngModel)]` y eventos de entrada. La búsqueda debe resaltar el texto coincidente y mostrar el número de resultados encontrados.

**Solución**:

```typescript
// search-list.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface ElementoBusqueda {
  id: number;
  texto: string;
  categoria: string;
  fecha: string;
}

@Component({
  selector: 'app-search-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="search-container">
      <h2>Búsqueda de Documentos</h2>

      <div class="barra-busqueda">
        <!-- TWO-WAY BINDING con ngModel -->
        <input
          type="search"
          [(ngModel)]="terminoBusqueda"
          (input)="onSearchInput()"
          placeholder="Buscar documentos..."
          autocomplete="off"
        />
        @if (terminoBusqueda) {
          <span class="contador-resultados">
            {{ resultados.length }} resultado(s)
          </span>
        }
      </div>

      <div class="filtros">
        <label>
          <input
            type="radio"
            name="filtro"
            [value]="'todos'"
            [(ngModel)]="filtroCategoria"
            (ngModelChange)="filtrar()"
          />
          Todos ({{ elementos.length }})
        </label>
        <label>
          <input
            type="radio"
            name="filtro"
            [value]="'informes'"
            [(ngModel)]="filtroCategoria"
            (ngModelChange)="filtrar()"
          />
          Informes
        </label>
        <label>
          <input
            type="radio"
            name="filtro"
            [value]="'manuales'"
            [(ngModel)]="filtroCategoria"
            (ngModelChange)="filtrar()"
          />
          Manuales
        </label>
        <label>
          <input
            type="radio"
            name="filtro"
            [value]="'contratos'"
            [(ngModel)]="filtroCategoria"
            (ngModelChange)="filtrar()"
          />
          Contratos
        </label>
      </div>

      @if (resultados.length > 0) {
        <ul class="lista-resultados">
          @for (elemento of resultados; track elemento.id) {
            <li class="item-resultado">
              <span class="categoria-badge">{{ elemento.categoria }}</span>
              <span class="texto-resultado" [innerHTML]="resaltarCoincidencia(elemento.texto)"></span>
              <span class="fecha">{{ elemento.fecha }}</span>
            </li>
          }
        </ul>
      } @else if (terminoBusqueda) {
        <div class="sin-resultados">
          <p>No se encontraron documentos que coincidan con "{{ terminoBusqueda }}"</p>
        </div>
      }

      @if (!terminoBusqueda) {
        <p class="ayuda">Escribe en el campo de búsqueda para filtrar los documentos.</p>
      }
    </div>
  `,
  styles: [`
    .search-container {
      max-width: 700px;
      margin: 0 auto;
    }
    h2 { margin-bottom: 16px; color: #333; }
    .barra-busqueda {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }
    .barra-busqueda input {
      flex: 1;
      padding: 12px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }
    .barra-busqueda input:focus {
      outline: none;
      border-color: #3f51b5;
    }
    .contador-resultados {
      font-size: 0.9rem;
      color: #666;
      white-space: nowrap;
    }
    .filtros {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
      padding: 12px;
      background: #f5f5f5;
      border-radius: 8px;
      flex-wrap: wrap;
    }
    .filtros label {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.9rem;
      cursor: pointer;
    }
    .lista-resultados {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .item-resultado {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border: 1px solid #eee;
      border-radius: 8px;
      margin-bottom: 8px;
      transition: background 0.2s;
    }
    .item-resultado:hover { background: #f9f9f9; }
    .categoria-badge {
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      background: #e8eaf6;
      color: #3f51b5;
    }
    .texto-resultado { flex: 1; font-size: 0.95rem; }
    .fecha {
      font-size: 0.8rem;
      color: #999;
      white-space: nowrap;
    }
    .sin-resultados, .ayuda {
      text-align: center;
      padding: 32px;
      color: #999;
    }
  `]
})
export class SearchListComponent {
  terminoBusqueda = '';
  filtroCategoria = 'todos';
  resultados: ElementoBusqueda[] = [];

  private elementos: ElementoBusqueda[] = [
    { id: 1, texto: 'Informe trimestral de ventas Q1 2024', categoria: 'informes', fecha: '2024-03-31' },
    { id: 2, texto: 'Manual de usuario del sistema de gestión', categoria: 'manuales', fecha: '2024-02-15' },
    { id: 3, texto: 'Contrato de prestación de servicios con Proveedor ABC', categoria: 'contratos', fecha: '2024-01-10' },
    { id: 4, texto: 'Informe de auditoría de seguridad informática', categoria: 'informes', fecha: '2024-04-05' },
    { id: 5, texto: 'Manual de instalación del software ERP', categoria: 'manuales', fecha: '2024-03-01' },
    { id: 6, texto: 'Contrato de arrendamiento de oficinas centrales', categoria: 'contratos', fecha: '2024-05-20' },
    { id: 7, texto: 'Informe de resultados de campaña de marketing', categoria: 'informes', fecha: '2024-06-15' },
    { id: 8, texto: 'Manual de políticas de privacidad y datos', categoria: 'manuales', fecha: '2024-04-22' },
    { id: 9, texto: 'Contrato de servicios de consultoría estratégica', categoria: 'contratos', fecha: '2024-07-01' },
    { id: 10, texto: 'Informe de satisfacción de clientes 2024', categoria: 'informes', fecha: '2024-08-30' },
  ];

  constructor() {
    this.filtrar();
  }

  onSearchInput(): void {
    this.filtrar();
  }

  filtrar(): void {
    const termino = this.terminoBusqueda.toLowerCase().trim();

    this.resultados = this.elementos.filter(el => {
      const coincideTexto = !termino || el.texto.toLowerCase().includes(termino);
      const coincideCategoria = this.filtroCategoria === 'todos' || el.categoria === this.filtroCategoria;
      return coincideTexto && coincideCategoria;
    });
  }

  resaltarCoincidencia(texto: string): string {
    if (!this.terminoBusqueda.trim()) return texto;

    // Escapar caracteres especiales de regex
    const terminoEscapado = this.terminoBusqueda.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${terminoEscapado})`, 'gi');

    return texto.replace(regex, '<mark style="background: #ffeb3b; padding: 0 2px; border-radius: 2px;">$1</mark>');
  }
}
```

## Actividades propuestas

### Actividad 1: Formulario de encuesta interactivo

**Descripción**: Crea un formulario de encuesta con al menos 5 tipos diferentes de campos (texto, radio, checkbox, select, range) usando two-way binding con `[(ngModel)]`. Muestra en tiempo real un resumen de las respuestas mientras el usuario completa el formulario.

**Requisitos**:
- Usar todos los tipos de binding vistos en la unidad.
- Validar campos required y mostrar mensajes de error.
- Mostrar una barra de progreso del formulario.

**Entregable**: Código del componente y capturas de pantalla del formulario en diferentes estados.

### Actividad 2: Comparador de productos con property binding

**Descripción**: Crea un componente que muestre dos productos lado a lado y permita compararlos. Usa class binding para resaltar el producto con mejor precio, mejor valoración, etc. Usa style binding para aplicar estilos dinámicos basados en la comparación.

**Entregable**: Código del componente y demostración visual.

### Actividad 3: Juego de memoria con event binding

**Descripción**: Crea un juego de "Simón dice" (memorizar secuencia de colores) usando event binding para capturar clics del usuario. Usa class binding para iluminar los botones y event binding con `$event` para registrar la interacción.

**Entregable**: Código del juego y explicación de los eventos utilizados.

### Actividad 4: Editor de texto enriquecido con variables de plantilla

**Descripción**: Crea un editor de texto simple con botones de formato (negrita, cursiva, subrayado) que modifiquen el contenido de un textarea usando variables de plantilla para acceder al elemento DOM. Añade contador de caracteres y palabras en tiempo real.

**Entregable**: Código del editor y demostración.

### Actividad 5: Galería de imágenes con @ViewChildren

**Descripción**: Crea una galería de imágenes que use variables de plantilla (con @ViewChildren) para implementar navegación por teclado (flechas izquierda/derecha), selección con Enter y modo presentación a pantalla completa.

**Entregable**: Código de la galería con las interacciones de teclado implementadas.

## Actividades de ampliación

### Actividad de ampliación 1: Dashboard con gráficos interactivos

**Descripción**: Crea un dashboard con múltiples widgets que se comuniquen mediante eventos. Por ejemplo, un selector de fechas que al cambiar actualice gráficos de barras y tablas. Usa event binding personalizado entre componentes.

**Entregable**: Código del dashboard con la comunicación entre widgets implementada.

### Actividad de ampliación 2: Formulario dinámico multietapa

**Descripción**: Crea un formulario de varias etapas (wizard) donde cada etapa se muestre/oculte condicionalmente usando `@if`. Usa two-way binding para que los datos persistan entre etapas. Implementa navegación con teclado, validación en cada etapa y guardado de progreso en localStorage.

**Entregable**: Código completo del wizard y explicación del flujo de datos.

### Actividad de ampliación 3: Chat en tiempo real simulado

**Descripción**: Crea una interfaz de chat simulada donde los mensajes se "envíen" localmente usando eventos de teclado (Enter para enviar, Shift+Enter para nueva línea). Usa variables de plantilla para auto-scroll al último mensaje y event binding para capturar `keydown` y `input`.

**Entregable**: Código de la interfaz de chat con las funciones de teclado implementadas.

## Buenas prácticas profesionales

1. **Prefiere property binding sobre interpolación para atributos**: Usa `[src]="imagenUrl"` en lugar de `src="{{imagenUrl}}"`. El property binding es más eficiente y evita problemas de timing con la detección de cambios.

2. **No llames a funciones costosas en expresiones de plantilla**: Los métodos llamados desde el template se ejecutan en CADA ciclo de detección de cambios. Para operaciones costosas, usa pipes (que son puros por defecto) o calcula los valores en `ngOnInit` y almacénalos en propiedades.

3. **Usa el operador `?.` para evitar errores con datos asíncronos**: Cuando trabajas con datos que pueden ser `null` o `undefined` (respuestas de API, inputs opcionales), el operador de navegación segura previene errores y hace el código más robusto.

4. **No abuses de `any` con `$event`**: Tipa correctamente los parámetros `$event` en tus métodos (`MouseEvent`, `KeyboardEvent`, `Event`). Esto mejora el autocompletado y la detección de errores.

5. **Usa `(ngSubmit)` en lugar de `(submit)` en formularios Angular**: `ngSubmit` respeta las validaciones del formulario y no emite el evento si el formulario no es válido.

6. **Evita manipulación directa del DOM**: Siempre que sea posible, usa los bindings de Angular en lugar de `document.getElementById` o `nativeElement`. El código es más testeable, mantenible y portable.

7. **Usa `track` en `@for`**: En la nueva sintaxis de control de flujo, siempre especifica `track` con una propiedad única (normalmente el `id`). Esto permite a Angular identificar elementos y optimizar las actualizaciones del DOM.

8. **Limpia las suscripciones y event listeners manuales**: Si añades event listeners con `addEventListener`, recuerda eliminarlos con `removeEventListener` en `ngOnDestroy` para evitar memory leaks.

## Errores frecuentes

1. **Confundir atributo y propiedad en bindings**: Intentar usar `[attr.value]` en un input en lugar de `[value]`. Recuerda: `value` es una propiedad DOM, no un atributo. Usa `[attr.xxx]` solo cuando no exista una propiedad DOM equivalente.

2. **Olvidar importar `FormsModule` para `[(ngModel)]`**: Si usas two-way binding sin importar `FormsModule`, Angular lanzará un error. En componentes standalone, debes importarlo explícitamente en el array `imports`.

3. **Usar interpolación en lugar de property binding para booleanos**: `<button disabled="{{isDisabled}}">` no funciona como esperas. Debes usar `<button [disabled]="isDisabled">`. La interpolación convierte todo a string, y el string `"false"` es truthy.

4. **Llamar a funciones con efectos secundarios en expresiones de plantilla**: `{{ guardarContador() }}` en el template se ejecutará en cada ciclo de detección de cambios, causando múltiples guardados no deseados y problemas de rendimiento.

5. **Pasar el `$event` completo en lugar de extraer el valor**: Cuando usas two-way binding entre componentes con `@Output`, es mejor emitir el dato relevante que pasar el evento completo: `this.valorChange.emit(nuevoValor)` en lugar de `this.valorChange.emit($event)`.

6. **No limpiar event listeners añadidos manualmente**: Si añades listeners al `window` o `document` en `ngOnInit`, debes eliminarlos en `ngOnDestroy`. De lo contrario, la función seguirá ejecutándose incluso después de destruir el componente.

7. **Usar `[innerHTML]` sin sanitizar datos de usuario**: Esto abre una vulnerabilidad XSS. Siempre sanitiza los datos con `DomSanitizer` y nunca uses `bypassSecurityTrustHtml` con contenido no confiable.

8. **No validar que los datos existen antes de usar `?.` en exceso**: El operador de navegación segura puede ocultar bugs. Si un valor siempre debería existir pero es `undefined`, el operador `?.` silenciará el error. A veces es mejor que la aplicación falle visiblemente para que puedas corregir la causa raíz.

## Resumen

En esta unidad hemos explorado en profundidad el sistema de plantillas de Angular, el puente entre la lógica TypeScript y la interfaz HTML. Los puntos clave son:

- **La interpolación** (`{{ }}`) es la forma más básica de mostrar datos. Angular la protege automáticamente contra XSS y permite usar pipes para transformar valores antes de mostrarlos. Los operadores `?.` y `!` ayudan a manejar valores nulos.

- **El property binding** (`[propiedad]`) vincula propiedades DOM con expresiones del componente. Es crucial entender la diferencia entre atributo HTML (estático) y propiedad DOM (dinámica). Los bindings de clase (`[class.xxx]`) y estilo (`[style.xxx]`) permiten control preciso sobre la presentación.

- **El event binding** (`(evento)`) responde a interacciones del usuario. El objeto `$event` proporciona acceso al evento nativo, y el filtrado de teclas (`.enter`, `.escape`) simplifica la implementación de accesos rápidos.

- **El two-way binding** (`[(ngModel)]`) combina property y event binding para sincronizar formularios bidireccionalmente. Con los Model Inputs, esta misma sintaxis funciona entre componentes.

- **Las variables de plantilla** (`#variable`) permiten referenciar elementos del DOM y componentes desde la plantilla. Para acceder desde TypeScript, se usan `@ViewChild` o la versión moderna con Signals.

- **Las expresiones de plantilla** deben ser rápidas, idempotentes y sin efectos secundarios. Angular las restringe para garantizar la seguridad y el rendimiento de la aplicación.

Con estos conocimientos sobre plantillas, el alumnado puede crear interfaces ricas y reactivas que respondan a las interacciones del usuario de forma fluida y segura.

## Recursos adicionales

### Documentación oficial
- **Angular Template Syntax**: https://angular.dev/guide/templates
- **Binding Syntax**: https://angular.dev/guide/templates/binding
- **Pipes**: https://angular.dev/guide/templates/pipes
- **Template Reference Variables**: https://angular.dev/guide/templates/reference-variables
- **Security**: https://angular.dev/best-practices/security
- **Control Flow Syntax**: https://angular.dev/guide/templates/control-flow

### Tutoriales y artículos
- **Angular Template Syntax Demystified (Angular University)**: https://blog.angular-university.io
- **Understanding Angular Property Binding**: https://angular.dev/guide/templates/property-binding
- **Event Binding Deep Dive**: https://angular.dev/guide/templates/event-binding

### Libros
- "Pro Angular" - Adam Freeman (capítulos sobre data binding y plantillas)
- "Angular Development with TypeScript" - Yakov Fain y Anton Moiseev
