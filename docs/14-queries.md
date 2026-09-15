# View Queries y Content Queries

## Objetivos de aprendizaje

Al finalizar este capítulo, el alumnado será capaz de:

- Diferenciar claramente entre View Queries (elementos propios del componente) y Content Queries (elementos proyectados mediante ng-content).
- Utilizar la nueva sintaxis de Signals con `viewChild()`, `viewChildren()`, `contentChild()` y `contentChildren()`.
- Acceder a ElementRef, componentes hijos y directivas desde el código TypeScript del componente.
- Implementar casos prácticos como auto-focus en inputs, scroll suave a elementos y comunicación con componentes hijos.
- Comprender los riesgos de seguridad asociados al acceso directo al DOM y aplicar Renderer2 como alternativa segura.

## Resultados de aprendizaje

1. Utiliza `viewChild` y `contentChild` con Signals para acceder a elementos del DOM y componentes del árbol.
2. Implementa `viewChildren` y `contentChildren` para manipular colecciones de elementos de forma reactiva.
3. Distingue entre el DOM del componente (View) y el DOM proyectado (Content) y aplica la query adecuada en cada caso.
4. Accede a componentes hijos para llamar a sus métodos públicos desde el padre.
5. Aplica buenas prácticas de seguridad al manipular el DOM nativo.

## Introducción

En el desarrollo de aplicaciones Angular, es frecuente necesitar acceso programático a elementos del DOM, componentes hijos o directivas presentes en la plantilla. Por ejemplo, querer enfocar automáticamente un campo de entrada al cargar una página, medir las dimensiones de un elemento para posicionar un tooltip, o llamar a un método de un componente hijo desde el componente padre.

Angular proporciona un conjunto de herramientas llamado **Queries** (consultas) que permiten obtener referencias a estos elementos de forma segura y reactiva. Las queries se dividen en dos categorías fundamentales:

- **View Queries (`viewChild`, `viewChildren`):** Acceden a elementos que pertenecen directamente a la plantilla del propio componente.
- **Content Queries (`contentChild`, `contentChildren`):** Acceden a elementos que han sido proyectados dentro del componente mediante `ng-content` desde un componente padre.

A partir de Angular 17, estas queries han adoptado una nueva sintaxis basada en **Signals** (señales), reemplazando a los decoradores tradicionales `@ViewChild` y `@ContentChild`. La nueva API orientada a funciones (`viewChild()`, `viewChildren()`, `contentChild()`, `contentChildren()`) devuelve señales reactivas que se integran perfectamente con el nuevo sistema de reactividad de Angular.

Este capítulo te guiará desde los conceptos fundamentales hasta casos de uso avanzados, ayudándote a comprender cuándo y cómo usar cada tipo de query, y cómo hacerlo de forma segura y siguiendo las mejores prácticas.

---

## Desarrollo teórico

### Diferencia entre View Queries y Content Queries

La distinción entre View y Content es uno de los conceptos más importantes para entender las queries en Angular. La regla es simple pero poderosa:

- **View (Vista):** Todo lo que está definido directamente en el template del componente.
- **Content (Contenido):** Todo lo que se proyecta dentro del componente desde el padre mediante `ng-content`.

```typescript
// Componente hijo: TarjetaComponent
@Component({
  selector: 'app-tarjeta',
  standalone: true,
  template: `
    <div class="tarjeta">
      <!-- VIEW: este <h3> pertenece al template de TarjetaComponent -->
      <h3 #tituloView>Título por defecto</h3>

      <!-- CONTENT: este contenido viene del padre -->
      <ng-content />
    </div>
  `
})
export class TarjetaComponent {
  // View Query: accede al <h3> (elemento propio del template)
  tituloVista = viewChild<ElementRef>('tituloView');

  // Content Query: accede a elementos proyectados por el padre
  contenidoProyectado = contentChild(ComponenteProyectado);
}

// Componente padre
@Component({
  selector: 'app-padre',
  standalone: true,
  imports: [TarjetaComponent],
  template: `
    <app-tarjeta>
      <!-- Este <app-badge> se PROYECTA en TarjetaComponent -->
      <!-- Es parte del CONTENT de TarjetaComponent -->
      <app-badge>Nuevo</app-badge>
      <p>Descripción de la tarjeta proyectada</p>
    </app-tarjeta>
  `
})
export class PadreComponent {}
```

**Diagrama conceptual:**

```
Componente Padre (app-padre)
  │
  ├── Componente Hijo (app-tarjeta)
  │     │
  │     ├── VIEW: elementos definidos en el template de TarjetaComponent
  │     │   └── <h3 #tituloView>, <div class="tarjeta">, etc.
  │     │
  │     └── CONTENT: elementos proyectados desde el padre
  │         └── <app-badge>, <p>, etc.
```

### viewChild

`viewChild()` consulta un único elemento de la vista del componente. Devuelve un `Signal` que contiene la referencia al elemento encontrado, o `undefined` si no existe.

#### Nueva sintaxis con Signals: viewChild.required() y viewChild()

```typescript
import { Component, viewChild, ElementRef, signal } from '@angular/core';
import { HijoComponent } from './hijo.component';

@Component({
  selector: 'app-padre',
  standalone: true,
  imports: [HijoComponent],
  template: `
    <h1>Componente Padre</h1>
    <!-- Elementos accesibles via View Queries -->
    <input #inputNombre type="text" placeholder="Nombre" />
    <app-hijo #compHijo />
    <button #btnEnviar>Enviar</button>
  `
})
export class PadreComponent {
  // viewChild(): Puede devolver undefined si el elemento no existe
  campoNombre = viewChild<ElementRef>('inputNombre');

  // viewChild.required(): Garantiza que el elemento existe. Si no, lanza error en runtime.
  campoNombreRequerido = viewChild.required<ElementRef>('inputNombre');

  // Acceder a un componente hijo
  componenteHijo = viewChild(HijoComponent);

  // Leer una directiva específica de un elemento
  // El token 'read' especifica qué tipo devolver
  botonEnviar = viewChild('btnEnviar', { read: ElementRef });

  enfocarInput(): void {
    // Accedemos al nativeElement del input
    const input = this.campoNombre();
    if (input) {
      input.nativeElement.focus();
    }
  }
}
```

#### Signal vs non-signal (decorador @ViewChild legacy)

Antes de Angular 17, la API se basaba en el decorador `@ViewChild` y se usaba dentro del ciclo de vida `ngAfterViewInit`. El nuevo enfoque con señales ofrece varias ventajas:

| Característica | @ViewChild (legacy) | viewChild() Signal |
|---------------|---------------------|-------------------|
| **Sintaxis** | Decorador de clase | Función + field initializer |
| **Tipo de dato** | Propiedad mutable que se asigna | Signal que se actualiza reactivamente |
| **Valor inicial** | undefined (hasta AfterViewInit) | undefined (Signal) |
| **Reactividad** | No reactiva (snapshot) | Reactiva (Signal) |
| **Uso en computed** | No posible directamente | Sí, se integra con computed() y effect() |
| **required()** | `@ViewChild('ref', { static: true })` como workaround | `viewChild.required()` nativo |
| **Detección de cambios** | Se asigna en AfterViewInit | Se asigna en cuanto está disponible |

