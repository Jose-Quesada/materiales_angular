# Proyección de Contenido en Angular

## Objetivos de aprendizaje

Al finalizar este capítulo, el alumnado será capaz de:

- Comprender el concepto de proyección de contenido (content projection) y su utilidad en la creación de componentes reutilizables.
- Utilizar `ng-content` para crear slots de proyección simples y múltiples.
- Implementar proyección condicional y contenido por defecto en componentes contenedores.
- Diseñar componentes de UI reutilizables (Cards, Modals, Tabs, Accordions) utilizando proyección de contenido.
- Aplicar la directiva `ngProjectAs` para proyección avanzada.
- Comparar la proyección de contenido con el uso de `@Input` para pasar templates.

## Resultados de aprendizaje

1. Construye componentes reutilizables con slots de proyección simple y múltiple.
2. Implementa selectores CSS en `ng-content` para proyección dirigida por atributos, clases y etiquetas.
3. Diseña componentes de interfaz de usuario complejos basados en proyección de contenido.
4. Aplica contenido por defecto en slots de proyección para componentes autosuficientes.
5. Evalúa cuándo usar proyección de contenido frente a otras técnicas de composición de componentes.

## Introducción

La proyección de contenido, también conocida como *content projection* o *transclusion* (término heredado de AngularJS), es uno de los patrones de composición más potentes de Angular. Permite crear componentes "contenedores" o "wrappers" que aceptan contenido HTML arbitrario desde el componente padre para mostrarlo en ubicaciones específicas de su plantilla.

Imagina que necesitas un componente `Card` reutilizable que debe mostrar diferentes tipos de contenido: a veces un texto, otras veces una imagen, otras un formulario completo. Sin la proyección de contenido, tendrías que crear múltiples componentes o usar complejas estructuras de `@Input` y `@if`. Con `ng-content`, el componente padre define qué contenido se renderiza dentro del hijo, manteniendo una separación limpia entre la estructura (el contenedor) y el contenido (lo que varía).

Este capítulo te enseñará a dominar `ng-content` en todas sus variantes: proyección simple, proyección múltiple con selectores, proyección condicional y la directiva `ngProjectAs`. Aprenderás a construir componentes de interfaz de usuario reutilizables que acepten contenido personalizado, mejorando la flexibilidad y mantenibilidad de tus aplicaciones.

La proyección de contenido es especialmente relevante en sistemas de diseño y librerías de componentes, donde el creador del componente no puede anticipar todos los casos de uso y debe proporcionar flexibilidad máxima.

---

## Desarrollo teórico

### Qué es la proyección de contenido (content projection)

La proyección de contenido es un mecanismo que permite a un componente Angular aceptar y mostrar contenido HTML que se le pasa desde fuera, es decir, desde su componente padre. Este contenido se inserta en ubicaciones específicas dentro de la plantilla del componente hijo mediante la etiqueta `<ng-content>`.

**Ejemplo conceptual más simple:**

```typescript
// Componente hijo: una "caja" con borde que acepta cualquier contenido
@Component({
  selector: 'app-caja',
  standalone: true,
  template: `
    <div class="caja">
      <h3>Caja Reutilizable</h3>
      <div class="cuerpo-caja">
        <ng-content />  <!-- Aquí se proyecta el contenido del padre -->
      </div>
    </div>
  `,
  styles: [`
    .caja {
      border: 2px solid #3498db;
      border-radius: 8px;
      padding: 1rem;
      margin: 1rem 0;
    }
    .caja h3 {
      margin-top: 0;
      color: #2980b9;
    }
  `]
})
export class CajaComponent {}

// Uso desde cualquier componente padre
@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [CajaComponent],
  template: `
    <app-caja>
      <p>Este párrafo se proyecta dentro de la caja.</p>
      <button>Un botón también</button>
      <span>Y cualquier otro contenido HTML</span>
    </app-caja>
  `
})
export class DemoComponent {}
```

**Resultado del DOM renderizado:**

```html
<div class="caja">
  <h3>Caja Reutilizable</h3>
  <div class="cuerpo-caja">
    <p>Este párrafo se proyecta dentro de la caja.</p>
    <button>Un botón también</button>
    <span>Y cualquier otro contenido HTML</span>
  </div>
</div>
```

La clave es que el contenido definido entre las etiquetas `<app-caja>...</app-caja>` se "proyecta" al lugar donde está `<ng-content />` en la plantilla del componente `CajaComponent`.

### ng-content

#### Proyección simple (slot único)

La proyección simple es el caso más básico: un único `<ng-content />` en la plantilla del componente hijo. Todo el contenido colocado entre las etiquetas del componente se proyecta en esa ubicación.

```typescript
@Component({
  selector: 'app-panel',
  standalone: true,
  template: `
    <div class="panel">
      <div class="panel-header">Panel</div>
      <div class="panel-body">
        <ng-content />
      </div>
      <div class="panel-footer">© 2025</div>
    </div>
  `,
  styles: [`
    .panel {
      border: 1px solid #ddd;
      border-radius: 6px;
      overflow: hidden;
      margin: 1rem 0;
    }
    .panel-header {
      background: #f5f5f5;
      padding: 0.75rem 1rem;
      font-weight: bold;
      border-bottom: 1px solid #ddd;
    }
    .panel-body {
      padding: 1rem;
    }
    .panel-footer {
      background: #f5f5f5;
      padding: 0.5rem 1rem;
      font-size: 0.8rem;
      border-top: 1px solid #ddd;
    }
  `]
})
export class PanelComponent {}
```

**Uso del panel:**

```html
<app-panel>
  <p>Este contenido se proyecta en el cuerpo del panel.</p>
  <ul>
    <li>Elemento 1</li>
    <li>Elemento 2</li>
  </ul>
</app-panel>
```

#### Proyección múltiple con selectores CSS (atributo `select`)

Angular permite definir múltiples slots de proyección mediante el atributo `select` en `<ng-content>`. El selector puede ser cualquier selector CSS válido: por etiqueta, por clase, por atributo, por ID, etc.

