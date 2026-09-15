# Anidar Componentes en Angular

## Objetivos de aprendizaje

1. Comprender la arquitectura jerárquica de componentes en Angular y el concepto de árbol de componentes.
2. Dominar la comunicación entre componentes padre e hijo mediante `@Input`, `@Output` y Model Inputs.
3. Aplicar el patrón de diseño Smart/Dumb (Container/Presentational) para organizar la lógica de negocio y la presentación.
4. Resolver la comunicación entre componentes hermanos mediante el patrón de elevación de estado y servicios compartidos.
5. Identificar y evitar problemas comunes como el prop drilling en jerarquías profundas.
6. Diseñar aplicaciones modulares y mantenibles mediante la adecuada composición de componentes.

## Resultados de aprendizaje

Al finalizar esta unidad, el alumnado será capaz de:

- Construir jerarquías de componentes que reflejen correctamente la estructura de la interfaz de usuario.
- Transferir datos desde componentes padres a hijos utilizando `@Input` con tipado estricto.
- Emitir eventos desde componentes hijos hacia padres mediante `@Output` y `EventEmitter`.
- Implementar two-way binding entre componentes utilizando Model Inputs.
- Clasificar componentes según el patrón Smart/Dumb y aplicarlo en aplicaciones reales.
- Resolver problemas de comunicación entre hermanos elevando el estado al padre o mediante servicios compartidos.
- Construir páginas completas mediante la composición de múltiples componentes anidados.

## Introducción

Si imaginamos una aplicación Angular como un edificio, los componentes serían los ladrillos. Pero un edificio no es simplemente un montón de ladrillos apilados: requiere una estructura, una jerarquía y una organización cuidadosa. De la misma manera, una aplicación Angular bien diseñada se construye anidando componentes dentro de otros, formando un árbol jerárquico donde cada componente tiene una responsabilidad clara y bien definida.

En esta unidad, exploraremos en profundidad cómo estructurar aplicaciones Angular mediante la anidación de componentes. Veremos cómo el flujo de datos unidireccional de Angular, combinado con los mecanismos de `@Input` y `@Output`, permite construir interfaces complejas a partir de piezas simples y reutilizables. También introduciremos los Model Inputs, una característica más reciente que simplifica el two-way binding entre componentes.

Un aspecto clave de esta unidad es el patrón Smart/Dumb (también conocido como Container/Presentational), una arquitectura que separa claramente los componentes que manejan lógica de negocio y estado de aquellos que se dedican exclusivamente a la presentación. Esta separación de responsabilidades produce código más limpio, testeable y mantenible.

Finalmente, abordaremos los desafíos de la comunicación entre componentes que no tienen una relación directa padre-hijo (componentes hermanos), y cómo el patrón de elevación de estado y los servicios compartidos proporcionan soluciones elegantes a este problema.

## Desarrollo teórico

### 1. Jerarquías de componentes: el árbol de componentes

Angular organiza los componentes en una estructura de árbol. Cada aplicación Angular tiene un componente raíz (por convención `AppComponent`) que actúa como contenedor principal. A partir de ahí, los componentes se anidan unos dentro de otros, formando una jerarquía padre-hijo.

**Cómo Angular renderiza el árbol de componentes:**

1. Angular comienza por el componente raíz especificado en `bootstrapApplication` (o en el array `bootstrap` del `@NgModule`).
2. Lee la plantilla del componente raíz.
3. Cuando encuentra un selector de componente hijo (ej. `<app-header>`), instancia ese componente.
4. El proceso se repite recursivamente para cada componente hijo.
5. El resultado es un árbol de vistas que Angular mantiene sincronizado con el estado de la aplicación.

```
AppComponent
├── HeaderComponent
│   ├── LogoComponent
│   └── NavigationComponent
│       └── NavigationItemComponent (x N)
├── MainContentComponent
│   ├── SidebarComponent
│   │   └── FilterPanelComponent
│   └── ContentAreaComponent
│       ├── ProductListComponent
│       │   └── ProductCardComponent (x N)
│       └── PaginationComponent
└── FooterComponent
```

**Flujo de datos unidireccional:**

Angular sigue un flujo de datos estrictamente unidireccional:
- Los datos fluyen de **padres a hijos** mediante bindings de propiedades (`[propiedad]="valor"`, `@Input()`).
- Los eventos fluyen de **hijos a padres** mediante bindings de eventos (`(evento)="manejador($event)"`, `@Output()`).

Este flujo unidireccional hace que el comportamiento de la aplicación sea predecible y facilita la depuración, ya que la dirección del flujo de datos siempre es clara.

### 2. Comunicación padre-hijo

#### 2.1. @Input: datos de padre a hijo

El decorador `@Input` marca una propiedad de un componente hijo como receptora de datos desde el componente padre. El padre vincula datos a esta propiedad mediante la sintaxis de corchetes `[propiedad]="expresion"`.

**Tipado estricto con `required` y `transform`:**

A partir de Angular 16, `@Input` soporta opciones adicionales que mejoran la seguridad de tipos y la expresividad:

```typescript
// product-card.component.ts
import { Component, Input, numberAttribute, booleanAttribute } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

// Interfaz para tipar los datos de entrada
interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  descripcion: string;
  categoria: string;
  stock: number;
  enOferta: boolean;
}

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <div class="product-card" [class.en-oferta]="producto.enOferta">
      <img [src]="producto.imagen" [alt]="producto.nombre" />
      <div class="info">
        <span class="categoria">{{ producto.categoria }}</span>
        <h3>{{ producto.nombre }}</h3>
        <p class="descripcion">{{ producto.descripcion }}</p>
        <div class="precio">
          <span class="valor">{{ producto.precio | currency:'EUR' }}</span>
          @if (producto.enOferta) {
            <span class="etiqueta-oferta">Oferta!</span>
          }
        </div>
        <p class="stock" [class.bajo]="producto.stock < 5">
          Stock: {{ producto.stock }} unidades
        </p>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
      transition: box-shadow 0.3s ease;
    }
    .product-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .product-card.en-oferta { border-color: #e53935; }
    img { width: 100%; height: 200px; object-fit: cover; }
    .info { padding: 1rem; }
    .categoria {
      text-transform: uppercase;
      font-size: 0.75rem;
      color: #666;
      letter-spacing: 1px;
    }
    h3 { margin: 0.5rem 0; font-size: 1.1rem; }
    .descripcion { color: #555; font-size: 0.9rem; }
    .precio { margin: 0.5rem 0; display: flex; align-items: center; gap: 0.5rem; }
    .valor { font-size: 1.3rem; font-weight: bold; color: #2e7d32; }
    .etiqueta-oferta {
      background: #e53935;
      color: white;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
    }
    .stock { color: #333; font-size: 0.85rem; }
    .stock.bajo { color: #e53935; font-weight: bold; }
  `]
})
export class ProductCardComponent {
  // @Input requerido: el componente no funcionará sin este dato
  @Input({ required: true }) producto!: Producto;

  // @Input opcional con valor por defecto
  @Input() mostrarStock: boolean = true;

  // @Input con transformación automática de string a boolean
  @Input({ transform: booleanAttribute }) destacado: boolean = false;

  // @Input con transformación automática de string a number
  @Input({ transform: numberAttribute }) indice: number = 0;
}
```

**Uso en el componente padre:**

```html
<!-- product-list.component.html -->
<div class="products-grid">
  @for (producto of productos; track producto.id; let i = $index) {
    <app-product-card
      [producto]="producto"
      [mostrarStock]="true"
      [destacado]="producto.enOferta"
      [indice]="i"
    />
  } @empty {
    <p class="sin-resultados">No hay productos disponibles.</p>
  }
</div>
```

**Buenas prácticas con @Input:**

1. Usar `required: true` cuando el componente no puede funcionar sin ese dato.
2. Usar `transform` para convertir tipos automáticamente (string a number, string a boolean, etc.).
3. Definir interfaces TypeScript para inputs complejos en lugar de usar `any`.
4. Mantener los inputs como propiedades de solo lectura desde fuera del componente (el componente no debe modificar sus inputs).
5. Documentar cada input con JSDoc para facilitar el uso del componente.

#### 2.2. @Output: eventos de hijo a padre

El decorador `@Output` permite que un componente hijo emita eventos personalizados hacia su componente padre. El hijo expone una instancia de `EventEmitter` y el padre se suscribe mediante la sintaxis de paréntesis `(evento)="manejador($event)"`.

```typescript
// quantity-selector.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-quantity-selector',
  standalone: true,
  template: `
    <div class="quantity-selector">
      <button
        class="btn-decrease"
        (click)="disminuir()"
        [disabled]="cantidad <= min"
      >-</button>

      <span class="quantity-value">{{ cantidad }}</span>

      <button
        class="btn-increase"
        (click)="aumentar()"
        [disabled]="cantidad >= max"
      >+</button>
    </div>
  `,
  styles: [`
    .quantity-selector {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    button {
      width: 32px;
      height: 32px;
      border: 1px solid #ccc;
      border-radius: 50%;
      background: white;
      font-size: 1.2rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .quantity-value {
      font-size: 1.1rem;
      font-weight: bold;
      min-width: 2rem;
      text-align: center;
    }
  `]
})
export class QuantitySelectorComponent {
  @Input() cantidad: number = 1;
  @Input() min: number = 1;
  @Input() max: number = 99;