```typescript
// ❌ API legacy con decoradores (Angular < 17)
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';

export class ComponenteAntiguo implements AfterViewInit {
  @ViewChild('miInput') miInput!: ElementRef;

  ngAfterViewInit(): void {
    // Solo aquí el elemento está garantizado
    this.miInput.nativeElement.focus();
  }
}

// ✅ API moderna con Signals (Angular 17+)
import { Component, viewChild, ElementRef, afterNextRender } from '@angular/core';

export class ComponenteModerno {
  miInput = viewChild<ElementRef>('miInput');

  constructor() {
    afterNextRender(() => {
      // El DOM ya está disponible en el navegador
      this.miInput()?.nativeElement.focus();
    });
  }
}
```

#### Cuándo está disponible (afterViewInit, en template, en computed)

La señal devuelta por `viewChild()` se actualiza después de que la vista del componente se ha inicializado:

- **En el constructor:** La señal tiene valor `undefined`.
- **En `ngAfterViewInit`:** La señal ya tiene el valor del elemento consultado.
- **En computed():** La señal puede usarse dentro de expresiones computadas que reaccionarán cuando el elemento esté disponible.
- **En effect():** Se ejecutará cuando el valor de la señal cambie.
- **En afterNextRender() / afterRender():** Garantiza que se ejecuta en el navegador (no en SSR).

```typescript
@Component({...})
export class ComponenteConTimeline {
  miInput = viewChild.required<ElementRef>('inputEmail');
  estaDisponible = computed(() => this.miInput() !== undefined);

  constructor() {
    // ✅ Se ejecuta cuando la señal cambia
    effect(() => {
      const input = this.miInput();
      if (input) {
        console.log('Input disponible:', input.nativeElement.value);
      }
    });
  }

  ngAfterViewInit(): void {
    // La señal ya está disponible aquí también
    console.log('Estado:', this.estaDisponible()); // true
  }
}
```

#### Leer diferentes tipos (read token: ElementRef, ViewContainerRef, componente específico)

El parámetro `read` nos permite especificar qué tipo de referencia obtener del elemento consultado:

```typescript
@Component({
  template: `
    <input #miInput type="text" appMiDirectiva />
    <app-hijo #compHijo />
  `
})
export class PadreComponent {
  // Por defecto: devuelve ElementRef para referencias de plantilla
  inputElement = viewChild<ElementRef>('miInput');

  // Leer el componente como instancia de su clase
  // Nos permite acceder a sus propiedades y métodos públicos
  componentInstance = viewChild(HijoComponent);

  // Leer una directiva específica aplicada al elemento
  miDirectiva = viewChild(MiDirectiva);

  // Leer ElementRef explícitamente (redundante para #ref, útil para componentes)
  inputAsElementRef = viewChild('miInput', { read: ElementRef });

  // Leer ViewContainerRef (útil para crear componentes dinámicamente)
  contenedorRef = viewChild('contenedor', { read: ViewContainerRef });

  // Leer un TemplateRef
  plantillaRef = viewChild('miPlantilla', { read: TemplateRef });
}
```

#### viewChild.required() para garantizar existencia

`viewChild.required()` funciona igual que `viewChild()`, pero:

1. El tipo de la señal es **no-nullable** (nunca `undefined`), lo que evita comprobaciones `if (elemento)`.
2. Si el elemento no existe, Angular lanza un error en tiempo de ejecución.

```typescript
@Component({
  template: `
    <!-- Este input SIEMPRE está en el template -->
    <input #inputPrincipal type="text" />
  `
})
export class FormularioComponent {
  // ✅ Seguro: sin comprobación de undefined
  input = viewChild.required<ElementRef>('inputPrincipal');

  enfocar(): void {
    // No necesitamos comprobar si existe: required lo garantiza
    this.input().nativeElement.focus();
  }
}
```

### viewChildren

`viewChildren()` consulta múltiples elementos que coinciden con un selector y devuelve un `Signal<readonly T[]>` que se actualiza reactivamente cuando los elementos se añaden, modifican o eliminan.

```typescript
@Component({
  template: `
    @for (item of lista(); track item.id) {
      <div #itemRef class="item">{{ item.nombre }}</div>
    }
    <button (click)="agregar()">Agregar elemento</button>
    <button (click)="eliminarUltimo()">Eliminar último</button>
  `
})
export class ListaComponent {
  lista = signal([
    { id: 1, nombre: 'Elemento 1' },
    { id: 2, nombre: 'Elemento 2' }
  ]);

  // Signal de array que se actualiza automáticamente cuando cambia la lista
  elementos = viewChildren<ElementRef>('itemRef');

  constructor() {
    effect(() => {
      console.log(`Hay ${this.elementos().length} elementos en la lista`);
    });
  }

  agregar(): void {
    this.lista.update(items => [
      ...items,
      { id: items.length + 1, nombre: `Elemento ${items.length + 1}` }
    ]);
  }

  eliminarUltimo(): void {
    this.lista.update(items => items.slice(0, -1));
  }
}
```

**Caso práctico: medir todos los elementos de una lista:**

```typescript
export class ListaConMedicionComponent implements AfterViewInit {
  elementos = viewChildren<ElementRef>('itemRef');

  constructor() {
    effect(() => {
      const elementos = this.elementos();
      if (elementos.length > 0) {
        const alturas = elementos.map(el => el.nativeElement.offsetHeight);
        console.log('Alturas de los elementos:', alturas);
      }
    });
  }
}
```

### contentChild

`contentChild()` consulta un único elemento proyectado mediante `ng-content`. Es el equivalente a `viewChild()`, pero para el DOM que viene del padre.

```typescript
@Component({
  selector: 'app-panel',
  standalone: true,
  template: `
    <div class="panel">
      <div class="panel-header">
        <!-- El contenido proyectado con el atributo [panel-titulo] -->
        <ng-content select="[panel-titulo]" />
      </div>
      <div class="panel-body">
        <ng-content />
      </div>
    </div>
  `
})
export class PanelComponent implements AfterContentInit {
  // Consulta el elemento proyectado con el atributo panel-titulo
  tituloProyectado = contentChild<ElementRef>('tituloRef');

  // Consulta un componente proyectado
  componenteProyectado = contentChild(ComponenteProyectado);

  ngAfterContentInit(): void {
    // En este punto, la señal ya tiene el contenido proyectado
    const titulo = this.tituloProyectado();
    if (titulo) {
      console.log('Título proyectado:', titulo.nativeElement.textContent);
    }
  }
}
```

**Uso desde el padre:**

```html
<app-panel>
  <h2 #tituloRef panel-titulo>Panel de Configuración</h2>
  <p>Contenido del panel...</p>
</app-panel>
```

#### ViewChild vs ContentChild (diferencia conceptual clave)

| Aspecto | viewChild | contentChild |
|---------|-----------|--------------|
| **Qué consulta** | Elementos en el template del propio componente | Elementos proyectados desde el padre |
| **Dónde se define** | Template del hijo | Template del padre (proyectado al hijo) |
| **Ciclo de vida** | Disponible en `AfterViewInit` | Disponible en `AfterContentInit` |
| **Caso de uso típico** | Enfocar un input propio del componente | Leer datos de un header proyectado |

#### Cuándo está disponible (afterContentInit, no antes)

```typescript
export class PanelComponent implements AfterContentInit, AfterViewInit {
  tituloProyectado = contentChild(ElementRef);
  miPropioTitulo = viewChild<ElementRef>('tituloPropio');

  ngAfterContentInit(): void {
    // ✅ contentChild YA está disponible
    console.log('Contenido proyectado:', this.tituloProyectado());

    // ❌ viewChild todavía NO está disponible
    //    (los elementos propios del template aún no se han inicializado)
  }

  ngAfterViewInit(): void {
    // ✅ viewChild YA está disponible
    console.log('Elemento propio:', this.miPropioTitulo());

    // contentChild también sigue disponible
  }
}
```