```typescript
@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div class="card">
      <div class="card-header">
        <ng-content select="[card-header]" />
      </div>
      <div class="card-image">
        <ng-content select="[card-image]" />
      </div>
      <div class="card-body">
        <ng-content select="[card-body]" />
      </div>
      <div class="card-footer">
        <ng-content select="[card-footer]" />
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      max-width: 400px;
    }
    .card-header {
      padding: 1rem;
      font-size: 1.25rem;
      font-weight: bold;
      border-bottom: 1px solid #e0e0e0;
      background: #fafafa;
    }
    .card-image img {
      width: 100%;
      display: block;
    }
    .card-body {
      padding: 1rem;
    }
    .card-footer {
      padding: 0.75rem 1rem;
      border-top: 1px solid #e0e0e0;
      background: #fafafa;
      text-align: right;
    }
  `]
})
export class CardComponent {}
```

**Uso de la Card con proyección múltiple por atributos:**

```html
<app-card>
  <!-- Contenido para el header: usa el atributo card-header -->
  <h2 card-header>Producto Destacado</h2>

  <!-- Contenido para la imagen: usa el atributo card-image -->
  <img card-image src="assets/producto.jpg" alt="Producto" />

  <!-- Contenido para el body: usa el atributo card-body -->
  <p card-body>
    Este es el producto más vendido de nuestra tienda.
    <strong>Precio: 49,99 €</strong>
  </p>

  <!-- Contenido para el footer: usa el atributo card-footer -->
  <div card-footer>
    <button>Comprar ahora</button>
    <button>Añadir al carrito</button>
  </div>
</app-card>
```

#### Tipos de selectores en ng-content

Angular soporta todos los selectores CSS estándar en el atributo `select` de `<ng-content>`. Los más utilizados son:

**1. Selector por atributo (recomendado):**

```html
<ng-content select="[slot-header]" />
<ng-content select="[slot-body]" />
<ng-content select="[slot-footer]" />
```

Los selectores por atributo son la opción más recomendada porque son semánticamente claros y no interfieren con los estilos CSS de clases o IDs.

**2. Selector por clase CSS:**

```html
<ng-content select=".header-content" />
<ng-content select=".body-content" />
```

```html
<!-- Uso: el padre aplica la clase al elemento que quiere proyectar -->
<app-layout>
  <div class="header-content">Título</div>
  <p class="body-content">Contenido principal</p>
</app-layout>
```

**3. Selector por etiqueta HTML:**

```html
<ng-content select="header" />
<ng-content select="footer" />
<ng-content select="nav" />
```

```html
<app-layout>
  <header>Cabecera de la página</header>
  <nav>Menú de navegación</nav>
  <footer>Pie de página</footer>
</app-layout>
```

**4. Selector compuesto (combinación de selectores):**

```html
<ng-content select="[slot][side=left]" />
<ng-content select="[slot][side=right]" />
```

```html
<app-sidebar>
  <div slot side="left">Panel izquierdo</div>
  <div slot side="right">Panel derecho</div>
</app-sidebar>
```

#### Proyección condicional

Un mismo elemento puede coincidir con múltiples selectores. El contenido se proyecta en el primer `<ng-content>` cuyo selector coincida. El resto de `<ng-content>` que pudieran coincidir no recibirán ese elemento.

**Ejemplo de orden de captura:**

```typescript
@Component({
  selector: 'app-contenedor',
  standalone: true,
  template: `
    <!-- Slot 1: captura elementos con el atributo "primero" -->
    <div class="zona-1">
      <ng-content select="[primero]" />
    </div>
    <!-- Slot 2: captura el resto (sin selector) -->
    <div class="zona-2">
      <ng-content />
    </div>
  `,
})
export class ContenedorComponent {}
```

```html
<app-contenedor>
  <p primero>Esto va a la zona 1 (tiene el atributo "primero")</p>
  <p>Esto va a la zona 2 (no tiene atributo especial)</p>
  <span primero>Esto también va a zona 1</span>
</app-contenedor>
```

**Importante:** Un mismo elemento solo se proyecta una vez, en el primer `ng-content` cuyo selector coincida. Si un elemento tiene atributo `primero`, irá al slot con `select="[primero]"`, no al slot sin selector.

#### Contenido por defecto (lo que se muestra si no se proyecta nada)

Si el padre no proporciona contenido para un slot, podemos definir contenido por defecto dentro del propio `<ng-content>`. Este contenido se mostrará solo si no se proyecta nada en ese slot.

```typescript
@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    <div class="modal">
      <div class="modal-header">
        <ng-content select="[modal-titulo]">
          <!-- Contenido por defecto para el título -->
          <h2>Sin título</h2>
        </ng-content>
        <button class="cerrar">×</button>
      </div>
      <div class="modal-body">
        <ng-content select="[modal-cuerpo]">
          <!-- Contenido por defecto para el cuerpo -->
          <p>No hay contenido disponible.</p>
        </ng-content>
      </div>
      <div class="modal-footer">
        <ng-content select="[modal-botones]">
          <!-- Contenido por defecto para los botones -->
          <button>Aceptar</button>
          <button>Cancelar</button>
        </ng-content>
      </div>
    </div>
  `,
  styles: [`
    .modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      min-width: 400px;
      z-index: 1000;
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid #eee;
    }
    .modal-body { padding: 1.5rem; }
    .modal-footer {
      padding: 1rem;
      border-top: 1px solid #eee;
      text-align: right;
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
    }
    .cerrar {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
    }
  `]
})
export class ModalComponent {}
```

**Uso con proyección completa:**

```html
<app-modal>
  <h2 modal-titulo>Confirmar eliminación</h2>
  <p modal-cuerpo>¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.</p>
  <div modal-botones>
    <button class="btn-cancelar">Cancelar</button>
    <button class="btn-peligro">Eliminar</button>
  </div>
</app-modal>
```

**Uso sin proyección (se muestra el contenido por defecto):**

```html
<!-- Modal vacío: se mostrarán los valores por defecto -->
<app-modal />
```

### ngProjectAs (proyectar contenido en un slot específico)

La directiva `ngProjectAs` se aplica a un `ng-container` y permite proyectar el contenido interior como si tuviera un selector diferente al que realmente tiene. Esto es útil cuando el contenido que queremos proyectar no puede llevar el atributo selector directamente, o cuando necesitamos agrupar múltiples elementos para un mismo slot sin envolverlos en un div adicional.

**Escenario 1: Agrupar múltiples elementos sin div contenedor extra:**