  // Emite la nueva cantidad cuando el usuario cambia el valor
  @Output() cantidadCambiada = new EventEmitter<number>();

  aumentar(): void {
    if (this.cantidad < this.max) {
      const nuevaCantidad = this.cantidad + 1;
      this.cantidadCambiada.emit(nuevaCantidad);
    }
  }

  disminuir(): void {
    if (this.cantidad > this.min) {
      const nuevaCantidad = this.cantidad - 1;
      this.cantidadCambiada.emit(nuevaCantidad);
    }
  }
}
```

**Uso en el componente padre:**

```html
<!-- cart-item.component.html -->
<div class="cart-item">
  <span class="product-name">{{ producto.nombre }}</span>

  <app-quantity-selector
    [cantidad]="producto.cantidad"
    [min]="1"
    [max]="producto.stock"
    (cantidadCambiada)="actualizarCantidad(producto.id, $event)"
  />

  <span class="subtotal">
    {{ producto.precio * producto.cantidad | currency:'EUR' }}
  </span>
</div>
```

```typescript
// cart-item.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { QuantitySelectorComponent } from './quantity-selector.component';
import { CurrencyPipe } from '@angular/common';

interface CartProduct {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  stock: number;
}

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [QuantitySelectorComponent, CurrencyPipe],
  templateUrl: './cart-item.component.html'
})
export class CartItemComponent {
  @Input({ required: true }) producto!: CartProduct;

  @Output() cantidadActualizada = new EventEmitter<{ id: number; cantidad: number }>();

  actualizarCantidad(id: number, cantidad: number): void {
    this.cantidadActualizada.emit({ id, cantidad });
  }
}
```

**Tipos de datos emitidos por EventEmitter:**

El `EventEmitter<T>` es genérico. El tipo `T` especifica el tipo de dato que se emite, lo que proporciona seguridad de tipos tanto en el hijo (al emitir) como en el padre (al recibir `$event`).

#### 2.3. Model Inputs: two-way binding entre componentes

Los Model Inputs, introducidos como evolución de los `@Input` + `@Output`, permiten implementar two-way data binding entre componentes de forma más concisa. Un Model Input es una propiedad que puede leerse y escribirse desde el padre usando la sintaxis "banana in a box" `[(propiedad)]`.

```typescript
// rating-input.component.ts
import { Component, model } from '@angular/core';

@Component({
  selector: 'app-rating-input',
  standalone: true,
  template: `
    <div class="rating">
      <span class="label">Valoracion:</span>
      @for (estrella of estrellas; track estrella) {
        <button
          class="star"
          [class.filled]="estrella <= valor()"
          (click)="establecerValoracion(estrella)"
          [attr.aria-label]="'Valorar con ' + estrella + ' estrellas'"
        >*</button>
      }
      <span class="numeric">{{ valor() }} / 5</span>
    </div>
  `,
  styles: [`
    .rating { display: flex; align-items: center; gap: 0.25rem; }
    .star {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #ccc;
      padding: 0;
      transition: color 0.2s;
    }
    .star.filled { color: #ffc107; }
    .star:hover { color: #ffb300; }
    .numeric { margin-left: 0.5rem; font-weight: bold; }
  `]
})
export class RatingInputComponent {
  // Model Input: permite two-way binding [(valoracion)]="miValor"
  valor = model<number>(0);

  estrellas: number[] = [1, 2, 3, 4, 5];

  establecerValoracion(estrella: number): void {
    this.valor.set(estrella);
  }
}
```

**Uso en el padre con two-way binding:**

```html
<!-- review-form.component.html -->
<div class="review-form">
  <h3>Escribe tu resena</h3>

  <div class="form-group">
    <label>Tu valoracion:</label>
    <app-rating-input [(valor)]="puntuacion" />
  </div>

  <p>Has seleccionado {{ puntuacion() }} estrellas de 5.</p>

  <button [disabled]="puntuacion() === 0">Enviar resena</button>
</div>
```

```typescript
// review-form.component.ts
import { Component, signal } from '@angular/core';
import { RatingInputComponent } from './rating-input.component';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [RatingInputComponent],
  templateUrl: './review-form.component.html'
})
export class ReviewFormComponent {
  puntuacion = signal<number>(0);
}
```

**Comparacion: Model Input vs Input+Output tradicional:**

```typescript
// Con Model Input (Angular moderno) - Menos codigo, mas claro
@Component({...})
export class HijoModernoComponent {
  valor = model<number>(0);
}
// Uso padre: <app-hijo [(valor)]="miValor" />

// Con Input + Output (tradicional) - Mas verboso
@Component({...})
export class HijoClasicoComponent {
  @Input() valor: number = 0;
  @Output() valorChange = new EventEmitter<number>();
  cambiarValor(nuevo: number): void {
    this.valorChange.emit(nuevo);
  }
}
// Uso padre: <app-hijo [valor]="miValor" (valorChange)="miValor = $event" />
```

La ventaja del Model Input es la simplicidad: menos codigo y la familiar sintaxis `[(banana-in-a-box)]` que ya se usa con `[(ngModel)]`.

### 3. Patrones: Container/Presenter (Smart/Dumb)

#### 3.1. Smart Components (Container)

Los Smart Components o Container Components son componentes que:

- Se comunican con servicios para obtener y manipular datos.
- Gestionan el estado que se comparte con sus hijos.
- Contienen la logica de negocio.
- Orquestan la interaccion entre componentes presentacionales.
- No contienen HTML de presentacion detallado; en su lugar, delegan en componentes Dumb.

```typescript
// product-list-container.component.ts
import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { ProductListComponent } from './product-list.component';
import { ProductFiltersComponent } from './product-filters.component';
import { ProductService } from '../../services/product.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-product-list-container',
  standalone: true,
  imports: [ProductListComponent, ProductFiltersComponent],
  template: `
    <div class="product-page">
      <h1>Catalogo de Productos</h1>

      <app-product-filters
        (filtrosCambiados)="aplicarFiltros($event)"
      />

      @if (cargando()) {
        <div class="loading">Cargando productos...</div>
      } @else if (error()) {
        <div class="error-message">{{ error() }}</div>
      } @else {
        <app-product-list
          [productos]="productosFiltrados()"
          (productoSeleccionado)="verDetalle($event)"
        />
      }
    </div>
  `
})
export class ProductListContainerComponent implements OnInit {
  // Estado gestionado por el Smart Component
  productos = signal<Producto[]>([]);
  cargando = signal<boolean>(true);
  error = signal<string | null>(null);
  filtroActivo = signal<string>('todos');

  // Datos derivados del estado
  productosFiltrados = computed(() => {
    const filtro = this.filtroActivo();
    const todos = this.productos();
    if (filtro === 'todos') return todos;
    return todos.filter(p => p.categoria === filtro);
  });

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  private cargarProductos(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.productService.obtenerProductos().subscribe({
      next: (data) => {
        this.productos.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar productos: ' + err.message);
        this.cargando.set(false);
      }
    });
  }

  aplicarFiltros(filtros: { categoria: string }): void {
    this.filtroActivo.set(filtros.categoria);
  }

  verDetalle(producto: Producto): void {
    console.log('Ver detalle de:', producto.nombre);
  }
}
```

#### 3.2. Presentational Components (Dumb)

Los Presentational Components o Dumb Components:

- Reciben datos exclusivamente mediante `@Input`.
- Emiten eventos exclusivamente mediante `@Output`.
- No se comunican directamente con servicios.
- Son altamente reutilizables porque no dependen del contexto de la aplicacion.
- Contienen principalmente HTML y estilos.
- Pueden contener logica, pero solo logica de presentacion (ej. formatear una fecha para mostrarla).

```typescript
// product-list.component.ts (Dumb)
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ProductCardComponent } from './product-card.component';
import { Producto } from '../../models/producto.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductCardComponent, CurrencyPipe],
  template: `
    <div class="product-grid">
      @for (producto of productos; track producto.id) {
        <app-product-card
          [producto]="producto"
          (click)="seleccionarProducto(producto)"
          class="clickable"
        />
      } @empty {
        <div class="empty-state">
          <p>No se encontraron productos.</p>
          <p>Intenta cambiar los filtros de busqueda.</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }
    .clickable { cursor: pointer; }
    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 3rem;
      color: #666;
    }
  `]
})
export class ProductListComponent {
  @Input({ required: true }) productos: Producto[] = [];

  @Output() productoSeleccionado = new EventEmitter<Producto>();