**Orden de inicialización:**

1. `constructor()` del componente.
2. `ngOnInit()`.
3. **Proyección de contenido** → `ngAfterContentInit()`.
4. **Inicialización de la vista** → `ngAfterViewInit()`.

#### contentChild.required()

Al igual que `viewChild.required()`, `contentChild.required()` garantiza que el contenido proyectado existe:

```typescript
export class AcordeonComponent {
  // Garantiza que el padre siempre proyecta un título
  titulo = contentChild.required<ElementRef>('tituloAcordeon');

  expandir(): void {
    // No necesitamos comprobar undefined
    this.titulo().nativeElement.scrollIntoView();
  }
}
```

### contentChildren

`contentChildren()` consulta múltiples elementos proyectados y devuelve un `Signal<readonly T[]>`. Es ideal para componentes como Tabs, Stepper o Accordion que necesitan detectar todos los paneles proyectados por el padre.

```typescript
@Component({
  selector: 'app-tabs',
  standalone: true,
  template: `
    <div class="tabs">
      <nav class="tabs-nav">
        <!-- Generamos botones a partir de las pestañas proyectadas -->
        @for (tab of tabs(); track $index; let i = $index) {
          <button
            [class.active]="i === activa()"
            (click)="activar(i)">
            {{ tab.titulo }}
          </button>
        }
      </nav>
      <div class="tabs-content">
        <ng-content />
      </div>
    </div>
  `
})
export class TabsComponent implements AfterContentInit {
  // Detecta TODOS los TabPanel proyectados por el padre
  tabs = contentChildren(TabPanelComponent);
  activa = signal(0);

  ngAfterContentInit(): void {
    // Activar la primera pestaña por defecto si hay alguna
    if (this.tabs().length > 0) {
      this.activar(0);
    }
  }

  activar(indice: number): void {
    this.tabs().forEach((tab, i) => {
      tab.activo = i === indice;
    });
    this.activa.set(indice);
  }
}

// Componente que representa un panel de pestaña (proyectado)
@Component({
  selector: 'app-tab-panel',
  standalone: true,
  template: `
    @if (activo) {
      <div class="tab-content">
        <ng-content />
      </div>
    }
  `
})
export class TabPanelComponent {
  @Input() titulo = '';
  @Input() activo = false;
}
```

**Uso:**

```html
<app-tabs>
  <app-tab-panel titulo="General">
    <p>Contenido de la pestaña General</p>
  </app-tab-panel>
  <app-tab-panel titulo="Seguridad">
    <p>Configuración de seguridad</p>
  </app-tab-panel>
  <app-tab-panel titulo="Notificaciones">
    <p>Preferencias de notificaciones</p>
  </app-tab-panel>
</app-tabs>
```

### Casos prácticos

#### Enfocar un input automáticamente

```typescript
@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <h1>Formulario de Contacto</h1>
    <form [formGroup]="formulario">
      <input
        #primerInput
        formControlName="nombre"
        type="text"
        placeholder="Tu nombre (auto-enfocado)"
      />
      <input formControlName="email" type="email" placeholder="Tu email" />
      <textarea formControlName="mensaje" placeholder="Tu mensaje"></textarea>
      <button type="submit">Enviar</button>
    </form>
  `
})
export class FormularioComponent {
  // Referencia al primer input para enfocarlo automáticamente
  primerInput = viewChild.required<ElementRef>('primerInput');
  formulario = inject(FormBuilder).group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    mensaje: ['']
  });

  constructor() {
    // afterNextRender garantiza que el DOM está listo y que no se ejecuta en SSR
    afterNextRender(() => {
      this.primerInput().nativeElement.focus();
    });
  }
}
```

#### ScrollTo en una lista

```typescript
@Component({
  selector: 'app-chat',
  standalone: true,
  template: `
    <div class="chat-container">
      <!-- Contenedor de mensajes con scroll -->
      <div #contenedorChat class="mensajes" (scroll)="onScroll()">
        @for (msg of mensajes(); track msg.id) {
          <div class="mensaje" [class.mio]="msg.mio">
            <p>{{ msg.texto }}</p>
            <small>{{ msg.hora }}</small>
          </div>
          <!-- Referencia en el último mensaje -->
          @if ($last) {
            <div #ultimoMensaje></div>
          }
        }
      </div>

      <form (ngSubmit)="enviar()" class="input-area">
        <input [(ngModel)]="nuevoMensaje" placeholder="Escribe un mensaje..." />
        <button type="submit">Enviar</button>
      </form>

      @if (!estaAlFinal()) {
        <button class="btn-scroll-abajo" (click)="scrollAlFinal()">
          ↓ Nuevos mensajes
        </button>
      }
    </div>
  `
})
export class ChatComponent {
  contenedorChat = viewChild.required<ElementRef>('contenedorChat');
  ultimoMensaje = viewChild<ElementRef>('ultimoMensaje');
  estaAlFinal = signal(true);
  nuevoMensaje = '';
  mensajes = signal<Mensaje[]>([...]);

  onScroll(): void {
    const el = this.contenedorChat().nativeElement;
    // Comprobar si el scroll está cerca del final (tolerancia de 50px)
    const alFinal = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
    this.estaAlFinal.set(alFinal);
  }

  scrollAlFinal(): void {
    const el = this.contenedorChat().nativeElement;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }

  enviar(): void {
    if (!this.nuevoMensaje.trim()) return;

    this.mensajes.update(msgs => [...msgs, {
      id: Date.now(),
      texto: this.nuevoMensaje,
      hora: new Date().toLocaleTimeString(),
      mio: true
    }]);

    this.nuevoMensaje = '';

    // Scroll al final después de que Angular renderice el nuevo mensaje
    afterNextRender(() => {
      this.scrollAlFinal();
    });
  }
}
```

#### Integración con librerías de terceros (charts, mapas)

Cuando usamos librerías como Chart.js o Leaflet, necesitamos una referencia al elemento canvas o div contenedor para inicializar la librería. `viewChild` es la herramienta perfecta:

```typescript
import { Component, viewChild, ElementRef, afterNextRender } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-grafico-ventas',
  standalone: true,
  template: `
    <div class="grafico-container">
      <canvas #canvasGrafico></canvas>
    </div>
  `
})
export class GraficoVentasComponent {
  canvasGrafico = viewChild.required<ElementRef<HTMLCanvasElement>>('canvasGrafico');
  private chart?: Chart;

  constructor() {
    afterNextRender(() => {
      this.inicializarGrafico();
    });
  }

  private inicializarGrafico(): void {
    const ctx = this.canvasGrafico().nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
        datasets: [{
          label: 'Ventas 2025',
          data: [12000, 19000, 15000, 22000, 28000],
          backgroundColor: '#3498db'
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top' } }
      }
    });
  }

  // Destruir el gráfico cuando el componente se destruye (importante para evitar memory leaks)
  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}
```

#### Comunicación con componentes hijos (llamar métodos públicos)

`viewChild` permite acceder a la instancia de un componente hijo y llamar a sus métodos públicos:

```typescript
// hijo.component.ts
@Component({
  selector: 'app-cronometro',
  standalone: true,
  template: `
    <div class="cronometro">
      <h2>{{ tiempoFormateado() }}</h2>
    </div>
  `
})
export class CronometroComponent {
  private segundos = signal(0);
  private intervalo?: number;

