---
icon: lucide/wrench
title: 13. PipesApp - Pipes Personalizados
---

# Sección 13: Pipes Personalizados — `PipeTransform`, Tipado Estricto con `keyof` y Encadenamiento

En esta sección ampliamos **PipesApp** (`05-pipes-app`) completando la página **`CustomPage`** (`/custom`). Aprenderemos a diseñar e implementar **siete Pipes personalizados** desde cero: desde transformaciones simples con argumentos (`toggleCase`, `canFly`, `heroColor`, `heroTextColor`, `heroCreator`) hasta pipes de colección que **filtran y ordenan un array de objetos de forma inmutable** (`heroFilter` y `heroSortBy`), combinándolos con Signals reactivas y tipado estricto de TypeScript (`enum`, `Record`, `keyof`).

---

## 📋 Ficha Técnica y Objetivos Didácticos

* **Proyecto:** `05-pipes-app` (Continuación directa en `src/app/pages/custom-page/`).
* **Stack Tecnológico (Angular 22):** `@Pipe({ name: '...' })`, interfaz `PipeTransform`, Signals (`signal<keyof Hero | null>(null)`, `signal('')`), TypeScript (`enum`, `Record<Color, string>`, `keyof Hero`), DaisyUI (`stats`, `table table-xs`).
* **Patrones Arquitectónicos:**
    * **Pure Pipes & Immutability:** Todos los pipes personalizados son puros por defecto (`pure: true`) y **no deben mutar** el array original recibido por parámetro (uso de `[...value].sort(...)` o `.toSorted(...)`).
    * **Pipeline Composition (Encadenamiento):** Filtrar primero y ordenar después (`heroes() | heroFilter : searchQuery() | heroSortBy : sortBy()`) para reducir el conjunto de datos antes de ordenar.
    * **Strict Property Indexing (`keyof Hero`):** Garantizar en tiempo de compilación que solo se puede ordenar por propiedades reales de la interfaz `Hero`.