```html
<!-- Sin ngProjectAs: necesitamos un div con el atributo selector -->
<app-card>
  <div card-body> <!-- Este div extra puede romper estilos -->
    <p>Párrafo 1</p>
    <p>Párrafo 2</p>
    <ul>
      <li>Elemento</li>
    </ul>
  </div>
</app-card>

<!-- Con ngProjectAs: ng-container no genera elemento en el DOM -->
<app-card>
  <ng-container ngProjectAs="[card-body]">
    <p>Párrafo 1</p>
    <p>Párrafo 2</p>
    <ul>
      <li>Elemento</li>
    </ul>
  </ng-container>
</app-card>
```

**Escenario 2: Proyectar un componente hijo en un slot específico:**

```html
<!-- Queremos que este icono se proyecte en el slot [card-header] -->
<app-card>
  <app-icono nombre="estrella" ngProjectAs="[card-header]" />
  <p card-body>Contenido</p>
</app-card>
```

Sin `ngProjectAs`, el componente `<app-icono>` se proyectaría en el slot por defecto (sin selector) o no se proyectaría en ningún slot concreto. Con `ngProjectAs`, forzamos su proyección al slot `[card-header]`.

**Escenario 3: Proyección condicional de templates:**

```html
<app-card>
  @if (mostrarHeader) {
    <h2 ngProjectAs="[card-header]">Título condicional</h2>
  }
  <p card-body>El cuerpo siempre se muestra</p>
</app-card>
```

### Componentes reutilizables con proyección de contenido

La proyección de contenido brilla especialmente en la construcción de componentes de interfaz de usuario reutilizables. Veamos algunos de los patrones más comunes.

#### Panel / Card

Ya hemos visto ejemplos de Cards. Aquí tienes una Card más avanzada con soporte para estados de carga y error:

```typescript
@Component({
  selector: 'app-card-avanzada',
  standalone: true,
  template: `
    <div class="card-avanzada" [class.cargando]="cargando">
      @if (cargando) {
        <div class="card-overlay">
          <div class="spinner"></div>
          <p>Cargando...</p>
        </div>
      }

      <div class="card-header">
        <ng-content select="[card-header]" />
      </div>

      <div class="card-body">
        <ng-content select="[card-body]" />
      </div>

      <div class="card-footer">
        <ng-content select="[card-footer]" />
      </div>
    </div>
  `,
  styles: [`
    .card-avanzada {
      position: relative;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
    }
    .card-overlay {
      position: absolute;
      inset: 0;
      background: rgba(255,255,255,0.8);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 10;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #eee;
      border-top-color: #3498db;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .card-header { padding: 1rem; border-bottom: 1px solid #e0e0e0; font-weight: bold; }
    .card-body { padding: 1rem; }
    .card-footer { padding: 0.75rem 1rem; border-top: 1px solid #e0e0e0; text-align: right; }
  `]
})
export class CardAvanzadaComponent {
  @Input() cargando = false;
}
```

#### Modal

```typescript
@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    @if (abierto) {
      <div class="modal-backdrop" (click)="cerrar()">
        <div class="modal-contenedor" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <ng-content select="[modal-titulo]">
              <h2>Modal</h2>
            </ng-content>
            <button class="btn-cerrar" (click)="cerrar()" aria-label="Cerrar">&times;</button>
          </div>

          <div class="modal-body">
            <ng-content select="[modal-cuerpo]">
              <p>Contenido del modal.</p>
            </ng-content>
          </div>

          <div class="modal-footer">
            <ng-content select="[modal-acciones]">
              <button (click)="cerrar()">Cerrar</button>
            </ng-content>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease;
    }
    .modal-contenedor {
      background: white;
      border-radius: 8px;
      min-width: 450px;
      max-width: 90vw;
      max-height: 85vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      animation: slideIn 0.3s ease;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideIn { from { transform: translateY(-30px); opacity: 0; } }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #eee;
    }
    .modal-body { padding: 1.5rem; }
    .modal-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid #eee;
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
    }
    .btn-cerrar {
      background: none;
      border: none;
      font-size: 1.8rem;
      cursor: pointer;
      line-height: 1;
      padding: 0;
      color: #999;
    }
    .btn-cerrar:hover { color: #333; }
  `]
})
export class ModalComponent {
  @Input() abierto = false;
  @Output() cerrarModal = new EventEmitter<void>();

  cerrar(): void {
    this.cerrarModal.emit();
  }
}
```

**Uso del modal:**

```html
<app-modal [abierto]="modalConfirmacionAbierto" (cerrarModal)="modalConfirmacionAbierto = false">
  <h3 modal-titulo>Eliminar usuario</h3>

  <div modal-cuerpo>
    <p>¿Estás seguro de eliminar al usuario <strong>{{ usuario.nombre }}</strong>?</p>
    <p class="advertencia">Esta acción no se puede deshacer.</p>
  </div>

  <div modal-acciones>
    <button class="btn-secundario" (click)="modalConfirmacionAbierto = false">Cancelar</button>
    <button class="btn-peligro" (click)="eliminarUsuario()">Eliminar</button>
  </div>
</app-modal>
```

#### Accordion (acordeón)

```typescript
@Component({
  selector: 'app-accordion',
  standalone: true,
  template: `
    <div class="accordion">
      <button class="accordion-header" (click)="toggle()" [attr.aria-expanded]="expandido">
        <ng-content select="[accordion-titulo]">
          <span>Sección</span>
        </ng-content>
        <span class="icono">{{ expandido ? '▲' : '▼' }}</span>
      </button>

      @if (expandido) {
        <div class="accordion-body">
          <ng-content select="[accordion-contenido]">
            <p>Contenido de la sección.</p>
          </ng-content>
        </div>
      }
    </div>
  `,
  styles: [`
    .accordion {
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-bottom: 0.5rem;
      overflow: hidden;
    }
    .accordion-header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: #f9f9f9;
      border: none;
      cursor: pointer;
      font-size: 1rem;
      text-align: left;
    }
    .accordion-header:hover { background: #f0f0f0; }
    .accordion-body {
      padding: 1rem;
      border-top: 1px solid #ddd;
      animation: slideDown 0.3s ease;
    }
    @keyframes slideDown {
      from { max-height: 0; opacity: 0; }
      to { max-height: 500px; opacity: 1; }
    }
    .icono { font-size: 0.8rem; color: #999; }
  `]
})
export class AccordionComponent {
  @Input() expandido = false;
  @Output() expandidoChange = new EventEmitter<boolean>();

