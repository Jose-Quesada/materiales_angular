---
icon: lucide/trophy
title: 01. Tracker Reactivo SPA (U04 y U05)
---

# 🚀 Práctica 01: Tracker Reactivo SPA

!!! info "📋 Ficha Técnica de la Práctica"
    * **Unidades de Referencia:** Sección 04 (Bases de Angular) y Sección 05 (Expandir Bases).
    * **Modalidad:** Trabajo autónomo individual para realizar en casa / proyecto de portfolio.
    * **Stack Tecnológico:** Angular 22+ (Standalone Components), TypeScript estricto, Bootstrap 5 o Tailwind CSS 4, Angular Signals (`signal`, `computed`, `effect`, `linkedSignal`) y el nuevo decorador `@Service()`.
    * **Manuales de Referencia:** [04. Plantillas y Control Flow](../manual/04-plantillas.md), [05. Signals y Reactividad](../manual/05-signals.md), [07. Comunicación entre Componentes](../manual/07-anidar-componentes.md) y [09. Servicios e Inyección](../manual/09-servicios.md).

Esta práctica global unifica todos los fundamentos de arquitectura, reactividad y enrutamiento aprendidos en las primeras unidades de Angular para crear un **Tracker Reactivo SPA** completo, persistente y desacoplado.

``` mermaid
flowchart TD
    subgraph CapaNavegacion ["1. Enrutamiento y Layout Global (SPA)"]
        Nav["<b>NavbarComponent</b><br/>routerLink y routerLinkActive (exact: true)"]
        Outlet["<b>RouterOutlet</b><br/>Viewport de renderizado dinámico"]
        Nav --> Outlet
    end

    subgraph CapaVistas ["2. Vistas Principales (Smart Containers)"]
        Home["<b>HomePageComponent (/home)</b><br/>Tarjetas de analítica y métricas globales"]
        Tracker["<b>TrackerPageComponent (/tracker)</b><br/>Orquestador de estado y flujo"]
    end

    Outlet --> Home
    Outlet --> Tracker

    subgraph CapaComponentes ["3. Componentes Presentacionales (Dumb)"]
        AddForm["<b>ItemAddComponent</b><br/>Formulario reactivo y notificación output()"]
        ItemList["<b>ItemListComponent</b><br/>@for con track, @empty y binding [class]"]
    end

    Tracker --> AddForm
    Tracker --> ItemList

    subgraph CapaEstado ["4. Capa de Datos y Estado Singleton (Inyección)"]
        Service[("<b>TrackerService</b><br/>signal(), computed(), effect() y localStorage")]
    end

    Tracker -.->|"inject(TrackerService)"| Service
    Home -.->|"inject(TrackerService)"| Service
```

---

## 🎯 Enfoque Pedagógico: Modelo Híbrido

Para que puedas desarrollar un proyecto atractivo para tu portfolio sin comprometer el rigor formativo:

1. **El Contrato Técnico es Innegociable:** Estructura de carpetas, interfaces tipadas, actualización inmutable del estado, patrón Smart/Dumb con `input.required()` y `output()`, y sincronización continua con `effect()`.
2. **La Temática es Libre y Guiada:** Puedes elegir uno de los arquetipos del catálogo sugerido o inventar tu propia temática adaptándola al contrato de datos.

---

## 📦 El Contrato de Datos Universal: `src/app/interfaces/item.interface.ts`

Todo proyecto debe definir una interfaz principal de TypeScript con exactamente las siguientes 4 propiedades:

```typescript title="src/app/interfaces/item.interface.ts"
export interface Item {
  id: string | number;
  title: string;        // Nombre, título o descripción
  category: string;     // Categoría, género, tipo o etiqueta
  value: number;        // Magnitud numérica (horas, precio, kg, dificultad, puntos)
  isCompleted: boolean; // Estado booleano (superado, terminado, pagado, activo)
}
```

### Catálogo de Temáticas Sugeridas

| Temática | `title` | `category` | `value` | `isCompleted` |
| :--- | :--- | :--- | :--- | :--- |
| **Opción A: Gaming Backlog** | Nombre del videojuego | Plataforma (PC, PS5, Switch) | Horas jugadas o estimadas | ¿Juego completado? |
| **Opción B: Fitness & Gym Tracker** | Nombre del ejercicio | Grupo muscular (Pecho, Espalda...) | Peso máximo levantado (kg) | ¿Récord personal superado? |
| **Opción C: Finanzas Personales** | Concepto del gasto o ingreso | Categoría (Hogar, Ocio, Servicios) | Importe en euros (€) | ¿Pagado o pendiente? |
| **Opción D: Temática Libre** | Nombre descriptivo | Clasificación temática | Métrica numérica relevante | Estado binario (Sí/No) |

---

## 🛠️ Especificaciones Técnicas y Fases de Desarrollo