  tiempoFormateado = computed(() => {
    const min = Math.floor(this.segundos() / 60).toString().padStart(2, '0');
    const seg = (this.segundos() % 60).toString().padStart(2, '0');
    return `${min}:${seg}`;
  });

  iniciar(): void {
    if (this.intervalo) return;
    this.intervalo = window.setInterval(() => {
      this.segundos.update(s => s + 1);
    }, 1000);
  }

  pausar(): void {
    if (this.intervalo) {
      clearInterval(this.intervalo);
      this.intervalo = undefined;
    }
  }

  reiniciar(): void {
    this.pausar();
    this.segundos.set(0);
  }
}

// padre.component.ts
@Component({
  selector: 'app-panel-cronometro',
  standalone: true,
  imports: [CronometroComponent],
  template: `
    <app-cronometro #cron />
    <div class="controles">
      <button (click)="cron.iniciar()">▶ Iniciar</button>
      <button (click)="cron.pausar()">⏸ Pausar</button>
      <button (click)="cron.reiniciar()">↺ Reiniciar</button>
    </div>
  `
})
export class PanelCronometroComponent {
  // También podemos acceder programáticamente:
  cronometro = viewChild(CronometroComponent);

  iniciarTodos(): void {
    this.cronometro()?.iniciar();
  }
}
```

### ElementRef y seguridad

#### Acceso directo al DOM nativo

`ElementRef` proporciona la propiedad `nativeElement` que da acceso directo al elemento HTML nativo. Esto permite manipular el DOM de forma imperativa:

```typescript
export class ComponenteConDOM {
  miDiv = viewChild.required<ElementRef<HTMLDivElement>>('miDiv');

  manipularDOM(): void {
    const div = this.miDiv().nativeElement;
    div.style.backgroundColor = 'red';
    div.classList.add('destacado');
    div.scrollIntoView({ behavior: 'smooth' });
    div.textContent = 'Texto modificado desde TypeScript';
  }
}
```

#### Riesgos (XSS, Angular Universal/SSR)

El acceso directo al DOM conlleva riesgos significativos:

**1. Riesgo de XSS (Cross-Site Scripting):**

```typescript
// ❌ PELIGROSO: innerHTML puede inyectar scripts maliciosos
const div = this.miDiv().nativeElement;
div.innerHTML = datosProvenientesDelUsuario; // XSS!

// ✅ SEGURO: Angular sanitiza automáticamente con [innerHTML]
// En el template: <div [innerHTML]="datosProvenientesDelUsuario"></div>
```

**2. Riesgo con SSR (Server Side Rendering):**

En Angular Universal, el código se ejecuta en el servidor, donde no existe el DOM del navegador. Acceder a `nativeElement` en el servidor causará errores.

```typescript
// ❌ Falla en SSR
export class ComponenteProblemaSSR {
  miInput = viewChild<ElementRef>('miInput');

  ngAfterViewInit(): void {
    // Esto falla en el servidor porque no hay DOM
    this.miInput()?.nativeElement.focus();
  }
}
```

#### Alternativa: Renderer2

`Renderer2` es el servicio de Angular para manipular el DOM de forma segura y compatible con múltiples plataformas (navegador, servidor, Web Workers).

```typescript
import { Component, viewChild, ElementRef, Renderer2, inject } from '@angular/core';

@Component({
  selector: 'app-manipulacion-segura',
  standalone: true,
  template: `<div #miDiv>Contenido</div>`
})
export class ManipulacionSeguraComponent {
  miDiv = viewChild.required<ElementRef>('miDiv');
  private renderer = inject(Renderer2);

  manipularSeguro(): void {
    const div = this.miDiv().nativeElement;

    // ✅ Añadir/quitar clases CSS de forma segura
    this.renderer.addClass(div, 'destacado');
    this.renderer.removeClass(div, 'oculto');

    // ✅ Modificar estilos
    this.renderer.setStyle(div, 'background-color', '#3498db');
    this.renderer.setStyle(div, 'transition', 'all 0.3s ease');

    // ✅ Establecer atributos
    this.renderer.setAttribute(div, 'aria-label', 'Contenedor principal');
    this.renderer.setAttribute(div, 'role', 'region');

    // ✅ Establecer propiedades de forma segura
    this.renderer.setProperty(div, 'textContent', 'Texto seguro');

    // ✅ Escuchar eventos (con limpieza automática)
    const unlisten = this.renderer.listen(div, 'click', (event) => {
      console.log('Div clickeado', event);
    });
    // Guardar unlisten para limpiar en ngOnDestroy si es necesario
  }
}
```

**Comparativa de operaciones Direct DOM vs Renderer2:**

| Operación | Direct DOM (inseguro) | Renderer2 (seguro) |
|-----------|----------------------|---------------------|
| Clase CSS | `el.classList.add('x')` | `renderer.addClass(el, 'x')` |
| Estilo | `el.style.color = 'red'` | `renderer.setStyle(el, 'color', 'red')` |
| Atributo | `el.setAttribute('aria-label', 'x')` | `renderer.setAttribute(el, 'aria-label', 'x')` |
| Propiedad | `el.textContent = 'x'` | `renderer.setProperty(el, 'textContent', 'x')` |
| Evento | `el.addEventListener(...)` | `renderer.listen(el, 'click', handler)` |
| Eliminar hijo | `el.removeChild(child)` | `renderer.removeChild(el, child)` |
| Crear elemento | `document.createElement('div')` | `renderer.createElement('div')` |

#### Buenas prácticas

1. **Prefiere Renderer2 sobre `nativeElement` directo.** Es más seguro y compatible con SSR.
2. **Usa `nativeElement` solo cuando Renderer2 no ofrezca la funcionalidad necesaria** (ej: `focus()`, `scrollTo()`, integración con librerías externas como Chart.js).
3. **Siempre verifica la plataforma** con `isPlatformBrowser()` antes de acceder al DOM en aplicaciones con SSR.
4. **Usa `afterNextRender()` y `afterRender()`** para código que manipula el DOM. Estas funciones no se ejecutan durante SSR.
5. **Nunca uses `innerHTML` con datos de usuario.** Usa el binding de Angular `[innerHTML]` que incluye sanitización automática.

---

## Ejemplos guiados

### Ejemplo 1: Auto-focus en input con viewChild

```typescript
import { Component, viewChild, ElementRef, afterNextRender } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-formulario-contacto',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <h1>Contacto Rápido</h1>
    <form [formGroup]="formulario" (ngSubmit)="enviar()">
      <div class="campo">
        <label for="nombre">Nombre *</label>
        <input
          id="nombre"
          #inputNombre
          formControlName="nombre"
          type="text"
          placeholder="Tu nombre completo"
          autocomplete="name"
        />
      </div>

      <div class="campo">
        <label for="email">Email *</label>
        <input
          id="email"
          formControlName="email"
          type="email"
          placeholder="tu@email.com"
          autocomplete="email"
        />
      </div>

      <div class="campo">
        <label for="asunto">Asunto</label>
        <input
          id="asunto"
          formControlName="asunto"
          type="text"
          placeholder="¿Sobre qué nos escribes?"
        />
      </div>

      <div class="campo">
        <label for="mensaje">Mensaje *</label>
        <textarea
          id="mensaje"
          formControlName="mensaje"
          rows="5"
          placeholder="Cuéntanos tu consulta..."
        ></textarea>
      </div>

      <button type="submit" [disabled]="formulario.invalid || enviando">
        @if (enviando) { Enviando... } @else { Enviar mensaje }
      </button>
    </form>
  `,
  styles: [`
    .campo { margin-bottom: 1rem; }
    label { display: block; margin-bottom: 0.25rem; font-weight: 600; }
    input, textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 1rem;
    }
    input:focus, textarea:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 0 3px rgba(52,152,219,0.2);
    }
    button {
      padding: 0.75rem 2rem;
      background: #3498db;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      cursor: pointer;
    }
    button:disabled {
      background: #bdc3c7;
      cursor: not-allowed;
    }
  `]
})
export class FormularioContactoComponent {
  private fb = inject(FormBuilder);

  // View Query para enfocar el primer campo automáticamente
  inputNombre = viewChild.required<ElementRef<HTMLInputElement>>('inputNombre');

  formulario = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    asunto: [''],
    mensaje: ['', [Validators.required, Validators.minLength(10)]]
  });

  enviando = false;

  constructor() {
    // Enfocar el input después de que el DOM esté disponible
    afterNextRender(() => {
      this.inputNombre().nativeElement.focus();
      // Opcional: seleccionar el contenido si ya tiene un valor por defecto
      // this.inputNombre().nativeElement.select();
    });
  }

  enviar(): void {
    if (this.formulario.invalid) return;
    this.enviando = true;
    // Simulación de envío
    setTimeout(() => {
      this.enviando = false;
      console.log('Formulario enviado:', this.formulario.value);
      this.formulario.reset();
      // Volver a enfocar el primer campo tras enviar
      this.inputNombre().nativeElement.focus();
    }, 1500);
  }
}
```

