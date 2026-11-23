---
icon: lucide/cloud-download
title: 07. GifsApp - Servicios y HTTP
---

# Sección 07: GifsApp — Servicios, HTTP, Mappers y Persistencia

En esta sección conectamos nuestra aplicación con una API del mundo real: **Giphy API**. Aprenderemos a realizar peticiones asíncronas con **`HttpClient`** (integrado de serie en Angular 22) y cuándo configurar **`provideHttpClient()`**, modelar respuestas JSON complejas mediante **QuickType**, implementar el **Patrón Mapper** para blindar nuestra aplicación frente a cambios en APIs externas, construir un **Buscador con Caché en Memoria**, enlazar **Parámetros Dinámicos de URL** con **`toSignal()`**, y persistir el historial en **`LocalStorage`** usando **`effect()`**.

---

## 📋 Ficha Técnica y Objetivos Didácticos

* **Proyecto:** `gifs-app` (Continuación e integración de servicios).
* **API Externa:** Giphy Developers API (Endpoints: `/trending` y `/search`).
* **Patrones Arquitectónicos:** Patrón Mapper, Separación de Interfaces de Dominio vs API, Caché de Búsqueda en Servicio Singleton, Interoperabilidad RxJS ↔ Signals con `toSignal()`.
* **Código Fuente de Referencia:** [GitHub - DevTalles GifsApp (fin-seccion-07)](https://github.com/DevTalles-corp/angular-gif-app/tree/fin-seccion-07)

``` mermaid
flowchart TD
    subgraph CapaAPI ["Fase 1 · Capa Externa y Comunicación HTTP"]
        API["<b>Giphy Developers API</b><br/>Endpoints REST oficiales: /trending y /search"] --> HTTP["<b>HttpClient (Fetch API por defecto)</b><br/>Peticiones asíncronas disponibles globalmente"]
    end

    subgraph CapaDominio ["Fase 2 · Transformación y Estado Centralizado (GifService)"]
        Mapper["<b>Patrón Mapper (GifMapper)</b><br/>Transformación pura de DTOs pesados a modelos de dominio"] --> State["<b>Estado Reactivo (Signals)</b><br/>trendingGifs y searchHistory con persistencia vía effect()"]
    end

    subgraph CapaUI ["Fase 3 · Capa de Presentación e Interacción"]
        Trending["<b>TrendingPageComponent</b><br/>Grid reactivo de gifs en tendencia"] --> Side["<b>SideMenuComponent</b><br/>Historial interactivo sincronizado en tiempo real"]
    end

    CapaAPI ==> CapaDominio ==> CapaUI
```

---

## Continuación del Proyecto y Preparación del Entorno

Al iniciar esta sección, retomamos la aplicación **GifsApp** desarrollada en la unidad anterior.  
Para asegurar que todo el alumnado parte de una base idéntica y libre de inconsistencias:

* **Continuación sobre el proyecto local:** Si vienes de completar la sección anterior, puedes continuar directamente en tu directorio de trabajo.
* **Continuación desde el repositorio de referencia:** Si deseas iniciar con una copia limpia y verificada por el instructor, puedes clonar o descargar la rama oficial:
  [GitHub - DevTalles GifsApp (fin-seccion-06)](https://github.com/DevTalles-corp/angular-gif-app/tree/fin-seccion-06).

### 1. Verificación de Dependencias y Servidor de Desarrollo

Si has clonado o descargado el proyecto, el directorio `node_modules` no estará incluido. Ejecuta la instalación limpia de dependencias:

```bash
npm install
```

Esto instalará todos los paquetes del core de Angular, el compilador PostCSS, Tailwind CSS v4 y las fuentes de FontAwesome 6. A continuación, inicia el servidor de desarrollo:

```bash
ng serve
```

Abre `http://localhost:4200/dashboard` en tu navegador y comprueba que la aplicación compila y responde con normalidad.

---

### 2. Inventario del Estado Arquitectónico Inicial

Antes de escribir nuevo código, repasemos las piezas clave construidas hasta el momento:

``` mermaid
flowchart TD
    Shell["<b>DashboardPageComponent</b><br/>Cascarón de 12 líneas"] --> SideMenu["<b>SideMenuComponent</b><br/>SideMenuHeader + SideMenuOptions"]
    Shell --> Content["<b>Área Principal (ml-[220px])</b><br/>&lt;router-outlet /&gt;"]
    
    Content -->|"URL: /dashboard/trending"| Trending["<b>TrendingPageComponent</b><br/>&lt;gif-list [gifs]=&quot;gifs()&quot; /&gt;"]
    Trending --> List["<b>GifListComponent</b><br/>Rejilla responsive de 3 columnas"]
    List --> Item["<b>GifListItemComponent</b><br/>12 imágenes mock fijas de Flowbite"]
```

* **El Cascarón (*Layout Shell*):** `DashboardPageComponent` actúa como contenedor principal, orquestando el menú lateral modular y el área de contenido con margen compensatorio (`ml-[220px]`).
* **Enrutamiento Anidado:** El archivo `app.routes.ts` define las rutas hijas `/dashboard/trending` y `/dashboard/search`.
* **Galería Estática con Signal Inputs:** `TrendingPageComponent` custodia una señal `gifs = signal(imageUrls)` con 12 URLs cuadradas de prueba de Flowbite, inyectadas a través de `GifListComponent` y `GifListItemComponent` mediante `input.required()`.
* **Path Aliases y Entornos:** `@environments/*`, `@gifs/*` y `@shared/*` configurados en `tsconfig.json`.

### El Reto de esta Unidad: De Datos Mock a Datos Reales
En las aplicaciones del mundo real, los datos no residen en arrays estáticos dentro de los componentes. El objetivo de esta sección es **sustituir el mock de Flowbite por peticiones asíncronas en vivo a la API oficial de Giphy**, centralizando la red y el estado en un **Servicio Singleton (`GifService`)** para que los componentes de la interfaz continúen siendo 100% tontos y reutilizables (*Dumb Components*).

---

## Integración con Giphy Developers API y Exploración REST

Para consumir imágenes animadas en vivo, nos conectaremos con **Giphy**, la mayor plataforma de GIFs del mundo, a través de su API pública para desarrolladores.

### 1. Obtención de la API Key en el Portal de Desarrolladores

1. Accede al portal oficial: [developers.giphy.com](https://developers.giphy.com/).
2. Inicia sesión con tu cuenta de Giphy o crea una cuenta nueva gratuita.
3. En el panel de control (*Dashboard*), pulsa en el botón **Create an App**.
4. **Selección Crucial: API frente a SDK:**  
   Giphy ofrece dos modalidades de integración:
    * **SDK:** Librerías prefabricadas de Giphy (con componentes UI cerrados y dependencias pesadas).
    * **API (Opción que debemos seleccionar):** Acceso directo a los endpoints REST estándar mediante HTTP. En Angular seleccionamos **API** porque utilizaremos el cliente HTTP nativo del framework (`HttpClient`), manteniendo un control absoluto sobre el ciclo de vida, el tipado y el empaquetado final de nuestra aplicación.
5. Asigna un nombre a tu aplicación (por ejemplo `Angular-GifsApp`), añade una descripción breve, acepta los términos del servicio y pulsa en **Create App**.
6. Copia tu **API Key** personal generada en pantalla.

---

### 2. Configuración Segura de Variables de Entorno

Una API Key es una credencial que identifica y autoriza a tu aplicación frente a los límites de consumo del proveedor. Siguiendo las mejores prácticas de arquitectura, nunca debemos cablear (*hardcode*) credenciales directamente en los componentes ni en las llamadas HTTP.

Actualizamos nuestros archivos de entorno en `src/environments/`:

=== "src/environments/environment.development.ts (Desarrollo)"
    ```typescript title="src/environments/environment.development.ts" hl_lines="8-10"
    export const environment = {
      production: false,
      companyName: 'Gifs',
      companyName2: 'App',
      companySlogan: 'Maneja tus gifs',

      // Giphy API Configuration
      // https://developers.giphy.com/dashboard/
      giphyApiKey: 'TU_API_KEY_DE_GIPHY',
      giphyUrl: 'https://api.giphy.com/v1',
    };
    ```

=== "src/environments/environment.ts (Producción)"
    ```typescript title="src/environments/environment.ts" hl_lines="8-10"
    export const environment = {
      production: true,
      companyName: 'Gifs',
      companyName2: 'App',
      companySlogan: 'Maneja tus gifs',

      // Giphy API Configuration
      // https://developers.giphy.com/dashboard/
      giphyApiKey: 'TU_API_KEY_DE_GIPHY',
      giphyUrl: 'https://api.giphy.com/v1',
    };
    ```

---

### 3. Exploración de Endpoints y Anatomía del Payload JSON

Antes de escribir código en Angular, es una práctica profesional indispensable **inspeccionar la respuesta real de la API** abriendo la URL en el navegador o utilizando un cliente HTTP (Thunder Client, Postman o curl).

#### Endpoint de Tendencias (Trending)
Devuelve los GIFs más populares del momento:
```http
GET https://api.giphy.com/v1/gifs/trending?api_key=TU_API_KEY&limit=20
```

#### Endpoint de Búsqueda (Search)
Permite realizar búsquedas por término o palabra clave:
```http
GET https://api.giphy.com/v1/gifs/search?api_key=TU_API_KEY&q=goku&limit=20
```

#### Anatomía de la Respuesta JSON Cruda
Al ejecutar la petición en el navegador, observamos la siguiente estructura raíz:

```json
{
  "data": [
    {
      "type": "gif",
      "id": "xT4uQulxzUGnHGL63m",
      "url": "https://giphy.com/gifs/...",
      "title": "Happy Dance GIF",
      "rating": "g",
      "images": {
        "original": {
          "url": "https://media.giphy.com/media/.../giphy.gif",
          "width": "480",
          "height": "270"
        },
        "fixed_height": { ... },
        "fixed_width": { ... }
      }
      // ... más de 40 propiedades adicionales por cada elemento
    }
  ],
  "pagination": {
    "total_count": 52340,
    "count": 20,
    "offset": 0
  },
  "meta": {
    "status": 200,
    "msg": "OK",
    "response_id": "3x8f9a2b..."
  }
}
```

!!! warning "El Reto del Payload Pesado: ¿Por qué no usar el JSON directo?"
    Cada elemento individual del array `data` contiene **más de 50 propiedades** (dimensiones en webp, mp4, gifs fijos, datos de analytics, autor, flags).
    
    Si consumiéramos este objeto tal cual en nuestros componentes:
    
    1. Acoplaríamos nuestra interfaz a los nombres de campos de Giphy.
    2. Sobrecargaríamos la memoria del navegador reteniendo datos que nunca mostraremos.
    3. Si Giphy cambia su estructura, se romperían todas nuestras plantillas.
    
    Por ello, en las siguientes lecciones modelaremos esta respuesta con **QuickType** y construiremos un **Mapper** que la filtre a un modelo limpio de solo 3 propiedades (`id`, `title`, `url`).

---

## Creación y Rol Arquitectónico del Servicio Singleton (`GifService`)

En el patrón de arquitectura de Angular, **los componentes nunca deben realizar llamadas HTTP directamente**.  
La regla de **Separación de Responsabilidades (SoC)** dicta que:

* La **UI (Componentes)** es "tonta": solo recibe datos ya procesados y emite eventos de usuario.
* La **Capa de Servicios**: es "ciega" respecto a cómo se pintan los datos, pero es la encargada de consultar la API externa, mapear los resultados y custodiar el estado reactivo centralizado (*Single Source of Truth*).

### 1. Generación del Servicio con Angular CLI

Generamos el servicio dentro de la carpeta `services` del dominio `gifs`:

```bash
ng g s gifs/services/gifs
```

Este comando genera:

* `src/app/gifs/services/gifs.service.ts`: La clase del servicio inyectable.
* `src/app/gifs/services/gifs.service.spec.ts`: Archivo de pruebas unitarias.

---

### 2. Esqueleto Inicial del Servicio

El servicio se crea decorado con `@Service()` (introducido en Angular 22 como sustituto moderno de `@Injectable({ providedIn: 'root' })`), lo que indica a Angular que existirá **una única instancia compartida (*Singleton*)** en toda la aplicación:

```typescript title="src/app/gifs/services/gifs.service.ts (Esqueleto Inicial)"
import { Service, signal } from '@angular/core';

@Service()
export class GifService {
  // Estado reactivo: lista de gifs y bandera de carga
  trendingGifs = signal<any[]>([]);
  trendingGifsLoading = signal(true);

  constructor() {
    console.log('GifService inicializado');
  }
}
```

En las siguientes fases conectaremos `HttpClient` y tiparemos `trendingGifs` con nuestro modelo de dominio `Gif[]`.

---

## Configuración del Cliente HTTP en Angular 22: `HttpClient` y `provideHttpClient()`

!!! info "📖 Para saber más: Manual de Referencia"
    Para dominar `provideHttpClient()`, configuración de interceptores funcionales y manejo de errores HTTP, consulta el **[Manual de Referencia: 10. Cliente HTTP y Comunicación con APIs](manual/10-http.md)**.

A partir de **Angular 21 y consolidado en Angular 22**, **`HttpClient` viene provisto automáticamente en `root`** (de forma *tree-shakeable*) y utiliza la **Fetch API** nativa como backend por defecto (por lo que `withFetch()` ya no es necesario).

Esto significa que, para realizar peticiones HTTP básicas en `GifService`, **ya no necesitas modificar `src/app/app.config.ts`**: puedes inyectar `HttpClient` directamente con `inject(HttpClient)`.

El archivo `src/app/app.config.ts` generado por Angular 22 (modo *zoneless* por defecto, sin `provideZoneChangeDetection`) queda así:

```typescript title="src/app/app.config.ts"
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
  ],
};
```

!!! note "¿Cuándo sí debemos añadir `provideHttpClient()` en `app.config.ts`?"
    * **Si vas a añadir características opcionales**, como interceptores funcionales (`provideHttpClient(withInterceptors([...]))`) o soporte de progreso de subida mediante XHR (`provideHttpClient(withXhr())`).
    * **Si trabajas con versiones anteriores (Angular 17–20)**, donde aún era obligatorio registrar `provideHttpClient()` manualmente en `providers` (reemplazando al antiguo `HttpClientModule`, ya en desuso).

---

## Modelos, DTOs y el Patrón Mapper (Capa Anticorrupción)

!!! info "📖 Para saber más: Manual de Referencia"
    Para estudiar los principios de diseño de servicios y la separación de contratos de datos, consulta el **[Manual de Referencia: 09. Servicios e Inyección de Dependencias](manual/09-servicios.md)**.

Al consumir APIs de terceros, uno de los errores más comunes en frontend es utilizar los objetos devueltos por el backend directamente en las plantillas y componentes.

La respuesta de Giphy para cada gif contiene **más de 50 propiedades** (múltiples dimensiones en formatos mp4, webp, información analítica, flags de moderación, datos de usuario, etc.). Si inyectamos este objeto tal cual en nuestra aplicación:

1. **Acoplamiento Fuerte:** Si Giphy altera mañana el nombre de una propiedad o reorganiza sus nodos, tendríamos que buscar y modificar decenas de componentes `.html` y `.ts`.
2. **Consumo Innecesario de Memoria:** Retenemos cientos de campos pesados que la UI jamás llegará a pintar.
3. **Pérdida de Legibilidad:** Trabajar con rutas kilométricas como `item.images.original.url` ensucia las plantillas y propicia errores tipográficos.

Para resolver esto, implementamos una **Capa Anticorrupción (*Anti-Corruption Layer - ACL*)** mediante la separación estricta entre **DTOs** y **Modelos de Dominio**, articulada por el **Patrón Mapper**:

``` mermaid
flowchart LR
    API["<b>API de Giphy</b><br/>Payload JSON Pesado"] --> DTO["<b>DTO Externo (GiphyItem)</b><br/>>50 campos volátiles"]
    DTO --> Mapper["<b>GifMapper</b><br/>Función pura estática (ACL)"]
    Mapper --> Domain["<b>Modelo de Dominio (Gif)</b><br/>3 campos limpios (id, title, url)"]
    Domain --> UI["<b>Componentes de UI</b><br/>Trending, Search, List"]
```

---

### 1. Tipado Automático de la Respuesta de la API con QuickType

Para tipar el contrato externo que recibimos del servidor, no escribimos las interfaces manualmente campo por campo. Utilizamos la herramienta [quicktype.io](https://quicktype.io/) o la extensión de VS Code **Paste JSON as Code** (`quicktype.quicktype`):

1. Realiza una petición de prueba a Giphy en el navegador (`/gifs/trending?api_key=...&limit=20`) y copia el JSON completo devuelto.
2. En Visual Studio Code, crea el archivo `src/app/gifs/interfaces/giphy.interfaces.ts`.
3. Abre la paleta de comandos con ++ctrl+shift+p++ (o ++cmd+shift+p++ en macOS), selecciona **Paste JSON as Code** y escribe como nombre de interfaz superior: `GiphyResponse`.
4. **Renombrado semántico (`Datum` → `GiphyItem`):** Al generar el código automáticamente, QuickType tipa el campo `data` como `Datum[]` (y crea `export interface Datum`). Para que el código sea más descriptivo, sitúa el cursor sobre `Datum`, pulsa ++f2++ (*Rename Symbol*) y renómbralo a `GiphyItem` (así se actualizarán todas sus referencias a `GiphyItem[]` y `export interface GiphyItem`).

El archivo `src/app/gifs/interfaces/giphy.interfaces.ts` tipa exhaustivamente la estructura del DTO externo:

```typescript title="src/app/gifs/interfaces/giphy.interfaces.ts"
export interface GiphyResponse {
  data:       GiphyItem[];
  meta:       Meta;
  pagination: Pagination;
}

export interface GiphyItem {
  type:                       string;
  id:                         string;
  url:                        string;
  slug:                       string;
  bitly_gif_url:              string;
  bitly_url:                  string;
  embed_url:                  string;
  username:                   string;
  source:                     string;
  title:                      string;
  rating:                     string;
  images:                     Images;
}

export interface Images {
  original: ImageProperties;
  fixed_height?: ImageProperties;
  fixed_width?: ImageProperties;
}

export interface ImageProperties {
  height:    string;
  width:     string;
  size:      string;
  url:       string;
}

export interface Meta {
  status:      number;
  msg:         string;
  response_id: string;
}

export interface Pagination {
  total_count: number;
  count:       number;
  offset:      number;
}
```

---

### 2. Modelo de Dominio Interno: `src/app/gifs/interfaces/gif.interface.ts`

Definimos la entidad limpia que representará a un GIF en toda nuestra aplicación. Este es el **único contrato** que conocerán nuestros componentes:

```typescript title="src/app/gifs/interfaces/gif.interface.ts"
export interface Gif {
  id: string;
  title: string;
  url: string;
}
```

---

### 3. El Mapper: `src/app/gifs/mapper/gif.mapper.ts`

Un **Mapper** es una pieza intermedia que actúa como traductor entre dos formatos de datos: toma la respuesta compleja que llega desde la API externa (`GiphyItem`) y la convierte en el modelo limpio que necesita nuestra aplicación (`Gif`).

**¿Por qué se usa en lugar de pasar los datos de Giphy directamente?**

* **Desacoplamiento ante cambios de la API:** Si mañana Giphy cambia la estructura de su JSON (por ejemplo, la ruta `item.images.original.url`) o decidimos cambiar a otro proveedor de GIFs, solo tendremos que adaptar `GifMapper` sin modificar ni un solo componente.
* **Limpieza y ahorro de memoria:** Evitamos propagar por toda la aplicación objetos gigantes con más de 50 propiedades que la interfaz no utiliza.
* **Reutilización centralizada:** Tanto la carga de tendencias (*trending*) como el buscador (*search*) devolverán exactamente el mismo tipo `Gif[]`, usando este único punto de conversión.

Creamos la clase utilitaria `GifMapper` con dos métodos puros: `mapGiphyItemToGif` (transforma un único elemento) y `mapGiphyItemsToGifArray` (aplica esa transformación a todo el array mediante `.map()`):

```typescript title="src/app/gifs/mapper/gif.mapper.ts"
import { Gif } from '../interfaces/gif.interface';
import { GiphyItem } from '../interfaces/giphy.interfaces';

export class GifMapper {
  // Transforma un único DTO de Giphy a nuestro modelo limpio Gif
  static mapGiphyItemToGif(item: GiphyItem): Gif {
    return {
      id: item.id,
      title: item.title,
      url: item.images.original.url,
    };
  }

  // Transforma una colección completa aplicando map funcional
  static mapGiphyItemsToGifArray(items: GiphyItem[]): Gif[] {
    return items.map(this.mapGiphyItemToGif);
  }
}
```

!!! note "¿Qué hace `.map()` y por qué se llama así?"
    * **¿Qué hace?** `items.map(...)` es el método nativo de los arrays en JavaScript/TypeScript que recorre cada elemento del array original (`GiphyItem[]`), le aplica la función transformadora (`this.mapGiphyItemToGif`) y **construye un nuevo array** con los resultados (`Gif[]`) **sin modificar el original** (misma cantidad de elementos, distinta forma).
    * **¿Por qué se llama `map` (y *Mapper*)?** El término proviene de las matemáticas (*mapping* = **correspondencia o proyección**): a cada elemento de un conjunto de origen (`GiphyItem`) le corresponde exactamente un elemento transformado en el conjunto de destino (`Gif`). Por esa misma razón, a la clase encargada de proyectar un modelo en otro se le llama **Mapper**.

!!! tip "¿Por qué métodos `static` en el Mapper?"
    `GifMapper` no mantiene estado ni interactúa con la red; es una caja de transformación determinista: ante un mismo `GiphyItem`, siempre devuelve el mismo `Gif`. Al declarar sus métodos como `static`, podemos consumirlo directamente como `GifMapper.mapGiphyItemsToGifArray(...)` sin necesidad de instanciarlo con `new` ni inyectarlo mediante DI.

---

## Carga de Tendencias con `HttpClient`: Petición HTTP GET

Ahora que contamos con los contratos tipados y el mapper, volvemos a `src/app/gifs/services/gifs.service.ts` para implementar la carga de tendencias paso a paso.

Para no mezclar demasiados conceptos a la vez, vamos a dividir la llamada HTTP en **tres fases**:

### 1. Fase 1: Inyectar `HttpClient` y definir la petición `http.get()`

En primer lugar, inyectamos `HttpClient` con `inject(HttpClient)` y declaramos las señales de estado (`trendingGifs` y `trendingGifsLoading`). Después, dentro de `loadTrendingGifs()`, preparamos la petición `GET` hacia el endpoint `/gifs/trending`:

```typescript title="Fase 1: Preparar la petición (sin suscripción aún)" hl_lines="2 8-12"
export class GifService {
  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal(true);

  loadTrendingGifs() {
    this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: 20,
      },
    });
  }
}
```

* **`<GiphyResponse>` (Tipado genérico):** indica a TypeScript la estructura exacta del JSON que devolverá Giphy, habilitando el autocompletado en `resp.data`.
* **`params` (Query Parameters seguros):** en lugar de concatenar texto en la URL (`?api_key=...&limit=20`), `HttpClient` construye y codifica los parámetros automáticamente de forma segura.

!!! warning "En este punto la petición todavía NO se envía: ¿qué es un `Observable`?"
    `this.http.get(...)` no devuelve los GIFs directamente ni una `Promise`, sino un **`Observable`** (una pieza de la librería **RxJS** incluida en Angular para trabajar con flujos de datos asíncronos a lo largo del tiempo).

    Para entenderlo sin rodeos en este punto:

    * **Un `Observable` es un flujo de datos potencial:** piensa en él como una **receta de cocina** o una **suscripción a un canal**; describe *cómo* obtener o emitir datos en el futuro (en este caso, la respuesta HTTP cuando llegue del servidor), pero por sí solo no ejecuta nada.
    * **Es un *Cold Observable* (Observable frío):** en `HttpClient`, la petición de red **no arranca al llamar a `this.http.get(...)`**. Permanece en espera hasta que alguien se **suscriba** a él con `.subscribe(...)` (Fase 2).
    * **Diferencia clave con una `Promise`:** una promesa de JavaScript se dispara en cuanto se crea; un `Observable` frío solo se activa cuando hay un suscriptor escuchando (y permite además transformar o cancelar la operación antes de recibir el resultado).

    > 📖 **Para profundizar:** si quieres ver la teoría completa sobre RxJS, la diferencia entre *Cold* y *Hot Observables*, operadores y gestión de suscripciones, consulta el **[Manual de Referencia: 10. Cliente HTTP y Observables (RxJS)](manual/10-http.md#seccion-2-observables-rxjs)**.
    >
    > 🎥 **Recurso audiovisual recomendado:** [Explicación visual completa sobre Observables y RxJS en YouTube](https://www.youtube.com/watch?v=BOouK6J8pqg).

---

### 2. Fase 2: Disparar la petición con `.subscribe()`

Para que Angular ejecute realmente la llamada HTTP por la red y nos entregue la respuesta cuando llegue del servidor, encadenamos `.subscribe(...)` al `http.get(...)` y llamamos a `this.loadTrendingGifs()` desde el `constructor()`:

```typescript title="Fase 2: Activar la petición con .subscribe()" hl_lines="1-3 12-14"
  constructor() {
    this.loadTrendingGifs();
  }

  loadTrendingGifs() {
    this.http
      .get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
        params: {
          api_key: environment.giphyApiKey,
          limit: 20,
        },
      })
      .subscribe((resp) => {
        console.log({ resp }); // Aquí llega el GiphyResponse completo desde la API
      });
  }
```

* **El `constructor()`** se ejecuta una sola vez cuando Angular instancia el servicio *Singleton*, lanzando la carga inicial de tendencias.
* **`.subscribe((resp) => { ... })`** es el disparador de la petición HTTP. La función flecha interior se ejecutará de forma asíncrona en el momento en que Giphy responda.

---

### 3. Fase 3: Transformar con `GifMapper` y actualizar las señales

Una vez recibimos `resp` dentro de `.subscribe()`, convertimos el array pesado de Giphy (`resp.data`) al modelo limpio de nuestra app usando `GifMapper` y actualizamos nuestras señales reactivas:

```typescript title="Fase 3: Mapear datos y actualizar el estado" hl_lines="2-5"
      .subscribe((resp) => {
        const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
        this.trendingGifs.set(gifs);
        this.trendingGifsLoading.set(false);
        console.log({ gifs });
      });
```

1. **Transformación (`GifMapper`):** extrae únicamente `id`, `title` y `url` de cada elemento de `resp.data`.
2. **Actualizar datos (`this.trendingGifs.set(gifs)`):** guarda el nuevo `Gif[]` en la señal para que cualquier componente conectado se actualice automáticamente.
3. **Finalizar carga (`this.trendingGifsLoading.set(false)`):** apaga el indicador de carga.

---

### 4. Código Completo de `GifService` (Tendencias)

Uniendo las tres fases, el archivo completo `src/app/gifs/services/gifs.service.ts` queda así:

```typescript title="src/app/gifs/services/gifs.service.ts (Fase 1: Tendencias)" hl_lines="1 3-6 10 13-14 16-18 20-34"
import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';

@Service()
export class GifService {
  private http = inject(HttpClient);

  // Señales de estado: lista tipada y bandera de carga
  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal(true);

  constructor() {
    this.loadTrendingGifs();
  }

  loadTrendingGifs() {
    this.http
      .get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
        params: {
          api_key: environment.giphyApiKey,
          limit: 20,
        },
      })
      .subscribe((resp) => {
        const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
        this.trendingGifs.set(gifs);
        this.trendingGifsLoading.set(false);
        console.log({ gifs });
      });
  }
}
```

---

### 5. Verificación en el Navegador (DevTools)

Al guardar los cambios y abrir `http://localhost:4200/dashboard`:

1. Abre las **Herramientas de Desarrollador** de tu navegador (++f12++).
2. En la pestaña **Network (Red)**, filtra por `Fetch/XHR`:
    * Observarás una petición saliente a `https://api.giphy.com/v1/gifs/trending?api_key=...&limit=20` con código de estado **200 OK**.
3. En la pestaña **Console (Consola)**, verás la salida estructurada de `console.log({ gifs })`:
    * Un array de 20 objetos limpios con únicamente las propiedades `id`, `title` y `url`.

---

!!! tip "💡 Evolución Angular 22: `@Service()` y Reactividad Asíncrona con `rxResource()`"
    En Angular 22, el CLI genera los servicios directamente con **`@Service()`** (reemplazando al clásico `@Injectable({ providedIn: 'root' })` de Angular 19–21 de forma autónoma y *tree-shakeable*).
    
    Además, si quieres evitar la suscripción manual con `.subscribe()` y las señales separadas `trendingGifs` / `trendingGifsLoading`, puedes emplear **`rxResource()`**:
    
    * **¿Cómo funciona su lógica?** `rxResource()` envuelve un `Observable` (devuelto por la función `loader`) y **se suscribe automáticamente por ti** en cuanto se crea el servicio, gestionando también la cancelación y limpieza de suscripciones.
    * **Señales automáticas integradas:** expone directamente `trendingResource.value()` (los datos), `trendingResource.isLoading()` (estado de carga), `trendingResource.error()` (errores) y `trendingResource.reload()` (recarga manual).
    
    ```typescript
    // Alternativa Angular 22 con @Service() y rxResource():
    import { inject, Service } from '@angular/core';
    import { rxResource } from '@angular/core/rxjs-interop';
    import { HttpClient } from '@angular/common/http';
    import { environment } from '@environments/environment';
    import { map } from 'rxjs';
    import type { GiphyResponse } from '../interfaces/giphy.interfaces';
    import { GifMapper } from '../mapper/gif.mapper';

    @Service()
    export class GifService {
      private http = inject(HttpClient);

      // Recurso reactivo asíncrono: carga automática y señales integradas
      readonly trendingResource = rxResource({
        loader: () => this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
          params: { api_key: environment.giphyApiKey, limit: 20 }
        }).pipe(
          map(resp => GifMapper.mapGiphyItemsToGifArray(resp.data))
        )
      });

      // Acceso directo en la plantilla o componentes:
      // trendingResource.value()      -> Array de Gif[] cargado (o undefined mientras carga)
      // trendingResource.isLoading()  -> Booleano automático de carga
      // trendingResource.error()      -> Información del error si falla la petición
    }
    ```
    *Conclusión didáctica:* Ambas formas son plenamente funcionales. Aprender primero el `.subscribe()` permite entender el flujo HTTP nativo, mientras que `rxResource()` muestra el enfoque declarativo moderno de Angular 22.

    **📚 Dónde se explica en profundidad en este curso:**
    
    * **[Manual de Referencia: 05. Signals y Reactividad (`resource()` y `rxResource()`)](manual/05-signals.md#resource-y-rxresource-reactividad-asincrona-con-signals)** — Fundamentos, diagrama de flujo y ciclo de vida completo.
    * **[Manual de Referencia: 10. Cliente HTTP (`rxResource()` para integración con RxJS)](manual/10-http.md#52-rxresource-para-integracion-con-rxjs)** — Uso con `request` reactivo y comparativa frente a `HttpClient + toSignal`.
    * **[Guía de Clase 10: CountryApp (`resource()` y `rxResource()`)](10-country-funcionalidad.md#3-la-revolucion-asincrona-resource-y-rxresource)** — Implementación práctica paso a paso en un proyecto real.

---

## Consumo Real de Tendencias y Actualización de Contratos

Tras haber configurado el cliente HTTP y la llamada hacia el endpoint `/trending` en `GifService`, el siguiente paso consiste en sustituir las imágenes estáticas (*mock data*) de la galería por las animaciones vivas devueltas por la API de Giphy.

Sin embargo, al conectar directamente los datos del servicio con la capa de presentación, surge un conflicto de tipos en el contrato de componentes.

### 1. Diagnóstico del Error de Tipado en `GifListComponent`

En el diseño inicial de la aplicación (cuando trabajábamos con datos de prueba), definimos la entrada de `GifListComponent` como una colección de cadenas simples de texto:

```typescript
// Contrato inicial (basado en URLs de texto plano):
gifs = input.required<string[]>();
```

Ahora, la señal reactiva expuesta por `GifService` no emite URLs crudas, sino una lista tipada con nuestro modelo de dominio:

```typescript
trendingGifs = signal<Gif[]>([]);
```

Si intentamos pasar `gifService.trendingGifs()` directamente a la propiedad `[gifs]` de `GifListComponent`, el compilador estricto de TypeScript detiene la compilación inmediatamente con un error de incompatibilidad de tipos:

```text
Type 'Gif[]' is not assignable to type 'string[]'.
  Type 'Gif' is not assignable to type 'string'.
```

### 2. Refactorización del Contrato: `GifListComponent`

Para resolver la incompatibilidad y mantener la coherencia arquitectónica, actualizamos el contrato de entrada para que trabaje formalmente con la interfaz de dominio `Gif`:

```typescript title="src/app/gifs/components/gif-list/gif-list.component.ts" hl_lines="3 11"
import { Component, input } from '@angular/core';
import { GifListItemComponent } from './gif-list-item/gif-list-item.component';
import { Gif } from '../../interfaces/gif.interface';

@Component({
  selector: 'gif-list',
  imports: [GifListItemComponent],
  templateUrl: './gif-list.component.html',
})
export class GifListComponent {
  gifs = input.required<Gif[]>();
}
```

En la plantilla HTML de `GifListComponent`, iteramos sobre la lista de objetos `Gif`. Como el modelo de dominio expone la propiedad `url` limpia (transformada previamente por el `GifMapper`), la enlazamos hacia la entrada `[imageUrl]` del componente hijo `GifListItemComponent`:

```html title="src/app/gifs/components/gif-list/gif-list.component.html" hl_lines="2-3"
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
  @for (gif of gifs(); track gif.id) {
    <gif-list-item [imageUrl]="gif.url" />
  }
</div>
```

!!! note "Optimización del seguimiento (`track gif.id`)"
    Al iterar sobre colecciones reactivas en la directiva `@for`, utilizar un identificador único e inmutable como `gif.id` optimiza la reconciliación del DOM virtual de Angular, evitando renderizados innecesarios cuando la lista se actualiza.

### 3. Ajuste de Estilos en `GifListItemComponent` (`object-cover`)

Las imágenes cuadradas fijas utilizadas durante la fase de maquetación compartían proporciones idénticas. En contraste, las animaciones devueltas por Giphy poseen dimensiones heterogéneas (formatos panorámicos, verticales y proporciones variables).

Para evitar que las imágenes se deformen, estiren o desborden la cuadrícula, aplicamos la regla de ajuste `object-cover`:

```html title="src/app/gifs/components/gif-list/gif-list-item/gif-list-item.component.html" hl_lines="3"
<div>
  <img
    class="h-full w-full rounded-lg object-cover"
    [src]="imageUrl()"
    alt="Giphy animation"
  />
</div>
```

* `h-full w-full`: Garantiza que el elemento ocupe la totalidad del espacio asignado por la celda de la rejilla.
* `object-cover`: Escala la animación para rellenar la caja manteniendo su relación de aspecto (*aspect ratio*), recortando suavemente los bordes sobrantes sin distorsionar la imagen.
* `rounded-lg`: Mantiene la estética visual del sistema de diseño atómico.

### 4. Integración Reactiva en `TrendingPageComponent`

Una vez actualizados los contratos hijos, refactorizamos `TrendingPageComponent` eliminando cualquier rastro de la constante local `imageUrls` e inyectando `GifService` mediante la función funcional `inject()`:

=== "src/app/gifs/pages/trending-page/trending-page.component.ts"
    ```typescript title="src/app/gifs/pages/trending-page/trending-page.component.ts"
    import { Component, inject } from '@angular/core';
    import { GifService } from '../../services/gifs.service';
    import { GifListComponent } from '../../components/gif-list/gif-list.component';

    @Component({
      selector: 'app-trending-page',
      imports: [GifListComponent],
      templateUrl: './trending-page.component.html',
    })
    export default class TrendingPageComponent {
      gifService = inject(GifService);
    }
    ```

=== "src/app/gifs/pages/trending-page/trending-page.component.html"
    ```html title="src/app/gifs/pages/trending-page/trending-page.component.html"
    <section class="py-5">
      @if (gifService.trendingGifsLoading()) {
        <div class="flex justify-center items-center py-20 text-blue-500">
          <i class="fa-solid fa-spinner fa-spin text-4xl"></i>
          <span class="ml-3 text-lg text-slate-600">Cargando tendencias...</span>
        </div>
      } @else {
        <gif-list [gifs]="gifService.trendingGifs()" />
      }
    </section>
    ```

El flujo de renderizado opera de forma 100% reactiva:

1. Mientras la petición HTTP viaja por la red, `gifService.trendingGifsLoading()` evalúa a `true`, mostrando el indicador de carga (*spinner*).
2. Cuando el flujo HTTP completa la transformación en `GifService` y actualiza la señal `trendingGifs.set(gifs)`, el estado `trendingGifsLoading.set(false)` desencadena el repintado automático, mostrando la cuadrícula de tendencias en tiempo real.

!!! note "¿Por qué NO llamamos a `loadTrendingGifs()` dentro de `TrendingPageComponent`?"
    Puede llamar la atención que `TrendingPageComponent` solo haga `gifService = inject(GifService)` y no invoque `this.gifService.loadTrendingGifs()`. El motivo está en el ciclo de vida de los servicios *Singleton*:

    * **Instanciación perezosa (*lazy*):** Los servicios con `@Service()` no se crean al arrancar la aplicación, sino la **primera vez** que un componente ejecuta `inject(GifService)`. En ese instante se ejecuta el `constructor()` de `GifService` y dispara `this.loadTrendingGifs()` automáticamente.
    * **Caché automática al navegar:** Al cambiar de **Trending** a **Buscador** y volver, `TrendingPageComponent` se destruye y se vuelve a crear, pero `GifService` **sigue vivo en memoria** (es *Singleton*). Como su `constructor()` no se repite, **evitamos lanzar peticiones duplicadas** a la API de Giphy y los GIFs se muestran al instante.

    **¿Qué pasaría si lo llamáramos en `TrendingPageComponent` (`constructor()` vs `ngOnInit()`)?**

    * **En ambos casos** la petición se repetiría cada vez que el usuario entre en la ruta `/dashboard/trending`, porque el componente se recrea en cada navegación (algo útil solo si quieres datos frescos en cada visita, no si deseas conservar caché en memoria).
    * **Diferencia entre `constructor()` y `ngOnInit()` en un componente:**
        * **`constructor()`:** Se ejecuta al instanciar la clase JavaScript, **antes** de que Angular haya resuelto los `input()` del componente. En Angular moderno se reserva para inicialización muy ligera o inyección de dependencias (`inject()`).
        * **`ngOnInit()`:** Se ejecuta justo después de que Angular haya enlazado los valores iniciales de los `input()`. Es el lugar adecuado cuando una petición HTTP **depende de un `input()`** del componente o cuando quieres recargar datos explícitamente cada vez que se monta la vista.

---

## Diseño de Pantalla y Captura de Eventos: `SearchPageComponent`

Una vez resuelto el consumo de tendencias, abordamos la funcionalidad del **Buscador de Gifs**. Siguiendo el principio de arquitectura de **Separación de Responsabilidades**, diseñamos en primer lugar la vista de usuario y el canal de captura de eventos antes de introducir la capa de comunicación de red.

### 1. Estructura Base del Componente y Maquetación de la Vista

En primer lugar, creamos la estructura base de `SearchPageComponent` con la señal local `gifs` que custodiará los resultados encontrados, junto con el diseño visual inicial de la plantilla (encabezado, caja de texto y cuadrícula de resultados, **todavía sin conectar ningún evento de teclado**):

=== "src/app/gifs/pages/search-page/search-page.component.ts"
    ```typescript title="src/app/gifs/pages/search-page/search-page.component.ts (Base)"
    import { Component, signal } from '@angular/core';
    import { GifListComponent } from '../../components/gif-list/gif-list.component';
    import { Gif } from '../../interfaces/gif.interface';

    @Component({
      selector: 'app-search-page',
      imports: [GifListComponent],
      templateUrl: './search-page.component.html',
    })
    export default class SearchPageComponent {
      // Señal local que custodia los gifs encontrados en la búsqueda actual
      gifs = signal<Gif[]>([]);
    }
    ```

=== "src/app/gifs/pages/search-page/search-page.component.html"
    ```html title="src/app/gifs/pages/search-page/search-page.component.html (Base)"
    <h2 class="text-2xl font-bold mt-5 text-slate-900">Buscar Gifs</h2>
    <h3 class="text-sm text-slate-600">
      Buscar gifs por nombre, descripción o tags
    </h3>

    <section class="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Buscar Gifs y presiona Enter..."
        class="mt-3 bg-white border border-slate-300 rounded-md p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
      />
    </section>

    <section class="py-5">
      <gif-list [gifs]="gifs()" />
    </section>
    ```

### 2. Variables de Referencia de Plantilla (`#txtSearch`) vs Formularios

Antes de leer lo que escribe el usuario en el `<input>`, debemos tomar una decisión arquitectónica clave en Angular: **¿qué mecanismo utilizar para capturar el valor del campo?**

| Mecanismo | Módulos requeridos | Complejidad | Caso de Uso Óptimo |
| :--- | :--- | :--- | :--- |
| **Variable de Referencia (`#ref`)** | Ninguno (Nativo) | Mínima (0 overhead) | Lectura bajo demanda en una acción específica (ej: pulsar ++enter++) |
| **`[(ngModel)]` (Template Forms)** | `FormsModule` | Media | Sincronización bidireccional continua en tiempo real |
| **`FormControl` (Reactive Forms)** | `ReactiveFormsModule` | Alta (Estructurada) | Validación síncrona/asíncrona compleja, múltiples campos y tracking de estado |

#### ¿Por qué `#txtSearch` en lugar de `FormsModule`?

En este caso, la búsqueda solo se dispara cuando el usuario decide ejecutarla presionando la tecla ++enter++. No necesitamos saber qué escribe letra a letra ni rastrear si el campo está sucio (*dirty*) o tocado (*touched*).

Al declarar `#txtSearch` sobre la etiqueta `<input>`:

1. Angular crea una **Variable de Referencia de Plantilla** que apunta directamente a la instancia del elemento nativo del DOM (`HTMLInputElement`).
2. Podemos acceder a cualquier propiedad nativa del elemento dentro del ámbito de la plantilla, como `txtSearch.value`.
3. Mantenemos el componente ultraligero, sin necesidad de importar `FormsModule` ni `ReactiveFormsModule` en los `imports` del componente *standalone*.

### 3. Event Binding Declarativo con `(keyup.enter)` y Conexión Final

En JavaScript tradicional o enfoques imperativos, la captura de la tecla Enter requiere interceptar el evento general `keyup` y verificar manualmente el código de la tecla:

```typescript
// Enfoque imperativo manual (no recomendado):
handleKeyUp(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    this.executeSearch();
  }
}
```

Angular proporciona **pseudo-eventos declarativos de teclado**. La sintaxis `(keyup.enter)` actúa como un filtro que el propio motor de Angular evalúa antes de ejecutar la expresión:

* La expresión `onSearch(txtSearch.value)` **únicamente** se evalúa cuando la tecla pulsada y liberada es ++enter++.
* Cualquier otra tecla (letras, números, flechas de dirección) es ignorada por el binding, evitando llamadas innecesarias al método del componente.

Ahora sí, añadimos la referencia `#txtSearch`, el evento `(keyup.enter)` en la plantilla y el método `onSearch(query: string)` en la clase del componente:

=== "src/app/gifs/pages/search-page/search-page.component.html"
    ```html title="src/app/gifs/pages/search-page/search-page.component.html" hl_lines="11-12"
    <h2 class="text-2xl font-bold mt-5 text-slate-900">Buscar Gifs</h2>
    <h3 class="text-sm text-slate-600">
      Buscar gifs por nombre, descripción o tags
    </h3>

    <section class="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Buscar Gifs y presiona Enter..."
        class="mt-3 bg-white border border-slate-300 rounded-md p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
        (keyup.enter)="onSearch(txtSearch.value)"
        #txtSearch
      />
    </section>

    <section class="py-5">
      <gif-list [gifs]="gifs()" />
    </section>
    ```

=== "src/app/gifs/pages/search-page/search-page.component.ts"
    ```typescript title="src/app/gifs/pages/search-page/search-page.component.ts" hl_lines="14-16"
    import { Component, signal } from '@angular/core';
    import { GifListComponent } from '../../components/gif-list/gif-list.component';
    import { Gif } from '../../interfaces/gif.interface';

    @Component({
      selector: 'app-search-page',
      imports: [GifListComponent],
      templateUrl: './search-page.component.html',
    })
    export default class SearchPageComponent {
      // Señal local que custodia los gifs encontrados en la búsqueda actual
      gifs = signal<Gif[]>([]);

      onSearch(query: string) {
        console.log({ query });
      }
    }
    ```

### 4. Verificación en el Navegador

Para comprobar que el canal de eventos está correctamente acoplado:

1. Abrimos las **Herramientas de Desarrollador** del navegador (++f12++ o ++ctrl+shift+i++) en la pestaña **Console**.
2. Navegamos a la ruta `/dashboard/search`.
3. Escribimos un término en el campo de texto (ej: `goku`) y pulsamos ++enter++.
4. Verificamos que la consola imprime inmediatamente el objeto `{ query: 'goku' }` sin recargar la página.

Una vez validada la captura limpia del evento, la interfaz de usuario queda lista para conectarse con el servicio HTTP.

---

## 🎯 Tarea Práctica 1: Primera Conexión del Buscador (`searchGifs`)

### 📋 Enunciado del Reto para el Alumno

Antes de ver la solución completa con operadores RxJS, pon en práctica lo aprendido creando la primera versión de la búsqueda de GIFs:

1. En `GifService` (`src/app/gifs/services/gifs.service.ts`), crea el método **`searchGifs(query: string)`** que realice una petición HTTP `GET` al endpoint **`${environment.giphyUrl}/gifs/search`** enviando los parámetros `api_key`, `limit: 20` y `q: query`.
2. En esta primera aproximación, suscríbete dentro del método, transforma `resp.data` con `GifMapper.mapGiphyItemsToGifArray(resp.data)` e imprime el resultado en consola con `console.log({ search: gifs })`.
3. En **`SearchPageComponent`** (`src/app/gifs/pages/search-page/search-page.component.ts`), inyecta `GifService` mediante `inject(GifService)`. Dentro de `onSearch(query: string)`, **limpia los espacios sobrantes con `.trim()`** (evitando lanzar la petición si el término resultante queda vacío) y llama a `this.gifService.searchGifs(cleanQuery)`.

### ⏸️ Reto Práctico: ¡Inténtalo tú mismo!

!!! exercise "Pausa de Trabajo Autónomo"
    Detente un momento e intenta implementar `searchGifs(query)` y su llamada desde `SearchPageComponent` por tu cuenta.
    
    **Criterio de éxito:** Al escribir un término (por ejemplo, `saitama` o `goku`) en el buscador y pulsar ++enter++, la consola del navegador debe mostrar `{ search: Gif[] }` con los 20 GIFs ya mapeados.

### ⚠️ Errores Típicos del Alumno en esta Tarea

* **Olvidar el parámetro `q` en `params`:** El endpoint `/gifs/search` requiere obligatoriamente `q: query` además de `api_key` y `limit`.
* **No suscribirse:** Si solo llamas a `this.http.get(...)` sin `.subscribe(...)` (ni devuelves el Observable para que otro se suscriba), la petición de red **nunca se dispara**.
* **No limpiar espacios (`trim()`):** Si pulsas ++enter++ con el input vacío o solo espacios, se consume cuota innecesaria de la API de Giphy.

??? success "Ver solución de la Tarea Práctica 1 (Primera aproximación)"
    **1. En `src/app/gifs/services/gifs.service.ts`:**

    ```typescript
    searchGifs(query: string) {
      this.http
        .get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
          params: {
            api_key: environment.giphyApiKey,
            limit: 20,
            q: query,
          },
        })
        .subscribe((resp) => {
          const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
          console.log({ search: gifs });
        });
    }
    ```

    **2. En `src/app/gifs/pages/search-page/search-page.component.ts`:**

    ```typescript
    import { Component, inject, signal } from '@angular/core';
    import { GifListComponent } from '../../components/gif-list/gif-list.component';
    import { Gif } from '../../interfaces/gif.interface';
    import { GifService } from '../../services/gifs.service';

    @Component({
      selector: 'app-search-page',
      imports: [GifListComponent],
      templateUrl: './search-page.component.html',
    })
    export default class SearchPageComponent {
      gifService = inject(GifService);
      gifs = signal<Gif[]>([]);

      onSearch(query: string) {
        const cleanQuery = query.trim();
        if (!cleanQuery) return;

        this.gifService.searchGifs(cleanQuery);
      }
    }
    ```

> En la siguiente sección veremos por qué suscribirse dentro del servicio impide devolver los resultados al componente y cómo resolverlo devolviendo un `Observable<Gif[]>` con `.pipe(map(...))`.

---

## Búsqueda de Gifs: Conexión HTTP y Resultados en Vivo

Una vez validada la captura limpia del evento de teclado en `SearchPageComponent`, conectamos la interfaz de usuario con el endpoint oficial de búsqueda de Giphy (`/gifs/search`).

### 1. El Antipatrón Asíncrono Clásico vs Devolver Observables

Al diseñar métodos de búsqueda en servicios de Angular que consumen APIs externas, los desarrolladores suelen enfrentarse a un error conceptual muy extendido: intentar resolver la suscripción dentro del propio servicio y devolver los datos síncronamente.

```typescript
// ❌ ANTIPATRÓN COMÚN: Intentar tratar una llamada asíncrona como síncrona
searchGifs(query: string) {
  this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
    params: { api_key: environment.giphyApiKey, limit: 20, q: query }
  }).subscribe((resp) => {
    const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
    return gifs; // ¡Error conceptual! Devuelve al callback interno de subscribe, no a quien invocó searchGifs()
  });

  // El método searchGifs() finaliza inmediatamente antes de recibir la respuesta y devuelve undefined
}
```

!!! danger "Antipatrón Didáctico: Suscripciones prematuras en Servicios"
    * `HttpClient.get()` no devuelve datos inmediatos, sino un **Observable frío**.
    * La sentencia `return gifs;` dentro de la función de callback de `.subscribe()` entrega el valor al suscriptor interno de RxJS, jamás al componente que llamó a `searchGifs()`.
    * Como la llamada de red es asíncrona, el método `searchGifs()` termina su ejecución síncrona en microsegundos y devuelve `undefined` al componente.

#### La Solución Arquitectónica
En una arquitectura limpia con RxJS y Angular, **el servicio prepara, transforma y expone el flujo reactivo**, devolviendo un `Observable<Gif[]>`. Es el componente de presentación el encargado de suscribirse al flujo para volcar los resultados en su estado local (mediante Signals):

```mermaid
flowchart LR
    Service["GifService.searchGifs()<br/>Prepara petición y pipe(map)"] -->|"Devuelve Observable de Gifs"| Component["SearchPageComponent<br/>Se suscribe y actualiza gifs.set()"]
    Component -->|"Actualiza Señal"| View["GifListComponent<br/>Renderizado Reactivo"]
```

### 2. Implementación en `GifService`: Método `searchGifs()`

Añadimos a `GifService` el método `searchGifs(query: string)`, tipado estrictamente con `Observable<Gif[]>`:

```typescript title="src/app/gifs/services/gifs.service.ts (Ampliación: Búsqueda HTTP)"
// Petición HTTP GET hacia el endpoint /gifs/search
searchGifs(query: string): Observable<Gif[]> {
  return this.http
    .get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: 20,
        q: query,
      },
    })
    .pipe(
      map(({ data }) => data),
      map((items) => GifMapper.mapGiphyItemsToGifArray(items))
    );
}
```

* **`q: query`**: Parámetro de consulta requerido por Giphy con la frase o término a buscar.
* **Pipeline de Transformación (`pipe`):**
    1. `map(({ data }) => data)`: Extrae limpiamente el payload de items del DTO `GiphyResponse`.
    2. `map((items) => GifMapper.mapGiphyItemsToGifArray(items))`: Transforma cada item de Giphy al modelo de dominio inmutable `Gif[]`.

### 3. Conexión de `SearchPageComponent` con `GifService`

Inyectamos `GifService` en `SearchPageComponent` mediante `inject()` y actualizamos `onSearch()` aplicando el patrón *Early Return* para sanitizar la entrada de usuario antes de disparar la petición HTTP:

```typescript title="src/app/gifs/pages/search-page/search-page.component.ts" hl_lines="2 12-13 15-22"
import { Component, inject, signal } from '@angular/core';
import { GifService } from '../../services/gifs.service';
import { GifListComponent } from '../../components/gif-list/gif-list.component';
import { Gif } from '../../interfaces/gif.interface';

@Component({
  selector: 'app-search-page',
  imports: [GifListComponent],
  templateUrl: './search-page.component.html',
})
export default class SearchPageComponent {
  gifService = inject(GifService);
  gifs = signal<Gif[]>([]);

  onSearch(query: string) {
    const cleanQuery = query.trim();
    if (!cleanQuery) return;

    this.gifService.searchGifs(cleanQuery).subscribe((resp) => {
      this.gifs.set(resp);
    });
  }
}
```

* **Sanitización y Early Return (`cleanQuery`)**: Si el usuario pulsa Enter en un campo vacío o compuesto únicamente por espacios en blanco, la función finaliza de inmediato sin consumir cuota de red de la API.
* **Actualización Reactiva de Señales (`this.gifs.set(resp)`)**: Al asignar los nuevos GIFs a la señal local, Angular propaga el cambio automáticamente hacia la plantilla `<gif-list [gifs]="gifs()" />`.

### 4. Verificación en el Navegador

1. Con el servidor activo (`ng serve`), navegamos a la ruta `/dashboard/search`.
2. Abrimos la pestaña **Network (Red)** en las Herramientas de Desarrollador del navegador (++f12++).
3. Tecleamos un término (ej: `dragon ball`) y pulsamos ++enter++.
4. Verificamos que se genera una petición GET hacia `https://api.giphy.com/v1/gifs/search?api_key=...&limit=20&q=dragon+ball` con código de estado HTTP `200 OK`, y que la rejilla se actualiza instantáneamente con las animaciones devueltas.

---

## Historial de Búsquedas y Optimización con Caché en Memoria

Tras implementar la búsqueda, surge un problema arquitectónico común en el consumo de servicios web. Si observamos la pestaña **Network** en las DevTools del navegador al realizar búsquedas repetidas:

1. Buscamos `"goku"` → Petición HTTP a la API.
2. Buscamos `"vegeta"` → Petición HTTP a la API.
3. Volvemos a buscar `"goku"` → **¡Nueva petición HTTP idéntica a la API!**

Este comportamiento acarrea múltiples desventajas:

* **Consumo innecesario de cuota:** Las claves de desarrollador gratuitas tienen límites estrictos de peticiones por hora.
* **Desperdicio de recursos y ancho de banda.**
* **Latencia perceptible:** El usuario experimenta un retraso de red esperando datos que ya se descargaron hace segundos.

### 1. Diseño de la Estructura de Datos: `Record<string, Gif[]>` vs `string[]`

Para almacenar el historial y optimizar la aplicación, evaluamos dos aproximaciones:

| Criterio | ❌ Opción Ingenua: `string[]` | ✅ Opción Arquitectónica: `Record<string, Gif[]>` |
| :--- | :--- | :--- |
| **Estructura en memoria** | `['goku', 'vegeta']` | `{ goku: [Gif, ...], vegeta: [Gif, ...] }` |
| **Listar el historial en el menú** | Directo (el propio array) | Directo con `Object.keys(history)` |
| **Al hacer clic en un término anterior** | Obliga a **repetir la petición HTTP** a Giphy | **Acceso instantáneo en memoria `O(1)`** sin red (`history['goku']`) |
| **Consumo de cuota API** | Alto (repite búsquedas ya hechas) | Mínimo (caché automática por término) |

!!! info "¿Qué es `Record<K, V>` en TypeScript?"
    **`Record<Keys, Type>`** es un **tipo utilitario (*Utility Type*) nativo de TypeScript** que sirve para tipar **objetos que actúan como diccionarios o mapas clave-valor** cuando no conocemos de antemano qué claves tendrá el objeto (porque las escribirá el usuario).

    * **`K` (`string`):** el tipo de las **claves** del objeto (en nuestro caso, cada término buscado en minúsculas: `'goku'`, `'saitama'`, `'naruto'`).
    * **`V` (`Gif[]`):** el tipo de los **valores** asociados a cada clave (el array de GIFs devuelto por Giphy para ese término).
    * **Equivalencia interna:** escribir `Record<string, Gif[]>` es exactamente equivalente (pero mucho más limpio y legible) a escribir `{ [clave: string]: Gif[] }`.

    ```typescript
    // Ejemplo real de cómo luce un Record<string, Gif[]> en memoria:
    const historial: Record<string, Gif[]> = {
      goku: [
        { id: '1', title: 'Goku SSJ', url: 'https://...' },
        { id: '2', title: 'Goku Kamehameha', url: 'https://...' },
      ],
      saitama: [
        { id: '9', title: 'One Punch', url: 'https://...' },
      ],
    };

    // Operaciones habituales sobre un Record:
    Object.keys(historial); // ['goku', 'saitama'] -> Lista de términos para el menú lateral
    historial['goku'];      // Gif[]               -> Acceso directo O(1) a la caché
    ```

    Además, TypeScript te protege en tiempo de compilación: si intentas asignar un `string` o un número en lugar de un `Gif[]` (`historial['goku'] = 'error'`), el compilador marcará el fallo al instante.

Al utilizar esta estructura de diccionario indexada por término (`Record<string, Gif[]>`):

* **Fuente Única de Verdad:** Las claves del objeto representan el historial cronológico de términos.
* **Caché en Memoria Instantánea:** Los valores almacenan las animaciones previamente recuperadas, eliminando la necesidad de volver a consultar la API externa.

**Modificación en el proyecto:** declaramos la señal `searchHistory` dentro de `GifService` inicializada como un objeto vacío `{}`:

```typescript title="src/app/gifs/services/gifs.service.ts (Paso 1: Declarar searchHistory)" hl_lines="5"
@Service()
export class GifService {
  private http = inject(HttpClient);

  searchHistory = signal<Record<string, Gif[]>>({});
  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal(true);
  // ...
}
```

### 2. El Operador RxJS `tap()` como Interceptor de Efectos Secundarios

Para guardar las búsquedas en la caché en el instante en que la petición responde con éxito, sin interrumpir ni mutar el flujo que espera el componente, utilizamos el operador **`tap()`**:

| Operador | Propósito | ¿Modifica el valor emitido? |
| :--- | :--- | :--- |
| **`map()`** | **Transformación pura:** Convierte un valor de entrada en uno de salida (ej: DTO → `Gif[]`). | **Sí** |
| **`tap()`** | **Efecto secundario (Side Effect):** Inspecciona el flujo o ejecuta acciones periféricas (logging, actualización de caché) sin alterar el dato. | **No** |

### 3. Principio de Inmutabilidad en Signals (`.update()`) y Normalización

**Modificación en el proyecto:** importamos `tap` desde `'rxjs'` y lo encadenamos al final de `.pipe(...)` en `searchGifs()` para guardar los resultados en `searchHistory` respetando la inmutabilidad:

```typescript title="src/app/gifs/services/gifs.service.ts (Paso 2: Guardar resultados con tap)" hl_lines="1 16-21"
import { Observable, map, tap } from 'rxjs';

// ... dentro de GifService:
searchGifs(query: string): Observable<Gif[]> {
  return this.http
    .get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: 20,
        q: query,
      },
    })
    .pipe(
      map(({ data }) => data),
      map((items) => GifMapper.mapGiphyItemsToGifArray(items)),
      tap((items) => {
        this.searchHistory.update((history) => ({
          ...history,
          [query.toLowerCase()]: items,
        }));
      })
    );
}
```

* **Normalización de Claves (`query.toLowerCase()`)**: Garantiza que búsquedas con diferencias de mayúsculas y minúsculas (ej: `Goku`, `goku`, `GOKU`) se asignen al mismo registro de caché, evitando duplicados.
* **Inmutabilidad Estricta (`...history`)**: Nunca mutamos el objeto directamente (`history[query] = items`). El método `.update()` recibe el estado anterior y devuelve un **nuevo objeto en memoria** mediante el operador de propagación (*spread*), permitiendo que el grafo de reactividad de Signals detecte el cambio de referencia y notifique a las vistas asociadas.

### 4. Señal Computada Derivada: `searchHistoryKeys`

**Modificación en el proyecto:** importamos `computed` desde `'@angular/core'` y declaramos `searchHistoryKeys` justo debajo de `searchHistory` en `GifService` para exponer la lista de términos al menú lateral:

```typescript title="src/app/gifs/services/gifs.service.ts (Paso 3: Señal computada de claves)" hl_lines="1 5"
import { computed, inject, Service, signal } from '@angular/core';

// ... dentro de GifService:
searchHistory = signal<Record<string, Gif[]>>({});
searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));
```

* **¿Qué hace `Object.keys(objeto)`?** Es un método nativo de JavaScript que recibe un objeto y **extrae únicamente los nombres de sus claves en forma de array (`string[]`)**.
    * Por ejemplo, si `this.searchHistory()` contiene `{ goku: [Gif, ...], saitama: [Gif, ...] }`, entonces `Object.keys(this.searchHistory())` devuelve `['goku', 'saitama']`.
    * Lo necesitamos porque en la plantilla HTML la directiva `@for` solo puede iterar sobre arrays/colecciones, no directamente sobre objetos diccionario.
* **Reactividad con `computed()`:** `searchHistoryKeys` se recalcula de forma puramente declarativa y automática cada vez que `searchHistory` añade una nueva clave.

### 5. Acceso Síncrono Defensivo: `getHistoryGifs()`

**Modificación en el proyecto:** añadimos el método `getHistoryGifs(query: string)` al final de `GifService` para recuperar animaciones cacheadas sin necesidad de realizar suscripciones asíncronas:

```typescript title="src/app/gifs/services/gifs.service.ts (Paso 4: Lectura de caché)" hl_lines="2-4"
// ... al final de GifService:
getHistoryGifs(query: string): Gif[] {
  return this.searchHistory()[query.toLowerCase()] ?? [];
}
```

* **Operador de Coalescencia Nula (`?? []`)**: Si se solicita un término que aún no existe en el diccionario, devuelve un array vacío en lugar de `undefined`, protegiendo a los componentes consumidores contra errores de tipo *Cannot read properties of undefined*.

### 6. Código Consolidado de `GifService`

A continuación se presenta la implementación completa y consolidada de `GifService` con carga de tendencias, búsqueda HTTP y sistema reactivo de caché en memoria:

```typescript title="src/app/gifs/services/gifs.service.ts (Servicio Completo con Tendencias, Búsqueda y Caché)" hl_lines="2 4 14-15 39-59 61-63"
import { HttpClient } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, map, tap } from 'rxjs';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';

@Service()
export class GifService {
  private http = inject(HttpClient);

  // Historial organizado como diccionario de búsqueda (Caché en memoria): { 'goku': [gif1, gif2], ... }
  searchHistory = signal<Record<string, Gif[]>>({});
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal(true);

  constructor() {
    this.loadTrendingGifs();
  }

  loadTrendingGifs() {
    this.http
      .get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
        params: {
          api_key: environment.giphyApiKey,
          limit: 20,
        },
      })
      .subscribe((resp) => {
        const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
        this.trendingGifs.set(gifs);
        this.trendingGifsLoading.set(false);
      });
  }

  searchGifs(query: string): Observable<Gif[]> {
    return this.http
      .get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
        params: {
          api_key: environment.giphyApiKey,
          limit: 20,
          q: query,
        },
      })
      .pipe(
        map(({ data }) => data),
        map((items) => GifMapper.mapGiphyItemsToGifArray(items)),
        // Almacenamos el resultado en el diccionario de historial y caché
        tap((items) => {
          this.searchHistory.update((history) => ({
            ...history,
            [query.toLowerCase()]: items,
          }));
        })
      );
  }

  getHistoryGifs(query: string): Gif[] {
    return this.searchHistory()[query.toLowerCase()] ?? [];
  }
}
```

---

## Parámetros Dinámicos de URL e Interoperabilidad con `toSignal`

!!! info "📖 Para saber más: Manual de Referencia"
    Para aprender cómo funciona `toSignal()` y la interoperabilidad entre Observables y Signals, consulta el **[Manual de Referencia: 10. Cliente HTTP (`toSignal()` — Observable a Signal)](manual/10-http.md#41-tosignal-observable-a-signal)**, y para rutas dinámicas el **[Manual de Referencia: 11. Angular Router y Navegación](manual/11-router.md)**.

Para permitir que el usuario comparta un enlace con una búsqueda fija (por ejemplo, `/dashboard/history/dragonball`) o pulse sobre un término del historial en el menú lateral, vamos a crear una nueva página de historial (`GifHistoryComponent`) y a configurarle una ruta dinámica con parámetros en dos pasos: primero preparamos el componente base (reto opcional) y después implementamos la ruta dinámica `:query` y la lectura reactiva con `toSignal()`.

## 🎯 Tarea Práctica 2 (Opcional): Crear la Página de Historial (`GifHistoryComponent`)

### 📋 Enunciado del Reto para el Alumno

Antes de configurar los argumentos dinámicos en la URL, prepara la nueva pantalla que mostrará los GIFs de un término guardado en el historial:

1. Crea una nueva página llamada **`gif-history`** dentro de `src/app/gifs/pages/gif-history/` (componente `GifHistoryComponent` con `export default class` para poder cargarlo de forma perezosa).
2. Registra su ruta hija dentro de `dashboard` en **`src/app/app.routes.ts`** para que sea accesible desde la navegación lateral.

### ⏸️ Reto Práctico: ¡Inténtalo tú mismo!

!!! exercise "Pausa de Trabajo Autónomo"
    Intenta generar el componente `gif-history` y enlazar su ruta en `app.routes.ts` antes de revisar la configuración completa con parámetros dinámicos.

    **Pista:** Recuerda exportar la clase como `export default class GifHistoryComponent` para que `import('./gifs/pages/gif-history/gif-history.component')` funcione directamente en `loadComponent`.

??? success "Ver solución base (Generación del componente `gif-history`)"
    1. Genera el componente con Angular CLI:

    ```bash
    ng g c gifs/pages/gif-history
    ```

    2. Asegúrate de añadir `default` a la exportación de la clase en `src/app/gifs/pages/gif-history/gif-history.component.ts`:

    ```typescript title="src/app/gifs/pages/gif-history/gif-history.component.ts (Base)"
    import { Component } from '@angular/core';

    @Component({
      selector: 'app-gif-history',
      imports: [],
      templateUrl: './gif-history.component.html',
    })
    export default class GifHistoryComponent {}
    ```

    A continuación completamos la ruta dinámica `:query` y la lógica de `GifHistoryComponent` con `toSignal()`.

### 1. Solución: Definición de la Ruta Dinámica en `src/app/app.routes.ts`

Registramos la ruta hija `history/:query` bajo el cascarón `DashboardPageComponent`, utilizando carga perezosa (*lazy loading*) mediante la función `loadComponent`:

```typescript title="src/app/app.routes.ts" hl_lines="19-23"
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./gifs/pages/dashboard-page/dashboard-page.component'),
    children: [
      {
        path: 'trending',
        loadComponent: () =>
          import('./gifs/pages/trending-page/trending-page.component'),
      },
      {
        path: 'search',
        loadComponent: () =>
          import('./gifs/pages/search-page/search-page.component'),
      },
      {
        path: 'history/:query',
        loadComponent: () =>
          import('./gifs/pages/gif-history/gif-history.component'),
      },
      {
        path: '**',
        redirectTo: 'trending',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
```

* El segmento `:query` actúa como comodín dinámico. Cualquier valor introducido tras `/history/` (ej: `/history/goku`) será capturado por el enrutador de Angular como un parámetro de ruta.

### 2. Lectura de Parámetros con `ActivatedRoute` y `toSignal()`: `GifHistoryComponent`

#### ¿Qué son `ActivatedRoute` y `route.params`?

Cuando una ruta contiene un segmento dinámico como `history/:query`, el componente necesita preguntar al enrutador de Angular qué valor hay escrito actualmente en la URL. Para ello existe el servicio nativo **`ActivatedRoute`** (de `@angular/router`):

* **`ActivatedRoute`:** contiene toda la información sobre la ruta activa actual (segmentos de URL, parámetros dinámicos, query params, etc.).
* **`route.params`:** es un **`Observable`** que emite un objeto diccionario con los parámetros de la URL cada vez que esta cambia:
    * Si entras en `/dashboard/history/goku`, `route.params` emite `{ query: 'goku' }`.
    * Si luego haces clic en otro término del menú lateral (`/dashboard/history/saitama`), Angular **reutiliza el mismo `GifHistoryComponent`** sin destruirlo, y `route.params` emite automáticamente `{ query: 'saitama' }`.

!!! note "¿Por qué `route.params` (Observable) y no una lectura fija?"
    Aunque existe `route.snapshot.params['query']`, esa lectura solo captura el valor **una vez** al crearse el componente. Si el usuario cambia de `/history/goku` a `/history/saitama` estando ya en la página de historial, la vista **no se actualizaría**. Al usar el Observable `route.params`, reaccionamos a cada cambio de URL.

Vamos a construir `GifHistoryComponent` **en tres pasos progresivos**:

#### Paso 1: Inyectar `ActivatedRoute` y transformar `route.params` con `map()`

Primero inyectamos `ActivatedRoute`. Como `this.route.params` emite un objeto (`{ query: 'goku' }`), usamos `.pipe(map(...))` para quedarnos únicamente con el texto del parámetro `query`:

```typescript title="Paso 1: Inyectar ActivatedRoute y extraer el parámetro :query" hl_lines="2-3 7 10-12"
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

export default class GifHistoryComponent {
  // 1. Inyectamos la ruta activa actual
  private route = inject(ActivatedRoute);

  // 2. Transformamos { query: 'goku' } -> 'goku' (o '' si no existe)
  query$ = this.route.params.pipe(
    map((params) => params['query'] ?? '')
  );
}
```

#### Paso 2: Convertir el Observable en Señal con `toSignal()`

En Angular tradicional habría que suscribirse manualmente a `query$` y cancelar la suscripción en `ngOnDestroy` para evitar fugas de memoria (*memory leaks*). En su lugar, envolvemos el flujo con **`toSignal()`** (de `@angular/core/rxjs-interop`), que **se suscribe y se desuscribe automáticamente** y nos entrega una señal pura `query()`:

```typescript title="Paso 2: Envolver el Observable con toSignal()" hl_lines="2 9-11"
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

export default class GifHistoryComponent {
  private route = inject(ActivatedRoute);

  query = toSignal(
    this.route.params.pipe(map((params) => params['query'] ?? ''))
  );
}
```

#### Paso 3: Leer los GIFs desde la caché con `computed()`

Ahora que `query` es una señal reactiva, inyectamos `GifService` y creamos la señal computada `gifsByKey`. Cada vez que `this.query()` cambie al pulsar otro término del historial, `gifsByKey` recuperará al instante los GIFs cacheados en memoria:

```typescript title="Paso 3: Derivar los GIFs cacheados con computed()" hl_lines="1 5 9 15-18"
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { GifService } from '../../services/gifs.service';

export default class GifHistoryComponent {
  private route = inject(ActivatedRoute);
  private gifService = inject(GifService);

  query = toSignal(
    this.route.params.pipe(map((params) => params['query'] ?? ''))
  );

  gifsByKey = computed(() => {
    const currentQuery = this.query();
    return currentQuery ? this.gifService.getHistoryGifs(currentQuery) : [];
  });
}
```

#### Código Completo de `GifHistoryComponent` (`.ts` y `.html`)

Uniendo los tres pasos e importando `GifListComponent` para pintar la cuadrícula:

=== "src/app/gifs/pages/gif-history/gif-history.component.ts"
    ```typescript title="src/app/gifs/pages/gif-history/gif-history.component.ts"
    import { Component, computed, inject } from '@angular/core';
    import { toSignal } from '@angular/core/rxjs-interop';
    import { ActivatedRoute } from '@angular/router';
    import { map } from 'rxjs';
    import { GifService } from '../../services/gifs.service';
    import { GifListComponent } from '../../components/gif-list/gif-list.component';

    @Component({
      selector: 'app-gif-history',
      imports: [GifListComponent],
      templateUrl: './gif-history.component.html',
    })
    export default class GifHistoryComponent {
      private route = inject(ActivatedRoute);
      private gifService = inject(GifService);

      // Convierte el Observable de parámetros de la URL en una Señal reactiva pura
      query = toSignal(
        this.route.params.pipe(map((params) => params['query'] ?? ''))
      );

      // Señal computada: recupera de forma síncrona (O(1)) los gifs asociados al término activo
      gifsByKey = computed(() => {
        const currentQuery = this.query();
        return currentQuery ? this.gifService.getHistoryGifs(currentQuery) : [];
      });
    }
    ```

=== "src/app/gifs/pages/gif-history/gif-history.component.html"
    ```html title="src/app/gifs/pages/gif-history/gif-history.component.html"
    <div class="py-4">
      <h2 class="text-2xl font-bold text-slate-900 mb-2">
        Historial de Búsqueda: <span class="text-blue-600 capitalize">{{ query() }}</span>
      </h2>
      <hr class="border-slate-300 my-4" />

      <!-- Reutilización del componente de galería -->
      <gif-list [gifs]="gifsByKey()" />
    </div>
    ```

#### Mecánica de Ejecución y Acceso a la Caché:

1. Cuando el usuario navega a `/dashboard/history/dragonball`, el enrutador emite el objeto `{ query: 'dragonball' }`.
2. El operador `pipe(map(...))` extrae el valor `dragonball`.
3. `toSignal()` actualiza la señal `query()`.
4. La señal computada `gifsByKey` detecta el cambio en `this.query()` y llama inmediatamente a `gifService.getHistoryGifs('dragonball')`.
5. Los resultados se leen **directamente desde la memoria caché** en tiempo constante $O(1)$, proyectándose en `<gif-list>` sin ningún retardo ni consumo de ancho de banda.

!!! tip "💡 Evolución Angular 22: Parámetros de Ruta mediante Signal Inputs directos"
    En el enfoque tradicional de Angular 19 se inyecta `ActivatedRoute` y se transforma el Observable `params` mediante `toSignal()`.
    
    En **Angular 19 y consolidado en Angular 22**, si configuras `withComponentInputBinding()` en `provideRouter()` (`app.config.ts`), puedes omitir completamente `ActivatedRoute` y `toSignal`. ¡Angular inyecta el parámetro dinámico `:query` de la ruta directamente como un **Signal Input**!:
    ```typescript
    // En app.config.ts:
    provideRouter(routes, withComponentInputBinding())

    // En GifHistoryComponent (Angular 22 directo y limpio):
    import { Component, computed, inject, input } from '@angular/core';

    export default class GifHistoryComponent {
      private gifService = inject(GifService);

      // El parámetro :query de la URL se enlaza de forma automática como Signal Input
      query = input.required<string>();

      gifsByKey = computed(() => {
        const currentQuery = this.query();
        return currentQuery ? this.gifService.getHistoryGifs(currentQuery) : [];
      });
    }
    ```
    *Ventaja didáctica:* Se reduce drásticamente el código, se prescinde de RxJS en el componente de vista y se unifica la lectura de propiedades mediante la API estándar de Signals.

---

## Actualización del Menú Lateral con el Historial Dinámico

Con la ruta dinámica y el componente de historial en funcionamiento, conectamos la lista de búsquedas en el menú lateral de navegación (`SideMenuOptionsComponent`).

### 1. El Reto de la Reactividad entre Componentes Desacoplados

Observa la estructura de componentes de la aplicación:

``` mermaid
flowchart TD
    Dashboard["DashboardPageComponent (Shell)"] --> SideMenu["SideMenuComponent"]
    SideMenu --> SideMenuOptions["SideMenuOptionsComponent (Navegación Lateral)"]
    
    Dashboard --> AreaPrincipal["Área de Contenido (Router Outlet)"]
    AreaPrincipal --> SearchPage["SearchPageComponent (Input de Búsqueda)"]
    AreaPrincipal --> HistoryPage["GifHistoryComponent (Vista de Historial)"]
    
    SearchPage -.->|"1. Dispara búsqueda"| Service["GifService (Singleton)"]
    Service -.->|"2. Actualiza searchHistory"| Service
    Service ==>|"3. Notifica cambio en searchHistoryKeys()"| SideMenuOptions
```

`SearchPageComponent` (donde el usuario introduce términos) y `SideMenuOptionsComponent` (donde queremos mostrar el historial) son **componentes hermanos totalmente desacoplados**.

* **En arquitecturas tradicionales:** Sincronizar estos dos componentes requería levantar eventos al padre (`@Output()` / `EventEmitter`), utilizar servicios con `Subject` / `BehaviorSubject` de RxJS o librerías externas de gestión de estado (NgRx).
* **Con Angular Signals y un Servicio Singleton:** Basta con que `SideMenuOptionsComponent` lea la señal computada `gifService.searchHistoryKeys()`. Cuando el usuario realiza una búsqueda, el servicio actualiza la señal y Angular actualiza **únicamente** la lista del menú lateral de forma reactiva y automática.

## 🎯 Tarea Práctica 3: Mostrar el Historial Dinámico en el Menú Lateral

### 📋 Enunciado del Reto para el Alumno

Con `searchHistoryKeys` ya expuesto en `GifService`, traslada la lista de términos buscados al menú lateral (`SideMenuOptionsComponent`):

1. Inyecta **`GifService`** en **`SideMenuOptionsComponent`** (`side-menu-options.component.ts`) usando `inject(GifService)`.
2. En **`side-menu-options.component.html`**, añade un segundo bloque **`@for`** justo debajo del listado estático `menuOptions` para iterar sobre **`gifService.searchHistoryKeys()`**.
3. Muestra cada término (`key`) usando la misma estructura visual `<a>` del menú (puedes utilizar el icono `fa-solid fa-clock-rotate-left`). En este paso basta con que los términos aparezcan listados debajo de **Buscador** conforme realizas búsquedas.

### ⏸️ Reto Práctico: ¡Inténtalo tú mismo!

!!! exercise "Pausa de Trabajo Autónomo"
    Detente aquí e intenta conectar `SideMenuOptionsComponent` con `gifService.searchHistoryKeys()`.

    **Criterio de éxito:** Cada vez que busques un término nuevo en `/dashboard/search` (por ejemplo, `saitama`, `goku`, `overwatch`), ese término debe aparecer automáticamente en la barra lateral izquierda. Si vuelves a buscar el mismo término, no debe duplicarse.

### ⚠️ Errores Típicos del Alumno en esta Tarea

* **Olvidar los paréntesis en la señal computada:** Debes escribir `gifService.searchHistoryKeys()`, no `gifService.searchHistoryKeys`, porque es una función `Signal<string[]>`.
* **Usar `track $index` en lugar de `track key`:** Dado que cada clave en `searchHistoryKeys()` es única, usar `track key` optimiza el renderizado de Angular.

### 2. Implementación de `SideMenuOptionsComponent`

Actualizamos la clase TypeScript inyectando `GifService` y la plantilla HTML con la directiva `@for`:

=== "src/app/gifs/components/side-menu/side-menu-options/side-menu-options.component.ts"
    ```typescript title="src/app/gifs/components/side-menu/side-menu-options/side-menu-options.component.ts" hl_lines="1 3 18"
    import { Component, inject } from '@angular/core';
    import { RouterLink, RouterLinkActive } from '@angular/router';
    import { GifService } from '../../../services/gifs.service';

    interface MenuOption {
      icon: string;
      label: string;
      subLabel: string;
      route: string;
    }

    @Component({
      selector: 'gifs-side-menu-options',
      imports: [RouterLink, RouterLinkActive],
      templateUrl: './side-menu-options.component.html',
    })
    export class SideMenuOptionsComponent {
      gifService = inject(GifService);

      menuOptions: MenuOption[] = [
        {
          icon: 'fa-solid fa-chart-line',
          label: 'Trending',
          subLabel: 'Gifs Populares',
          route: '/dashboard/trending',
        },
        {
          icon: 'fa-solid fa-magnifying-glass',
          label: 'Buscador',
          subLabel: 'Buscar Gifs',
          route: '/dashboard/search',
        },
      ];
    }
    ```

=== "src/app/gifs/components/side-menu/side-menu-options/side-menu-options.component.html"
    ```html title="src/app/gifs/components/side-menu/side-menu-options/side-menu-options.component.html" hl_lines="18-33"
    <div id="nav" class="w-full px-4 py-4 space-y-1">
      <!-- Opciones Estáticas de Navegación -->
      @for (item of menuOptions; track item.route) {
        <a
          [routerLink]="item.route"
          routerLinkActive="bg-blue-600 text-white shadow-lg"
          class="w-full px-3 py-3 inline-flex space-x-3 items-center text-slate-300 hover:bg-slate-800 hover:text-white transition duration-150 rounded-lg"
        >
          <i [class]="item.icon + ' w-6 text-center text-lg'"></i>
          <div class="flex flex-col">
            <span class="text-sm font-semibold">{{ item.label }}</span>
            <span class="text-xs text-slate-400">{{ item.subLabel }}</span>
          </div>
        </a>
      }

      <!-- Sección Dinámica: Historial de Búsquedas -->
      @if (gifService.searchHistoryKeys().length > 0) {
        <div class="pt-4 pb-2 px-3 border-t border-slate-800">
          <span class="text-xs uppercase tracking-wider text-slate-500 font-bold">Búsquedas Recientes</span>
        </div>

        @for (key of gifService.searchHistoryKeys(); track key) {
          <a
            [routerLink]="['/dashboard/history', key]"
            routerLinkActive="bg-slate-800 text-blue-400 font-semibold"
            class="w-full px-3 py-2.5 inline-flex items-center space-x-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-md transition text-sm capitalize"
          >
            <i class="fa-solid fa-clock-rotate-left text-xs"></i>
            <span>{{ key }}</span>
          </a>
        }
      }
    </div>
    ```

* **`[routerLink]="['/dashboard/history', key]"`**: Genera un enlace dinámico hacia la ruta del historial con el término actual.
* **`routerLinkActive="bg-slate-800 text-blue-400 font-semibold"`**: Resalta visualmente el término activo en la barra lateral cuando la URL coincide con dicho historial.

---

## Persistencia del Historial en LocalStorage con `effect()`

En este punto, el historial de búsquedas y la memoria caché funcionan a la perfección en memoria. Sin embargo, surge un problema fundamental de persistencia:

!!! warning "El Problema de la Volatilidad de Memoria"
    Si el usuario pulsa ++f5++ o recarga el navegador, la instancia de `GifService` se reinicializa en el inyector de dependencias. La señal `searchHistory` vuelve a su valor inicial (`{}`) y todo el historial de búsquedas desaparece.

## 🎯 Tarea Práctica 4: Persistir el Historial en `localStorage`

### 📋 Enunciado del Reto para el Alumno

Antes de ver la solución final, aplica lo aprendido en la **Sección 05 (Efectos y LocalStorage)** para evitar que el historial de búsquedas se pierda al recargar la página:

1. En **`GifService`**, implementa un **`effect()`** que serialice `this.searchHistory()` con `JSON.stringify(...)` y lo guarde en `localStorage` bajo una clave (por ejemplo, `'gifs'`).
2. Crea una función auxiliar (por ejemplo, `loadFromLocalStorage()`) que lea esa clave de `localStorage`, haga `JSON.parse(...)` y sirva como valor inicial de la señal `searchHistory`.

### ⏸️ Reto Práctico: ¡Inténtalo tú mismo!

!!! exercise "Pausa de Trabajo Autónomo"
    Pausa la lectura e intenta persistir y restaurar `searchHistory` en `localStorage` por tu cuenta.
    
    **Criterio de éxito:** Realiza varias búsquedas (`saitama`, `goku`, `vegeta`), recarga la página con ++f5++ y comprueba que tanto las entradas del menú lateral como sus GIFs en `/dashboard/history/:query` siguen disponibles sin hacer nuevas peticiones HTTP.

### ⚠️ Errores Típicos del Alumno en esta Tarea

* **Inicializar `searchHistory` con `{}` en lugar de leer `localStorage`:** Si inicializas la señal con `{}` y luego registras el `effect()`, el efecto se ejecutará al arrancar el servicio y **sobrescribirá** los datos guardados en `localStorage` con un objeto vacío.
* **Olvidar que `localStorage` solo guarda strings:** Debes convertir el diccionario `Record<string, Gif[]>` con `JSON.stringify()` al guardar y reconstruirlo con `JSON.parse()` al leer (usando `'{}'` como respaldo si `getItem` devuelve `null`).
* **Usar `'[]'` en lugar de `'{}'` como fallback:** `searchHistory` es un objeto diccionario (`Record<string, Gif[]>`), no un array.

Para solventar esta limitación, implementamos una estrategia de **persistencia local desatendida** utilizando la API de almacenamiento web (`localStorage`) y la función **`effect()`** de Angular Signals.

### 1. Función de Recuperación Inicial: `loadFromLocalStorage()`

Antes de inicializar la señal, definimos una función pura auxiliar fuera de la clase que intenta leer los datos persistidos en el navegador:

```typescript
const GIF_KEY = 'gifs';

const loadFromLocalStorage = (): Record<string, Gif[]> => {
  const gifsFromLocalStorage = localStorage.getItem(GIF_KEY) ?? '{}';
  const gifs = JSON.parse(gifsFromLocalStorage);
  return gifs;
};
```

Al inicializar la señal en el servicio, invocamos directamente esta función:

```typescript
searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage());
```

* Si el usuario abre la aplicación por primera vez, `localStorage.getItem` devuelve `null`, el operador `??` suministra `'{}'` y `JSON.parse` entrega un objeto vacío válido.
* Si el usuario ya realizó búsquedas anteriormente, el estado del historial se restaura de forma síncrona en el mismo instante en que el servicio se crea.

### 2. Sincronización Automática con `effect()`

Para mantener sincronizado el almacenamiento local sin tener que llamar manualmente a `localStorage.setItem` en cada método de búsqueda, registramos un **`effect()`**:

```typescript
saveGifsToLocalStorage = effect(() => {
  const historyString = JSON.stringify(this.searchHistory());
  localStorage.setItem(GIF_KEY, historyString);
});
```

### 3. Inmersión Arquitectónica: ¿Qué es un `effect()` en Angular?

Un **`effect`** es una operación reactiva que se programa y ejecuta automáticamente siempre que alguna de las señales leídas dentro de su cuerpo cambie de valor.

#### Requisitos y Reglas de Uso de `effect()`:

1. **Contexto de Inyección (*Injection Context*):** `effect()` debe instanciarse en un contexto donde el inyector de dependencias esté disponible (por ejemplo, en el constructor o como valor inicial de una propiedad de clase en un servicio o componente).
2. **Ejecución Asíncrona (Microtask):** Los efectos no se ejecutan síncronamente al mutar la señal, sino que Angular los agrupa y los procesa en el siguiente microciclo, optimizando el rendimiento.
3. **No debe emitir otras señales:** No se debe mutar otra señal dentro de un efecto para evitar bucles infinitos de reactividad (a menos que se configure explícitamente `allowSignalWrites: true`).

#### Comparativa: `computed()` vs `effect()`

| Criterio | `computed()` | `effect()` |
| :--- | :--- | :--- |
| **Propósito Principal** | Derivar un nuevo estado de solo lectura | Ejecutar un efecto secundario (*side effect*) |
| **Valor de Retorno** | Devuelve una nueva `Signal<T>` | Devuelve una referencia `EffectRef` (para destrucción) |
| **Efectos Secundarios** | **Estrictamente prohibidos** (debe ser pura) | **Diseñado para efectos secundarios** (I/O, APIs) |
| **Casos de Uso Típicos** | Filtrar listas, cálculos matemáticos, formateo | Persistencia en `localStorage`, logging, sincronización DOM |

### 4. Implementación Final Consolidada de `GifService`

A continuación se muestra el código completo y definitivo de `GifService`, integrando la carga inicial de tendencias, la búsqueda HTTP, la caché reactiva y la persistencia automática en `localStorage`:

```typescript title="src/app/gifs/services/gifs.service.ts (Versión Definitiva con Persistencia)" hl_lines="1 9 11-15 26 34-37"
import { computed, effect, inject, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '@environments/environment';
import { Gif } from '../interfaces/gif.interface';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import { GifMapper } from '../mapper/gif.mapper';

const GIF_KEY = 'gifs';

const loadFromLocalStorage = (): Record<string, Gif[]> => {
  const gifsFromLocalStorage = localStorage.getItem(GIF_KEY) ?? '{}';
  const gifs = JSON.parse(gifsFromLocalStorage);
  return gifs;
};

@Service()
export class GifService {
  private http = inject(HttpClient);

  // Señales de Tendencias
  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal(true);

  // Señales de Historial y Caché (inicializadas desde LocalStorage)
  searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage());
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

  constructor() {
    this.loadTrendingGifs();
  }

  // Efecto reactivo: Sincroniza automáticamente cualquier cambio en searchHistory con LocalStorage
  saveGifsToLocalStorage = effect(() => {
    const historyString = JSON.stringify(this.searchHistory());
    localStorage.setItem(GIF_KEY, historyString);
  });

  loadTrendingGifs() {
    this.http
      .get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
        params: {
          api_key: environment.giphyApiKey,
          limit: 20,
        },
      })
      .subscribe((resp) => {
        const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
        this.trendingGifs.set(gifs);
        this.trendingGifsLoading.set(false);
      });
  }

  searchGifs(query: string): Observable<Gif[]> {
    return this.http
      .get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
        params: {
          api_key: environment.giphyApiKey,
          limit: 20,
          q: query,
        },
      })
      .pipe(
        map(({ data }) => data),
        map((items) => GifMapper.mapGiphyItemsToGifArray(items)),
        tap((items) => {
          this.searchHistory.update((history) => ({
            ...history,
            [query.toLowerCase()]: items,
          }));
        })
      );
  }

  getHistoryGifs(query: string): Gif[] {
    return this.searchHistory()[query.toLowerCase()] ?? [];
  }
}
```

### 5. Verificación en el Navegador

1. En el navegador, abre las Herramientas de Desarrollador (++f12++).
2. Dirígete a la pestaña **Application** (o **Almacenamiento**) → **Local Storage** → `http://localhost:4200`.
3. Navega al buscador y realiza varias búsquedas (ej: `goku`, `vegeta`, `sailor moon`).
4. Observa cómo la clave `gifs` actualiza su contenido JSON en tiempo real con cada búsqueda.
5. Recarga la página (++f5++):
    * Comprueba que las opciones del menú lateral se cargan inmediatamente.
    * Haz clic sobre cualquiera de los términos del historial: la ruta `/dashboard/history/:query` se abre de inmediato mostrando los GIFs almacenados en caché, sin realizar ninguna petición de red.

---

## 🧪 Evaluación y Preguntas para el Aula

!!! question "Pregunta 1: ¿Por qué creamos un Mapper (`GifMapper`) en lugar de usar directamente la respuesta de Giphy?"
    ??? success "Respuesta"
        Para aislar nuestra aplicación de cambios en la API externa. Si la API de Giphy cambia la estructura de sus imágenes o renombra propiedades, solo editamos el Mapper; nuestros componentes y plantillas continúan funcionando sin ninguna modificación.

!!! question "Pregunta 2: ¿Qué ventaja ofrece `toSignal()` frente a suscribirse manualmente a `ActivatedRoute.params`?"
    ??? success "Respuesta"
        `toSignal()` gestiona automáticamente la desuscripción cuando el componente se destruye, previniendo fugas de memoria (*memory leaks*), y expone el valor como una señal pura para componerla con `computed()`.

!!! question "Pregunta 3: ¿Por qué es preferible almacenar el historial como diccionario `{ [query]: Gif[] }` en vez de un simple array de textos?"
    ??? success "Respuesta"
        Porque funciona como una **Caché en Memoria**. Al almacenar los gifs asociados a cada término, si el usuario hace clic nuevamente en un término del historial, se muestran los gifs inmediatamente sin realizar una nueva petición HTTP a Giphy.

!!! question "Pregunta 4: ¿Por qué usamos `effect()` en lugar de `computed()` para sincronizar con `localStorage`?"
    ??? success "Respuesta"
        Porque escribir en `localStorage` es una operación de entrada/salida (*I/O*), lo cual constituye un efecto secundario (*side effect*). Las señales computadas (`computed()`) deben ser funciones puras sin efectos colaterales destinadas exclusivamente a derivar nuevos valores de lectura, mientras que `effect()` está específicamente diseñado para reaccionar a cambios en señales ejecutando tareas de sincronización, persistencia o interacción con APIs externas del navegador.

---

## 📖 Material de Referencia y Profundización

Para una comprensión exhaustiva de la comunicación HTTP y la reactividad combinada:

* **[Manual de Referencia: 05. Signals y Reactividad](manual/05-signals.md):** Fundamentos de `signal()`, `computed()`, `effect()` y reactividad granular.
* **[Manual de Referencia: 09. Servicios e Inyección de Dependencias](manual/09-servicios.md):** Inyección funcional con `inject()` y gestión de estado reactivo en servicios.
* **[Manual de Referencia: 10. Cliente HTTP y Comunicación con APIs](manual/10-http.md#seccion-4-signals-rxjs):** `provideHttpClient()`, Observables (RxJS), interoperabilidad con Signals (`toSignal()`, `toObservable()`), Resource API e interceptores funcionales.
* **[Manual de Referencia: 11. Angular Router y Navegación](manual/11-router.md):** Rutas dinámicas con parámetros (`:query`) y enlace de parámetros a inputs de componentes.