* **Código Fuente de Referencia:**
    * [GitHub - DevTalles PipesApp (fin-seccion-13)](https://github.com/DevTalles-corp/angular-pipes-app/tree/fin-seccion-13)
    * [Gist oficial de interfaces y datos de héroes (`hero.interface.ts` y `heroes.data.ts`)](https://gist.github.com/Klerith/b893d08799253ff5d570a57c04aeb06a)

``` mermaid
flowchart LR
    Data["<b>heroes()</b><br/>Signal con 25 héroes"] --> Filter["<b>heroFilter : searchQuery()</b><br/>Filtra por nombre (inmutable)"]
    Filter --> Sort["<b>heroSortBy : sortBy()</b><br/>Ordena copia con <code>[...value].sort()</code>"]
    Sort --> Loop["<b>@for (hero of ...; track hero.id)</b>"]

    Loop --> ColFly["<b>hero.canFly | canFly</b><br/>'Puede volar' / 'No puede volar'"]
    Loop --> ColColor["<b>hero.color | heroColor | titlecase</b><br/>+ <code>[style.color]='hero.color | heroTextColor'</code>"]
    Loop --> ColCreator["<b>hero.creator | heroCreator</b><br/>'DC' / 'Marvel'"]
```

---

## 1. Estructura de un Pipe Personalizado y Convención de Nombres

Un pipe personalizado es una clase TypeScript decorada con `@Pipe({ name: 'nombreEnHtml' })` que implementa la interfaz `PipeTransform` y define el método obligatorio `transform(value, ...args)`.

!!! note "Convención de nombres en Angular 22 CLI vs. curso"
    En Angular 22, el comando `ng g p pipes/toggle-case --skip-tests` genera el archivo `toggle-case-pipe.ts` (con guion). En el curso original verás `toggle-case.pipe.ts` (con punto). Ambos son válidos mientras seas consistente en tus `import`. En esta guía usamos la convención `*.pipe.ts` bajo `src/app/pipes/` para que coincida con el repositorio de referencia del curso.

### 1.1. Preparación de `CustomPage` y Primer Pipe: `ToggleCasePipe`

Creamos la carpeta `src/app/pipes/` y el archivo `src/app/pipes/toggle-case.pipe.ts`. Recibe un `string` y un parámetro opcional `upper: boolean = true` que decide si devuelve el texto en mayúsculas o en minúsculas:

```typescript title="src/app/pipes/toggle-case.pipe.ts" hl_lines="3 4 5 7 8 9"
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toggleCase',
})
export class ToggleCasePipe implements PipeTransform {
  transform(value: string, upper: boolean = true): string {
    return upper ? value.toUpperCase() : value.toLowerCase();
  }
}
```

Importamos `ToggleCasePipe` en `CustomPage` y maquetamos la cabecera y la tarjeta de estadísticas:

=== "custom-page.ts (Fase 1)"
    ```typescript title="src/app/pages/custom-page/custom-page.ts" hl_lines="2 6 10"
    import { Component, signal } from '@angular/core';
    import { ToggleCasePipe } from '../../pipes/toggle-case.pipe';

    @Component({
      selector: 'app-custom-page',
      imports: [ToggleCasePipe],
      templateUrl: './custom-page.html',
    })
    export default class CustomPage {
      name = signal('Fernando Herrera');
    }
    ```

=== "custom-page.html (Fase 1)"
    ```html title="src/app/pages/custom-page/custom-page.html" hl_lines="9 10"
    <section class="mx-5">
      <h1 class="text-2xl font-bold">Pipes Personalizados</h1>
      <h3 class="text-xl font-thin">Pipes no incluidos en Angular</h3>
    </section>

    <div class="stats shadow my-4">
      <div class="stat">
        <div class="stat-title">ToggleCase Pipe</div>
        <div class="stat-value">{{ name() | toggleCase }}</div>
        <div class="stat-desc">{{ name() }}</div>
      </div>
    </div>
    ```

---

## 🎯 Tarea Práctica 1: Hacer Interactivo `ToggleCasePipe`

### 📋 Enunciado del Reto

Haz que el usuario pueda alternar en vivo entre mayúsculas y minúsculas sobre `name()`:

1. Crea una Signal `upperCase = signal(true)` en `CustomPage`.
2. Pasa `upperCase()` como argumento al pipe `toggleCase` en `custom-page.html`.
3. Añade un botón `<button class="btn btn-primary mt-2">ToggleCase</button>` debajo de `.stat-desc` que invierta el valor booleano de `upperCase` al hacer clic.

### ⏸️ Reto Práctico: ¡Inténtalo tú mismo!

!!! exercise "Pausa de Trabajo Autónomo"
    Implementa la Signal `upperCase`, conéctala con `: upperCase()` en la plantilla y añade el evento `(click)` del botón antes de ver la solución.

### ⚠️ Errores Típicos

* **Pasar la referencia de la Signal sin ejecutarla:** escribir `name() | toggleCase : upperCase` (sin paréntesis) pasa la función Signal (siempre *truthy*) en lugar del booleano `true`/`false`. Debe ser `upperCase()`.

### ✅ Solución de la Tarea Práctica 1

=== "custom-page.ts"
    ```typescript title="src/app/pages/custom-page/custom-page.ts (fragmento)" hl_lines="3"
    export default class CustomPage {
      name = signal('Fernando Herrera');
      upperCase = signal(true);
    }
    ```

=== "custom-page.html"
    ```html title="src/app/pages/custom-page/custom-page.html (tarjeta ToggleCase)" hl_lines="4 7 8 9"
    <div class="stats shadow my-4">
      <div class="stat">
        <div class="stat-title">ToggleCase Pipe</div>
        <div class="stat-value">{{ name() | toggleCase : upperCase() }}</div>
        <div class="stat-desc">{{ name() }}</div>

        <button (click)="upperCase.set(!upperCase())" class="btn btn-primary mt-2">
          ToggleCase
        </button>
      </div>
    </div>
    ```

---

## 2. Preparación de Datos y Tabla de Superhéroes

Para practicar con pipes sobre tablas reales de datos, incorporamos las interfaces y el catálogo de 25 superhéroes desde el [Gist oficial del curso](https://gist.github.com/Klerith/b893d08799253ff5d570a57c04aeb06a).

=== "src/app/interfaces/hero.interface.ts"
    ```typescript title="src/app/interfaces/hero.interface.ts"
    export enum Color {
      red,
      black,
      blue,
      green,
    }

    export enum Creator {
      DC,
      Marvel,
    }

    export interface Hero {
      id: number;
      name: string;
      canFly: boolean;
      color: Color;
      creator: Creator;
    }

    export const ColorMap: Record<Color, string> = {
      [Color.red]: '#E57373',
      [Color.black]: '#424242',
      [Color.blue]: '#64B5F6',
      [Color.green]: '#81C784',
    };
    ```

=== "src/app/data/heroes.data.ts (extracto)"
    ```typescript title="src/app/data/heroes.data.ts (copiar los 25 héroes completos desde el Gist)"
    import { Color, Creator, Hero } from '../interfaces/hero.interface';

    export const heroes: Hero[] = [
      {
        id: 1,
        name: 'Superman',
        canFly: true,
        color: Color.blue,
        creator: Creator.DC,
      },
      {
        id: 2,
        name: 'Batman',
        canFly: false,
        color: Color.black,
        creator: Creator.DC,
      },
      {
        id: 3,
        name: 'Robin',
        canFly: false,
        color: Color.green,
        creator: Creator.DC,
      },
      {
        id: 4,
        name: 'Daredevil',
        canFly: false,
        color: Color.red,
        creator: Creator.Marvel,
      },
      // ... copia el resto de héroes hasta el id: 25 desde el Gist oficial
    ];
    ```

Añadimos `heroes = signal(heroes);` en `CustomPage` y construimos la tabla base de DaisyUI (`table table-xs w-full`) junto con la barra de botones de ordenación en `custom-page.html`:

```html title="src/app/pages/custom-page/custom-page.html (tabla inicial sin pipes)"
<div class="divider my-2"></div>

<section class="my-2">
  <h1 class="text-2xl font-bold">Filtrando y ordenando héroes</h1>

  <div class="flex gap-2 justify-end w-full mt-2">
    <button class="btn btn-primary">Por nombre</button>
    <button class="btn btn-accent">Por volar</button>
    <button class="btn btn-secondary">Por color</button>
    <button class="btn btn-info">Por creador</button>
  </div>
</section>

<section class="overflow-x-auto w-full">
  <table class="table table-xs w-full">
    <thead>
      <tr>
        <th>#</th>
        <th>Nombre</th>
        <th>Puede volar</th>
        <th>Color</th>
        <th>Creador</th>
      </tr>
    </thead>
    <tbody>
      @for (hero of heroes(); track hero.id; let i = $index) {
        <tr>
          <td>{{ i + 1 }}</td>
          <td>{{ hero.name }}</td>
          <td>{{ hero.canFly }}</td>
          <td>{{ hero.color }}</td>
          <td>{{ hero.creator }}</td>
        </tr>
      }
    </tbody>
  </table>
</section>
```

Al renderizar esta tabla inicial verás valores crudos poco amigables para el usuario: `true`/`false` en *Puede volar*, y números (`0`, `1`, `2`, `3`) en *Color* y *Creador* (porque los `enum` de TypeScript son numéricos por defecto). Vamos a resolver cada columna con un pipe personalizado.

---

## 🎯 Tarea Práctica 2: `CanFlyPipe`

### 📋 Enunciado del Reto

Crea el pipe `CanFlyPipe` en `src/app/pipes/can-fly.pipe.ts` con el nombre `'canFly'`:

1. Recibe un `boolean` y devuelve `'Puede volar'` si es `true`, o `'No puede volar'` si es `false`.
2. Aplícalo en la columna **Puede volar** de `custom-page.html`.
3. Colorea el texto de la celda usando clases condicionales de DaisyUI: `text-success` si `hero.canFly` es `true`, y `text-accent` si es `false`.

### ⏸️ Reto Práctico: ¡Inténtalo tú mismo!

!!! exercise "Pausa de Trabajo Autónomo"
    Crea `can-fly.pipe.ts`, impórtalo en `CustomPage` y actualiza la columna correspondiente en la tabla.

### ⚠️ Errores Típicos

* **Olvidar importar `CanFlyPipe` en `CustomPage`:** recuerda añadir cada nuevo pipe al array `imports` del decorador `@Component`.

### ✅ Solución de la Tarea Práctica 2

=== "can-fly.pipe.ts"
    ```typescript title="src/app/pipes/can-fly.pipe.ts" hl_lines="4 7 8 9"
    import { Pipe, PipeTransform } from '@angular/core';

    @Pipe({
      name: 'canFly',
    })
    export class CanFlyPipe implements PipeTransform {
      transform(value: boolean): 'Puede volar' | 'No puede volar' {
        return value ? 'Puede volar' : 'No puede volar';
      }
    }
    ```

=== "custom-page.html (columna)"
    ```html title="Columna Puede volar en custom-page.html" hl_lines="3 4 5"
    <td>
      <span
        class="text-xs w-44"
        [class.text-success]="hero.canFly"
        [class.text-accent]="!hero.canFly"
      >
        {{ hero.canFly | canFly }}
      </span>
    </td>
    ```

---

## 🎯 Tarea Práctica 3: `HeroColorPipe` (Mapeo Inverso de `enum`)

### 📋 Enunciado del Reto

Crea `HeroColorPipe` en `src/app/pipes/hero-color.pipe.ts` con el nombre `'heroColor'`:

1. Recibe un valor de tipo `Color` (el `enum` numérico de `hero.interface.ts`).
2. Devuelve el nombre textual del color (`'red'`, `'black'`, `'blue'`, `'green'`) aprovechando el **mapeo inverso de enums numéricos** de TypeScript (`Color[value]`).
3. Aplícalo en la columna **Color** de la tabla y utiliza `[style.color]="hero.color | heroColor"` de forma provisional para ver el color aplicado al texto.

### ⏸️ Reto Práctico: ¡Inténtalo tú mismo!

!!! exercise "Pausa de Trabajo Autónomo"
    Implementa `HeroColorPipe`, impórtalo en `CustomPage` y pruébalo tanto en la interpolación `{{ hero.color | heroColor }}` como en `[style.color]`.

### ⚠️ Errores Típicos

* **Confundir `enum` numérico con `enum` de strings:** el acceso `Color[value]` (reverse mapping) solo funciona en TypeScript con enums numéricos.

### ✅ Solución de la Tarea Práctica 3

=== "hero-color.pipe.ts"
    ```typescript title="src/app/pipes/hero-color.pipe.ts" hl_lines="8 9 10"
    import { Pipe, PipeTransform } from '@angular/core';
    import { Color } from '../interfaces/hero.interface';

    @Pipe({
      name: 'heroColor',
    })
    export class HeroColorPipe implements PipeTransform {
      transform(value: Color): string {
        return Color[value];
      }
    }
    ```

=== "custom-page.html (columna provisional)"
    ```html title="Columna Color (fase intermedia)"
    <td>
      <span class="text-xs w-44" [style.color]="hero.color | heroColor">
        {{ hero.color | heroColor }}
      </span>
    </td>
    ```

---

## 🎯 Tarea Práctica 4: `HeroTextColorPipe` y Encadenamiento con `TitleCasePipe`

### 📋 Enunciado del Reto

Los colores CSS puros (`red`, `blue`, `black`) tienen poco contraste sobre el tema oscuro `dracula`. En `hero.interface.ts` ya tenemos definido `ColorMap` con códigos hexadecimales pastel (`#E57373`, `#64B5F6`, etc.).

1. Crea `HeroTextColorPipe` en `src/app/pipes/hero-text-color.pipe.ts` con nombre `'heroTextColor'` que reciba `Color` y devuelva `ColorMap[value]`.
2. Sustituye `[style.color]` para que use `hero.color | heroTextColor`.
3. Encadena `TitleCasePipe` en la interpolación del texto: `{{ hero.color | heroColor | titlecase }}`.

### ⏸️ Reto Práctico: ¡Inténtalo tú mismo!

!!! exercise "Pausa de Trabajo Autónomo"
    Implementa `HeroTextColorPipe`, importa `HeroTextColorPipe` y `TitleCasePipe` en `CustomPage` y actualiza la celda de color.

### ⚠️ Errores Típicos

* **Invertir el orden del encadenamiento:** `hero.color | titlecase | heroColor` falla en compilación porque `titlecase` espera un `string` y `hero.color` es un `Color` (número). Los pipes siempre se evalúan de **izquierda a derecha**.

### ✅ Solución de la Tarea Práctica 4

=== "hero-text-color.pipe.ts"
    ```typescript title="src/app/pipes/hero-text-color.pipe.ts" hl_lines="8 9 10"
    import { Pipe, PipeTransform } from '@angular/core';
    import { Color, ColorMap } from '../interfaces/hero.interface';

    @Pipe({
      name: 'heroTextColor',
    })
    export class HeroTextColorPipe implements PipeTransform {
      transform(value: Color): string {
        return ColorMap[value];
      }
    }
    ```

=== "custom-page.html (columna final)"
    ```html title="Columna Color con HeroTextColorPipe y TitleCasePipe" hl_lines="2 3"
    <td>
      <span class="text-xs w-44" [style.color]="hero.color | heroTextColor">
        {{ hero.color | heroColor | titlecase }}
      </span>
    </td>
    ```

---

## 🎯 Tarea Práctica 5: `HeroCreatorPipe`

### 📋 Enunciado del Reto

Crea `HeroCreatorPipe` en `src/app/pipes/hero-creator.pipe.ts` con nombre `'heroCreator'`:

1. Recibe `value: Creator` y devuelve `'DC'` si `value === Creator.DC` o `'Marvel'` en caso contrario.
2. Aplícalo en la columna **Creador** con `[class.text-primary]="hero.creator === 0"` y `[class.text-accent]="hero.creator === 1"`.

### ⏸️ Reto Práctico: ¡Inténtalo tú mismo!

!!! exercise "Pausa de Trabajo Autónomo"
    Crea `hero-creator.pipe.ts`, impórtalo en `CustomPage` y actualiza la última columna de la tabla.

### ⚠️ Errores Típicos

* **Comparar con cadenas `'DC'` en vez del enum `Creator.DC`:** recuerda que `hero.creator` almacena `0` (`Creator.DC`) o `1` (`Creator.Marvel`).

### ✅ Solución de la Tarea Práctica 5

=== "hero-creator.pipe.ts"
    ```typescript title="src/app/pipes/hero-creator.pipe.ts" hl_lines="8 9 10"
    import { Pipe, PipeTransform } from '@angular/core';
    import { Creator } from '../interfaces/hero.interface';

    @Pipe({
      name: 'heroCreator',
    })
    export class HeroCreatorPipe implements PipeTransform {
      transform(value: Creator): 'DC' | 'Marvel' {
        return value === Creator.DC ? 'DC' : 'Marvel';
      }
    }
    ```

=== "custom-page.html (columna)"
    ```html title="Columna Creador en custom-page.html" hl_lines="3 4 5"
    <td>
      <span
        class="text-xs w-44"
        [class.text-primary]="hero.creator === 0"
        [class.text-accent]="hero.creator === 1"
      >
        {{ hero.creator | heroCreator }}
      </span>
    </td>
    ```

---

## 3. Ordenación Tipada e Inmutable: `HeroSortByPipe`

Ahora damos funcionalidad a los cuatro botones superiores (**Por nombre**, **Por volar**, **Por color**, **Por creador**). Para evitar errores tipográficos al indicar el campo de ordenación, tipamos el argumento con **`keyof Hero | null`**: así TypeScript solo aceptará `'id' | 'name' | 'canFly' | 'color' | 'creator' | null`.

!!! important "Principio de Inmutabilidad: no mutes `value` con `value.sort()`"
    El método nativo `Array.prototype.sort()` **muta el array original in-place**. Dentro de un pipe puro esto puede provocar efectos secundarios inesperados (como alterar la Signal `heroes()` o impedir que Angular detecte cambios al mantener la misma referencia de array).
    Por eso creamos siempre una copia superficial con **`[...value].sort(...)`** (o `.toSorted(...)` en entornos ES2023+) antes de ordenar.

```typescript title="src/app/pipes/hero-sort-by.pipe.ts" hl_lines="8 9 11 13 15 18 21 24"
import { Pipe, PipeTransform } from '@angular/core';
import { Hero } from '../interfaces/hero.interface';

@Pipe({
  name: 'heroSortBy',
})
export class HeroSortByPipe implements PipeTransform {
  transform(value: Hero[], sortBy: keyof Hero | null): Hero[] {
    if (!sortBy) return value;

    const sortedHeroes = [...value];

    switch (sortBy) {
      case 'name':
        return sortedHeroes.sort((a, b) => a.name.localeCompare(b.name));

      case 'canFly':
        return sortedHeroes.sort((a, b) => (a.canFly ? 1 : -1) - (b.canFly ? 1 : -1));

      case 'color':
        return sortedHeroes.sort((a, b) => a.color - b.color);

      case 'creator':
        return sortedHeroes.sort((a, b) => a.creator - b.creator);

      default:
        return value;
    }
  }
}
```

En `CustomPage` añadimos la Signal `sortBy = signal<keyof Hero | null>(null)` y conectamos los cuatro botones:

```html title="Botones de ordenación en custom-page.html" hl_lines="3 4 5 6"
<div class="flex gap-2 justify-end w-full mt-2">
  <button (click)="sortBy.set('name')" class="btn btn-primary">Por nombre</button>
  <button (click)="sortBy.set('canFly')" class="btn btn-accent">Por volar</button>
  <button (click)="sortBy.set('color')" class="btn btn-secondary">Por color</button>
  <button (click)="sortBy.set('creator')" class="btn btn-info">Por creador</button>
</div>
```

---

## 4. Filtrado Reactivo y Orden de Encadenamiento: `HeroFilterPipe`

Por último, añadimos una caja de búsqueda para filtrar héroes por nombre en tiempo real mediante `HeroFilterPipe`.

```typescript title="src/app/pipes/hero-filter.pipe.ts" hl_lines="8 9 11 13 14 15"
import { Pipe, PipeTransform } from '@angular/core';
import { Hero } from '../interfaces/hero.interface';

@Pipe({
  name: 'heroFilter',
})
export class HeroFilterPipe implements PipeTransform {
  transform(value: Hero[], search: string): Hero[] {
    if (!search) return value;

    const normalizedSearch = search.toLowerCase();

    return value.filter((hero) =>
      hero.name.toLowerCase().includes(normalizedSearch)
    );
  }
}
```

### 4.1. ¿Por qué encadenar `heroFilter` ANTES que `heroSortBy`?

En el bucle `@for` de `custom-page.html`, escribimos:

```html
@for (hero of heroes() | heroFilter : searchQuery() | heroSortBy : sortBy(); track hero.id; let i = $index)
```

1. **Rendimiento:** si el usuario busca `"bat"`, `heroFilter` reduce primero el array de 25 elementos a 1 solo elemento, y `heroSortBy` ordena únicamente ese subconjunto en lugar de ordenar los 25 elementos primero.
2. **Previsibilidad en detección de cambios:** `Array.prototype.filter()` siempre devuelve una nueva referencia de array, garantizando que el siguiente pipe (`heroSortBy`) reciba exactamente el subconjunto filtrado actualizado.

### 4.2. Código Completo Final de `CustomPage`

=== "custom-page.ts"
    ```typescript title="src/app/pages/custom-page/custom-page.ts" hl_lines="1 2 3 4 5 6 7 8 9 25 26 27 28"
    import { Component, signal } from '@angular/core';
    import { TitleCasePipe } from '@angular/common';
    import { heroes } from '../../data/heroes.data';
    import { Hero } from '../../interfaces/hero.interface';
    import { ToggleCasePipe } from '../../pipes/toggle-case.pipe';
    import { CanFlyPipe } from '../../pipes/can-fly.pipe';
    import { HeroColorPipe } from '../../pipes/hero-color.pipe';
    import { HeroTextColorPipe } from '../../pipes/hero-text-color.pipe';
    import { HeroCreatorPipe } from '../../pipes/hero-creator.pipe';
    import { HeroSortByPipe } from '../../pipes/hero-sort-by.pipe';
    import { HeroFilterPipe } from '../../pipes/hero-filter.pipe';

    @Component({
      selector: 'app-custom-page',
      imports: [
        TitleCasePipe,
        ToggleCasePipe,
        CanFlyPipe,
        HeroColorPipe,
        HeroTextColorPipe,
        HeroCreatorPipe,
        HeroSortByPipe,
        HeroFilterPipe,
      ],
      templateUrl: './custom-page.html',
    })
    export default class CustomPage {
      name = signal('Fernando Herrera');
      upperCase = signal(true);

      heroes = signal(heroes);
      sortBy = signal<keyof Hero | null>(null);
      searchQuery = signal('');
    }
    ```

=== "custom-page.html"
    ```html title="src/app/pages/custom-page/custom-page.html" hl_lines="25 26 27 28 29 30 31 48"
    <section class="mx-5">
      <h1 class="text-2xl font-bold">Pipes Personalizados</h1>
      <h3 class="text-xl font-thin">Pipes no incluidos en Angular</h3>
    </section>

    <div class="stats shadow my-4">
      <div class="stat">
        <div class="stat-title">ToggleCase Pipe</div>
        <div class="stat-value">{{ name() | toggleCase : upperCase() }}</div>
        <div class="stat-desc">{{ name() }}</div>

        <button (click)="upperCase.set(!upperCase())" class="btn btn-primary mt-2">
          ToggleCase
        </button>
      </div>
    </div>

    <div class="divider my-2"></div>

    <section class="my-2">
      <h1 class="text-2xl font-bold">
        Filtrando por: {{ searchQuery() }} | Ordenando por: {{ sortBy() }}
      </h1>

      <div class="flex gap-2 justify-end w-full mt-2">
        <input
          type="text"
          class="input input-bordered w-full max-w-xs"
          placeholder="Buscar héroe"
          (input)="searchQuery.set(txtSearch.value)"
          #txtSearch
        />

        <div class="flex flex-1"></div>

        <button (click)="sortBy.set('name')" class="btn btn-primary">Por nombre</button>
        <button (click)="sortBy.set('canFly')" class="btn btn-accent">Por volar</button>
        <button (click)="sortBy.set('color')" class="btn btn-secondary">Por color</button>
        <button (click)="sortBy.set('creator')" class="btn btn-info">Por creador</button>
      </div>
    </section>

    <section class="overflow-x-auto w-full">
      <table class="table table-xs w-full">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Puede volar</th>
            <th>Color</th>
            <th>Creador</th>
          </tr>
        </thead>
        <tbody>
          @for (
            hero of heroes() | heroFilter : searchQuery() | heroSortBy : sortBy();
            track hero.id;
            let i = $index
          ) {
            <tr>
              <td>{{ i + 1 }}</td>
              <td>{{ hero.name }}</td>
              <td>
                <span
                  class="text-xs w-44"
                  [class.text-success]="hero.canFly"
                  [class.text-accent]="!hero.canFly"
                >
                  {{ hero.canFly | canFly }}
                </span>
              </td>
              <td>
                <span class="text-xs w-44" [style.color]="hero.color | heroTextColor">
                  {{ hero.color | heroColor | titlecase }}
                </span>
              </td>
              <td>
                <span
                  class="text-xs w-44"
                  [class.text-primary]="hero.creator === 0"
                  [class.text-accent]="hero.creator === 1"
                >
                  {{ hero.creator | heroCreator }}
                </span>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </section>
    ```

---

## 📝 Repaso y Autoevaluación

??? question "1. ¿Qué ventaja aporta tipar el parámetro de `HeroSortByPipe` como `keyof Hero | null` en lugar de `string`?"
    TypeScript valida en tiempo de compilación que solo se puedan pasar nombres de propiedades reales de la interfaz `Hero` (`'id'`, `'name'`, `'canFly'`, `'color'`, `'creator'`) o `null`, evitando errores tipográficos silenciosos en los botones de la plantilla.

??? question "2. ¿Por qué debemos copiar el array con `[...value].sort(...)` dentro de `HeroSortByPipe`?"
    Porque `Array.prototype.sort()` muta el array original en memoria. Al copiarlo antes de ordenar, mantenemos intacta la Signal `heroes()` y devolvemos siempre una nueva referencia inmutable compatible con la detección de cambios de Angular.

??? question "3. ¿Por qué es mejor escribir `heroes() | heroFilter : searchQuery() | heroSortBy : sortBy()` que al revés?"
    Porque los pipes se ejecutan de izquierda a derecha: filtrar primero reduce el número de elementos que tendrá que ordenar `heroSortBy`, mejorando el rendimiento.

---

## 📚 Material de Profundización

* [Manual 06 — Pipes Nativos y Personalizados](manual/06-pipes.md)
* [Manual 05 — Signals y Reactividad](manual/05-signals.md)
* [Guía 12 — PipesApp: Pipes Nativos e i18n](12-pipes.md)
