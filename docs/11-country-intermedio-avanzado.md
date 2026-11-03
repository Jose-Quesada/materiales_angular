---
icon: lucide/sliders
title: 11. CountryApp - Debounce y Caché
---

# Sección 11: CountryApp Intermedio/Avanzado — Debounce, Caché en Memoria y Query Parameters

En esta sección elevamos la experiencia de usuario de **CountryApp** a un nivel profesional. Implementamos la técnica de **Debounce** para realizar búsquedas automáticas en tiempo real mientras el usuario escribe, creamos un **mecanismo de caché en memoria de alto rendimiento mediante `Map`** en nuestro servicio para erradicar peticiones de red redundantes, diseñamos el filtrado por **regiones geográficas con uniones de tipos estrictas** y sincronizamos bidireccionalmente el estado de la aplicación con la URL mediante **Query Parameters (`queryParams`)** para que las búsquedas sobrevivan a recargas y a la navegación del historial.

---

## 📋 Ficha Técnica y Objetivos Didácticos

* **Proyecto:** `country-app` (Optimización avanzada, caché y enrutamiento con parámetros).
* **Stack Tecnológico:** Angular 19 - 22, RxJS (`Subject`, `debounceTime`), Signals, TypeScript (`Map`, Type Unions), Angular Router.
* **Patrones Arquitectónicos:**
    * **Debounce Pattern:** Retraso programado de eventos de teclado para evitar saturar el backend con ráfagas de peticiones por cada tecla pulsada.
    * **In-Memory Cache Pattern:** Almacén asociativo con `Map<string, Country[]>` en el servicio para respuestas instantáneas de 0 milisegundos.
    * **URL as Single Source of Truth:** El estado de los filtros se refleja en la barra de direcciones (`?query=madrid` o `?region=Americas`) permitiendo compartir enlaces y usar los botones Atrás/Adelante del navegador.