### Ejemplo 2: Implementar Tabs con contentChildren (detectar paneles proyectados)

```typescript
// tab-panel.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tab-panel',
  standalone: true,
  template: `
    @if (activo) {
      <div class="tab-contenido">
        <ng-content />
      </div>
    }
  `
})
export class TabPanelComponent {
  @Input() titulo = '';
  @Input() activo = false;
  @Input() icono?: string; // Opcional: icono emoji o clase CSS
}

// tabs.component.ts
import {
  Component, contentChildren, afterContentInit, signal, computed
} from '@angular/core';
import { TabPanelComponent } from './tab-panel.component';

@Component({
  selector: 'app-tabs',
  standalone: true,
  template: `
    <div class="tabs">
      <nav class="tabs-nav" role="tablist">
        @for (tab of tabs(); track $index; let i = $index) {
          <button
            #botonTab
            class="tab-btn"
            [class.active]="i === tabActivo()"
            [attr.aria-selected]="i === tabActivo()"
            role="tab"
            (click)="seleccionarTab(i)"
            (keydown.arrowLeft)="navegarTeclado(i, -1)"
            (keydown.arrowRight)="navegarTeclado(i, 1)">
            @if (tab.icono) {
              <span class="tab-icon">{{ tab.icono }}</span>
            }
            {{ tab.titulo }}
          </button>
        }
      </nav>
      <div class="tabs-content">
        <ng-content />
      </div>
    </div>
  `,
  styles: [`
    .tabs { border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
    .tabs-nav {
      display: flex;
      background: #f8f9fa;
      border-bottom: 2px solid #e9ecef;
      overflow-x: auto;
    }
    .tab-btn {
      padding: 0.75rem 1.25rem;
      background: transparent;
      border: none;
      cursor: pointer;
      font-size: 0.9rem;
      color: #555;
      white-space: nowrap;
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      transition: all 0.2s;
    }
    .tab-btn:hover { color: #333; }
    .tab-btn.active {
      color: #3498db;
      border-bottom-color: #3498db;
      font-weight: 600;
    }
    .tab-icon { margin-right: 0.5rem; }
    .tabs-content { min-height: 200px; }
  `]
})
export class TabsComponent implements afterContentInit {
  // Detecta automáticamente todos los TabPanel proyectados
  tabs = contentChildren(TabPanelComponent);
  tabActivo = signal(0);

  constructor() {
    effect(() => {
      const tabs = this.tabs();
      console.log(`Número de pestañas detectadas: ${tabs.length}`);
    });
  }

  ngAfterContentInit(): void {
    this.actualizarTabActivo();
  }

  seleccionarTab(indice: number): void {
    if (indice >= 0 && indice < this.tabs().length) {
      this.tabActivo.set(indice);
      this.actualizarTabActivo();
    }
  }

  navegarTeclado(indiceActual: number, direccion: number): void {
    const nuevoIndice = indiceActual + direccion;
    if (nuevoIndice >= 0 && nuevoIndice < this.tabs().length) {
      this.seleccionarTab(nuevoIndice);
    }
  }

  private actualizarTabActivo(): void {
    const activo = this.tabActivo();
    this.tabs().forEach((tab, i) => {
      tab.activo = i === activo;
    });
  }
}
```

**Uso de las Tabs:**

```html
<app-tabs>
  <app-tab-panel titulo="Dashboard" icono="📊">
    <app-dashboard-contenido />
  </app-tab-panel>

  <app-tab-panel titulo="Pedidos" icono="📦">
    <app-lista-pedidos />
  </app-tab-panel>

  <app-tab-panel titulo="Clientes" icono="👥">
    <app-lista-clientes />
  </app-tab-panel>

  <app-tab-panel titulo="Configuración" icono="⚙️">
    <app-configuracion />
  </app-tab-panel>
</app-tabs>
```

### Ejemplo 3: Acceso a canvas para dibujar con viewChild

```typescript
import {
  Component, viewChild, ElementRef,
  afterNextRender, signal, HostListener
} from '@angular/core';

interface Punto { x: number; y: number; }

@Component({
  selector: 'app-pizarra-dibujo',
  standalone: true,
  template: `
    <div class="pizarra-container">
      <div class="herramientas">
        <button (click)="seleccionarColor('black')" [class.active]="color() === 'black'"
          style="background: black">Negro</button>
        <button (click)="seleccionarColor('red')" [class.active]="color() === 'red'"
          style="background: red">Rojo</button>
        <button (click)="seleccionarColor('blue')" [class.active]="color() === 'blue'"
          style="background: blue">Azul</button>
        <button (click)="seleccionarColor('green')" [class.active]="color() === 'green'"
          style="background: green">Verde</button>
        <button (click)="cambiarGrosor(-1)">−</button>
        <span>{{ grosor() }}px</span>
        <button (click)="cambiarGrosor(1)">+</button>
        <button class="btn-limpiar" (click)="limpiar()">🗑 Limpiar</button>
      </div>

      <canvas
        #canvasDibujo
        [width]="ancho"
        [height]="alto"
        (mousedown)="iniciarDibujo($event)"
        (mousemove)="dibujar($event)"
        (mouseup)="detenerDibujo()"
        (mouseleave)="detenerDibujo()"
      ></canvas>
    </div>
  `,
  styles: [`
    .pizarra-container { display: inline-block; border: 1px solid #ccc; border-radius: 8px; overflow: hidden; }
    .herramientas { display: flex; gap: 0.5rem; padding: 0.5rem; background: #f5f5f5; align-items: center; flex-wrap: wrap; }
    .herramientas button {
      width: 32px; height: 32px;
      border: 2px solid transparent;
      border-radius: 50%;
      cursor: pointer;
      color: white;
    }
    .herramientas button.active { border-color: #333; }
    .btn-limpiar { background: #e74c3c; border-radius: 4px !important; width: auto !important; }
    canvas { display: block; cursor: crosshair; }
  `]
})
export class PizarraDibujoComponent {
  canvasDibujo = viewChild.required<ElementRef<HTMLCanvasElement>>('canvasDibujo');
  private ctx!: CanvasRenderingContext2D;

  ancho = 800;
  alto = 500;
  color = signal('black');
  grosor = signal(3);
  dibujando = false;

  constructor() {
    afterNextRender(() => this.inicializarCanvas());
  }

  private inicializarCanvas(): void {
    const canvas = this.canvasDibujo().nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.aplicarEstilo();
  }

  private aplicarEstilo(): void {
    if (this.ctx) {
      this.ctx.strokeStyle = this.color();
      this.ctx.lineWidth = this.grosor();
    }
  }

  seleccionarColor(color: string): void {
    this.color.set(color);
    this.ctx.strokeStyle = color;
  }

  cambiarGrosor(delta: number): void {
    this.grosor.update(g => Math.max(1, Math.min(20, g + delta)));
    this.ctx.lineWidth = this.grosor();
  }

  iniciarDibujo(event: MouseEvent): void {
    this.dibujando = true;
    this.ctx.beginPath();
    this.ctx.moveTo(event.offsetX, event.offsetY);
  }

  dibujar(event: MouseEvent): void {
    if (!this.dibujando) return;
    this.ctx.lineTo(event.offsetX, event.offsetY);
    this.ctx.stroke();
  }

  detenerDibujo(): void {
    this.dibujando = false;
    this.ctx.closePath();
  }

  limpiar(): void {
    const canvas = this.canvasDibujo().nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}
```

### Ejemplo 4: Scroll suave al último elemento de una lista

```typescript
import { Component, viewChildren, ElementRef, signal, afterNextRender } from '@angular/core';

interface Actividad {
  id: number;
  tipo: 'creacion' | 'edicion' | 'eliminacion';
  descripcion: string;
  usuario: string;
  fecha: Date;
}

@Component({
  selector: 'app-log-actividades',
  standalone: true,
  template: `
    <div class="log-container">
      <h2>Registro de Actividades</h2>

      <div #contenedorScroll class="log-lista">
        @for (actividad of actividades(); track actividad.id; let last = $last) {
          <div
            #itemActividad
            class="log-item"
            [class.nuevo]="actividad.id > ultimoIdVisto()">
            <span class="tipo" [class]="actividad.tipo">
              {{ iconoActividad(actividad.tipo) }}
            </span>
            <div class="contenido">
              <strong>{{ actividad.usuario }}</strong>
              <p>{{ actividad.descripcion }}</p>
              <small>{{ actividad.fecha | date:'dd/MM/yyyy HH:mm' }}</small>
            </div>
          </div>
        }
      </div>

      <div class="log-acciones">
        <button (click)="agregarActividad()">+ Simular nueva actividad</button>
        <button (click)="scrollAlFinal()">↓ Ir al final</button>
        <button (click)="scrollAlPrincipio()">↑ Ir al principio</button>
      </div>
    </div>
  `,
  styles: [`
    .log-container { max-width: 600px; margin: 0 auto; }
    .log-lista {
      max-height: 400px;
      overflow-y: auto;
      border: 1px solid #eee;
      border-radius: 8px;
      padding: 0.5rem;
    }
    .log-item {
      display: flex;
      gap: 0.75rem;
      padding: 0.75rem;
      border-radius: 6px;
      margin-bottom: 0.5rem;
      background: #fff;
      transition: background 0.3s;
    }
    .log-item.nuevo { background: #eaf7ee; }
    .tipo {
      font-size: 1.25rem;
      width: 36px; height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .tipo.creacion { background: #d4edda; }
    .tipo.edicion { background: #fff3cd; }
    .tipo.eliminacion { background: #f8d7da; }
    .contenido strong { display: block; }
    .contenido p { margin: 0.25rem 0; color: #555; }
    .contenido small { color: #999; }
    .log-acciones { margin-top: 1rem; display: flex; gap: 0.5rem; }
    button { padding: 0.5rem 1rem; border: 1px solid #ccc; border-radius: 4px; background: white; cursor: pointer; }
    button:hover { background: #f0f0f0; }
  `]
})
export class LogActividadesComponent {
  contenedorScroll = viewChild.required<ElementRef>('contenedorScroll');
  itemsActividad = viewChildren<ElementRef>('itemActividad');

  actividades = signal<Actividad[]>(this.generarActividadesIniciales());
  ultimoIdVisto = signal(0);

  iconoActividad(tipo: string): string {
    switch (tipo) {
      case 'creacion': return '➕';
      case 'edicion': return '✏️';
      case 'eliminacion': return '🗑';
      default: return '❓';
    }
  }

  private generarActividadesIniciales(): Actividad[] {
    return Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      tipo: ['creacion', 'edicion', 'eliminacion'][i % 3] as Actividad['tipo'],
      descripcion: `Actividad de prueba número ${i + 1}`,
      usuario: `Usuario ${i + 1}`,
      fecha: new Date(Date.now() - (5 - i) * 3600000)
    }));
  }

  agregarActividad(): void {
    const nuevoId = this.actividades().length + 1;
    this.actividades.update(acts => [...acts, {
      id: nuevoId,
      tipo: ['creacion', 'edicion', 'eliminacion'][Math.floor(Math.random() * 3)] as Actividad['tipo'],
      descripcion: `Nueva actividad generada a las ${new Date().toLocaleTimeString()}`,
      usuario: `Usuario Automático`,
      fecha: new Date()
    }]);

    // Scroll al final después de que Angular renderice el nuevo elemento
    afterNextRender(() => {
      this.scrollAlFinal();
    });
  }

  scrollAlFinal(): void {
    const contenedor = this.contenedorScroll().nativeElement;
    contenedor.scrollTo({
      top: contenedor.scrollHeight,
      behavior: 'smooth'
    });
  }

  scrollAlPrincipio(): void {
    const contenedor = this.contenedorScroll().nativeElement;
    contenedor.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
```

---

## Ejercicios resueltos

### Ejercicio 1: Componente de contador con start/stop y reset desde el padre

**Enunciado:** Crea un componente `Contador` que tenga métodos `iniciar()`, `pausar()`, `reiniciar()` y una propiedad de solo lectura `valor`. Desde el componente padre, accede al contador mediante `viewChild` y proporciona botones para controlarlo. El contador debe auto-incrementarse cada segundo cuando está activo.

```typescript
// contador.component.ts
import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-contador',
  standalone: true,
  template: `
    <div class="contador" [class.activo]="enMarcha()">
      <h2>{{ valorFormateado() }}</h2>
      <span class="estado">{{ enMarcha() ? '▶ En marcha' : '⏸ Pausado' }}</span>
    </div>
  `,
  styles: [`
    .contador {
      text-align: center;
      padding: 2rem;
      border: 2px solid #ccc;
      border-radius: 12px;
      transition: border-color 0.3s;
      background: #fafafa;
    }
    .contador.activo { border-color: #27ae60; background: #f0fff4; }
    .contador h2 { font-size: 3rem; font-family: monospace; margin: 0 0 0.5rem; }
    .estado { color: #888; font-size: 0.9rem; }
  `]
})
export class ContadorComponent {
  private segundos = signal(0);
  private intervalo?: number;

  enMarcha = signal(false);

  valorFormateado = computed(() => {
    const h = Math.floor(this.segundos() / 3600).toString().padStart(2, '0');
    const m = Math.floor((this.segundos() % 3600) / 60).toString().padStart(2, '0');
    const s = (this.segundos() % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  });

  get valor(): number { return this.segundos(); }

  iniciar(): void {
    if (this.intervalo) return;
    this.enMarcha.set(true);
    this.intervalo = window.setInterval(() => this.segundos.update(s => s + 1), 1000);
  }

  pausar(): void {
    this.enMarcha.set(false);
    window.clearInterval(this.intervalo);
    this.intervalo = undefined;
  }

  reiniciar(): void {
    this.pausar();
    this.segundos.set(0);
  }

  ngOnDestroy(): void {
    window.clearInterval(this.intervalo);
  }
}

// padre-contador.component.ts
import { Component, viewChild } from '@angular/core';
import { ContadorComponent } from './contador.component';

@Component({
  selector: 'app-padre-contador',
  standalone: true,
  imports: [ContadorComponent],
  template: `
    <h1>Panel de Control</h1>

    <!-- Contador controlado desde el padre -->
    <app-contador #refContador />

    <div class="controles">
      <button class="btn-iniciar" (click)="iniciarContador()">▶ Iniciar</button>
      <button class="btn-pausar" (click)="pausarContador()">⏸ Pausar</button>
      <button class="btn-reiniciar" (click)="reiniciarContador()">↺ Reiniciar</button>
    </div>

    <p class="info">Valor actual: {{ contador()?.valor ?? 0 }} segundos</p>
  `,
  styles: [`
    .controles { display: flex; gap: 0.5rem; margin: 1.5rem 0; flex-wrap: wrap; }
    .controles button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      color: white;
      font-size: 1rem;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .controles button:hover { opacity: 0.9; }
    .btn-iniciar { background: #27ae60; }
    .btn-pausar { background: #f39c12; }
    .btn-reiniciar { background: #e74c3c; }
    .info { color: #555; font-style: italic; }
  `]
})
export class PadreContadorComponent {
  contador = viewChild<ContadorComponent>('refContador');

  iniciarContador(): void { this.contador()?.iniciar(); }
  pausarContador(): void { this.contador()?.pausar(); }
  reiniciarContador(): void { this.contador()?.reiniciar(); }
}
```

### Ejercicio 2: Sistema de tooltips con viewChild y directiva personalizada

```typescript
// tooltip.directive.ts
import { Directive, ElementRef, Input, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective {
  private el = inject(ElementRef);
  private tooltipElement?: HTMLElement;

  @Input('appTooltip') texto = '';
  @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';

  @HostListener('mouseenter') onMouseEnter(): void { this.mostrar(); }
  @HostListener('mouseleave') onMouseLeave(): void { this.ocultar(); }
  @HostListener('focus') onFocus(): void { this.mostrar(); }
  @HostListener('blur') onBlur(): void { this.ocultar(); }

  private mostrar(): void {
    if (this.tooltipElement || !this.texto) return;

    this.tooltipElement = document.createElement('div');
    this.tooltipElement.className = 'tooltip-burbuja';
    this.tooltipElement.textContent = this.texto;
    this.tooltipElement.setAttribute('role', 'tooltip');

    document.body.appendChild(this.tooltipElement);
    this.posicionar();
  }

  private ocultar(): void {
    if (this.tooltipElement) {
      this.tooltipElement.remove();
      this.tooltipElement = undefined;
    }
  }

  private posicionar(): void {
    if (!this.tooltipElement) return;

    const hostRect = this.el.nativeElement.getBoundingClientRect();
    const tooltipRect = this.tooltipElement.getBoundingClientRect();

    let top = 0, left = 0;

    switch (this.tooltipPosition) {
      case 'top':
        top = hostRect.top - tooltipRect.height - 8;
        left = hostRect.left + (hostRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = hostRect.bottom + 8;
        left = hostRect.left + (hostRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = hostRect.top + (hostRect.height - tooltipRect.height) / 2;
        left = hostRect.left - tooltipRect.width - 8;
        break;
      case 'right':
        top = hostRect.top + (hostRect.height - tooltipRect.height) / 2;
        left = hostRect.right + 8;
        break;
    }

    this.tooltipElement.style.position = 'fixed';
    this.tooltipElement.style.top = `${top}px`;
    this.tooltipElement.style.left = `${left}px`;
  }
}

// tooltip-container.component.ts
import { Component, viewChild, ElementRef, afterNextRender } from '@angular/core';
import { TooltipDirective } from './tooltip.directive';

@Component({
  selector: 'app-tooltip-container',
  standalone: true,
  imports: [TooltipDirective],
  template: `
    <h1>Sistema de Tooltips</h1>
    <p>Pasa el ratón sobre los elementos subrayados para ver información adicional:</p>

    <div class="demo-area">
      <p>
        El
        <span appTooltip="HyperText Markup Language" tabindex="0"
          class="tooltip-target">HTML</span>
        es el lenguaje de marcado estándar para crear páginas web.
      </p>
      <p>
        <span appTooltip="Cascading Style Sheets" tooltipPosition="bottom"
          class="tooltip-target">CSS</span>
        se utiliza para estilizar y dar formato a los documentos HTML.
      </p>
      <p>
        <span appTooltip="Application Programming Interface: conjunto de definiciones y protocolos"
          tooltipPosition="right" class="tooltip-target">API</span>
        permite la comunicación entre diferentes sistemas.
      </p>
    </div>
  `,
  styles: [`
    .demo-area { max-width: 600px; margin: 2rem auto; line-height: 2; }
    .tooltip-target {
      text-decoration: underline dotted #3498db;
      cursor: help;
      color: #2980b9;
    }
    .tooltip-target:focus { outline: 2px solid #3498db; outline-offset: 2px; }

    /* Estilos globales para la burbuja del tooltip (en styles.css global) */
    ::ng-deep .tooltip-burbuja {
      background: #2c3e50;
      color: white;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      font-size: 0.85rem;
      max-width: 250px;
      z-index: 10000;
      pointer-events: none;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      animation: tooltipFadeIn 0.15s ease;
    }
    @keyframes tooltipFadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class TooltipContainerComponent {}
```

---

## Actividades propuestas

1. **Componente Carrusel (Carousel) con viewChildren:** Crea un componente de carrusel de imágenes que use `viewChildren` para acceder a todas las diapositivas. Implementa navegación con botones "Anterior"/"Siguiente", indicadores de posición (puntos) y transiciones suaves. El carrusel debe ser responsive y funcionar con cualquier número de imágenes.

2. **Selector de fecha personalizado con viewChild y Renderer2:** Implementa un datepicker personalizado desde cero usando `viewChild` para acceder al input y al panel del calendario. El panel debe posicionarse automáticamente debajo del input usando Renderer2. Implementa navegación entre meses, selección de fecha y cierre al hacer clic fuera.

3. **Componente de Autocompletado con contentChild:** Diseña un componente `Autocomplete` que proyecte una lista de opciones desde el padre usando `contentChild`. El componente debe filtrar las opciones según el texto introducido, permitir navegación con teclado (flechas + Enter) y selección con ratón. Implementa debounce para la búsqueda.

4. **Sistema de notificaciones Toast con viewChild:** Crea un servicio de notificaciones toast y un componente contenedor que muestre las notificaciones. Usa `viewChildren` para gestionar múltiples toasts simultáneos, con animaciones de entrada/salida y auto-eliminación tras un tiempo configurable.

5. **Editor de Layout con arrastre y queries:** Construye un editor de layout donde el usuario pueda redimensionar paneles. Usa `viewChildren` para detectar todos los paneles y Renderer2 para gestionar los eventos de redimensionamiento. Implementa límites mínimos y máximos de tamaño para cada panel.

## Actividades de ampliación

1. **Componente de Hoja de Cálculo (Spreadsheet):** Crea un componente de hoja de cálculo con filas y columnas editables. Usa `viewChildren` para acceder a todas las celdas y Renderer2 para gestionar la selección múltiple. Implementa navegación con teclado (flechas, Tab), edición inline y soporte para fórmulas simples.

2. **Sistema de Drag & Drop nativo sin librerías:** Implementa un sistema de arrastrar y soltar desde cero usando `viewChild`, Renderer2 y los eventos nativos del navegador (dragstart, dragover, drop). Crea una lista reordenable y un área de "papelera" donde soltar elementos para eliminarlos. Añade animaciones y feedback visual durante el arrastre.

3. **Visualizador de PDF con visor de miniaturas:** Integra una librería de renderizado de PDF (pdfjs-dist) con Angular usando `viewChild` para acceder al canvas de renderizado. Crea un panel lateral con miniaturas de las páginas usando `viewChildren`. Implementa scroll sincronizado entre el visor principal y las miniaturas.

## Buenas prácticas profesionales

1. **Prefiere `viewChild.required()` cuando el elemento siempre debe existir.** Evita comprobaciones `if (elemento)` innecesarias y haz que el código sea más limpio. Si el elemento puede no existir (por un `@if` condicional), usa `viewChild()` normal y comprueba `undefined`.

2. **Usa `afterNextRender()` para manipulación del DOM, no `ngAfterViewInit`.** `afterNextRender()` se ejecuta una sola vez tras el primer renderizado y no se ejecuta en SSR. `ngAfterViewInit` puede ejecutarse múltiples veces en detección de cambios y también durante SSR.

3. **No accedas al `nativeElement` en el constructor ni en `ngOnInit`.** El DOM aún no está disponible en esos hooks. Espera a `ngAfterViewInit` para View Queries y a `ngAfterContentInit` para Content Queries, o usa `effect()` y `computed()` con señales.

4. **Usa Renderer2 en lugar de manipulación directa del DOM.** Renderer2 proporciona una capa de abstracción que funciona en diferentes plataformas (navegador, servidor, Web Workers) y mejora la seguridad. Solo usa `nativeElement` directamente para operaciones no soportadas por Renderer2.

5. **Verifica siempre `isPlatformBrowser()` en aplicaciones con SSR.** Antes de acceder a `window`, `document`, `localStorage` o cualquier API del navegador, comprueba que estás en el navegador para evitar errores en el servidor.

6. **Limpia los recursos en `ngOnDestroy`.** Si creas event listeners, intervalos, o instancias de librerías externas a través de View Queries, asegúrate de limpiarlos cuando el componente se destruya para evitar memory leaks.

7. **No abuses de View Queries para comunicación padre-hijo.** Para la mayoría de casos de comunicación padre-hijo, usa `@Input()` y `@Output()`. ViewChild para llamar métodos del hijo es apropiado solo para acciones imperativas (iniciar/pausar cronómetro, enfocar input, etc.).

8. **Tipa correctamente las queries para evitar `any`.** Usa `viewChild<ElementRef<HTMLInputElement>>('ref')` en lugar de `viewChild('ref')` para obtener tipos precisos y autocompletado en el IDE.

## Errores frecuentes

1. **Intentar acceder a `viewChild` en el constructor.** El valor será `undefined` porque la vista del componente aún no se ha renderizado. Solución: usa `ngAfterViewInit`, `afterNextRender()`, o `effect()`.

2. **Intentar acceder a `contentChild` en `ngAfterViewInit`.** El contenido proyectado DEBE consultarse en `ngAfterContentInit`. En `ngAfterViewInit` ya es demasiado tarde para ciertas operaciones relacionadas con el contenido proyectado.

3. **Confundir `viewChild` con `contentChild` en componentes con proyección.** Recuerda: `viewChild` para elementos del template propio, `contentChild` para elementos proyectados por el padre. Un error típico es usar `viewChild` para intentar acceder a contenido proyectado.

4. **Usar múltiples `ng-content` sin selectores pensando que cada uno captura contenido diferente.** Todos los `<ng-content>` sin selector capturan el mismo contenido. Si quieres múltiples slots, usa selectores de atributo (`select="[slot-name]"`).

5. **No limpiar recursos del DOM nativo en `ngOnDestroy`.** Si añades event listeners o creas elementos fuera del template de Angular (como tooltips o modales), debes eliminarlos al destruir el componente para evitar memory leaks.

6. **Modificar el DOM de un componente hijo desde el padre con `nativeElement`.** Esto rompe la encapsulación de componentes. Prefiere exponer métodos públicos en el componente hijo y llamarlos desde el padre, o usar `@Input()` para pasar datos.

7. **Olvidar que `viewChildren` devuelve un Signal de array, no un array mutable.** El resultado es `Signal<readonly T[]>`. No puedes hacer `.push()` directamente sobre él. Si necesitas modificar, usa la señal subyacente de los datos que generan los elementos.

8. **Usar `nativeElement.querySelector()` desde el componente.** Esto acopla el componente a la estructura del DOM interno y rompe el principio de encapsulación. Usa `viewChild` con referencias de plantilla (`#ref`) para acceder a elementos específicos.

## Resumen

Las View Queries y Content Queries son herramientas fundamentales para la interacción programática con el DOM en Angular. En este capítulo hemos aprendido:

- **Diferencia fundamental entre View y Content:** View son los elementos propios del template del componente; Content son los elementos proyectados mediante `ng-content`.
- **viewChild() y viewChild.required():** Acceden a un único elemento de la vista. Con Signals (Angular 17+), devuelven un `Signal<T>` reactivo. `required()` garantiza la existencia del elemento.
- **viewChildren():** Consulta múltiples elementos de la vista. Devuelve `Signal<readonly T[]>` que se actualiza automáticamente.
- **contentChild() y contentChildren():** Los equivalentes para contenido proyectado. Disponibles en `AfterContentInit`.
- **Casos prácticos:** Auto-focus, scroll suave, integración con librerías de terceros, comunicación con componentes hijos.
- **Seguridad y Renderer2:** El acceso directo al DOM con `nativeElement` conlleva riesgos de XSS y problemas con SSR. Renderer2 ofrece una alternativa segura y multiplataforma.

La API de señales para queries (introducida en Angular 17) representa una mejora significativa en ergonomía y reactividad respecto a los decoradores legacy. Su integración con `computed()`, `effect()` y el sistema de detección de cambios hace que el código sea más declarativo y predecible.

## Recursos adicionales

- [Documentación oficial de View Queries (Angular.dev)](https://angular.dev/guide/components/queries#view-queries)
- [Documentación oficial de Content Queries](https://angular.dev/guide/components/queries#content-queries)
- [Renderer2 API Reference](https://angular.dev/api/core/Renderer2)
- [afterRender / afterNextRender](https://angular.dev/api/core/afterRender)
- [Signal Queries Migration Guide](https://angular.dev/guide/signals/queries)
- [Angular Security Best Practices](https://angular.dev/best-practices/security)