  toggle(): void {
    this.expandido = !this.expandido;
    this.expandidoChange.emit(this.expandido);
  }
}
```

**Uso del accordion (múltiples secciones):**

```html
<app-accordion [(expandido)]="seccion1Abierta">
  <h3 accordion-titulo>Información personal</h3>
  <div accordion-contenido>
    <form>
      <label>Nombre: <input /></label>
      <label>Email: <input type="email" /></label>
    </form>
  </div>
</app-accordion>

<app-accordion [(expandido)]="seccion2Abierta">
  <h3 accordion-titulo>Preferencias</h3>
  <div accordion-contenido>
    <label><input type="checkbox" /> Recibir newsletter</label>
    <label><input type="checkbox" /> Modo oscuro</label>
  </div>
</app-accordion>
```

#### Tabs (pestañas)

Las Tabs son un caso especialmente interesante de proyección de contenido. Normalmente los paneles de las Tabs se proyectan como contenido, y el componente de Tabs detecta cuántas pestañas hay y genera los botones de navegación automáticamente.

```typescript
@Component({
  selector: 'app-tab',
  standalone: true,
  template: `
    @if (activo) {
      <div class="tab-panel" role="tabpanel">
        <ng-content />
      </div>
    }
  `
})
export class TabComponent {
  @Input() titulo = '';
  @Input() activo = false;
}

@Component({
  selector: 'app-tabs',
  standalone: true,
  template: `
    <div class="tabs">
      <div class="tabs-header" role="tablist">
        @for (tab of tabComponents(); track $index; let i = $index) {
          <button
            class="tab-btn"
            [class.active]="i === tabActivo()"
            (click)="seleccionarTab(i)"
            role="tab"
            [attr.aria-selected]="i === tabActivo()">
            {{ tab.titulo }}
          </button>
        }
      </div>
      <div class="tabs-body">
        <ng-content />
      </div>
    </div>
  `
})
export class TabsComponent {
  // Usaremos @ContentChildren para detectar los paneles proyectados
  // (esto se cubre en detalle en el capítulo de Queries)
  @ContentChildren(TabComponent) tabComponents!: QueryList<TabComponent>;
  tabActivo = signal(0);

  seleccionarTab(indice: number): void {
    this.tabActivo.set(indice);
  }
}
```

**Uso de las Tabs:**

```html
<app-tabs>
  <app-tab titulo="General">
    <p>Contenido de la pestaña General</p>
  </app-tab>
  <app-tab titulo="Seguridad">
    <p>Configuración de seguridad y contraseñas</p>
  </app-tab>
  <app-tab titulo="Notificaciones">
    <p>Preferencias de notificaciones por email</p>
  </app-tab>
</app-tabs>
```

### Wrappers con lógica común

La proyección de contenido permite crear wrappers que encapsulen lógica común (estados de carga, error, vacío) mientras el contenido específico se proyecta desde fuera.

```typescript
@Component({
  selector: 'app-data-loader',
  standalone: true,
  template: `
    @if (cargando()) {
      <ng-content select="[loader-cargando]">
        <!-- Contenido por defecto para estado de carga -->
        <div class="estado-cargando">
          <div class="spinner"></div>
          <p>Cargando datos...</p>
        </div>
      </ng-content>
    }
    @else if (error()) {
      <ng-content select="[loader-error]">
        <!-- Contenido por defecto para estado de error -->
        <div class="estado-error">
          <p>Error: {{ error() }}</p>
          <button (click)="reintentar()">Reintentar</button>
        </div>
      </ng-content>
    }
    @else if (!hayDatos()) {
      <ng-content select="[loader-vacio]">
        <!-- Contenido por defecto para estado vacío -->
        <div class="estado-vacio">
          <p>No hay datos disponibles.</p>
        </div>
      </ng-content>
    }
    @else {
      <!-- Slot principal para los datos -->
      <ng-content />
    }
  `
})
export class DataLoaderComponent<T> {
  @Input() cargando = signal(false);
  @Input() error = signal<string | null>(null);
  @Input() hayDatos = signal(false);

  @Output() recargar = new EventEmitter<void>();

  reintentar(): void {
    this.recargar.emit();
  }
}
```

**Uso del DataLoader con proyección personalizada para cada estado:**

```html
<app-data-loader
  [cargando]="cargandoUsuarios"
  [error]="errorUsuarios"
  [hayDatos]="usuarios().length > 0"
  (recargar)="cargarUsuarios()">

  <!-- Estado de carga personalizado -->
  <div loader-cargando>
    <app-skeleton-loader filas="5" />
  </div>

  <!-- Estado de error personalizado -->
  <div loader-error>
    <app-alerta tipo="error" [mensaje]="errorUsuarios()" />
  </div>

  <!-- Estado vacío personalizado -->
  <div loader-vacio>
    <app-estado-vacio
      icono="people"
      titulo="Sin usuarios"
      descripcion="No hay usuarios registrados en el sistema." />
  </div>

  <!-- Contenido cuando hay datos: se proyecta en el slot por defecto -->
  <table>
    <thead>
      <tr><th>Nombre</th><th>Email</th><th>Acciones</th></tr>
    </thead>
    <tbody>
      @for (usuario of usuarios(); track usuario.id) {
        <tr>
          <td>{{ usuario.nombre }}</td>
          <td>{{ usuario.email }}</td>
          <td><button (click)="editar(usuario)">Editar</button></td>
        </tr>
      }
    </tbody>
  </table>