### Fase 1: Creación del Proyecto y Layout SPA

1. **Generación del proyecto:**  
   Genera un nuevo proyecto con Angular CLI:
   ```bash
   ng new tracker-spa --routing --style=css --ssr=false
   ```

2. **Estilos y Maquetación:**  
   Instala tu framework visual preferido (Bootstrap 5 vía CDN en `index.html` o Tailwind CSS configurado en el proyecto).

3. **Navegación Global:**  
   Diseña un componente `NavbarComponent` integrado en el layout principal con dos enlaces de navegación:

    * `/home`: Vista de resumen general y analítica.
    * `/tracker`: Vista de gestión operativa del catálogo.

4. **Resaltado de ruta activa:**  
   Aplica la directiva **`routerLink`** y resalta el enlace activo con **`routerLinkActive="active"`**, asegurando el uso de `[routerLinkActiveOptions]="{ exact: true }"` en el enlace a la raíz.

5. **Ruta comodín:**  
   Configura una ruta comodín (`path: '**'`) que redirija a `/home`.

---

### Fase 2: Capa de Servicio y Reactividad Pura (`TrackerService`)

En **Angular 22**, el estándar moderno para declarar servicios de aplicación es el decorador **`@Service()`** (que sustituye al tradicional `@Injectable({ providedIn: 'root' })`, asignando automáticamente ámbito singleton global y forzando la inyección moderna con `inject()`).

Crea el servicio singleton `src/app/services/tracker.service.ts` utilizando el nuevo decorador:

```typescript title="src/app/services/tracker.service.ts"
import { Service, inject, signal, computed, effect } from '@angular/core';
import { Item } from '../interfaces/item.interface';

@Service() // Estándar Angular 22: Singleton global 'root' automático
export class TrackerService {
  // Lógica de estado reactivo y persistencia
}
```