  seleccionarProducto(producto: Producto): void {
    this.productoSeleccionado.emit(producto);
  }
}
```

**Ventajas de este patron:**

- **Testeabilidad:** Los componentes Dumb no dependen de servicios, por lo que se pueden probar de forma aislada pasando inputs y verificando outputs.
- **Reutilizacion:** Un mismo componente presentacional puede usarse en diferentes contextos simplemente cambiando los datos de entrada.
- **Mantenibilidad:** La separacion clara de responsabilidades hace que el codigo sea mas facil de entender y modificar.
- **Desarrollo en paralelo:** Diferentes desarrolladores pueden trabajar simultaneamente en Smart y Dumb components.
- **Storybook-friendly:** Los componentes Dumb son ideales para documentar en herramientas como Storybook.

### 4. Comunicacion entre hermanos

Los componentes hermanos (al mismo nivel en el arbol) no pueden comunicarse directamente entre si. Angular proporciona dos estrategias principales para resolver esta necesidad:

#### 4.1. Lifting State Up (elevacion de estado)

La estrategia mas directa es elevar el estado compartido al componente padre comun mas cercano:

```
     PadreComun
     /        \
HermanoA    HermanoB
```

El padre mantiene el estado que ambos hermanos necesitan y lo distribuye mediante `@Input` y `@Output`:

```typescript
// parent.component.ts
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-parent',
  standalone: true,
  imports: [HermanoAComponent, HermanoBComponent],
  template: `
    <app-hermano-a
      [itemsSeleccionados]="seleccion()"
      (seleccionCambiada)="actualizarSeleccion($event)"
    />
    <app-hermano-b
      [itemsSeleccionados]="seleccion()"
    />
  `
})
export class ParentComponent {
  seleccion = signal<string[]>([]);

  actualizarSeleccion(data: { items: string[] }): void {
    this.seleccion.set(data.items);
  }
}
```

**Problemas de prop drilling:**

Cuando la jerarquia de componentes es profunda, pasar datos a traves de multiples niveles de componentes intermedios (que no necesitan esos datos) se conoce como "prop drilling". Esto hace que el codigo sea fragil y dificil de mantener:

```
Abuelo -> Padre -> Hijo -> Nieto (destinatario real)
```

**Soluciones al prop drilling:**
- Servicios compartidos (Unidad 9).
- State management libraries (NgRx, Elf).
- Context providers con injection tokens.

#### 4.2. Servicios compartidos

Para compartir estado entre componentes que no comparten un padre cercano, se utilizan servicios inyectables (se estudiaran en detalle en la Unidad 9):

```typescript
// services/cart-state.service.ts
import { Injectable, signal, computed } from '@angular/core';

interface CartItem {
  productoId: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

@Injectable({ providedIn: 'root' })
export class CartStateService {
  // Estado privado con Signals
  private items = signal<CartItem[]>([]);

  // Selectores publicos de solo lectura
  readonly itemsCarrito = this.items.asReadonly();

  readonly totalItems = computed(() =>
    this.items().reduce((sum, item) => sum + item.cantidad, 0)
  );

  readonly totalPrecio = computed(() =>
    this.items().reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
  );

  // Acciones para modificar el estado
  agregarItem(item: CartItem): void {
    this.items.update(current => {
      const existente = current.find(i => i.productoId === item.productoId);
      if (existente) {
        return current.map(i =>
          i.productoId === item.productoId
            ? { ...i, cantidad: i.cantidad + item.cantidad }
            : i
        );
      }
      return [...current, item];
    });
  }

  eliminarItem(productoId: number): void {
    this.items.update(current =>
      current.filter(i => i.productoId !== productoId)
    );
  }

  vaciarCarrito(): void {
    this.items.set([]);
  }
}
```

Ambos hermanos (o cualquier componente en la aplicacion) pueden inyectar este servicio y comunicarse a traves del estado compartido:

```typescript
// Hermano A: catalogo de productos
@Component({
  selector: 'app-product-catalog',
  standalone: true,
  template: `
    @for (producto of productos; track producto.id) {
      <div class="product">
        <h3>{{ producto.nombre }}</h3>
        <button (click)="agregarAlCarrito(producto)">Anadir al carrito</button>
      </div>
    }
  `
})
export class ProductCatalogComponent {
  private cartService = inject(CartStateService);

  agregarAlCarrito(producto: Producto): void {
    this.cartService.agregarItem({
      productoId: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1
    });
  }
}

// Hermano B: resumen del carrito
@Component({
  selector: 'app-cart-summary',
  standalone: true,
  template: `
    <div class="cart-summary">
      <h3>Carrito ({{ cartService.totalItems() }} items)</h3>
      <p>Total: {{ cartService.totalPrecio() | currency:'EUR' }}</p>
    </div>
  `
})
export class CartSummaryComponent {
  cartService = inject(CartStateService);
}
```

### 5. Composicion de componentes

La verdadera potencia de Angular se revela cuando combinamos multiples componentes para construir una pagina completa. Veamos como estructurar una pagina tipica de e-commerce:

```
ProductPage (Smart - Container)
├── ProductFilters (Dumb)
│   ├── CategoryFilter (Dumb)
│   └── PriceRangeFilter (Dumb)
├── ProductGrid (Dumb)
│   └── ProductCard (Dumb) x N
│       ├── ProductImage (Dumb)
│       ├── ProductRating (Dumb)
│       └── AddToCartButton (Dumb)
└── Pagination (Dumb)
```

```typescript
// product-page.component.ts (Smart Component que orquesta todo)
import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CartStateService } from '../../services/cart-state.service';
import { ProductFiltersComponent } from './product-filters.component';
import { ProductGridComponent } from './product-grid.component';
import { PaginationComponent } from '../../shared/pagination.component';

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [ProductFiltersComponent, ProductGridComponent, PaginationComponent],
  template: `
    <div class="product-page">
      <aside class="sidebar">
        <app-product-filters
          [categorias]="categorias()"
          (filtrosCambiados)="alCambiarFiltros($event)"
        />
      </aside>

      <main class="main-content">
        @if (cargando()) {
          <p class="loading">Cargando catalogo...</p>
        } @else if (error()) {
          <p class="error">{{ error() }}</p>
        } @else {
          <div class="resultados-info">
            <span>{{ totalProductos() }} productos encontrados</span>
            <select (change)="alCambiarOrden($any($event.target).value)">
              <option value="relevancia">Mas relevantes</option>
              <option value="precio_asc">Precio: menor a mayor</option>
              <option value="precio_desc">Precio: mayor a menor</option>
            </select>
          </div>

          <app-product-grid
            [productos]="productosVisibles()"
            (productoSeleccionado)="navegarADetalle($event)"
          />

          <app-pagination
            [paginaActual]="pagina()"
            [totalPaginas]="totalPaginas()"
            (paginaCambiada)="cargarPagina($event)"
          />
        }
      </main>
    </div>
  `,
  styles: [`
    .product-page {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 2rem;
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }
    .resultados-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    @media (max-width: 900px) {
      .product-page { grid-template-columns: 1fr; }
    }
  `]
})
export class ProductPageComponent implements OnInit {
  private productService = inject(ProductService);

  productos = signal<Producto[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);
  pagina = signal(1);
  filtros = signal({ categoria: 'todas', orden: 'relevancia' });

  categorias = computed(() => [...new Set(this.productos().map(p => p.categoria))]);
  totalProductos = computed(() => this.productos().length);
  totalPaginas = computed(() => Math.ceil(this.totalProductos() / 12));

  productosVisibles = computed(() => {
    const todos = this.productos();
    const inicio = (this.pagina() - 1) * 12;
    return todos.slice(inicio, inicio + 12);
  });

  ngOnInit(): void {
    this.cargarProductos();
  }

  private cargarProductos(): void {
    this.cargando.set(true);
    this.productService.obtenerProductos().subscribe({
      next: (data) => {
        this.productos.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.cargando.set(false);
      }
    });
  }

  alCambiarFiltros(nuevosFiltros: any): void {
    this.filtros.set(nuevosFiltros);
    this.pagina.set(1);
  }

  navegarADetalle(producto: any): void {
    console.log('Navegar a detalle:', producto.id);
  }