</app-data-loader>
```

### Buenas prácticas en proyección de contenido

1. **Prefiere selectores de atributo sobre selectores de clase o etiqueta.** Los atributos como `[slot-header]` son semánticamente claros, no colisionan con estilos CSS y funcionan con cualquier elemento HTML.

2. **Proporciona siempre contenido por defecto.** Hace que tus componentes sean autosuficientes y fáciles de usar en prototipados rápidos. El contenido por defecto debe ser genérico y funcional.

3. **Documenta los slots disponibles.** Especifica claramente qué slots acepta tu componente y qué tipo de contenido espera en cada uno. Puedes usar comentarios JSDoc o crear interfaces documentadas.

4. **Mantén la proyección simple.** Si un componente necesita más de 3-4 slots de proyección, considera dividirlo en componentes más pequeños o replantear su diseño.

5. **Usa `ngProjectAs` para evitar divs envoltorios innecesarios.** Cuando necesites agrupar elementos para un slot sin añadir nodos extra al DOM, `ng-container` con `ngProjectAs` es la solución.

6. **Combina proyección con `@Input` para contenido estático.** Para datos simples como cadenas de texto, es más eficiente usar `@Input` que la proyección. Reserva la proyección para contenido HTML complejo y dinámico.

### Comparación con @Input para pasar templates

Existen dos enfoques principales para hacer un componente reutilizable: pasar contenido mediante proyección (`ng-content`) o pasar templates mediante `@Input`.

| Característica | ng-content (proyección) | @Input con TemplateRef |
|---------------|------------------------|------------------------|
| **Sintaxis en el padre** | HTML natural entre etiquetas | Binding de propiedad con template |
| **Contexto de ejecución** | El contenido se evalúa en el contexto del padre | Puede evaluarse en cualquier contexto (padre, hijo, o implícito) |
| **Curva de aprendizaje** | Baja (HTML estándar) | Media (requiere entender TemplateRef y contexto) |
| **Flexibilidad** | Limitada: no se puede modificar el contenido desde el hijo | Alta: el hijo puede pasar datos al template (contexto) |
| **Rendimiento** | Mejor: sin overhead de templates dinámicos | Puede implicar recreación de templates |
| **Casos de uso** | Layouts, cards, modals, formularios simples | Tablas, listas virtuales, componentes de datos |
| **Data binding** | El contenido usa datos del padre directamente | El hijo puede pasar datos al template (ej: `$implicit`) |

**Ejemplo con `@Input` y `TemplateRef`:**

```typescript
@Component({
  selector: 'app-lista-personalizada',
  standalone: true,
  imports: [NgTemplateOutlet],
  template: `
    <ul>
      @for (item of datos; track item.id) {
        <li>
          <ng-container
            *ngTemplateOutlet="plantillaItem || plantillaPorDefecto;
            context: { $implicit: item }"
          />
        </li>
      }
    </ul>

    <ng-template #plantillaPorDefecto let-item>
      {{ item | json }}
    </ng-template>
  `
})
export class ListaPersonalizadaComponent<T> {
  @Input() datos: T[] = [];
  @Input() plantillaItem?: TemplateRef<{ $implicit: T }>;
}