* **Código Fuente de Referencia:** [GitHub - DevTalles CountryApp (fin-seccion-11)](https://github.com/DevTalles-corp/angular-country-app/tree/fin-seccion-11)

``` mermaid
flowchart TD
    subgraph EntradaUsuario ["1. Entrada con Debounce (UI)"]
        Typing["<b>Usuario teclea en SearchInput</b><br/>'E' ... 's' ... 'p' ... 'a'"] --> Debounce["<b>Subject + debounceTime(300ms)</b><br/>Espera a que el usuario deje de teclear"]
    end

    subgraph SincronizacionURL ["2. Sincronización con la URL"]
        Debounce --> URL["<b>Router.navigate([], { queryParams })</b><br/>Actualiza la URL: <code>?query=españa</code>"]
    end

    subgraph CapaServicio ["3. CountryService con Caché"]
        URL --> CheckCache{"<b>¿Existe en el Map de Caché?</b>"}
        CheckCache -- Sí --> ReturnMemory["<b>Retorno Inmediato en Memoria</b><br/>0ms latencia, 0 peticiones HTTP"]
        CheckCache -- No --> FetchHTTP["<b>Petición HTTP real a REST Countries</b><br/>Guarda respuesta en Map y retorna"]
    end

    subgraph Renderizado ["4. Renderizado Reactivo"]
        ReturnMemory --> Table["<b>CountryTableComponent</b><br/>Renderizado instantáneo"]
        FetchHTTP --> Table
    end

    EntradaUsuario ==> SincronizacionURL ==> CapaServicio ==> Renderizado
```

---

## 1. Técnica de Debounce: Búsquedas Automáticas en Tiempo Real

Hasta ahora, el usuario debía pulsar la tecla `Enter` o hacer clic en "Buscar" para disparar la consulta. Queremos que la búsqueda ocurra **mientras escribe**, pero sin ametrallar el servidor con una petición por cada letra (*keystroke*).

### 1.1. ¿Qué es el Debounce?
El **Debounce** es un patrón que agrupa una ráfaga de eventos y solo emite el último tras un periodo de inactividad prefijado (por ejemplo, 300 milisegundos).

```
Teclas:    E ──(50ms)── s ──(80ms)── p ──(60ms)── a ────(espera 300ms sin teclear)────> ¡Dispara búsqueda: "espa"!
Petición:                                                                              └──> 1 sola llamada HTTP
```

### 1.2. Actualización de `SearchInputComponent` con `Subject` y `debounceTime`
Modificamos `src/app/country/components/search-input/search-input.component.ts`. Utilizamos un `Subject` de RxJS configurado en el ciclo de vida del componente:

!!! info "📖 Para saber más: Manual de Referencia"
    Para repasar los operadores principales de RxJS (`debounceTime`, `distinctUntilChanged`, `switchMap`), consulta el **[Manual de Referencia: 10. Cliente HTTP y Comunicación con APIs](manual/10-http.md)**.

```typescript title="src/app/country/components/search-input/search-input.component.ts" hl_lines="18 29-37"
import { Component, effect, input, OnDestroy, OnInit, output, signal } from '@angular/core';
import { debounceTime, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'country-search-input',
  template: `
    <div class="flex gap-2 w-full max-w-lg mb-6">
      <input
        type="text"
        [value]="inputValue()"
        [placeholder]="placeholder()"
        class="input input-bordered w-full focus:input-primary"
        (input)="onInputChange($event)"
      />
      @if (inputValue()) {
        <button 
          type="button" 
          class="btn btn-ghost btn-circle"
          (click)="clearInput()">
          ✕
        </button>
      }
    </div>
  `,
})
export class SearchInputComponent implements OnInit, OnDestroy {
  placeholder = input<string>('Buscar...');
  initialValue = input<string>(''); // Permite precargar el valor inicial desde la URL
  value = output<string>();

  inputValue = signal<string>('');
  private debouncer = new Subject<string>();
  private debouncerSubscription?: Subscription;

  constructor() {
    // Sincroniza el valor inicial si viene de la URL
    effect(() => {
      this.inputValue.set(this.initialValue());
    });
  }

  ngOnInit(): void {
    // Configura el debounce a 350 milisegundos
    this.debouncerSubscription = this.debouncer
      .pipe(debounceTime(350))
      .subscribe(query => {
        this.value.emit(query);
      });
  }

  ngOnDestroy(): void {
    // Limpieza preventiva de memoria
    this.debouncerSubscription?.unsubscribe();
  }

  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.inputValue.set(input.value);
    this.debouncer.next(input.value.trim());
  }

  clearInput() {
    this.inputValue.set('');
    this.value.emit('');
  }
}
```

---

## 2. Caché en Memoria de Alto Rendimiento en `CountryService`

Si un usuario busca `"Madrid"`, luego cambia a `"Francia"` y vuelve a teclear `"Madrid"`, es ineficiente volver a contactar con la API externa. La información geográfica no cambia de un segundo a otro.

Implementamos un **almacén de caché en memoria con la estructura nativa `Map<string, Country[]>`**.

### ¿Por qué `Map` en lugar de un Objeto `{}` tradicional?
* **Rendimiento:** `Map` está optimizado por los motores V8 de JavaScript para inserciones y lecturas frecuentes por clave.
* **Cualquier tipo de clave:** No se limita a strings forzados.
* **Métodos limpios:** `.has(key)`, `.get(key)`, `.set(key, value)`, `.clear()`.

### 2.1. Implementación de Caché en `CountryService`
Actualizamos `src/app/country/services/country.service.ts`:

```typescript title="src/app/country/services/country.service.ts" hl_lines="14-16 23-28"
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Country } from '../interfaces/country.interface';
import { RESTCountry } from '../interfaces/rest-countries.interface';
import { CountryMapper } from '../mappers/country.mapper';

const API_URL = 'https://restcountries.com/v3.1';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private http = inject(HttpClient);

  // Almacenes de caché en memoria separados por endpoint
  private queryCacheCapital = new Map<string, Country[]>();
  private queryCacheCountry = new Map<string, Country[]>();
  private queryCacheRegion = new Map<string, Country[]>();

  // 1. Buscar por Capital con Caché
  searchByCapital(query: string): Observable<Country[]> {
    const term = query.trim().toLowerCase();
    if (!term) return of([]);

    // Verificación de caché: si ya lo consultamos antes, lo devolvemos en 0ms
    if (this.queryCacheCapital.has(term)) {
      console.log(`[Caché HIT]: Capital '${term}' recuperada de memoria`);
      return of(this.queryCacheCapital.get(term)!);
    }

    console.log(`[Caché MISS]: Consultando API de red para '${term}'`);
    return this.http.get<RESTCountry[]>(`${API_URL}/capital/${term}`).pipe(
      map(resp => CountryMapper.mapRestCountryArrayToCountryArray(resp)),
      // Guardamos la respuesta en el Map de caché
      tap(countries => this.queryCacheCapital.set(term, countries)),
      catchError(() => of([]))
    );
  }

  // 2. Buscar por País con Caché
  searchByCountry(query: string): Observable<Country[]> {
    const term = query.trim().toLowerCase();
    if (!term) return of([]);

    if (this.queryCacheCountry.has(term)) {
      return of(this.queryCacheCountry.get(term)!);
    }

    return this.http.get<RESTCountry[]>(`${API_URL}/name/${term}`).pipe(
      map(resp => CountryMapper.mapRestCountryArrayToCountryArray(resp)),
      tap(countries => this.queryCacheCountry.set(term, countries)),
      catchError(() => of([]))
    );
  }

  // 3. Buscar por Región con Caché
  searchByRegion(region: string): Observable<Country[]> {
    const term = region.trim().toLowerCase();
    if (!term) return of([]);

    if (this.queryCacheRegion.has(term)) {
      return of(this.queryCacheRegion.get(term)!);
    }

    return this.http.get<RESTCountry[]>(`${API_URL}/region/${term}`).pipe(
      map(resp => CountryMapper.mapRestCountryArrayToCountryArray(resp)),
      tap(countries => this.queryCacheRegion.set(term, countries)),
      catchError(() => of([]))
    );
  }
}
```

---

## 3. Búsqueda por Regiones Geográficas con Botones Activos

En la pantalla de búsqueda por región (`ByRegionPageComponent`), no se utiliza una caja de texto, sino un **conjunto cerrado de botones** para garantizar que el usuario solo elija regiones reconocidas por la API.

### 3.1. Tipado de Regiones
Definimos un tipo unión estricto:

```typescript
export type Region = 'Africa' | 'Americas' | 'Asia' | 'Europe' | 'Oceania' | 'Antarctic';
```

### 3.2. Implementación de `ByRegionPageComponent`
Creamos `src/app/country/pages/by-region-page/by-region-page.component.ts`:

```typescript title="src/app/country/pages/by-region-page/by-region-page.component.ts"
import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { CountryService } from '../../services/country.service';
import { CountryTableComponent } from '../../components/country-table/country-table.component';

export type Region = 'Africa' | 'Americas' | 'Asia' | 'Europe' | 'Oceania' | 'Antarctic';

@Component({
  selector: 'app-by-region-page',
  imports: [CountryTableComponent],
  templateUrl: './by-region-page.component.html',
})
export default class ByRegionPageComponent {
  private countryService = inject(CountryService);

  // Lista inmutable de regiones disponibles
  readonly regions: Region[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania', 'Antarctic'];

  // Región actualmente seleccionada
  selectedRegion = signal<Region | null>(null);

  // Recurso reactivo enlazado a selectedRegion
  countryResource = rxResource({
    request: () => ({ region: this.selectedRegion() }),
    loader: ({ request }) => {
      if (!request.region) return of([]);
      return this.countryService.searchByRegion(request.region);
    },
  });

  selectRegion(region: Region) {
    this.selectedRegion.set(region);
  }
}
```

```html title="src/app/country/pages/by-region-page/by-region-page.component.html"
<h1 class="text-3xl font-extrabold mb-2">Por Región</h1>
<p class="text-base-content/70 mb-6">Filtra países según su continente o región geográfica.</p>

<!-- Grupo de Botones de Región DaisyUI -->
<div class="flex flex-wrap gap-2 mb-8">
  @for (region of regions; track region) {
    <button
      type="button"
      class="btn btn-sm sm:btn-md"
      [class.btn-primary]="selectedRegion() === region"
      [class.btn-outline]="selectedRegion() !== region"
      (click)="selectRegion(region)">
      {{ region }}
    </button>
  }
</div>

@if (countryResource.isLoading()) {
  <div class="flex justify-center py-12">
    <span class="loading loading-spinner loading-lg text-primary"></span>
  </div>
} @else {
  <country-table [countries]="countryResource.value() ?? []" />
}
```

---

## 4. Persistencia en la URL mediante Query Parameters (`queryParams`)

Un fallo clásico de diseño en SPAs es que, al recargar la página (`F5`) o al pulsar el botón "Atrás" del navegador tras ver los detalles de un país, los resultados desaparecen y la pantalla vuelve a estar vacía.

Para resolverlo, **escribimos la consulta activa en la URL** (`/country/by-capital?query=madrid`) y leemos dicho parámetro cuando el componente inicializa.

!!! info "📖 Para saber más: Manual de Referencia"
    Para conocer a fondo la manipulación de Query Parameters y preservación de estado en el Router, consulta el **[Manual de Referencia: 11. Angular Router y Navegación](manual/11-router.md)**.

### 4.1. Integración en `ByCapitalPageComponent`
Actualizamos `src/app/country/pages/by-capital-page/by-capital-page.component.ts`:

```typescript title="src/app/country/pages/by-capital-page/by-capital-page.component.ts" hl_lines="15-18 24-29 38-42"
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { CountryService } from '../../services/country.service';
import { SearchInputComponent } from '../../components/search-input/search-input.component';
import { CountryTableComponent } from '../../components/country-table/country-table.component';

@Component({
  selector: 'app-by-capital-page',
  imports: [SearchInputComponent, CountryTableComponent],
  templateUrl: './by-capital-page.component.html',
})
export default class ByCapitalPageComponent implements OnInit {
  private countryService = inject(CountryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  query = signal<string>('');

  countryResource = rxResource({
    request: () => ({ query: this.query() }),
    loader: ({ request }) => {
      if (!request.query) return of([]);
      return this.countryService.searchByCapital(request.query);
    },
  });

  ngOnInit(): void {
    // Leemos el queryParam de la URL al cargar la página
    const urlQuery = this.route.snapshot.queryParamMap.get('query');
    if (urlQuery) {
      this.query.set(urlQuery);
    }
  }

  onSearch(newQuery: string) {
    this.query.set(newQuery);

    // Escribimos en la URL sin recargar la página
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { query: newQuery || null }, // Si está vacío, eliminamos el parámetro
      queryParamsHandling: 'merge',
    });
  }
}
```

```html title="src/app/country/pages/by-capital-page/by-capital-page.component.html"
<h1 class="text-3xl font-extrabold mb-2">Por Capital</h1>
<p class="text-base-content/70 mb-6">Encuentra países buscando por el nombre de su capital.</p>

<!-- Buscador con precarga de initialValue desde la señal query -->
<country-search-input 
  placeholder="Ej: Madrid, Tokyo, Bogotá..." 
  [initialValue]="query()"
  (value)="onSearch($event)" 
/>

@if (countryResource.isLoading()) {
  <div class="flex justify-center py-12">
    <span class="loading loading-spinner loading-lg text-primary"></span>
  </div>
} @else {
  <country-table [countries]="countryResource.value() ?? []" />
}
```

---

## 💡 Evolución Angular 22: Enlace Declarativo de Query Params y Estado

!!! tip "1. QueryParams directos con `input()` y `withComponentInputBinding()`"
    En Angular 19/22, la combinación de `withComponentInputBinding()` en `provideRouter()` permite que los Query Parameters de la URL se asignen **directamente a un Signal Input** del componente:
    ```typescript
    // En Angular 22:
    export default class ByCapitalPageComponent {
      // Si la URL es /by-capital?query=berlin, queryInput() valdrá automáticamente 'berlin'
      queryInput = input<string>('', { alias: 'query' });
    }
    ```
    Esto elimina la necesidad de suscribirse a `ActivatedRoute.queryParamMap` en `ngOnInit`.

!!! tip "2. Preservación Nativa del Historial con Navigation API"
    Angular 22 se sincroniza con la **Navigation API nativa de los navegadores modernos**, garantizando que el estado de scroll, la pila de páginas y las señales computadas se restauren con fidelidad al pulsar el botón de retroceso del navegador, sin provocar peticiones redundantes.

---

## 📝 Evaluación y Preguntas para el Aula

??? question "¿Por qué el operador `debounceTime(350)` es fundamental en aplicaciones que consultan APIs de terceros?"
    **Respuesta:** Evita el **agotamiento de cuotas de API (*rate limiting*) y el bloqueo por denegación de servicio accidental**. Si un usuario escribe una palabra de 8 letras en 1 segundo, sin debounce se enviarían 8 peticiones HTTP al servidor. Con debounce, se envía exactamente 1 petición cuando el usuario termina de escribir.

??? question "¿Qué diferencia existe entre almacenar la caché en un servicio Singleton frente a almacenarla en la variable de un componente?"
    **Respuesta:** El ciclo de vida. Un componente se destruye cada vez que el usuario navega a otra ruta, perdiéndose todas sus variables en memoria. Un **Servicio Singleton (`providedIn: 'root'` o `@Service()`)** permanece vivo en memoria durante toda la sesión de la SPA, permitiendo que la caché persista intacta al cambiar de pantalla.

??? question "¿Por qué es una buena práctica reflejar los filtros de búsqueda en la URL mediante `queryParams`?"
    **Respuesta:** Porque convierte a la URL en la **fuente de la verdad compartible**. Permite que un usuario copie el enlace y se lo envíe a un colega (quien verá exactamente los mismos resultados), y hace que los botones "Atrás" y "Adelante" del navegador funcionen como el usuario espera de forma intuitiva.

---

## 📚 Material de Referencia y Profundización

* [Manual de Referencia: 05. Signals y Reactividad (`effect`, `linkedSignal`)](manual/05-signals.md)
* [Manual de Referencia: 09. Servicios e Inyección de Dependencias (Caché en Servicios)](manual/09-servicios.md)
* [Manual de Referencia: 10. Cliente HTTP y Comunicación con APIs (Operadores RxJS)](manual/10-http.md)
* [Manual de Referencia: 11. Angular Router y Navegación (QueryParams y State)](manual/11-router.md)
* [MDN: JavaScript Map vs Object](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Map)