!!! tip "📖 Referencia: @Service() frente a @Injectable() en Angular 22"
    Puedes consultar la comparativa detallada y reglas de inyección en el **[Manual de Referencia: 09. Servicios e Inyección de Dependencias (@Service)](../manual/09-servicios.md#45-la-evolucion-moderna-service-novedad-angular-22-frente-a-injectable)**. *(Nota: Por compatibilidad hacia atrás, también se acepta `@Injectable({ providedIn: 'root' })`).*

El servicio debe implementar las siguientes 5 capacidades:

#### 1. Lectura Defensiva con Fallback Inicial
Declara fuera de la clase la función `loadFromLocalStorage()` que intente leer la clave `'tracker_items'` de `localStorage`. Si está vacía o se produce un error de lectura, debe retornar un array de al menos **3 elementos de prueba iniciales**.

#### 2. Estado Maestro con `signal()`
Define la señal reactiva central inicializada con la lectura del almacenamiento local:
```typescript
items = signal<Item[]>(loadFromLocalStorage());
```

#### 3. Escritura Automática con `effect()`
En el contexto de inyección del servicio, define un efecto reactivo que sincronice automáticamente cualquier mutación de la señal con `localStorage`:
```typescript
private saveToLocalStorage = effect(() => {
  localStorage.setItem('tracker_items', JSON.stringify(this.items()));
});
```

#### 4. Actualizaciones Estrictamente Inmutables
Implementa métodos para modificar el estado asegurando no mutar nunca el array original:

* **`addItem(item: Item): void`:** Inserta usando `.update(prev => [...prev, item])`.
* **`toggleItem(id: string | number): void`:** Alterna el valor de `isCompleted` usando `.update()` con `.map()`.
* **`deleteItem(id: string | number): void`:** Elimina el elemento usando `.update()` con `.filter()`.

#### 5. Analítica en Tiempo Real con `computed()`
Declara al menos **3 señales computadas** derivadas de la señal `items`:

* **`totalItems`:** Número total de elementos (`computed(() => this.items().length)`).
* **`completedCount`:** Cantidad de elementos completados (`computed(() => this.items().filter(i => i.isCompleted).length)`).
* **`totalValue`:** Suma acumulada de la métrica numérica (`computed(() => this.items().reduce((acc, curr) => acc + curr.value, 0))`).

---

### Fase 3: Vistas y Componentes Smart / Dumb

#### 1. Página de Resumen: `HomePageComponent` (`/home`)
* Inyecta el `TrackerService` con la función moderna **`inject()`**.
* Muestra tarjetas estadísticas (*Dashboard Cards*) que consuman las señales computadas `totalItems()`, `completedCount()` y `totalValue()`. Al ser reactivas, cuando el usuario añada o alterne elementos en el Tracker, las métricas del Home se actualizarán en tiempo real.

#### 2. Página Contenedora: `TrackerPageComponent` (`/tracker` - Componente Smart)
* Actúa como orquestador maestro. Inyecta el servicio y conecta los componentes hijos presentacionales.

#### 3. Componente Dumb 1: Formulario de Entrada (`ItemAddComponent`)
* Formulario con campos para `title`, `category` y `value`.
* Dispone de una señal interna o bindings para previsualizar los datos que el usuario está escribiendo en tiempo real (`<h3>Agregando: {{ title() }}</h3>`).
* Al pulsar el botón de envío, valida que los campos no estén vacíos y emite el nuevo objeto mediante **`output<Item>()`**.
* Limpia los campos tras la emisión.

#### 4. Componente Dumb 2: Listado y Renderizado (`ItemListComponent`)
* Recibe los elementos desde el padre mediante **`input.required<Item[]>()`**.
* Dispone de dos outputs para notificar al padre las acciones del usuario:

    * **`onToggle = output<string | number>();`**
    * **`onDelete = output<string | number>();`**

* Renderiza los elementos mediante el nuevo Control Flow:
  ```html
  @for (item of items(); track item.id; let idx = $index) {
    <!-- Renderizado de tarjeta o fila de tabla -->
  } @empty {
    <div class="alert alert-info">No hay elementos registrados en el tracker.</div>
  }
  ```
* Aplica estilos condicionales dinámicos con **`[class.nombre-clase]="condicion"`** (por ejemplo, `[class.table-success]="item.isCompleted"` o `[class.text-decoration-line-through]="item.isCompleted"`).

---

### Fase 4: Reto Avanzado / Bonus Pro (`linkedSignal`)
*(Opcional - Para optar a la máxima calificación)*

1. **Selección del elemento:** En el listado, añade un botón o evento de clic para seleccionar un elemento y custodiarlo en una señal del padre:
    ```typescript
    selectedItem = signal<Item | null>(null);
    ```

2. **Vinculación reactiva con `linkedSignal()`:** Utiliza la primitiva moderna para crear una copia editable del título:
    ```typescript
    editableTitle = linkedSignal(() => this.selectedItem()?.title ?? '');
    ```

3. **Demostración de reseteo automático:** Permite editar el título localmente en un `<input>` y comprueba cómo, al seleccionar otro elemento diferente de la lista, el valor de `editableTitle` se reinicia automáticamente sin necesidad de métodos de ciclo de vida ni lógica manual.

---

## 🧪 Checklist de Validación y Autoevaluación

Antes de entregar tu proyecto, verifica en el navegador el cumplimiento de estas 6 pruebas:

- [ ] **Prueba 1 (Navegación SPA):** Cambiar entre `/home` y `/tracker` no debe recargar el navegador ni parpadear la pantalla. La clase activa del navbar debe iluminar solo el enlace correspondiente.
- [ ] **Prueba 2 (Adición Inmutable):** Agregar un nuevo elemento debe insertarlo inmediatamente en la lista y actualizar los contadores reactivos en vivo.
- [ ] **Prueba 3 (Control Flow y @empty):** Si eliminas todos los elementos de la lista, debe desaparecer la tabla y mostrarse el bloque amigable `@empty`.
- [ ] **Prueba 4 (Persistencia en LocalStorage):** Modifica el estado, agrega elementos y pulsa ++f5++ para recargar la página por completo. Todos tus datos deben permanecer intactos.
- [ ] **Prueba 5 (Separación Smart/Dumb):** Ningún componente hijo debe importar o inyectar directamente el `TrackerService`; toda la comunicación debe fluir por `input.required()` y `output()`.
- [ ] **Prueba 6 (Clean Code):** La consola del navegador (++f12++) debe estar completamente limpia de errores y advertencias de Angular o TypeScript.

---

## 📊 Rúbrica de Calificación (Escala 0 a 10)

| Criterio Evaluado | Puntuación | Descripción del Estándar de Calidad |
| :--- | :---: | :--- |
| **Enrutamiento y Layout SPA** | **1.5 pts** | Navegación con `routerLink`, `routerLinkActiveOptions: { exact: true }` y comodín `**`. |
| **Arquitectura Smart / Dumb** | **2.5 pts** | Desacoplamiento estricto: hijos tontos gobernados por `input.required()` y `output()`. |
| **Control Flow y Directivas** | **1.5 pts** | Uso nativo de `@for` con `track`, bloque `@empty`, variables de contexto y `[class]`. |
| **Servicio de Estado y Signals** | **2.5 pts** | Declaración moderna con `@Service()` (o `@Injectable`), actualización inmutable con `.update()` y métricas con `computed()`. |
| **Persistencia y `effect()`** | **1.0 pts** | Lectura defensiva con fallback inicial y sincronización automática en `localStorage`. |
| **Calidad de Código y Bonus** | **1.0 pts** | Tipado riguroso, consola limpia de errores y uso opcional de `linkedSignal()`. |