// Uso desde el padre:
@Component({
  template: `
    <!-- Pasamos un template como @Input -->
    <app-lista-personalizada
      [datos]="usuarios"
      [plantillaItem]="filaUsuario">
    </app-lista-personalizada>

    <!-- Template definido en el padre -->
    <ng-template #filaUsuario let-usuario>
      <strong>{{ usuario.nombre }}</strong> — {{ usuario.email }}
    </ng-template>
  `
})
```

**Regla general:** usa `ng-content` por defecto para la mayoría de casos de componentes contenedores. Usa `TemplateRef` + `@Input` cuando el componente hijo necesite pasar datos de vuelta al template proyectado (listas, tablas, componentes de datos), o cuando el template deba renderizarse múltiples veces con diferentes datos.

---

## Ejemplos guiados

### Ejemplo 1: Componente Card reutilizable con header, body y footer

```typescript
// card.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div class="card" [class.destacada]="destacada">
      @if (titulo) {
        <div class="card-titulo">
          {{ titulo }}
        </div>
      }

      <div class="card-header">
        <ng-content select="[card-header]" />
      </div>

      <div class="card-body">
        <ng-content select="[card-body]" />
      </div>

      <div class="card-footer">
        <ng-content select="[card-footer]" />
      </div>
    </div>
  `,
  styles: [`
    .card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      overflow: hidden;
      transition: box-shadow 0.3s ease;
      margin-bottom: 1.5rem;
    }
    .card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .card.destacada { border-color: #3498db; box-shadow: 0 0 0 1px #3498db; }
    .card-titulo {
      padding: 0.75rem 1.25rem;
      background: #f8f9fa;
      font-weight: 600;
      font-size: 1.1rem;
      color: #495057;
      border-bottom: 1px solid #e0e0e0;
    }
    .card-header { padding: 1rem 1.25rem; }
    .card-body { padding: 1.25rem; }
    .card-footer { padding: 0.75rem 1.25rem; background: #f8f9fa; border-top: 1px solid #e0e0e0; }
  `]
})
export class CardComponent {
  @Input() titulo = '';
  @Input() destacada = false;
}

// Uso en cualquier página
@Component({
  selector: 'app-pagina-ejemplo',
  standalone: true,
  imports: [CardComponent],
  template: `
    <app-card titulo="Perfil de usuario" [destacada]="true">
      <div card-header>
        <img [src]="usuario.avatar" alt="Avatar" class="avatar" />
        <h3>{{ usuario.nombre }}</h3>
      </div>

      <div card-body>
        <p><strong>Email:</strong> {{ usuario.email }}</p>
        <p><strong>Miembro desde:</strong> {{ usuario.fechaRegistro | date }}</p>
      </div>

      <div card-footer>
        <button (click)="editar()">Editar perfil</button>
        <button (click)="cambiarPassword()">Cambiar contraseña</button>
      </div>
    </app-card>
  `
})
export class PaginaEjemploComponent {
  usuario = {
    avatar: 'assets/avatar-placeholder.png',
    nombre: 'María García',
    email: 'maria@example.com',
    fechaRegistro: new Date('2023-06-15')
  };

  editar(): void { console.log('Editar'); }
  cambiarPassword(): void { console.log('Cambiar password'); }
}
```

### Ejemplo 2: Componente Modal con slots para título, cuerpo y botones

(Véase el código desarrollado en la sección teórica "Modal" de este mismo capítulo como referencia.)

### Ejemplo 3: Componente Tabs con proyección múltiple

```typescript
// tab.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tab',
  standalone: true,
  template: `
    @if (activo) {
      <div class="tab-contenido" role="tabpanel">
        <ng-content />
      </div>
    }
  `,
  styles: [`
    .tab-contenido {
      padding: 1.5rem;
      animation: fadeIn 0.3s ease;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class TabComponent {
  @Input() titulo = '';
  @Input() icono = '';
  @Input() activo = false;
}

// tabs.component.ts
import { Component, ContentChildren, QueryList, signal, AfterContentInit } from '@angular/core';
import { TabComponent } from './tab.component';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [TabComponent],
  template: `
    <div class="tabs">
      <div class="tabs-navegacion" role="tablist">
        @for (tab of tabs; track $index; let i = $index) {
          <button
            class="tab-btn"
            [class.active]="i === tabActivo()"
            (click)="activarTab(i)"
            role="tab"
            [attr.aria-selected]="i === tabActivo()">
            @if (tab.icono) {
              <span class="tab-icono">{{ tab.icono }}</span>
            }
            {{ tab.titulo }}
          </button>
        }
      </div>
      <div class="tabs-contenido">
        <ng-content />
      </div>
    </div>
  `,
  styles: [`
    .tabs { border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
    .tabs-navegacion {
      display: flex;
      background: #f5f5f5;
      border-bottom: 2px solid #e0e0e0;
      overflow-x: auto;
    }
    .tab-btn {
      padding: 0.75rem 1.5rem;
      border: none;
      background: transparent;
      cursor: pointer;
      font-size: 0.95rem;
      color: #666;
      white-space: nowrap;
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      transition: all 0.2s;
    }
    .tab-btn:hover { color: #333; background: rgba(0,0,0,0.02); }
    .tab-btn.active { color: #3498db; border-bottom-color: #3498db; font-weight: 600; }
    .tab-icono { margin-right: 0.5rem; }
    .tabs-contenido { min-height: 200px; }
  `]
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs!: QueryList<TabComponent>;
  tabActivo = signal(0);

  ngAfterContentInit(): void {
    // Activar la primera pestaña por defecto
    this.activarTab(0);
  }

  activarTab(indice: number): void {
    this.tabActivo.set(indice);
    this.tabs.forEach((tab, i) => {
      tab.activo = i === indice;
    });
  }
}
```

**Uso:**

```html
<app-tabs>
  <app-tab titulo="Facturación" icono="📄">
    <h2>Datos de facturación</h2>
    <form>...</form>
  </app-tab>

  <app-tab titulo="Notificaciones" icono="🔔">
    <h2>Preferencias de notificación</h2>
    <div class="opciones-notificaciones">...</div>
  </app-tab>

  <app-tab titulo="Seguridad" icono="🔒">
    <h2>Configuración de seguridad</h2>
    <app-cambiar-password />
  </app-tab>
</app-tabs>
```

### Ejemplo 4: Componente Accordion con contenido por defecto y proyección

(Véase el código desarrollado en la sección teórica "Accordion" de este mismo capítulo como referencia.)

---

## Ejercicios resueltos

### Ejercicio 1: Componente Panel colapsable con proyección

**Enunciado:** Crea un componente `PanelColapsable` que permita mostrar/ocultar su contenido y acepte proyección para el título y el cuerpo. El título debe ser clickable y mostrar un indicador visual (flecha) del estado abierto/cerrado. Debe tener contenido por defecto para ambos slots.

```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-panel-colapsable',
  standalone: true,
  template: `
    <div class="panel" [class.abierto]="expandido">
      <button class="panel-cabecera" (click)="toggle()" [attr.aria-expanded]="expandido">
        <span class="panel-titulo">
          <ng-content select="[panel-titulo]">
            <span>Sección</span>
          </ng-content>
        </span>
        <span class="panel-flecha">{{ expandido ? '▲' : '▼' }}</span>
      </button>

      @if (expandido) {
        <div class="panel-cuerpo">
          <ng-content select="[panel-cuerpo]">
            <p>Contenido de la sección no especificado.</p>
          </ng-content>
        </div>
      }
    </div>
  `,
  styles: [`
    .panel {
      border: 1px solid #d0d0d0;
      border-radius: 6px;
      margin-bottom: 0.5rem;
      overflow: hidden;
      transition: border-color 0.3s;
    }
    .panel.abierto { border-color: #3498db; }
    .panel-cabecera {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      background: #f8f9fa;
      border: none;
      cursor: pointer;
      font-size: 1rem;
      text-align: left;
      transition: background 0.2s;
    }
    .panel-cabecera:hover { background: #e9ecef; }
    .panel-titulo { font-weight: 600; }
    .panel-flecha { font-size: 0.75rem; color: #888; transition: transform 0.3s; }
    .panel-cuerpo {
      padding: 1rem;
      animation: slideDown 0.3s ease;
      border-top: 1px solid #d0d0d0;
    }
    @keyframes slideDown {
      from { opacity: 0; max-height: 0; }
      to { opacity: 1; max-height: 500px; }
    }
  `]
})
export class PanelColapsableComponent {
  @Input() expandido = false;
  @Output() expandidoChange = new EventEmitter<boolean>();

  toggle(): void {
    this.expandido = !this.expandido;
    this.expandidoChange.emit(this.expandido);
  }
}
```

**Uso:**

```html
<app-panel-colapsable [(expandido)]="panel1Abierto">
  <h3 panel-titulo>Información del pedido #4521</h3>
  <div panel-cuerpo>
    <p><strong>Fecha:</strong> 15/03/2025</p>
    <p><strong>Estado:</strong> En tránsito</p>
    <p><strong>Dirección de entrega:</strong> Calle Mayor, 12, Madrid</p>
    <ul>
      <li>Producto A x2 — 30,00 €</li>
      <li>Producto B x1 — 45,00 €</li>
    </ul>
    <p><strong>Total:</strong> 75,00 €</p>
  </div>
</app-panel-colapsable>

<!-- Sin proyección: se muestran los valores por defecto -->
<app-panel-colapsable />
```

### Ejercicio 2: Componente de Layout Maestro-Detalle

**Enunciado:** Construye un layout maestro-detalle con proyección de contenido. La parte izquierda (maestro) muestra una lista de elementos y la parte derecha (detalle) muestra la información del elemento seleccionado.

```typescript
// maestro-detalle.component.ts
import { Component, Input, Output, EventEmitter, signal } from '@angular/core';