  cargarPagina(numero: number): void {
    this.pagina.set(numero);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  alCambiarOrden(criterio: string): void {
    this.productos.update(current => {
      const copia = [...current];
      switch (criterio) {
        case 'precio_asc': return copia.sort((a, b) => a.precio - b.precio);
        case 'precio_desc': return copia.sort((a, b) => b.precio - a.precio);
        default: return copia;
      }
    });
  }
}
```

### 6. Buenas practicas en la jerarquia de componentes

1. **Mantener los componentes pequenos y enfocados:** Cada componente debe tener una unica responsabilidad. Si un componente empieza a ser dificil de entender, es momento de dividirlo en subcomponentes.

2. **Usar nombres descriptivos:** Los componentes deben nombrarse segun su funcion: `ProductListComponent`, `UserProfileComponent`, `ShoppingCartComponent`, no `Comp1Component` o `DataComponent`.

3. **Limitar la profundidad del arbol:** Las jerarquias excesivamente profundas (mas de 5-6 niveles) suelen indicar problemas de diseno. Considerar usar servicios compartidos o slots de contenido (`<ng-content>`) para aplanar la jerarquia.

4. **Preferir composicion sobre herencia:** Angular favorece la composicion de componentes. En lugar de crear componentes base y extenderlos, componer funcionalidad mediante inputs y outputs.

5. **Separar claramente Smart y Dumb:** Ser consistente con este patron en todo el proyecto. Una convencion util es usar sufijos: `*-container.component.ts` para Smart, y `*-presentation.component.ts` o simplemente el nombre base para Dumb.

## Ejemplos guiados

### Ejemplo 1: Galeria de productos con componentes anidados

Construiremos una galeria de productos con tres niveles de anidamiento: `ProductGalleryContainer` -> `ProductGrid` -> `ProductCard`.

```typescript
// models/producto.model.ts
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl: string;
  categoria: string;
  valoracion: number;
  enStock: boolean;
}
```

```typescript
// product-card.component.ts (Nivel 3 - Presentational)
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <article class="card" (click)="seleccionar.emit(producto)">
      <div class="card-image">
        <img [src]="producto.imagenUrl" [alt]="producto.nombre" loading="lazy" />
        @if (!producto.enStock) {
          <span class="badge agotado">Agotado</span>
        }
      </div>
      <div class="card-body">
        <span class="categoria">{{ producto.categoria | uppercase }}</span>
        <h3>{{ producto.nombre }}</h3>
        <div class="rating">
          @for (i of [1,2,3,4,5]; track i) {
            <span [class.filled]="i <= producto.valoracion">*</span>
          }
        </div>
        <p class="precio">{{ producto.precio | currency:'EUR':'symbol':'1.2-2' }}</p>
      </div>
      <div class="card-footer">
        <button
          class="btn-add-cart"
          [disabled]="!producto.enStock"
          (click)="$event.stopPropagation(); agregarAlCarrito.emit(producto)"
        >
          {{ producto.enStock ? 'Anadir al carrito' : 'No disponible' }}
        </button>
      </div>
    </article>
  `,
  styles: [`
    .card {
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      overflow: hidden;
      background: white;
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
    }
    .card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
    .card-image { position: relative; height: 220px; overflow: hidden; }
    .card-image img { width: 100%; height: 100%; object-fit: cover; }
    .badge {
      position: absolute;
      top: 8px; right: 8px;
      padding: 4px 8px;
      border-radius: 4px;
      color: white;
      font-size: 0.75rem;
      font-weight: bold;
    }
    .badge.agotado { background: #757575; }
    .card-body { padding: 1rem; }
    .categoria {
      font-size: 0.75rem;
      color: #1976d2;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    h3 { margin: 0.35rem 0; font-size: 1rem; }
    .rating { margin: 0.35rem 0; color: #ccc; }
    .rating .filled { color: #ffc107; }
    .precio { font-size: 1.25rem; font-weight: 700; color: #1b5e20; margin: 0.5rem 0 0; }
    .card-footer { padding: 0 1rem 1rem; }
    .btn-add-cart {
      width: 100%;
      padding: 0.65rem;
      background: #1976d2;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: background 0.2s;
    }
    .btn-add-cart:hover { background: #1565c0; }
    .btn-add-cart:disabled { background: #bdbdbd; cursor: not-allowed; }
  `]
})
export class ProductCardComponent {
  @Input({ required: true }) producto!: Producto;
  @Output() seleccionar = new EventEmitter<Producto>();
  @Output() agregarAlCarrito = new EventEmitter<Producto>();
}
```

```typescript
// product-grid.component.ts (Nivel 2 - Presentational)
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ProductCardComponent } from './product-card.component';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [ProductCardComponent],
  template: `
    <div class="grid">
      @for (producto of productos; track producto.id) {
        <app-product-card
          [producto]="producto"
          (seleccionar)="productoSeleccionado.emit($event)"
          (agregarAlCarrito)="productoAgregado.emit($event)"
        />
      } @empty {
        <div class="empty">
          <p>No se encontraron productos con los filtros actuales.</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }
    .empty {
      grid-column: 1 / -1;
      text-align: center;
      padding: 4rem 2rem;
      color: #999;
    }
  `]
})
export class ProductGridComponent {
  @Input({ required: true }) productos: Producto[] = [];
  @Output() productoSeleccionado = new EventEmitter<Producto>();
  @Output() productoAgregado = new EventEmitter<Producto>();
}
```

```typescript
// product-gallery-container.component.ts (Nivel 1 - Smart)
import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { ProductGridComponent } from './product-grid.component';
import { ProductService } from '../../services/product.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-product-gallery-container',
  standalone: true,
  imports: [ProductGridComponent],
  template: `
    <div class="gallery-container">
      <header class="gallery-header">
        <h1>Nuestra Coleccion</h1>
        <div class="controles">
          <select (change)="filtroCategoria.set($any($event.target).value)">
            <option value="todas">Todas las categorias</option>
            @for (cat of categorias(); track cat) {
              <option [value]="cat">{{ cat }}</option>
            }
          </select>
        </div>
      </header>

      @if (cargando()) {
        <div class="loading">Cargando productos...</div>
      } @else {
        <app-product-grid
          [productos]="productosFiltrados()"
          (productoSeleccionado)="navegarADetalle($event)"
          (productoAgregado)="agregarAlCarrito($event)"
        />
      }
    </div>
  `,
  styles: [`
    .gallery-container { max-width: 1400px; margin: 0 auto; padding: 2rem; }
    .gallery-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .loading { text-align: center; padding: 4rem; color: #666; }
    select { padding: 0.5rem; border: 1px solid #ccc; border-radius: 6px; }
  `]
})
export class ProductGalleryContainerComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartStateService);

  productos = signal<Producto[]>([]);
  cargando = signal(true);
  filtroCategoria = signal('todas');

  categorias = computed(() => [...new Set(this.productos().map(p => p.categoria))]);

  productosFiltrados = computed(() => {
    const filtro = this.filtroCategoria();
    const todos = this.productos();
    return filtro === 'todas' ? todos : todos.filter(p => p.categoria === filtro);
  });

  ngOnInit(): void {
    this.productService.obtenerProductos().subscribe({
      next: (data) => {
        this.productos.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  navegarADetalle(producto: Producto): void {
    console.log('Ver detalle:', producto.id);
  }

  agregarAlCarrito(producto: Producto): void {
    this.cartService.agregarItem({
      productoId: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1
    });
  }
}
```

### Ejemplo 2: Dashboard con patron Smart/Dumb

Implementemos un dashboard analitico donde el Smart Component gestiona los datos y los Dumb Components muestran las visualizaciones.

```typescript
// models/dashboard.model.ts
export interface MetricasResumen {
  ventasTotales: number;
  pedidosPendientes: number;
  nuevosClientes: number;
  tasaConversion: number;
}

export interface DatosGrafico {
  etiquetas: string[];
  valores: number[];
}
```

```typescript
// metric-card.component.ts (Dumb)
import { Component, Input } from '@angular/core';
import { CurrencyPipe, PercentPipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CurrencyPipe, PercentPipe, DecimalPipe],
  template: `
    <div class="metric-card" [class]="variante">
      <div class="metric-icon">{{ icono }}</div>
      <div class="metric-content">
        <span class="metric-label">{{ etiqueta }}</span>
        <span class="metric-value">
          @if (esMoneda) {
            {{ valor | currency:'EUR':'symbol':'1.0-0' }}
          } @else if (esPorcentaje) {
            {{ valor | percent:'1.2-2' }}
          } @else {
            {{ valor | number:'1.0-0' }}
          }
        </span>
        @if (tendencia !== undefined) {
          <span class="metric-trend" [class.positivo]="tendencia > 0">
            {{ tendencia > 0 ? '&#8593;' : '&#8595;' }}
            {{ tendencia | percent:'1.1-1' }}
          </span>
        }
      </div>
    </div>
  `,
  styles: [`
    .metric-card {
      display: flex; align-items: center; gap: 1rem;
      padding: 1.5rem; border-radius: 12px;
      background: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .metric-card.primario { border-left: 4px solid #1976d2; }
    .metric-card.exito { border-left: 4px solid #388e3c; }
    .metric-card.advertencia { border-left: 4px solid #f57c00; }
    .metric-card.info { border-left: 4px solid #7b1fa2; }
    .metric-icon { font-size: 2rem; }
    .metric-content { display: flex; flex-direction: column; }
    .metric-label { color: #666; font-size: 0.85rem; }
    .metric-value { font-size: 1.5rem; font-weight: 700; }
    .metric-trend { font-size: 0.8rem; color: #f44336; }
    .metric-trend.positivo { color: #388e3c; }
  `]
})
export class MetricCardComponent {
  @Input({ required: true }) etiqueta!: string;
  @Input({ required: true }) valor!: number;
  @Input() icono: string = 'E';
  @Input() variante: 'primario' | 'exito' | 'advertencia' | 'info' = 'primario';
  @Input() esMoneda: boolean = false;
  @Input() esPorcentaje: boolean = false;
  @Input() tendencia?: number;
}
```

```typescript
// bar-chart.component.ts (Dumb)
import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DatosGrafico } from '../../models/dashboard.model';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [DecimalPipe],
  template: `
    <div class="chart-container">
      <h3 class="chart-title">{{ titulo }}</h3>
      <div class="bars">
        @for (item of datos; track item.etiqueta) {
          <div class="bar-item">
            <span class="bar-label">{{ item.etiqueta }}</span>
            <div class="bar-track">
              <div
                class="bar-fill"
                [style.width.%]="calcularPorcentaje(item.valor)"
                [style.background-color]="color"
              ></div>
            </div>
            <span class="bar-value">{{ item.valor | number:'1.0-0' }}</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .chart-container {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
    }
    .chart-title { margin: 0 0 1rem; font-size: 1.1rem; }
    .bar-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }
    .bar-label { min-width: 100px; font-size: 0.85rem; color: #555; }
    .bar-track {
      flex: 1;
      height: 24px;
      background: #f0f0f0;
      border-radius: 12px;
      overflow: hidden;
    }
    .bar-fill {
      height: 100%;
      border-radius: 12px;
      transition: width 0.5s ease;
    }
    .bar-value { font-weight: 600; font-size: 0.85rem; min-width: 50px; text-align: right; }
  `]
})
export class BarChartComponent {
  @Input({ required: true }) titulo!: string;
  @Input({ required: true }) datosGrafico!: DatosGrafico;
  @Input() color: string = '#1976d2';

  get datos() {
    return this.datosGrafico.etiquetas.map((etiqueta, i) => ({
      etiqueta,
      valor: this.datosGrafico.valores[i]
    }));
  }

  calcularPorcentaje(valor: number): number {
    const maximo = Math.max(...this.datosGrafico.valores, 1);
    return (valor / maximo) * 100;
  }
}
```

```typescript
// dashboard-container.component.ts (Smart)
import { Component, OnInit, signal, inject } from '@angular/core';
import { MetricCardComponent } from './metric-card.component';
import { BarChartComponent } from './bar-chart.component';
import { DashboardService } from '../../services/dashboard.service';
import { MetricasResumen, DatosGrafico } from '../../models/dashboard.model';

@Component({
  selector: 'app-dashboard-container',
  standalone: true,
  imports: [MetricCardComponent, BarChartComponent],
  template: `
    <div class="dashboard">
      <h1>Dashboard de Ventas</h1>

      @if (cargando()) {
        <p>Cargando datos del dashboard...</p>
      } @else {
        <section class="metrics-row">
          <app-metric-card
            etiqueta="Ventas Totales"
            [valor]="metricas()?.ventasTotales ?? 0"
            icono="$"
            variante="primario"
            [esMoneda]="true"
            [tendencia]="0.12"
          />
          <app-metric-card
            etiqueta="Pedidos Pendientes"
            [valor]="metricas()?.pedidosPendientes ?? 0"
            icono="#"
            variante="advertencia"
          />
          <app-metric-card
            etiqueta="Nuevos Clientes"
            [valor]="metricas()?.nuevosClientes ?? 0"
            icono="+"
            variante="exito"
            [tendencia]="0.08"
          />
          <app-metric-card
            etiqueta="Tasa de Conversion"
            [valor]="metricas()?.tasaConversion ?? 0"
            icono="%"
            variante="info"
            [esPorcentaje]="true"
            [tendencia]="0.04"
          />
        </section>

        <section class="charts-row">
          <app-bar-chart
            titulo="Ventas por Categoria"
            [datosGrafico]="datosCategorias()"
            color="#1976d2"
          />
          <app-bar-chart
            titulo="Pedidos por Dia"
            [datosGrafico]="datosPedidos()"
            color="#388e3c"
          />
        </section>
      }
    </div>
  `,
  styles: [`
    .dashboard { max-width: 1400px; margin: 0 auto; padding: 2rem; }
    h1 { margin-bottom: 2rem; }
    .metrics-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .charts-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    @media (max-width: 768px) {
      .charts-row { grid-template-columns: 1fr; }
    }
  `]
})
export class DashboardContainerComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  metricas = signal<MetricasResumen | null>(null);
  cargando = signal(true);
  datosCategorias = signal<DatosGrafico>({ etiquetas: [], valores: [] });
  datosPedidos = signal<DatosGrafico>({ etiquetas: [], valores: [] });

  ngOnInit(): void {
    // Simulacion de carga de datos (en produccion vendria de API)
    setTimeout(() => {
      this.metricas.set({
        ventasTotales: 125680,
        pedidosPendientes: 42,
        nuevosClientes: 156,
        tasaConversion: 0.034
      });

      this.datosCategorias.set({
        etiquetas: ['Electronica', 'Ropa', 'Hogar', 'Deportes', 'Libros'],
        valores: [45000, 32000, 28000, 15000, 5600]
      });

      this.datosPedidos.set({
        etiquetas: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
        valores: [85, 92, 78, 110, 95, 62, 48]
      });

      this.cargando.set(false);
    }, 1200);
  }
}
```

### Ejemplo 3: Comunicacion entre hermanos mediante servicio

Dos componentes hermanos en una pagina de checkout: `OrderSummary` y `PaymentForm`, que se comunican a traves de un servicio compartido.

```typescript
// services/checkout-state.service.ts
import { Injectable, signal, computed } from '@angular/core';

export interface MetodoPago {
  id: string;
  tipo: 'tarjeta' | 'paypal' | 'transferencia';
  detalles: string;
}

@Injectable({ providedIn: 'root' })
export class CheckoutStateService {
  readonly metodoPagoSeleccionado = signal<MetodoPago | null>(null);
  readonly pasoActual = signal<'envio' | 'pago' | 'confirmacion'>('pago');

  readonly puedeAvanzar = computed(() => this.metodoPagoSeleccionado() !== null);

  seleccionarMetodoPago(metodo: MetodoPago): void {
    this.metodoPagoSeleccionado.set(metodo);
  }

  avanzarPaso(): void {
    // Logica de avance de pasos
  }
}
```

```typescript
// order-summary.component.ts (Hermano A - Dumb)
import { Component, inject } from '@angular/core';
import { CheckoutStateService } from '../../services/checkout-state.service';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  template: `
    <div class="order-summary">
      <h3>Resumen del pedido</h3>
      <div class="steps-progress">
        <div class="step" [class.completed]="true">
          <span class="step-number">1</span><span>Direccion de envio</span>
        </div>
        <div class="step" [class.completed]="checkout.metodoPagoSeleccionado() !== null">
          <span class="step-number">2</span><span>Metodo de pago</span>
        </div>
        <div class="step">
          <span class="step-number">3</span><span>Confirmacion</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .order-summary { background: white; border-radius: 12px; padding: 1.5rem; }
    .steps-progress { margin-top: 1rem; }
    .step {
      display: flex; align-items: center; gap: 0.5rem;
      margin-bottom: 0.5rem; color: #999;
    }
    .step.completed { color: #333; }
    .step-number {
      width: 24px; height: 24px; border-radius: 50%;
      background: #e0e0e0;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.75rem; font-weight: bold;
    }
    .step.completed .step-number { background: #388e3c; color: white; }
  `]
})
export class OrderSummaryComponent {
  checkout = inject(CheckoutStateService);
}
```

```typescript
// payment-form.component.ts (Hermano B - Dumb)
import { Component, inject } from '@angular/core';
import { CheckoutStateService } from '../../services/checkout-state.service';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  template: `
    <div class="payment-form">
      <h3>Selecciona metodo de pago</h3>
      <div class="payment-options">
        <label class="payment-option" [class.selected]="checkout.metodoPagoSeleccionado()?.id === 'card'">
          <input type="radio" name="metodo" value="card"
            [checked]="checkout.metodoPagoSeleccionado()?.id === 'card'"
            (change)="seleccionar('card')" />
          <span>
            <strong>Tarjeta de credito/debito</strong>
            <small>Visa, Mastercard</small>
          </span>
        </label>
        <label class="payment-option" [class.selected]="checkout.metodoPagoSeleccionado()?.id === 'paypal'">
          <input type="radio" name="metodo" value="paypal"
            [checked]="checkout.metodoPagoSeleccionado()?.id === 'paypal'"
            (change)="seleccionar('paypal')" />
          <span>
            <strong>PayPal</strong>
            <small>Pago rapido y seguro</small>
          </span>
        </label>
        <label class="payment-option" [class.selected]="checkout.metodoPagoSeleccionado()?.id === 'transfer'">
          <input type="radio" name="metodo" value="transfer"
            [checked]="checkout.metodoPagoSeleccionado()?.id === 'transfer'"
            (change)="seleccionar('transfer')" />
          <span>
            <strong>Transferencia bancaria</strong>
            <small>Se procesara al recibir la transferencia</small>
          </span>
        </label>
      </div>
    </div>
  `,
  styles: [`
    .payment-form { background: white; border-radius: 12px; padding: 1.5rem; }
    .payment-options { display: flex; flex-direction: column; gap: 0.75rem; margin: 1rem 0; }
    .payment-option {
      display: flex; align-items: center; gap: 1rem;
      padding: 1rem; border: 2px solid #e0e0e0; border-radius: 8px;
      cursor: pointer; transition: border-color 0.2s;
    }
    .payment-option:hover { border-color: #1976d2; }
    .payment-option.selected { border-color: #1976d2; background: #e3f2fd; }
  `]
})
export class PaymentFormComponent {
  checkout = inject(CheckoutStateService);

  seleccionar(tipo: string): void {
    const metodos: Record<string, { id: string; tipo: any; detalles: string }> = {
      'card': { id: 'card', tipo: 'tarjeta', detalles: 'Tarjeta de credito' },
      'paypal': { id: 'paypal', tipo: 'paypal', detalles: 'PayPal' },
      'transfer': { id: 'transfer', tipo: 'transferencia', detalles: 'Transferencia bancaria' }
    };
    this.checkout.seleccionarMetodoPago(metodos[tipo]);
  }
}
```

## Ejercicios resueltos

### Ejercicio 1: Aplicacion de blog con patron Smart/Dumb

**Enunciado:** Implementar un sistema de blog donde `PostListContainer` (Smart) obtiene los posts de un servicio y los muestra a traves de `PostCard` (Dumb). Al hacer clic en un post, se muestra `PostDetail` (Dumb) con el contenido completo.

```typescript
// models/post.model.ts
export interface Post {
  id: number;
  titulo: string;
  extracto: string;
  contenido: string;
  autor: string;
  fecha: Date;
  etiquetas: string[];
  likes: number;
}

// services/post.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  obtenerPosts(): Observable<Post[]> {
    // Simulacion de peticion HTTP
    return of([
      {
        id: 1, titulo: 'Introduccion a Angular 19',
        extracto: 'Angular 19 trae importantes mejoras en rendimiento y DX.',
        contenido: 'Contenido completo del articulo sobre Angular 19...',
        autor: 'Ana Garcia', fecha: new Date('2026-05-15'),
        etiquetas: ['angular', 'frontend'], likes: 156
      },
      {
        id: 2, titulo: 'RxJS desde cero',
        extracto: 'La programacion reactiva es fundamental en Angular.',
        contenido: 'Guia completa de RxJS para principiantes...',
        autor: 'Carlos Ruiz', fecha: new Date('2026-05-10'),
        etiquetas: ['rxjs', 'javascript'], likes: 89
      },
      {
        id: 3, titulo: 'TypeScript avanzado',
        extracto: 'Tipos condicionales, mapped types y mas.',
        contenido: 'Articulo detallado sobre TypeScript avanzado...',
        autor: 'Ana Garcia', fecha: new Date('2026-05-01'),
        etiquetas: ['typescript'], likes: 210
      },
      {
        id: 4, titulo: 'Docker para desarrolladores',
        extracto: 'Contenedores que todo desarrollador deberia conocer.',
        contenido: 'Guia practica de Docker...',
        autor: 'Maria Lopez', fecha: new Date('2026-04-28'),
        etiquetas: ['docker', 'devops'], likes: 67
      },
      {
        id: 5, titulo: 'CSS Grid vs Flexbox',
        extracto: 'Comparativa de las dos herramientas de layout.',
        contenido: 'Analisis detallado de diferencias y casos de uso...',
        autor: 'Carlos Ruiz', fecha: new Date('2026-04-20'),
        etiquetas: ['css'], likes: 132
      },
    ]).pipe(delay(800)); // Simular latencia de red
  }
}
```

```typescript
// post-card.component.ts (Dumb)
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [DatePipe],
  template: `
    <article class="post-card" (click)="seleccionar.emit(post)">
      <h2>{{ post.titulo }}</h2>
      <p class="extracto">{{ post.extracto }}</p>
      <div class="meta">
        <span class="autor">{{ post.autor }}</span>
        <span class="fecha">{{ post.fecha | date:'mediumDate' }}</span>
        <span class="likes">&hearts; {{ post.likes }}</span>
      </div>
      <div class="etiquetas">
        @for (tag of post.etiquetas; track tag) {
          <span class="tag">{{ tag }}</span>
        }
      </div>
    </article>
  `,
  styles: [`
    .post-card {
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      padding: 1.5rem;
      cursor: pointer;
      transition: box-shadow 0.3s;
      background: white;
    }
    .post-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
    h2 { margin: 0 0 0.5rem; font-size: 1.25rem; color: #333; }
    .extracto { color: #666; font-size: 0.95rem; line-height: 1.5; }
    .meta { display: flex; gap: 1rem; margin: 0.75rem 0; font-size: 0.85rem; color: #888; }
    .etiquetas { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .tag {
      background: #e3f2fd;
      color: #1976d2;
      padding: 0.2rem 0.5rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }
  `]
})
export class PostCardComponent {
  @Input({ required: true }) post!: Post;
  @Output() seleccionar = new EventEmitter<Post>();
}
```

```typescript
// post-detail.component.ts (Dumb)
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [DatePipe],
  template: `
    @if (post) {
      <article class="post-detail">
        <button class="back-btn" (click)="cerrar.emit()">&larr; Volver al listado</button>
        <h1>{{ post.titulo }}</h1>
        <div class="meta">
          <span>{{ post.autor }}</span> |
          <span>{{ post.fecha | date:'longDate' }}</span> |
          <span>&hearts; {{ post.likes }} likes</span>
        </div>
        <div class="contenido">{{ post.contenido }}</div>
        <div class="etiquetas">
          @for (tag of post.etiquetas; track tag) {
            <span class="tag">{{ tag }}</span>
          }
        </div>
      </article>
    }
  `,
  styles: [`
    .post-detail { max-width: 800px; margin: 0 auto; padding: 2rem; }
    .back-btn {
      background: none; border: none; color: #1976d2;
      cursor: pointer; font-size: 1rem; padding: 0; margin-bottom: 1.5rem;
    }
    .back-btn:hover { text-decoration: underline; }
    h1 { font-size: 2rem; color: #333; margin-bottom: 0.5rem; }
    .meta { color: #888; font-size: 0.9rem; margin-bottom: 2rem; }
    .contenido { line-height: 1.8; color: #444; font-size: 1.05rem; }
    .etiquetas { display: flex; gap: 0.5rem; margin-top: 2rem; }
    .tag {
      background: #e3f2fd;
      color: #1976d2;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
    }
  `]
})
export class PostDetailComponent {
  @Input() post: Post | null = null;
  @Output() cerrar = new EventEmitter<void>();
}
```

```typescript
// post-list-container.component.ts (Smart)
import { Component, OnInit, signal, inject } from '@angular/core';
import { PostCardComponent } from './post-card.component';
import { PostDetailComponent } from './post-detail.component';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-post-list-container',
  standalone: true,
  imports: [PostCardComponent, PostDetailComponent],
  template: `
    @if (!postSeleccionado()) {
      <h1>Blog</h1>

      @if (cargando()) {
        <p class="loading">Cargando articulos...</p>
      } @else {
        <div class="posts-grid">
          @for (post of posts(); track post.id) {
            <app-post-card
              [post]="post"
              (seleccionar)="seleccionarPost($event)"
            />
          } @empty {
            <p>No hay articulos disponibles.</p>
          }
        </div>
      }
    } @else {
      <app-post-detail
        [post]="postSeleccionado()"
        (cerrar)="cerrarDetalle()"
      />
    }
  `,
  styles: [`
    h1 { margin-bottom: 2rem; font-size: 2rem; color: #333; }
    .posts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }
    .loading { text-align: center; padding: 3rem; color: #888; }
  `]
})
export class PostListContainerComponent implements OnInit {
  private postService = inject(PostService);

  posts = signal<Post[]>([]);
  cargando = signal(true);
  postSeleccionado = signal<Post | null>(null);

  ngOnInit(): void {
    this.postService.obtenerPosts().subscribe({
      next: (data) => {
        this.posts.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  seleccionarPost(post: Post): void {
    this.postSeleccionado.set(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cerrarDetalle(): void {
    this.postSeleccionado.set(null);
  }
}
```

### Ejercicio 2: Carrito de compras con comunicacion entre hermanos

**Enunciado:** Implementar un carrito de compras donde `ProductCatalog` y `CartPanel` son hermanos que se comunican a traves de un servicio `CartStateService`.

```typescript
// cart-state.service.ts
import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

@Injectable({ providedIn: 'root' })
export class CartStateService {
  private items = signal<CartItem[]>([]);

  readonly items$ = this.items.asReadonly();
  readonly totalArticulos = computed(() =>
    this.items().reduce((sum, i) => sum + i.cantidad, 0)
  );
  readonly totalPrecio = computed(() =>
    this.items().reduce((sum, i) => sum + i.precio * i.cantidad, 0)
  );

  agregarAlCarrito(item: CartItem): void {
    this.items.update(current => {
      const index = current.findIndex(i => i.id === item.id);
      if (index >= 0) {
        return current.map((i, idx) =>
          idx === index ? { ...i, cantidad: i.cantidad + item.cantidad } : i
        );
      }
      return [...current, item];
    });
  }

  eliminarDelCarrito(id: number): void {
    this.items.update(current => current.filter(i => i.id !== id));
  }

  actualizarCantidad(id: number, cantidad: number): void {
    if (cantidad <= 0) {
      this.eliminarDelCarrito(id);
      return;
    }
    this.items.update(current =>
      current.map(i => i.id === id ? { ...i, cantidad } : i)
    );
  }

  vaciarCarrito(): void {
    this.items.set([]);
  }
}
```

```typescript
// product-catalog.component.ts (Hermano A)
import { Component, inject } from '@angular/core';
import { CartStateService } from '../../services/cart-state.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-catalog',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <div class="catalog">
      <h2>Productos Disponibles</h2>
      <div class="products">
        @for (producto of productosCatalogo; track producto.id) {
          <div class="product-item">
            <div class="product-info">
              <h3>{{ producto.nombre }}</h3>
              <p class="price">{{ producto.precio | currency:'EUR' }}</p>
            </div>
            <button class="btn-add" (click)="agregar(producto)">
              + Anadir al carrito
            </button>
          </div>
        }
      </div>
    </div>
  `
})
export class ProductCatalogComponent {
  private cartService = inject(CartStateService);

  productosCatalogo = [
    { id: 1, nombre: 'Auriculares Bluetooth', precio: 49.99 },
    { id: 2, nombre: 'Teclado Mecanico', precio: 89.99 },
    { id: 3, nombre: 'Monitor 27 pulgadas', precio: 299.99 },
    { id: 4, nombre: 'Raton inalambrico', precio: 34.99 },
    { id: 5, nombre: 'Webcam Full HD', precio: 59.99 },
    { id: 6, nombre: 'Hub USB-C', precio: 24.99 },
  ];

  agregar(producto: { id: number; nombre: string; precio: number }): void {
    this.cartService.agregarAlCarrito({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1
    });
  }
}
```

```typescript
// cart-panel.component.ts (Hermano B)
import { Component, inject } from '@angular/core';
import { CartStateService } from '../../services/cart-state.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart-panel',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <div class="cart-panel">
      <h2>Tu Carrito</h2>

      @if (cartService.totalArticulos() === 0) {
        <p class="empty">El carrito esta vacio.</p>
        <p class="empty-hint">Anade productos desde el catalogo.</p>
      } @else {
        <div class="cart-items">
          @for (item of cartService.items$(); track item.id) {
            <div class="cart-item">
              <div class="item-info">
                <h4>{{ item.nombre }}</h4>
                <p>{{ item.precio | currency:'EUR' }} x {{ item.cantidad }}</p>
              </div>
              <div class="item-controls">
                <button (click)="disminuir(item.id, item.cantidad)">-</button>
                <span>{{ item.cantidad }}</span>
                <button (click)="aumentar(item.id, item.cantidad)">+</button>
                <button class="btn-remove" (click)="cartService.eliminarDelCarrito(item.id)">X</button>
              </div>
            </div>
          }
        </div>

        <div class="cart-footer">
          <div class="total">
            <span>Total ({{ cartService.totalArticulos() }} articulos):</span>
            <strong>{{ cartService.totalPrecio() | currency:'EUR' }}</strong>
          </div>
          <button class="btn-clear" (click)="cartService.vaciarCarrito()">Vaciar carrito</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .cart-panel { background: white; border-radius: 12px; padding: 1.5rem; }
    .empty { color: #999; text-align: center; margin: 2rem 0; }
    .empty-hint { color: #bbb; text-align: center; font-size: 0.9rem; }
    .cart-items { margin: 1rem 0; }
    .cart-item {
      display: flex; justify-content: space-between; align-items: center;
      padding: 0.75rem 0; border-bottom: 1px solid #eee;
    }
    .item-controls { display: flex; align-items: center; gap: 0.5rem; }
    .item-controls button {
      width: 28px; height: 28px; border: 1px solid #ccc;
      border-radius: 50%; background: white; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
    }
    .btn-remove { color: #e53935; font-weight: bold; }
    .cart-footer { margin-top: 1rem; }
    .total { display: flex; justify-content: space-between; margin-bottom: 0.75rem; }
    .btn-clear {
      width: 100%; padding: 0.5rem;
      background: none; border: 1px solid #e53935;
      color: #e53935; border-radius: 6px; cursor: pointer;
    }
  `]
})
export class CartPanelComponent {
  cartService = inject(CartStateService);

  aumentar(id: number, cantidadActual: number): void {
    this.cartService.actualizarCantidad(id, cantidadActual + 1);
  }

  disminuir(id: number, cantidadActual: number): void {
    this.cartService.actualizarCantidad(id, cantidadActual - 1);
  }
}
```

El componente padre que orquesta ambos hermanos:

```typescript
// shop-container.component.ts
import { Component } from '@angular/core';
import { ProductCatalogComponent } from './product-catalog.component';
import { CartPanelComponent } from './cart-panel.component';

@Component({
  selector: 'app-shop-container',
  standalone: true,
  imports: [ProductCatalogComponent, CartPanelComponent],
  template: `
    <div class="shop-layout">
      <main class="main-area">
        <app-product-catalog />
      </main>
      <aside class="sidebar">
        <app-cart-panel />
      </aside>
    </div>
  `,
  styles: [`
    .shop-layout {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }
    @media (max-width: 900px) {
      .shop-layout { grid-template-columns: 1fr; }
    }
  `]
})
export class ShopContainerComponent {}
```

## Actividades propuestas

### Actividad 1: Agenda de contactos con patrón Smart/Dumb (Nivel básico)

**Descripción:** Crear una aplicación de agenda de contactos utilizando el patrón Smart/Dumb.

**Tareas:**
1. Crear un modelo `Contacto` con: id, nombre, apellidos, email, teléfono, favorito (boolean).
2. Crear un `ContactListContainer` (Smart) que gestione la lista de contactos en una signal.
3. Crear un `ContactCard` (Dumb) que reciba un contacto por `@Input` y emita eventos de selección y toggle de favorito.
4. Crear un `ContactDetail` (Dumb) que muestre los detalles del contacto seleccionado.
5. Implementar filtro de búsqueda por nombre en el Smart Component usando `computed()`.
6. Separar contactos favoritos al inicio de la lista.

**Duración estimada:** 1.5 horas.

### Actividad 2: Formulario de registro multi-paso (Nivel medio)

**Descripción:** Implementar un formulario de registro dividido en 3 pasos con comunicación entre los componentes del formulario.

**Tareas:**
1. Crear un servicio `RegistrationStateService` con signals para cada paso del formulario (datos personales, dirección, preferencias).
2. Crear componentes Dumb para cada paso: `PersonalInfoStep`, `AddressStep`, `PreferencesStep`.
3. Crear un `RegistrationContainer` (Smart) que orqueste los pasos y muestre una barra de progreso.
4. Usar Model Inputs para los campos del formulario que necesiten two-way binding.
5. Usar `inject()` para acceder al servicio desde cada componente paso.

**Duración estimada:** 2 horas.

### Actividad 3: Panel de administración con layout compuesto (Nivel medio)

**Descripción:** Construir la estructura de un panel de administración con header, sidebar, área de contenido y footer.

**Tareas:**
1. Crear `AdminLayoutComponent` con slots usando `<ng-content>` para header, sidebar, content y footer.
2. Crear componentes: `AdminHeader`, `AdminSidebar`, `AdminFooter`.
3. Implementar un `AdminDashboardComponent` que use el layout.
4. La sidebar debe tener items de navegación que emitan eventos al layout.
5. El contenido debe cambiar según la navegación seleccionada.

**Duración estimada:** 2 horas.

### Actividad 4: Sistema de comentarios anidados (Nivel avanzado)

**Descripción:** Implementar un sistema de comentarios donde los comentarios pueden tener respuestas anidadas (hilos).

**Tareas:**
1. Crear un modelo `Comment` con: id, autor, texto, fecha, respuestas (array del mismo tipo - recursivo).
2. Crear un `CommentThread` (Smart) que reciba un comentario y muestre sus respuestas.
3. Crear un `CommentItem` (Dumb) que reciba un comentario y emita eventos de responder.
4. Implementar recursividad: `CommentItem` puede contener un `CommentThread` para las respuestas.
5. Gestionar el estado de los comentarios con signals en un servicio.

**Duración estimada:** 2.5 horas.

### Actividad 5: Comparador de productos (Nivel avanzado)

**Descripción:** Crear una herramienta de comparación de productos donde se seleccionan productos en una grilla y se comparan en paralelo.

**Tareas:**
1. Crear un servicio `CompareService` que mantenga la lista de productos a comparar.
2. `ProductGrid` (Dumb) muestra todos los productos con checkbox de selección.
3. `ComparePanel` (Dumb) muestra los productos seleccionados lado a lado.
4. Ambos hermanos se comunican a través del servicio compartido.
5. Implementar límite de 4 productos en la comparación.

**Duración estimada:** 2 horas.

## Actividades de ampliación

### Actividad de ampliación 1: Drag and Drop entre componentes hermanos

**Descripción:** Implementar un sistema Kanban básico donde las tareas se pueden arrastrar entre columnas (componentes hermanos).

**Tareas:**
1. Crear un servicio `KanbanService` con signals para las columnas y tareas.
2. Crear componentes `KanbanColumn` (Dumb) con soporte para drag and drop (usar eventos nativos HTML5).
3. Los hermanos (columnas) se comunican a través del servicio al soltar una tarea.
4. Implementar animaciones CSS para la transición de tareas entre columnas.

**Duración estimada:** 3 horas.

### Actividad de ampliación 2: Árbol de componentes con lazy loading

**Descripción:** Construir una aplicación donde ciertos subárboles de componentes se cargan bajo demanda (lazy loading).

**Tareas:**
1. Crear rutas con lazy loading que carguen módulos completos de componentes.
2. Implementar un `DashboardShell` que cargue widgets dinámicamente según configuración.
3. Usar `@defer` para diferir la carga de componentes pesados.
4. Medir el impacto en el bundle size con `ng build --stats-json`.

**Duración estimada:** 2.5 horas.

### Actividad de ampliación 3: Sistema de notificaciones con servicios

**Descripción:** Crear un sistema global de notificaciones toast donde cualquier componente pueda mostrar notificaciones.

**Tareas:**
1. Crear un `NotificationService` con cola de notificaciones usando signals.
2. Crear un `NotificationContainer` (Smart) que muestre las notificaciones activas.
3. `NotificationToast` (Dumb) para cada notificación individual con animación de entrada/salida.
4. Soportar tipos: success, error, warning, info con diferentes estilos.
5. Auto-dismiss configurable.

**Duración estimada:** 2 horas.

## Buenas prácticas profesionales

1. **Un componente, una responsabilidad:** Aplicar el Principio de Responsabilidad Única (SRP). Si un componente hace "A y B", probablemente deberían ser dos componentes. Esto facilita el testing, la reutilización y el mantenimiento.

2. **Nombrado consistente y descriptivo:** Usar nombres que describan la función: `UserListComponent`, `ProductCardComponent`. Evitar nombres genéricos como `DataComponent` o `ItemComponent`. Para distinguir Smart/Dumb, se pueden usar sufijos: `ShoppingCartContainerComponent` vs `ShoppingCartViewComponent`.

3. **Inmutabilidad de inputs:** Los componentes no deben modificar los objetos/arrays recibidos como `@Input`. Si necesitan datos derivados, deben crearlos internamente o usar `computed()`.

   ```typescript
   // Mal: modifica el input
   @Input() items: Item[] = [];
   ordenarItems(): void {
     this.items.sort((a, b) => a.nombre.localeCompare(b.nombre));
   }

   // Bien: crea datos derivados sin modificar el input
   itemsOrdenados = computed(() =>
     [...this.items].sort((a, b) => a.nombre.localeCompare(b.nombre))
   );
   ```

4. **Usar `required: true` para inputs obligatorios:** Hace explícito qué datos son necesarios para que el componente funcione y Angular advierte en tiempo de compilación si faltan.

5. **Mantener la jerarquía plana:** Evitar anidamientos de más de 4-5 niveles. Si un componente tiene muchos niveles de hijos, considerar si parte de esa lógica debería moverse a un servicio o si la estructura refleja correctamente el diseño.

6. **Composición mediante `<ng-content>`:** Para layouts y componentes contenedores, usar `<ng-content>` (single slot) o `<ng-content select="...">` (multi-slot) para permitir que el padre proyecte contenido. Esto hace que los componentes de layout sean más flexibles y reutilizables.

   ```html
   <!-- card.component.ts (Dumb, reutilizable) -->
   <div class="card">
     <ng-content select="[card-header]"></ng-content>
     <ng-content></ng-content>
     <ng-content select="[card-footer]"></ng-content>
   </div>
   ```

7. **Eventos con nombres de verbo en infinitivo:** Los `@Output` deben nombrarse con verbos que describan la acción: `seleccionCambiada`, `itemEliminado`, `formularioEnviado`. Evitar nombres como `click` o `change` que no aportan contexto.

8. **Evitar lógica de negocio en Dumb Components:** Los componentes presentacionales no deben importar servicios, hacer llamadas HTTP ni contener reglas de negocio complejas. Su lógica debe limitarse a la presentación (formateo, cálculos visuales, estados de UI locales como hover/active).

## Errores frecuentes

1. **Modificar los inputs directamente desde el hijo:** Este es uno de los errores más comunes y peligrosos porque rompe el flujo unidireccional de datos y puede causar comportamientos impredecibles.

   ```typescript
   // Error: modificar el input
   @Input() usuario: Usuario;
   ngOnInit() {
     this.usuario.nombre = this.usuario.nombre.toUpperCase();
   }

   // Correcto: emitir un evento para que el padre actualice
   @Output() nombreCambiado = new EventEmitter<string>();
   ```

2. **No configurar `changeDetection: ChangeDetectionStrategy.OnPush`:** Por defecto, Angular usa `ChangeDetectionStrategy.Default` que verifica cambios en cada evento. En aplicaciones con muchos componentes, esto degrada el rendimiento. Usar `OnPush` con signals y inputs inmutables reduce drásticamente las comprobaciones innecesarias.

3. **Crear jerarquías con demasiados niveles de anidamiento:** Más de 5-6 niveles de profundidad suele indicar un problema de diseño. Dificulta la comprensión, el mantenimiento y el rendimiento.

4. **No limpiar suscripciones:** Cuando se usa comunicación entre hermanos mediante servicios con Observables, es necesario desuscribirse para evitar memory leaks. El `AsyncPipe` lo gestiona automáticamente, pero las suscripciones manuales requieren `takeUntil` o `unsubscribe`.

5. **Usar `@Output` para datos que deberían ser inputs:** Si un componente necesita ciertos datos para funcionar, deben ser `@Input`, no esperar a que el padre los pase a través de algún mecanismo indirecto.

6. **No usar `track` en `@for`:** En componentes que renderizan listas (usando `@for`), es obligatorio usar `track` para que Angular pueda identificar eficientemente qué elementos cambian. No hacerlo resulta en recreaciones innecesarias del DOM.

7. **Exceso de EventEmitters:** Si un componente tiene más de 3-4 `@Output`, quizás tiene demasiadas responsabilidades. Considerar si el componente debería dividirse o si parte de la interacción debería manejarse con servicios.

8. **No aprovechar `computed()` y `effect()`:** Con la API de Signals, muchos casos que antes requerían ngOnChanges para reaccionar a cambios de inputs ahora se pueden resolver más limpiamente con `computed()` para valores derivados y `effect()` para efectos secundarios controlados.

## Resumen

La anidación de componentes es la base sobre la que se construye cualquier aplicación Angular. La correcta organización jerárquica del árbol de componentes determina la mantenibilidad, escalabilidad y rendimiento de la aplicación.

La comunicación padre-hijo mediante `@Input` y `@Output` (y sus variantes modernas como Model Inputs y `model()`) establece un flujo de datos unidireccional claro y predecible. La aplicación del patrón Smart/Dumb separa las responsabilidades de gestión de estado (Smart/Container) y de presentación (Dumb/Presentational), produciendo código más limpio, reutilizable y fácil de probar.

Cuando los componentes hermanos necesitan compartir estado, el patrón de elevación de estado (lifting state up) y el uso de servicios compartidos con signals ofrecen soluciones elegantes sin comprometer la arquitectura. La clave está en elegir la estrategia adecuada según la cercanía de los componentes en el árbol y la complejidad del estado compartido.

## Recursos adicionales

- [Documentación oficial: Comunicación entre componentes](https://angular.dev/guide/components/inputs)
- [Documentación oficial: Model Inputs](https://angular.dev/guide/signals/model)
- [Angular University: Smart vs Dumb Components](https://blog.angular-university.io/angular-2-smart-components-vs-presentation-components-whats-the-difference-when-to-use-each-and-why/)
- [Patrón Container/Presenter en React (conceptualmente aplicable a Angular)](https://www.patterns.dev/react/presentational-container-pattern/)
- [Documentación oficial: Two-way binding](https://angular.dev/guide/templates/two-way-binding)
- [Documentación oficial: Content projection con ng-content](https://angular.dev/guide/components/content-projection)