@Component({
  selector: 'app-maestro-detalle',
  standalone: true,
  template: `
    <div class="maestro-detalle">
      <!-- Panel Maestro (izquierda) -->
      <aside class="panel-maestro">
        <div class="maestro-cabecera">
          <ng-content select="[maestro-titulo]">
            <h3>Listado</h3>
          </ng-content>
          <ng-content select="[maestro-acciones]" />
        </div>
        <div class="maestro-lista">
          <ng-content select="[maestro-lista]">
            <p class="placeholder">Selecciona un elemento de la lista.</p>
          </ng-content>
        </div>
      </aside>

      <!-- Panel Detalle (derecha) -->
      <main class="panel-detalle">
        @if (elementoSeleccionado(); as id) {
          <div class="detalle-cabecera">
            <ng-content select="[detalle-titulo]" />
          </div>
          <div class="detalle-cuerpo">
            <ng-content select="[detalle-contenido]" />
          </div>
          <div class="detalle-pie">
            <ng-content select="[detalle-acciones]" />
          </div>
        } @else {
          <div class="detalle-vacio">
            <ng-content select="[detalle-vacio]">
              <div class="placeholder-detalle">
                <span class="icono-grande">📋</span>
                <p>Selecciona un elemento para ver sus detalles.</p>
              </div>
            </ng-content>
          </div>
        }
      </main>
    </div>
  `,
  styles: [`
    .maestro-detalle {
      display: grid;
      grid-template-columns: 350px 1fr;
      gap: 1px;
      background: #e0e0e0;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
      min-height: 500px;
    }
    .panel-maestro {
      background: white;
      display: flex;
      flex-direction: column;
    }
    .maestro-cabecera {
      padding: 1rem;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .maestro-lista {
      flex: 1;
      overflow-y: auto;
      padding: 0.5rem;
    }
    .panel-detalle {
      background: white;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }
    .detalle-cabecera { padding: 1rem; border-bottom: 1px solid #e0e0e0; }
    .detalle-cuerpo { flex: 1; padding: 1.5rem; }
    .detalle-pie { padding: 1rem; border-top: 1px solid #e0e0e0; }
    .detalle-vacio {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .placeholder-detalle {
      text-align: center;
      color: #999;
    }
    .icono-grande { font-size: 3rem; }
    .placeholder { color: #999; text-align: center; margin-top: 2rem; }
  `]
})
export class MaestroDetalleComponent {
  @Input() elementoSeleccionado = signal<number | string | null>(null);
}
```

**Uso del layout maestro-detalle:**

```html
<app-maestro-detalle [elementoSeleccionado]="usuarioSeleccionado">
  <!-- Zona Maestro: título y acciones -->
  <h3 maestro-titulo>Usuarios del sistema</h3>
  <button maestro-acciones (click)="nuevoUsuario()">+ Nuevo</button>

  <!-- Zona Maestro: lista de elementos -->
  <div maestro-lista>
    @for (usuario of usuarios(); track usuario.id) {
      <div
        class="item-usuario"
        [class.seleccionado]="usuarioSeleccionado() === usuario.id"
        (click)="seleccionar(usuario.id)">
        <strong>{{ usuario.nombre }}</strong>
        <span>{{ usuario.email }}</span>
      </div>
    }
  </div>

  <!-- Zona Detalle: título (se muestra cuando hay selección) -->
  <h2 detalle-titulo>Detalles del usuario</h2>

  <!-- Zona Detalle: contenido principal -->
  <div detalle-contenido>
    @if (usuarioActual(); as user) {
      <p><strong>ID:</strong> {{ user.id }}</p>
      <p><strong>Nombre:</strong> {{ user.nombre }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Rol:</strong> {{ user.rol }}</p>
    }
  </div>

  <!-- Zona Detalle: acciones al pie -->
  <div detalle-acciones>
    <button class="btn-editar" (click)="editarUsuario()">Editar</button>
    <button class="btn-eliminar" (click)="eliminarUsuario()">Eliminar</button>
  </div>
</app-maestro-detalle>
```

---

## Actividades propuestas

1. **Componente de Alertas reutilizable:** Crea un componente `Alerta` que acepte proyección de contenido para el mensaje y el icono. Debe tener 4 variantes visuales (success, warning, error, info) controladas por un `@Input`. Incluye contenido por defecto apropiado para cada variante y un botón de cierre.

2. **Componente Dropdown con proyección:** Implementa un componente `Dropdown` que proyecte el botón disparador y el contenido del menú mediante slots. El dropdown debe cerrarse al hacer clic fuera y al seleccionar una opción. Implementa animaciones de apertura/cierre.

3. **Componente Stepper (asistente multi-paso):** Construye un componente `Stepper` que acepte componentes `Step` proyectados como contenido. El Stepper debe mostrar una barra de progreso, permitir navegación entre pasos con botones "Anterior"/"Siguiente", y validar cada paso antes de avanzar. Cada `Step` debe poder proyectar su propio contenido.

4. **Componente de Formulario con layout adaptable:** Crea un componente `FormLayout` que acepte proyección para campos de formulario y los organice automáticamente en una cuadrícula responsive. Debe tener slots para el título del formulario, los campos, las acciones (botones) y un mensaje de error general. Implementa diferentes densidades de layout (compacto, normal, espacioso) mediante un `@Input`.

5. **Componente de Tabla con slots personalizables:** Diseña un componente `DataTable` que use proyección para permitir personalizar columnas, cabeceras, pies y estados vacíos. Debe tener slots como `[columna-nombre]`, `[columna-acciones]`, `[tabla-vacia]`, `[tabla-cargando]` y `[tabla-error]`.

## Actividades de ampliación

1. **Sistema de Layouts de aplicación:** Construye tres layouts diferentes usando proyección de contenido (layout de aplicación estándar, layout de landing page, layout de dashboard con sidebar). Implementa un sistema que permita cambiar dinámicamente de layout según la ruta activa. Cada layout debe definir slots para header, sidebar, contenido principal y footer.

2. **Editor de páginas con bloques proyectables:** Desarrolla un editor de páginas sencillo donde el usuario pueda añadir bloques predefinidos (texto, imagen, video, código) que se renderizan mediante proyección de contenido. Cada bloque debe ser un componente independiente que se proyecta en un grid. Implementa drag & drop para reordenar bloques.

3. **Componente de visualización de datos con múltiples vistas:** Crea un componente `DataView` que acepte proyección para diferentes vistas de los mismos datos: vista de tabla, vista de tarjetas, vista de lista y vista de calendario. Usa `ng-content` con selectores específicos para cada vista y permite cambiar entre ellas mediante un selector.

## Buenas prácticas profesionales

1. **Usa selectores de atributo para los slots de proyección.** Los atributos como `[card-header]`, `[modal-body]` son la convención más extendida en el ecosistema Angular (seguida por Angular Material, PrimeNG, etc.). Evita selectores de clase o etiqueta que pueden generar colisiones con estilos CSS.

2. **Proporciona contenido por defecto en todos los slots.** Incluso si esperas que el desarrollador siempre proporcione contenido, un fallback mejora la experiencia de desarrollo y evita páginas en blanco. El contenido por defecto debe ser semánticamente correcto y visualmente aceptable.

3. **Nombra los slots con un prefijo consistente.** Si tu librería de componentes se llama "ui", nombra los slots como `[ui-header]`, `[ui-body]`, `[ui-footer]`. Esto previene colisiones con otros componentes y hace explícito el origen del slot.

4. **Documenta los slots disponibles.** Incluye en el README o en comentarios JSDoc del componente una lista de los slots disponibles, su propósito y un ejemplo de uso. Los desarrolladores que consuman tu componente te lo agradecerán.

5. **No abuses de la proyección de contenido.** Para componentes simples con pocas variaciones, usar `@Input` puede ser más limpio y tipado que la proyección. La proyección brilla cuando el contenido es complejo (HTML, otros componentes) o altamente variable.

6. **Combina proyección con `@ContentChild` / `@ContentChildren` para componentes avanzados.** Para Tabs, Steppers o Accordions que necesitan interactuar con el contenido proyectado, usa Content Queries para acceder a los componentes hijos proyectados (tema que se cubre en el capítulo de Queries).

7. **Mantén la proyección como último recurso para personalización extrema.** La API pública principal de tu componente deberían ser `@Input()` y `@Output()`. Ofrece proyección para los casos donde el desarrollador necesite control total sobre el markup renderizado.

8. **Prueba tu componente sin proyección.** Asegúrate de que tu componente se renderiza correctamente incluso cuando el padre no proyecta ningún contenido. Los valores por defecto deben estar presentes y ser funcionales.

## Errores frecuentes

1. **Olvidar que `ng-content` solo proyecta elementos del DOM, no lógica de componente.** El contenido proyectado se evalúa en el contexto del componente padre, no del hijo. Si quieres que el contenido acceda a datos del componente hijo, debes usar `TemplateRef` + `ngTemplateOutlet` con contexto.

2. **Incluir `ng-content` dentro de `@if`, `@for`, o `@switch` de control flow.** `<ng-content />` solo puede proyectarse una vez. Si se coloca dentro de una estructura condicional, Angular emitirá un error. Solución: usa un contenedor condicional alrededor del contenido proyectado, no `<ng-content>` dentro de la condición.

3. **Asumir que el contenido proyectado siempre estará presente.** Si tu lógica de componente asume que cierto contenido proyectado existe, fallará cuando el padre no lo proporcione. Siempre verifica la presencia de elementos proyectados usando `@ContentChild` o proporciona contenido por defecto.

4. **Confundir proyección múltiple: un elemento solo se proyecta una vez.** Si un elemento coincide con múltiples selectores `ng-content`, solo se proyecta en el primer slot que coincida. El resto de slots no reciben ese elemento.

5. **Usar selectores de atributo olvidando los corchetes en la plantilla del padre.** El selector `select="[card-header]"` espera un atributo llamado `card-header`. En la plantilla debemos escribir `<div card-header>...</div>`, no `<div [card-header]>...</div>` (esto último sería un binding de propiedad).

6. **No importar los componentes standalone que se proyectan.** Si proyectas `<app-icono />` dentro de un componente, Angular necesita conocer el componente `IconoComponent`. El componente que recibe la proyección NO necesita importar los componentes proyectados; es el componente PADRE quien debe importarlos.

7. **Intentar proyectar contenido que incluye directivas estructurales sin `ngProjectAs`.** Si necesitas usar `@if` o `@for` para proyectar contenido condicional, envuélvelo en `ng-container` con `ngProjectAs` si el slot destino tiene selector específico.

8. **Proyectar múltiples elementos para un mismo slot esperando que se envuelvan automáticamente.** El `ng-content` con un selector específico proyecta todos los elementos que coinciden con ese selector, uno tras otro. Si necesitas un contenedor común, debes agruparlos en el padre.

## Resumen

La proyección de contenido es una técnica fundamental para crear componentes reutilizables y flexibles en Angular. Hemos aprendido:

- **Proyección simple:** Un único `<ng-content />` que recibe todo el contenido colocado entre las etiquetas del componente.
- **Proyección múltiple:** Múltiples slots usando el atributo `select` con selectores CSS (atributos, clases, etiquetas). Cada elemento se proyecta en el primer slot cuyo selector coincida.
- **Contenido por defecto:** Contenido HTML dentro de `<ng-content>` que se muestra si el padre no proyecta nada para ese slot. Esencial para componentes autosuficientes.
- **ngProjectAs:** Directiva para `ng-container` que fuerza la proyección de contenido en un slot específico, útil para agrupar elementos sin divs extra o para redirigir componentes a slots concretos.
- **Componentes reutilizables:** Cards, Modals, Tabs y Accordions son los patrones más comunes de proyección de contenido.

La proyección de contenido se complementa con las Content Queries (`@ContentChild`, `@ContentChildren`) — que estudiaremos en el próximo capítulo — para crear componentes que no solo muestran contenido proyectado, sino que también interactúan con él.

## Recursos adicionales

- [Documentación oficial de Content Projection](https://angular.dev/guide/components/content-projection)
- [Angular ng-content: The Complete Guide](https://blog.angular-university.io/angular-ng-content/)
- [Advanced Content Projection in Angular](https://angular.dev/guide/components/content-projection#multi-slot-content-projection)
- [Angular Material CDK - Component Dev Kit](https://material.angular.io/cdk/categories)
- [TemplateRef and ngTemplateOutlet](https://angular.dev/api/common/NgTemplateOutlet)
