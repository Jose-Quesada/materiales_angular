# Pipes en Angular

## Objetivos de aprendizaje

1. Comprender el concepto de pipes y su función en la transformación de datos en plantillas Angular.
2. Dominar el uso de los pipes integrados más comunes (DatePipe, CurrencyPipe, DecimalPipe, PercentPipe, etc.).
3. Aprender a crear pipes personalizados mediante el decorador `@Pipe` y la interfaz `PipeTransform`.
4. Diferenciar entre pipes puros e impuros y conocer las implicaciones de rendimiento de cada tipo.
5. Saber encadenar múltiples pipes para realizar transformaciones compuestas.
6. Utilizar el AsyncPipe para gestionar suscripciones a Observables y Promesas en plantillas.
7. Aplicar buenas prácticas en la creación y uso de pipes en aplicaciones Angular profesionales.

## Resultados de aprendizaje

Al finalizar esta unidad, el alumnado será capaz de:

- Identificar y utilizar correctamente los pipes integrados de Angular en plantillas.
- Construir pipes personalizados que transformen datos según requisitos de negocio.
- Parametrizar pipes para dotarlos de flexibilidad.
- Seleccionar entre pipes puros e impuros según el contexto de uso.
- Encadenar pipes para realizar transformaciones múltiples de forma declarativa.
- Depurar datos en plantillas usando JsonPipe.
- Integrar el AsyncPipe con streams de datos asíncronos.

## Introducción

En el desarrollo de aplicaciones web modernas, los datos que recibimos de una API, de una base de datos o del propio usuario rara vez llegan en el formato exacto que necesitamos mostrar en la interfaz. Un valor monetario puede venir como un número decimal (1250.5) y necesitamos mostrarlo como "1.250,50 €". Una fecha ISO 8601 como "2026-06-05T14:30:00Z" debe presentarse como "5 de junio de 2026, 16:30". Un objeto complejo debe visualizarse durante la depuración sin necesidad de escribir `console.log`.

Angular proporciona un mecanismo elegante y declarativo para transformar datos en las plantillas: los **pipes**. Inspirados en los filtros de AngularJS pero rediseñados completamente, los pipes toman un valor de entrada, lo procesan mediante una función de transformación y devuelven un valor formateado para su visualización. La sintaxis es sencilla: `{{ valor | nombrePipe:param1:param2 }}`.

La importancia de los pipes radica en que separan la lógica de presentación de la lógica de negocio. Un componente no necesita saber cómo formatear una fecha para un locale específico; simplemente expone el valor crudo y delega en un pipe la responsabilidad de presentarlo correctamente. Esto hace que los componentes sean más limpios, las plantillas más legibles y el código más mantenible.

En esta unidad, exploraremos en profundidad el ecosistema de pipes en Angular: desde los pipes integrados que cubren las necesidades más comunes, hasta la creación de pipes personalizados que resuelven problemas específicos de dominio. También abordaremos conceptos avanzados como la pureza de los pipes, el encadenamiento y la interoperabilidad con el sistema de detección de cambios de Angular.

## Desarrollo teórico

### 1. Concepto de Pipe

Un pipe es una clase TypeScript decorada con `@Pipe` que implementa la interfaz `PipeTransform`. Esta interfaz obliga a implementar el método `transform(value: any, ...args: any[]): any`, que recibe un valor de entrada y cero o más parámetros adicionales, y devuelve el valor transformado.

Los pipes se aplican en las plantillas mediante el operador `|` (barra vertical o "pipe"), similar a las tuberías de los sistemas Unix donde la salida de un comando se convierte en la entrada del siguiente. Esta analogía es perfecta: los datos "fluyen" a través de los pipes, transformándose en cada paso.

```
{{ datoBruto | pipe1 | pipe2 | pipe3 }}
```

Cuando Angular detecta un cambio en `datoBruto`, vuelve a ejecutar la cadena de pipes, asegurando que la vista siempre refleje los datos actualizados.

### 2. Pipes integrados en Angular

Angular incluye un conjunto de pipes listos para usar que cubren las necesidades más comunes de transformación de datos. Estos pipes se importan desde `@angular/common` y están disponibles automáticamente cuando se usa `CommonModule` o la importación estándar de componentes standalone.

#### 2.1. DatePipe

El `DatePipe` formatea valores de fecha según el locale de la aplicación. Es uno de los pipes más utilizados y con mayor número de opciones de configuración.

**Firma del transform:**
```
transform(value: Date | string | number, format?: string, timezone?: string, locale?: string): string | null
```

**Formatos predefinidos:**

| Formato | Ejemplo (es-ES) | Descripción |
|---------|------------------|-------------|
| `'short'` | 05/06/26 14:30 | Fecha y hora cortas |
| `'medium'` | 5 jun 2026, 14:30:00 | Fecha y hora medias |
| `'long'` | 5 de junio de 2026, 14:30:00 CET | Fecha y hora largas |
| `'full'` | viernes, 5 de junio de 2026, 14:30 (hora central europea) | Fecha y hora completas |
| `'shortDate'` | 05/06/26 | Solo fecha corta |
| `'mediumDate'` | 5 jun 2026 | Solo fecha media |
| `'longDate'` | 5 de junio de 2026 | Solo fecha larga |
| `'fullDate'` | viernes, 5 de junio de 2026 | Solo fecha completa |
| `'shortTime'` | 14:30 | Solo hora corta |
| `'mediumTime'` | 14:30:00 | Solo hora media |
| `'longTime'` | 14:30:00 CET | Solo hora larga |
| `'fullTime'` | 14:30 (hora central europea) | Solo hora completa |

**Tokens de formato personalizado:**

Para formatos específicos, se pueden usar tokens:

| Token | Significado | Ejemplo |
|-------|-------------|---------|
| `yyyy` | Año con 4 dígitos | 2026 |
| `yy` | Año con 2 dígitos | 26 |
| `MMMM` | Mes completo | junio |
| `MMM` | Mes abreviado | jun |
| `MM` | Mes con 2 dígitos | 06 |
| `M` | Mes sin relleno | 6 |
| `dd` | Día con 2 dígitos | 05 |
| `d` | Día sin relleno | 5 |
| `EEEE` | Día de la semana completo | viernes |
| `EEE` | Día de la semana abreviado | vie |
| `HH` | Hora 24h con 2 dígitos | 14 |
| `hh` | Hora 12h con 2 dígitos | 02 |
| `mm` | Minutos con 2 dígitos | 30 |
| `ss` | Segundos con 2 dígitos | 00 |
| `a` | AM/PM | PM |

**Configuración de locale:**

Para que los pipes de localización (DatePipe, CurrencyPipe, DecimalPipe, PercentPipe) funcionen con el locale español, hay que registrar los datos de localización correspondientes:

```typescript
// app.config.ts
import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import localeEsExtra from '@angular/common/locales/extra/es';

registerLocaleData(localeEs, 'es-ES', localeEsExtra);

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'es-ES' }
  ]
};
```

**Ejemplos de DatePipe:**

```html
<!-- Usando formatos predefinidos -->
<p>Fecha corta: {{ fechaActual | date:'short' }}</p>
<!-- Resultado: Fecha corta: 05/06/26, 14:30 -->

<p>Fecha larga: {{ fechaActual | date:'longDate' }}</p>
<!-- Resultado: Fecha larga: 5 de junio de 2026 -->

<p>Hora media: {{ fechaActual | date:'mediumTime' }}</p>
<!-- Resultado: Hora media: 14:30:00 -->

<!-- Usando formatos personalizados -->
<p>Personalizado: {{ fechaActual | date:'dd/MM/yyyy HH:mm' }}</p>
<!-- Resultado: Personalizado: 05/06/2026 14:30 -->

<p>Día y mes: {{ fechaActual | date:"d 'de' MMMM 'de' yyyy" }}</p>
<!-- Resultado: Día y mes: 5 de junio de 2026 -->

<!-- Timezone específico -->
<p>UTC: {{ fechaActual | date:'medium':'UTC' }}</p>
<p>Hora local: {{ fechaActual | date:'medium':'+0200' }}</p>
```

> **Nota importante:** Las comillas simples dentro del formato permiten escapar texto literal. En el ejemplo anterior, las palabras 'de' se tratan como texto literal, no como tokens de formato.

#### 2.2. UpperCasePipe / LowerCasePipe

Transforman una cadena de texto a mayúsculas o minúsculas respectivamente. Son extremadamente simples pero muy útiles para normalizar la presentación de texto.

```html
<!-- UpperCasePipe -->
<p>{{ nombre | uppercase }}</p>
<!-- "juan garcía" → "JUAN GARCÍA" -->

<!-- LowerCasePipe -->
<p>{{ email | lowercase }}</p>
<!-- "Usuario@Dominio.COM" → "usuario@dominio.com" -->

<!-- Encadenados con otros pipes en situaciones reales -->
<p>{{ producto.nombre | uppercase }}</p>
<p>{{ codigoReferencia | lowercase }}</p>
```

#### 2.3. TitleCasePipe

Transforma un texto a formato de título: la primera letra de cada palabra en mayúscula y el resto en minúscula. Es útil para nombres propios, títulos de artículos o categorías.

```html
<p>{{ 'maría josé garcía lópez' | titlecase }}</p>
<!-- Resultado: "María José García López" -->

<p>{{ categoria | titlecase }}</p>
<!-- "electrónica de consumo" → "Electrónica De Consumo" -->
```

**Precaución:** El `TitleCasePipe` considera que una "palabra" es cualquier secuencia de caracteres alfanuméricos. Para apellidos compuestos o caracteres especiales, puede no comportarse como se espera. En esos casos, conviene crear un pipe personalizado.

#### 2.4. CurrencyPipe

Formatea valores numéricos como moneda según el locale configurado. Es muy versátil y permite especificar el código de moneda, si se muestra el símbolo o el código, y el número de dígitos decimales.

**Firma del transform:**
```
transform(value: number, currencyCode?: string, display?: 'code' | 'symbol' | 'symbol-narrow' | string | boolean, digitsInfo?: string, locale?: string): string | null
```

```html
<!-- Formato por defecto con locale es-ES -->
<p>Precio: {{ 1250.5 | currency:'EUR' }}</p>
<!-- Resultado: Precio: 1.250,50 € -->

<!-- Mostrando el código de moneda en lugar del símbolo -->
<p>Precio: {{ 1250.5 | currency:'EUR':'code' }}</p>
<!-- Resultado: Precio: EUR 1.250,50 -->

<!-- Símbolo narrow (reducido) -->
<p>Precio: {{ 1250.5 | currency:'USD':'symbol-narrow' }}</p>
<!-- Resultado: Precio: $1,250.50 -->

<!-- Especificando dígitos: mínimo 1 entero, 0-2 decimales -->
<p>Precio: {{ 1250.5 | currency:'EUR':'symbol':'1.0-2' }}</p>
<!-- Resultado: Precio: 1.250,50 € -->

<!-- Sin decimales -->
<p>Precio: {{ 1250.5 | currency:'EUR':'symbol':'1.0-0' }}</p>
<!-- Resultado: Precio: 1.250 € -->

<!-- Con 3 dígitos decimales fijos -->
<p>Precio: {{ 1250.5 | currency:'EUR':'symbol':'1.3-3' }}</p>
<!-- Resultado: Precio: 1.250,500 € -->

<!-- Otras monedas -->
<p>{{ 99.99 | currency:'JPY':'symbol' }}</p>
<!-- Resultado: ¥100 (JPY no tiene decimales por defecto) -->

<p>{{ 99.99 | currency:'GBP':'symbol' }}</p>
<!-- Resultado: £99.99 -->
```

**Formato de `digitsInfo`: `{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}`**

- `minIntegerDigits`: Número mínimo de dígitos enteros (rellena con ceros si es necesario).
- `minFractionDigits`: Número mínimo de dígitos decimales.
- `maxFractionDigits`: Número máximo de dígitos decimales.

#### 2.5. DecimalPipe

Formatea valores numéricos con separadores de miles y control de decimales, según el locale. También conocido como `number` pipe.

```html
<!-- Formato por defecto: 3 dígitos enteros mínimos, 0-3 decimales -->
<p>Cantidad: {{ 1234567.89 | number }}</p>
<!-- Resultado (es-ES): 1.234.567,89 -->
<!-- Resultado (en-US): 1,234,567.89 -->

<!-- Especificando formato decimal -->
<p>{{ 3.14159 | number:'1.0-2' }}</p>
<!-- Resultado: 3,14 -->

<p>{{ 3.14159 | number:'1.4-4' }}</p>
<!-- Resultado: 3,1416 (redondea a 4 decimales) -->

<p>{{ 5 | number:'3.0-0' }}</p>
<!-- Resultado: 005 (relleno a 3 dígitos enteros) -->

<p>{{ 1500000 | number:'1.0-0' }}</p>
<!-- Resultado: 1.500.000 -->
```

#### 2.6. PercentPipe

Multiplica el valor por 100 y añade el símbolo de porcentaje. Útil para mostrar ratios, descuentos o cualquier valor que represente un porcentaje.

```html
<!-- El valor debe estar entre 0 y 1 -->
<p>Descuento: {{ 0.15 | percent }}</p>
<!-- Resultado: 15 % -->

<!-- Especificando dígitos decimales -->
<p>Progreso: {{ 0.855 | percent:'1.1-2' }}</p>
<!-- Resultado: 85,50 % -->

<p>Tasa de conversión: {{ 0.0342 | percent:'1.2-2' }}</p>
<!-- Resultado: 3,42 % -->

<!-- Si se quiere mostrar un porcentaje ya calculado, no usar percent pipe -->
<!-- INCORRECTO: {{ 15 | percent }} → mostraría 1.500 %  -->
<!-- CORRECTO: {{ 15 }}% -->
```

#### 2.7. JsonPipe

Convierte un valor JavaScript a su representación JSON mediante `JSON.stringify()`. Es extremadamente útil para depuración, ya que permite visualizar la estructura completa de objetos, arrays y otros tipos de datos directamente en la plantilla sin necesidad de colocar breakpoints o `console.log` en el código TypeScript.

```html
<div>
  <h3>Depuración de datos del usuario</h3>
  <pre>{{ usuario | json }}</pre>
</div>
```

Resultado en pantalla:
```json
{
  "id": 42,
  "nombre": "Ana",
  "apellidos": "García López",
  "email": "ana@ejemplo.com",
  "roles": ["admin", "editor"],
  "direccion": {
    "calle": "Calle Mayor 12",
    "ciudad": "Sevilla",
    "cp": "41001"
  },
  "activo": true,
  "fechaRegistro": "2025-11-15T09:30:00.000Z"
}
```

**Buenas prácticas con JsonPipe:**
- Envolver el pipe en una etiqueta `<pre>` para mantener el formato y la indentación.
- Usarlo solo durante el desarrollo, no en producción.
- Si se necesita en producción (ej. mostrar respuestas de API), considerar limitar la profundidad o mostrar solo campos relevantes.

#### 2.8. SlicePipe

Crea un subconjunto de un array o una subcadena de un string. Funciona de forma similar al método `Array.prototype.slice()`.

**Firma:** `transform(value: any, start: number, end?: number): any`

```html
<!-- Con arrays -->
<ul>
  <li *ngFor="let item of items | slice:0:5">{{ item }}</li>
</ul>
<!-- Muestra solo los primeros 5 elementos del array -->

<!-- Con strings -->
<p>{{ textoLargo | slice:0:100 }}...</p>
<!-- Muestra los primeros 100 caracteres -->

<!-- Índices negativos -->
<p>{{ items | slice:-3 }}</p>
<!-- Muestra los últimos 3 elementos -->
```

> **Precaución:** En Angular moderno (v17+), con el nuevo Control Flow `@for`, el `SlicePipe` sigue siendo útil para limitar colecciones, pero se puede combinar sin problemas con `@for`.

#### 2.9. AsyncPipe

El `AsyncPipe` suscribe automáticamente a un `Observable` o `Promise` y devuelve el último valor emitido. Cuando el componente se destruye, cancela la suscripción automáticamente, evitando memory leaks.

Este pipe se estudiará en profundidad en la Unidad 10 (Peticiones HTTP), pero introducimos aquí su sintaxis básica:

```html
<!-- Con Observable -->
<p>Usuario: {{ usuario$ | async | json }}</p>

<!-- Con Promise -->
<p>Datos: {{ datosPromise | async }}</p>

<!-- Con alias (as) para usar el valor resuelto -->
<div *ngIf="usuario$ | async as usuario">
  <h2>{{ usuario.nombre }}</h2>
  <p>{{ usuario.email }}</p>
</div>
```

El `AsyncPipe` es **impuro** por naturaleza, ya que necesita reaccionar a cada nueva emisión del Observable/Promise. Esto es correcto y necesario para su funcionamiento.

#### 2.10. KeyValuePipe

Transforma un `Object` o `Map` en un array de pares clave-valor. Cada elemento del array resultante es un objeto con las propiedades `key` y `value`. Es la forma más limpia de iterar sobre las propiedades de un objeto en una plantilla.

**Firma:** `transform(input: Object | Map<any, any>, compareFn?: (a: KeyValue<K,V>, b: KeyValue<K,V>) => number): Array<KeyValue<K,V>>`

```html
<!-- Iterando sobre un objeto -->
<ul>
  <li *ngFor="let item of configuracion | keyvalue">
    <strong>{{ item.key }}:</strong> {{ item.value }}
  </li>
</ul>
```

```typescript
// En el componente
configuracion: Record<string, any> = {
  tema: 'oscuro',
  idioma: 'es',
  notificaciones: true,
  fontSize: 16
};
```

Resultado:
```
- tema: oscuro
- idioma: es
- notificaciones: true
- fontSize: 16
```

**Función de comparación opcional:**

Por defecto, las claves se ordenan alfabéticamente. Se puede proporcionar una función de comparación personalizada:

```typescript
// Componente
ordenOriginal = (a: KeyValue<string, any>, b: KeyValue<string, any>): number => {
  return 0; // Mantiene el orden de inserción (devuelve 0 = no reordenar)
};
```

```html
<ul>
  <li *ngFor="let item of configuracion | keyvalue:ordenOriginal">
    <strong>{{ item.key }}:</strong> {{ item.value }}
  </li>
</ul>
```

#### 2.11. I18nPluralPipe e I18nSelectPipe

Son pipes para internacionalización (i18n) que permiten mostrar mensajes diferentes según valores numéricos o de cadena.

**I18nPluralPipe:** Muestra un mensaje según un valor numérico (pluralización).

```typescript
// En el componente
mensajesPlural: Record<string, string> = {
  '=0': 'No hay mensajes nuevos.',
  '=1': 'Hay un mensaje nuevo.',
  'other': 'Hay # mensajes nuevos.' // # se reemplaza por el valor
};
```

```html
<p>{{ numeroMensajes | i18nPlural:mensajesPlural }}</p>
```

**I18nSelectPipe:** Muestra un mensaje según el valor de una cadena.

```typescript
// En el componente
genero: string = 'femenino';

mensajesGenero: Record<string, string> = {
  'masculino': 'Bienvenido',
  'femenino': 'Bienvenida',
  'otro': 'Bienvenide'
};
```

```html
<p>{{ genero | i18nSelect:mensajesGenero }}</p>
<!-- Resultado: Bienvenida -->
```

Aunque la tendencia actual es usar `@if` y `@switch` para estos casos, estos pipes son útiles en contextos de internacionalización con Angular.

### 3. Pipes personalizados

Cuando los pipes integrados no cubren las necesidades específicas del dominio, Angular permite crear pipes personalizados. Un pipe personalizado es una clase TypeScript con el decorador `@Pipe` que implementa la interfaz `PipeTransform`.

#### 3.1. Creación con @Pipe

Estructura básica de un pipe personalizado standalone:

```typescript
// truncate.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',          // Nombre usado en las plantillas
  standalone: true,          // Permite usarlo sin NgModules
  pure: true                 // Pipe puro (comportamiento por defecto)
})
export class TruncatePipe implements PipeTransform {

  /**
   * Trunca un texto a una longitud máxima y añade puntos suspensivos.
   * @param value - El texto a truncar
   * @param limit - Longitud máxima antes de truncar (default: 80)
   * @param trail - Caracteres finales tras truncar (default: '...')
   * @returns El texto truncado o el texto original si no supera el límite
   */
  transform(value: string, limit: number = 80, trail: string = '...'): string {
    if (!value || typeof value !== 'string') {
      return '';
    }

    if (value.length <= limit) {
      return value;
    }

    return value.substring(0, limit).trimEnd() + trail;
  }
}
```

**Uso en la plantilla:**

```html
<p>{{ descripcionLarga | truncate:150 }}</p>
<p>{{ titulo | truncate:30:'…' }}</p>
```

#### 3.2. Uso en componentes standalone

Para usar un pipe personalizado en un componente standalone, se debe importar en el array `imports` del componente:

```typescript
// producto-card.component.ts
import { Component, Input } from '@angular/core';
import { TruncatePipe } from './pipes/truncate.pipe';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-producto-card',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, TruncatePipe],
  template: `
    <div class="card">
      <h3>{{ producto.nombre }}</h3>
      <p class="descripcion">{{ producto.descripcion | truncate:120 }}</p>
      <p class="precio">{{ producto.precio | currency:'EUR' }}</p>
      <p class="fecha">{{ producto.fechaAlta | date:'longDate' }}</p>
    </div>
  `
})
export class ProductoCardComponent {
  @Input() producto!: Producto;
}
```

### 4. Pipes parametrizados

Los pipes aceptan parámetros que se pasan mediante el carácter `:` (dos puntos). Cada parámetro adicional se separa con otro `:`.

```html
{{ valor | nombrePipe:parametro1:parametro2:parametro3 }}
```

El método `transform` recibe estos parámetros en orden:

```typescript
transform(value: any, param1: any, param2: any, param3: any): any {
  // Implementación
}
```

**Ejemplo: pipe de filtro con múltiples parámetros**

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtrar',
  standalone: true,
  pure: true
})
export class FiltrarPipe implements PipeTransform {

  /**
   * Filtra un array de objetos por un campo y valor.
   * @param items - Array a filtrar
   * @param campo - Nombre del campo por el que filtrar
   * @param valor - Valor a buscar en el campo
   * @returns Array filtrado
   */
  transform(items: any[], campo: string, valor: string): any[] {
    if (!items || !campo || valor === undefined || valor === null || valor === '') {
      return items;
    }

    const termino = valor.toLowerCase();

    return items.filter(item => {
      const valorCampo = item[campo];
      if (typeof valorCampo === 'string') {
        return valorCampo.toLowerCase().includes(termino);
      }
      return String(valorCampo).toLowerCase().includes(termino);
    });
  }
}
```

```html
<input [(ngModel)]="terminoBusqueda" placeholder="Buscar..." />
<ul>
  <li *ngFor="let producto of productos | filtrar:'nombre':terminoBusqueda">
    {{ producto.nombre }}
  </li>
</ul>
```

### 5. Pipes puros e impuros

#### 5.1. Diferencia fundamental

La propiedad `pure` del decorador `@Pipe` determina cómo Angular detecta cambios para el pipe:

**Pipe puro (`pure: true`, por defecto):**
- Angular solo recalcula el pipe si cambia la referencia del valor de entrada (primitivos) o la referencia del objeto/array (tipos complejos).
- Si se añade un elemento a un array (`push`), el pipe no se recalcula porque la referencia no cambió.
- Si se crea un nuevo array (`[...array, nuevoElemento]`), el pipe sí se recalcula.
- Los pipes integrados DatePipe, CurrencyPipe, DecimalPipe, PercentPipe, UpperCasePipe, LowerCasePipe, TitleCasePipe, JsonPipe y SlicePipe son todos puros.

**Pipe impuro (`pure: false`):**
- Angular recalcula el pipe en cada ciclo de detección de cambios, independientemente de si han cambiado las referencias.
- Esto tiene un **alto impacto en el rendimiento**, ya que el transform se ejecuta constantemente.
- Solo se debe usar cuando sea estrictamente necesario.

#### 5.2. Cuándo usar cada uno

**Pipes puros:** Para la gran mayoría de casos. Transformaciones basadas en el valor de entrada que solo deben actualizarse cuando cambie dicho valor.

**Pipes impuros:** En escenarios muy concretos:
1. Cuando el pipe depende de estado externo mutable que no se refleja en cambios de referencia (ej. cambios en una propiedad de un objeto dentro de un array).
2. AsyncPipe (necesita ser impuro para reaccionar a nuevas emisiones).
3. Pipes que filtrar arrays en tiempo real donde no se quiere crear nuevos arrays.

**Alternativa recomendada a los pipes impuros para arrays:**

En lugar de usar un pipe impuro para filtrar arrays (que es muy común pero ineficiente), se recomienda filtrar en el componente o usar un enfoque reactivo:

```typescript
// Enfoque recomendado: filtrar en el componente
@Component({...})
export class ListaComponent {
  private productos: Producto[] = [];
  terminoBusqueda = signal('');

  productosFiltrados = computed(() => {
    const termino = this.terminoBusqueda().toLowerCase();
    if (!termino) return this.productos;

    return this.productos.filter(p =>
      p.nombre.toLowerCase().includes(termino)
    );
  });

  actualizarBusqueda(texto: string): void {
    this.terminoBusqueda.set(texto);
  }
}
```

```html
<input (input)="actualizarBusqueda($any($event.target).value)" />
<ul>
  @for (producto of productosFiltrados(); track producto.id) {
    <li>{{ producto.nombre }}</li>
  }
</ul>
```

#### 5.3. Problemas de rendimiento con pipes impuros

En aplicaciones medianas o grandes, un pipe impuro puede ejecutarse cientos de veces por segundo. Si ese pipe realiza operaciones costosas (iterar arrays grandes, hacer llamadas HTTP, realizar cálculos complejos), el rendimiento de la aplicación se degradará notablemente.

**Problemas típicos:**
- Lentitud en formularios (cada pulsación de tecla dispara la detección de cambios).
- Animaciones entrecortadas.
- Consumo excesivo de batería en dispositivos móviles.
- Posibles bucles infinitos si el pipe modifica estado que a su vez dispara cambios.

### 6. Encadenamiento de pipes

Los pipes pueden encadenarse para aplicar múltiples transformaciones secuenciales. El orden es importante: el pipe de la izquierda se ejecuta primero y su salida alimenta al siguiente.

```html
<!-- Primero slice, luego uppercase -->
<p>{{ descripcion | slice:0:100 | uppercase }}</p>

<!-- Primero currency, luego uppercase (poco común pero ilustrativo) -->
<p>{{ precio | currency:'EUR' | uppercase }}</p>

<!-- Ejemplo práctico: fecha formateada en mayúsculas -->
<p>{{ fecha | date:'fullDate' | uppercase }}</p>
<!-- Resultado: VIERNES, 5 DE JUNIO DE 2026 -->

<!-- Combinación con async pipe (siempre al final) -->
<p>{{ datosUsuario$ | async | json }}</p>
```

**Reglas de encadenamiento:**
- El tipo de salida de un pipe debe ser compatible con el tipo de entrada del siguiente.
- `AsyncPipe` suele colocarse primero, seguido de pipes de transformación.
- `JsonPipe` debe ir al final (convierte a string).
- Evitar cadenas excesivamente largas que dificulten la lectura.

## Ejemplos guiados

### Ejemplo 1: Pipe personalizado para filtrar arrays

Vamos a crear un pipe que permita filtrar una lista de elementos por un campo de búsqueda, útil para implementar barras de búsqueda en listados.

```typescript
// pipes/buscar.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'buscar',
  standalone: true,
  pure: true
})
export class BuscarPipe implements PipeTransform {

  /**
   * Busca en un array de objetos filtrando por el texto en cualquier campo.
   * @param items - Array de objetos a filtrar
   * @param termino - Texto de búsqueda
   * @param campos - Lista de campos donde buscar (si no se especifica, busca en todos)
   */
  transform<T extends Record<string, any>>(
    items: T[],
    termino: string,
    campos?: string[]
  ): T[] {
    if (!items || !Array.isArray(items)) {
      return [];
    }

    if (!termino || termino.trim() === '') {
      return items;
    }

    const terminoLower = termino.toLowerCase().trim();

    return items.filter(item => {
      if (campos && campos.length > 0) {
        // Buscar solo en los campos especificados
        return campos.some(campo => {
          const valor = item[campo];
          return valor != null && String(valor).toLowerCase().includes(terminoLower);
        });
      } else {
        // Buscar en todos los campos
        return Object.values(item).some(valor =>
          valor != null && String(valor).toLowerCase().includes(terminoLower)
        );
      }
    });
  }
}
```

**Uso en un componente de listado:**

```typescript
// lista-usuarios.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { BuscarPipe } from '../pipes/buscar.pipe';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  ciudad: string;
  activo: boolean;
}

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [BuscarPipe],
  template: `
    <div class="busqueda">
      <input
        type="text"
        placeholder="Buscar usuarios..."
        [value]="termino()"
        (input)="termino.set($any($event.target).value)"
      />
    </div>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Email</th>
          <th>Ciudad</th>
          <th>Activo</th>
        </tr>
      </thead>
      <tbody>
        @for (usuario of usuarios | buscar:termino():['nombre', 'email', 'ciudad']; track usuario.id) {
          <tr>
            <td>{{ usuario.id }}</td>
            <td>{{ usuario.nombre }}</td>
            <td>{{ usuario.email }}</td>
            <td>{{ usuario.ciudad }}</td>
            <td>{{ usuario.activo ? 'Sí' : 'No' }}</td>
          </tr>
        } @empty {
          <tr>
            <td colspan="5">No se encontraron usuarios con "{{ termino() }}"</td>
          </tr>
        }
      </tbody>
    </table>
  `,
  styles: [`
    .busqueda { margin-bottom: 1rem; }
    .busqueda input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 1rem;
    }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 0.5rem; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #f5f5f5; }
  `]
})
export class ListaUsuariosComponent implements OnInit {
  termino = signal<string>('');
  usuarios: Usuario[] = [];

  ngOnInit(): void {
    // Simulación de datos
    this.usuarios = [
      { id: 1, nombre: 'Ana García', email: 'ana@email.com', ciudad: 'Sevilla', activo: true },
      { id: 2, nombre: 'Carlos López', email: 'carlos@email.com', ciudad: 'Málaga', activo: true },
      { id: 3, nombre: 'María Rodríguez', email: 'maria@email.com', ciudad: 'Granada', activo: false },
      { id: 4, nombre: 'Pedro Martínez', email: 'pedro@email.com', ciudad: 'Sevilla', activo: true },
      { id: 5, nombre: 'Laura Sánchez', email: 'laura@email.com', ciudad: 'Córdoba', activo: true },
      { id: 6, nombre: 'José Fernández', email: 'jose@email.com', ciudad: 'Huelva', activo: false },
      { id: 7, nombre: 'Carmen Ruiz', email: 'carmen@email.com', ciudad: 'Cádiz', activo: true },
      { id: 8, nombre: 'Antonio Díaz', email: 'antonio@email.com', ciudad: 'Jaén', activo: true },
    ];
  }
}
```

### Ejemplo 2: Pipe parametrizado para formatear números de teléfono

En España, los números de teléfono suelen formatearse como `+34 612 345 678` o `612 34 56 78`. Vamos a crear un pipe flexible que soporte distintos formatos.

```typescript
// pipes/telefono.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

type FormatoTelefono = 'nacional' | 'internacional' | 'puntos' | 'guiones';

@Pipe({
  name: 'telefono',
  standalone: true,
  pure: true
})
export class TelefonoPipe implements PipeTransform {

  private readonly PREFIJO_ESPANA = '+34';

  /**
   * Formatea un número de teléfono español en varios formatos.
   * @param telefono - Número de teléfono como string (ej: '612345678')
   * @param formato - Formato deseado: 'nacional', 'internacional', 'puntos', 'guiones'
   */
  transform(telefono: string | number, formato: FormatoTelefono = 'nacional'): string {
    if (!telefono) {
      return '';
    }

    // Normalizar: eliminar todo excepto dígitos
    let digitos = String(telefono).replace(/\D/g, '');

    // Si no empieza con prefijo español, puede ser un número sin prefijo
    if (digitos.length === 9) {
      // Es un número móvil español sin prefijo
    } else if (digitos.startsWith('34') && digitos.length === 11) {
      digitos = digitos.substring(2); // Quitar 34 inicial
    } else {
      // Otros casos: devolver formato básico
      return digitos;
    }

    return this.aplicarFormato(digitos, formato);
  }

  private aplicarFormato(digitos: string, formato: FormatoTelefono): string {
    switch (formato) {
      case 'nacional':
        // 612 34 56 78
        return `${digitos.substring(0, 3)} ${digitos.substring(3, 5)} ${digitos.substring(5, 7)} ${digitos.substring(7, 9)}`;

      case 'internacional':
        // +34 612 34 56 78
        return `${this.PREFIJO_ESPANA} ${digitos.substring(0, 3)} ${digitos.substring(3, 5)} ${digitos.substring(5, 7)} ${digitos.substring(7, 9)}`;

      case 'puntos':
        // 612.34.56.78
        return `${digitos.substring(0, 3)}.${digitos.substring(3, 5)}.${digitos.substring(5, 7)}.${digitos.substring(7, 9)}`;

      case 'guiones':
        // 612-34-56-78
        return `${digitos.substring(0, 3)}-${digitos.substring(3, 5)}-${digitos.substring(5, 7)}-${digitos.substring(7, 9)}`;

      default:
        return digitos;
    }
  }
}
```

**Uso:**

```html
<p>Nacional: {{ '612345678' | telefono:'nacional' }}</p>
<!-- Resultado: Nacional: 612 34 56 78 -->

<p>Internacional: {{ '612345678' | telefono:'internacional' }}</p>
<!-- Resultado: Internacional: +34 612 34 56 78 -->

<p>Puntos: {{ '612345678' | telefono:'puntos' }}</p>
<!-- Resultado: Puntos: 612.34.56.78 -->

<p>Guiones: {{ '612345678' | telefono:'guiones' }}</p>
<!-- Resultado: Guiones: 612-34-56-78 -->

<!-- También acepta números con formato -->
<p>{{ '+34 612 345 678' | telefono:'puntos' }}</p>
<!-- Resultado: 612.34.56.78 -->
```

### Ejemplo 3: Pipe para truncar texto con ellipsis

Un pipe muy común en aplicaciones web es el que trunca texto largo y añade puntos suspensivos (ellipsis). Veamos una implementación robusta:

```typescript
// pipes/tail.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tail',
  standalone: true,
  pure: true
})
export class TailPipe implements PipeTransform {

  /**
   * Trunca un texto a una longitud máxima, evitando cortar palabras a la mitad
   * si se especifica la opción correspondiente.
   *
   * @param valor - Texto a truncar
   * @param longitud - Longitud máxima (default: 100)
   * @param sufijo - Cadena a añadir al final (default: '...')
   * @param respetarPalabras - Si true, evita cortar palabras (default: true)
   */
  transform(
    valor: string,
    longitud: number = 100,
    sufijo: string = '...',
    respetarPalabras: boolean = true
  ): string {
    if (!valor || typeof valor !== 'string') {
      return '';
    }

    if (valor.length <= longitud) {
      return valor;
    }

    if (respetarPalabras) {
      // Buscar el último espacio antes de la longitud máxima
      const truncado = valor.substring(0, longitud);
      const ultimoEspacio = truncado.lastIndexOf(' ');

      if (ultimoEspacio > 0) {
        return truncado.substring(0, ultimoEspacio) + sufijo;
      }
    }

    return valor.substring(0, longitud) + sufijo;
  }
}
```

**Uso en plantilla:**

```html
<div class="tarjeta-noticia">
  <h3>{{ noticia.titulo }}</h3>
  <p class="resumen">{{ noticia.contenido | tail:150 }}</p>
  <p class="meta">
    {{ noticia.autor }} |
    {{ noticia.fecha | date:'longDate' }}
  </p>
</div>
```

## Ejercicios resueltos

### Ejercicio 1: Pipe para convertir temperaturas

**Enunciado:** Crear un pipe que convierta temperaturas entre grados Celsius y Fahrenheit. Debe ser parametrizable para indicar la dirección de la conversión y el número de decimales.

```typescript
// pipes/temperatura.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

type UnidadTemperatura = 'C' | 'F';
type DireccionConversion = 'toF' | 'toC';

@Pipe({
  name: 'temperatura',
  standalone: true,
  pure: true
})
export class TemperaturaPipe implements PipeTransform {

  /**
   * Convierte temperaturas entre Celsius y Fahrenheit.
   * @param valor - Valor numérico de temperatura
   * @param desde - Unidad de origen ('C' o 'F')
   * @param hacia - Unidad de destino ('toF' o 'toC')
   * @param decimales - Número de decimales (default: 1)
   */
  transform(
    valor: number,
    desde: UnidadTemperatura = 'C',
    hacia: DireccionConversion = 'toF',
    decimales: number = 1
  ): string {
    if (valor == null || isNaN(valor)) {
      return '--';
    }

    let resultado: number;

    if (desde === 'C' && hacia === 'toF') {
      resultado = (valor * 9 / 5) + 32;
    } else if (desde === 'F' && hacia === 'toC') {
      resultado = (valor - 32) * 5 / 9;
    } else if (desde === 'C' && hacia === 'toC') {
      // Misma unidad, no necesita conversión
      resultado = valor;
    } else if (desde === 'F' && hacia === 'toF') {
      // Misma unidad, no necesita conversión
      resultado = valor;
    } else {
      return '--'; // Combinación no válida
    }

    return `${resultado.toFixed(decimales)}°${hacia === 'toF' ? 'F' : 'C'}`;
  }
}
```

**Uso en plantilla:**

```html
<table>
  <tr>
    <th>Ciudad</th>
    <th>Celsius</th>
    <th>Fahrenheit</th>
  </tr>
  <tr>
    <td>Sevilla</td>
    <td>35°C</td>
    <td>{{ 35 | temperatura:'C':'toF':1 }}</td>
    <!-- Resultado: 95.0°F -->
  </tr>
  <tr>
    <td>Nueva York</td>
    <td>{{ 86 | temperatura:'F':'toC':1 }}</td>
    <!-- Resultado: 30.0°C -->
    <td>86°F</td>
  </tr>
  <tr>
    <td>Londres</td>
    <td>18°C</td>
    <td>{{ 18 | temperatura:'C':'toF' }}</td>
    <!-- Resultado: 64.4°F -->
  </tr>
</table>
```

### Ejercicio 2: Pipe para resaltar texto de búsqueda

**Enunciado:** Implementar un pipe que, dado un texto y un término de búsqueda, envuelva las coincidencias en una etiqueta `<mark>` o `<strong>` para resaltarlas visualmente. Debe devolver HTML seguro usando `DomSanitizer`.

```typescript
// pipes/resaltar.pipe.ts
import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'resaltar',
  standalone: true,
  pure: true
})
export class ResaltarPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  /**
   * Resalta las ocurrencias de un término de búsqueda dentro de un texto.
   * @param texto - Texto donde buscar
   * @param termino - Término a resaltar
   * @param clase - Clase CSS para el marcado (default: 'resaltado')
   */
  transform(texto: string, termino: string, clase: string = 'resaltado'): SafeHtml {
    if (!texto || !termino || termino.trim() === '') {
      return texto || '';
    }

    // Escapar caracteres especiales de regex
    const terminoEscapado = termino.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Crear regex insensible a mayúsculas/minúsculas
    const regex = new RegExp(`(${terminoEscapado})`, 'gi');

    // Reemplazar coincidencias con etiqueta mark
    const resultado = texto.replace(regex, `<mark class="${clase}">$1</mark>`);

    // Sanitizar el HTML antes de devolverlo (importante por seguridad)
    return this.sanitizer.bypassSecurityTrustHtml(resultado);
  }
}
```

**Uso en plantilla:**

```typescript
// resultado-busqueda.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ResaltarPipe } from '../pipes/resaltar.pipe';

@Component({
  selector: 'app-resultado-busqueda',
  standalone: true,
  imports: [FormsModule, ResaltarPipe],
  template: `
    <div class="buscador">
      <input [(ngModel)]="termino" placeholder="Buscar en el texto..." />
    </div>

    <div class="texto-busqueda" [innerHTML]="texto | resaltar:termino">
    </div>
  `,
  styles: [`
    .buscador { margin-bottom: 1rem; }
    .buscador input {
      width: 100%;
      padding: 0.5rem;
      font-size: 1rem;
    }
    .texto-busqueda {
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      line-height: 1.6;
      background-color: #fafafa;
    }
    /* Estilo para el texto resaltado */
    ::ng-deep mark.resaltado {
      background-color: #ffeb3b;
      color: #333;
      padding: 0 2px;
      border-radius: 2px;
      font-weight: bold;
    }
  `]
})
export class ResultadoBusquedaComponent {
  termino: string = '';

  texto: string = `Angular es un framework de desarrollo web mantenido por Google.
  Se utiliza para crear aplicaciones web de una sola página (SPA) y aplicaciones
  móviles. Angular utiliza TypeScript como lenguaje principal y ofrece características
  como inyección de dependencias, enrutamiento, formularios reactivos y comunicación
  con servidores mediante HTTP. La arquitectura de Angular se basa en componentes y
  servicios, lo que facilita la organización del código y la reutilización.`;
}
```

**Nota importante sobre seguridad:** Este pipe utiliza `bypassSecurityTrustHtml` porque estamos generando HTML dinámico. Esto es seguro en este contexto porque solo estamos insertando etiquetas `<mark>` con clase controlada, y el texto original proviene de datos propios. **Nunca** se debe usar `bypassSecurityTrustHtml` con contenido proporcionado por el usuario sin sanitizar adecuadamente, ya que abre la puerta a ataques XSS.

## Actividades propuestas

### Actividad 1: Sistema de filtrado avanzado (Nivel básico)

**Descripción:** Crear un componente que muestre una tabla de productos con la capacidad de filtrar por nombre, categoría y rango de precio.

**Tareas:**
1. Crear un array de al menos 12 productos con campos: id, nombre, categoría, precio, stock, fechaAlta.
2. Crear un pipe `filtrarProductos` que acepte un array de productos, un término de búsqueda (nombre) y una categoría.
3. Añadir controles de filtro en la plantilla (input text + select de categorías).
4. Combinar el pipe personalizado con `CurrencyPipe` para los precios y `DatePipe` para las fechas.
5. Usar `@for` con `@empty` para mostrar un mensaje cuando no haya resultados.

**Duración estimada:** 1 hora.

### Actividad 2: Formateador de DNI/NIF (Nivel medio)

**Descripción:** Implementar un pipe que formatee números de DNI y NIF españoles.

**Tareas:**
1. Crear un pipe `dni` que acepte un string con 8 dígitos + letra o sin letra.
2. Si solo recibe dígitos, calcular la letra del DNI automáticamente (dividir entre 23 y usar la tabla TRWAGMYFPDXBNJZSQVHLCKE).
3. Formatear con puntos de millares: "12345678Z" → "12.345.678-Z".
4. Permitir un parámetro para formatear como NIE si empieza con X, Y, Z.
5. Validar la letra y marcar visualmente si es incorrecta (añadiendo clase CSS).

**Duración estimada:** 1.5 horas.

### Actividad 3: Pipe de duración para multimedia (Nivel medio)

**Descripción:** Desarrollar un pipe que convierta segundos en un formato legible de tiempo (horas:minutos:segundos), útil para aplicaciones de reproducción de audio/vídeo.

**Tareas:**
1. Crear un pipe `duracion` que convierta un número (segundos totales) a formato `HH:MM:SS` o `MM:SS`.
2. Si son más de 3600 segundos, mostrar horas; en caso contrario, solo minutos y segundos.
3. Parametrizar para permitir diferentes estilos: `'corto'` (1h 23m), `'completo'` (01:23:45), `'texto'` (1 hora, 23 minutos, 45 segundos).
4. Crear un componente demo que tenga un slider de tiempo y muestre la conversión en los tres formatos simultáneamente.

**Duración estimada:** 1 hora.

### Actividad 4: Pipe de iniciales para avatares (Nivel básico)

**Descripción:** Crear un pipe que extraiga las iniciales de un nombre completo para mostrarlas en avatares cuando no hay imagen disponible.

**Tareas:**
1. Crear un pipe `iniciales` que reciba un string con nombre y apellidos.
2. Extraer la primera letra del nombre y la primera letra del primer apellido.
3. Devolverlas en mayúsculas: "Ana García López" → "AG".
4. Si solo hay un nombre, devolver sus dos primeras letras: "María" → "MA".
5. Parametrizar el número máximo de iniciales (1, 2 o 3).
6. Usarlo en un componente que simule una lista de contactos con avatares circulares.

**Duración estimada:** 45 minutos.

### Actividad 5: Pipe de ordinales (Nivel avanzado)

**Descripción:** Implementar un pipe que convierta un número entero en su representación ordinal en español: 1 → "primero/a", 2 → "segundo/a", etc.

**Tareas:**
1. Crear un pipe `ordinal` con soporte para masculino y femenino (parametrizable).
2. Implementar un mapeo para números del 1 al 100.
3. Soportar también números especiales (11º, 12º, etc.)
4. Añadir un parámetro opcional para formato abreviado (1.º, 2.ª) usando caracteres Unicode.
5. Probar con una lista de elementos que se ordenan y enumeran automáticamente.

**Duración estimada:** 2 horas.

## Actividades de ampliación

### Actividad de ampliación 1: Pipe de diferencia temporal (Time Ago)

**Descripción:** Crear un pipe que muestre el tiempo transcurrido desde una fecha hasta ahora, al estilo de redes sociales ("hace 2 horas", "ayer", "hace 3 días"). A diferencia del DatePipe que muestra fechas absolutas, este pipe muestra tiempos relativos que se actualizan en tiempo real.

**Tareas:**
1. Crear un pipe impuro `tiempoRelativo` que calcule la diferencia entre la fecha de entrada y el momento actual.
2. Implementar lógica de cálculo: segundos → "ahora mismo", minutos → "hace X minutos", horas → "hace X horas", días → "ayer" / "hace X días", semanas → "la semana pasada" / "hace X semanas", meses → "el mes pasado" / "hace X meses", años → "el año pasado" / "hace X años".
3. Al ser impuro, implementar un mecanismo de caché interna para no recalcular innecesariamente (guardar último valor y timestamp).
4. Añadir un parámetro `actualizar` (booleano) que permita desactivar la actualización automática en listas grandes.
5. Crear un componente demo que muestre una lista de mensajes con sus timestamps relativos.

**Duración estimada:** 2 horas.

### Actividad de ampliación 2: Pipe de enmascaramiento de datos sensibles

**Descripción:** Diseñar un pipe que enmascare datos sensibles como números de tarjeta de crédito, emails y teléfonos, mostrando solo parte de la información.

**Tareas:**
1. Crear un pipe `enmascarar` con parámetro de tipo (`'email'`, `'tarjeta'`, `'telefono'`).
2. Email: "ana.garcia@email.com" → "a***a@email.com".
3. Tarjeta: "1234567812345678" → "**** **** **** 5678".
4. Teléfono: "612345678" → "*** *** 678".
5. Permitir personalizar el carácter de enmascaramiento (por defecto `*`).
6. Crear un componente que muestre una lista de datos personales con toggle para mostrar/ocultar datos.

**Duración estimada:** 1.5 horas.

### Actividad de ampliación 3: Pipe de traducción dinámica

**Descripción:** Implementar un pipe simple de traducción que use un diccionario en memoria para traducir claves a textos en diferentes idiomas.

**Tareas:**
1. Crear un servicio `I18nService` que almacene un diccionario de traducciones (es, en, fr).
2. Crear un pipe impuro `traducir` que use el servicio para resolver claves de traducción.
3. Implementar cambio de idioma reactivo usando Signals en el servicio.
4. Soportar interpolación de parámetros: `'Bienvenido {{nombre}}'` → "Bienvenido Ana".
5. Soportar pluralización simple con el pipe.
6. Crear un componente demo con selector de idioma y varios textos traducidos.

**Duración estimada:** 2.5 horas.

## Buenas prácticas profesionales

1. **Nombrado coherente:** Usar nombres descriptivos en minúscula para los pipes, sin guiones ni camelCase: `truncate`, `capitalizeFirst`, `filterBy`. El nombre debe transmitir claramente lo que hace el pipe con solo leerlo.

   ```typescript
   // ✅ Bueno
   @Pipe({ name: 'formatearTelefono' })

   // ❌ Evitar
   @Pipe({ name: 'fmtTel' })
   @Pipe({ name: 'telefono-pipe' })
   ```

2. **Pipes puros por defecto:** A menos que haya una razón de peso, todos los pipes deben ser puros (`pure: true`). Esto permite que Angular optimice la detección de cambios y evita ejecuciones innecesarias. Si se necesita un pipe impuro, primero considerar alternativas como mover la lógica al componente con `computed()`.

3. **Validación de entrada robusta:** El método `transform` debe ser defensivo y manejar valores nulos, undefined, tipos incorrectos y edge cases sin lanzar excepciones. Un pipe nunca debería romper la aplicación.

   ```typescript
   transform(value: any, ...args: any[]): any {
     // Validaciones defensivas al inicio
     if (value == null) {
       return ''; // Valor por defecto seguro
     }

     if (typeof value !== 'string') {
       console.warn('Pipe truncate: se esperaba string, recibido', typeof value);
       return String(value); // Conversión segura
     }

     // Lógica del pipe...
   }
   ```

4. **No realizar operaciones asíncronas en pipes:** Los pipes deben ser funciones síncronas puras. No se deben hacer llamadas HTTP, accesos a localStorage o cualquier operación con efectos secundarios dentro de `transform`. Para operaciones asíncronas, usar `AsyncPipe` o procesar los datos en el componente/servicio.

5. **Evitar pipes impuros para filtrado:** Es uno de los antipatrones más comunes. Un pipe impuro de filtrado se ejecuta en cada ciclo de detección de cambios, incluso cuando el usuario está escribiendo en otro campo del formulario. La solución correcta es usar `computed()` en el componente o aplicar el filtro en el servicio.

6. **Inmutabilidad con pipes puros:** Cuando se usa un pipe puro con arrays u objetos, es necesario crear nuevas referencias al modificar los datos para que el pipe detecte el cambio. Usar spread operator, `map`, `filter` (devuelven nuevos arrays) en lugar de `push`, `splice`, `sort` (modifican el array original).

   ```typescript
   // ✅ El pipe detectará el cambio
   this.productos = [...this.productos, nuevoProducto];

   // ❌ El pipe NO detectará el cambio
   this.productos.push(nuevoProducto);
   ```

7. **No abusar del encadenamiento:** Encadenar más de 3 pipes dificulta la lectura y depuración. Si se necesita una transformación compleja, crear un pipe específico que la realice completa o hacerla en el componente.

   ```html
   <!-- ❌ Difícil de leer y depurar -->
   <p>{{ texto | pipe1:arg1 | pipe2:arg2 | pipe3:arg3 | pipe4 | pipe5:arg5 }}</p>

   <!-- ✅ Pipe específico o lógica en componente -->
   <p>{{ texto | transformarParaPresentacion }}</p>
   ```

8. **Documentar los pipes con JSDoc:** Cada pipe personalizado debe incluir documentación JSDoc que describa su propósito, parámetros esperados, valores de retorno y ejemplos de uso. Esto facilita el mantenimiento y permite que otros desarrolladores comprendan rápidamente su funcionamiento.

## Errores frecuentes

1. **Modificar el valor de entrada directamente:** El método `transform` nunca debe mutar el valor recibido. Si se necesita modificar un array u objeto, crear una copia.

   ```typescript
   // ❌ Incorrecto: muta el array original
   transform(items: any[]): any[] {
     return items.sort(); // sort() modifica el array in-place
   }

   // ✅ Correcto: crea una copia
   transform(items: any[]): any[] {
     return [...items].sort();
   }
   ```

2. **Olvidar importar el pipe en componentes standalone:** Un error muy común es crear un pipe standalone y esperar que esté disponible automáticamente. En componentes standalone, cada pipe debe importarse explícitamente en el array `imports` del componente.

   ```typescript
   // ❌ El componente no encontrará el pipe
   @Component({
     standalone: true,
     template: `<p>{{ texto | miPipe }}</p>`
   })

   // ✅ Importación correcta
   @Component({
     standalone: true,
     imports: [MiPipe],
     template: `<p>{{ texto | miPipe }}</p>`
   })
   ```

3. **Uso incorrecto de PercentPipe:** El `PercentPipe` espera un valor entre 0 y 1 (0.15 = 15%). Un error común es pasar el porcentaje ya multiplicado (15 en lugar de 0.15), lo que resulta en "1.500 %" en lugar de "15 %".

   ```html
   <!-- ❌ Muestra 1.500 % en lugar de 15 % -->
   <p>Descuento: {{ 15 | percent }}</p>

   <!-- ✅ Correcto -->
   <p>Descuento: {{ 0.15 | percent }}</p>
   ```

4. **No gestionar la zona horaria en DatePipe:** Si la aplicación se ejecuta en el navegador del usuario pero los datos vienen del servidor, es crucial especificar la zona horaria correctamente. Por defecto, `DatePipe` usa la zona horaria local del navegador, lo que puede causar discrepancias.

5. **Usar pipes impuros sin considerar el rendimiento:** Un pipe impuro se ejecuta en cada ciclo de detección de cambios. Si ese pipe itera sobre arrays grandes o realiza cálculos pesados, la aplicación se vuelve lenta rápidamente. Siempre considerar mover la lógica al componente o usar `computed()`.

6. **Olvidar que los pipes no reaccionan a cambios dentro de objetos:** Para pipes puros, Angular solo detecta cambios por referencia. Si una propiedad interna de un objeto cambia, el pipe no se recalcula. Es necesario proporcionar una nueva referencia del objeto completo.

   ```typescript
   // ❌ El pipe no se recalculará
   this.usuario.nombre = 'Nuevo Nombre';

   // ✅ El pipe se recalculará
   this.usuario = { ...this.usuario, nombre: 'Nuevo Nombre' };
   ```

7. **Mal manejo de la internacionalización:** Usar strings de fecha hardcodeados en el formato ignorando el locale resultará en experiencias inconsistentes para usuarios de diferentes regiones. Configurar correctamente `LOCALE_ID` y registrar los datos de localización.

8. **No sanitizar HTML cuando se genera dinámicamente:** Si un pipe devuelve HTML (como en el ejemplo de resaltado de texto), es obligatorio usar `DomSanitizer` y `bypassSecurityTrustHtml` con precaución, o mejor aún, usar `SecurityContext.HTML` para sanitizar. No hacerlo puede exponer la aplicación a ataques XSS si el contenido proviene de fuentes no confiables.

## Resumen

Los pipes son uno de los mecanismos más elegantes de Angular para transformar datos en plantillas de forma declarativa. Permiten separar limpiamente la lógica de presentación de la lógica de negocio, haciendo que los componentes sean más mantenibles y las plantillas más legibles.

Los pipes integrados (DatePipe, CurrencyPipe, DecimalPipe, PercentPipe, UpperCasePipe, LowerCasePipe, TitleCasePipe, JsonPipe, SlicePipe, AsyncPipe, KeyValuePipe) cubren la mayoría de necesidades comunes. Cuando estos no son suficientes, crear pipes personalizados con `@Pipe` y `PipeTransform` es sencillo y permite encapsular transformaciones específicas del dominio.

La distinción entre pipes puros e impuros es fundamental para el rendimiento. Los pipes puros, que son la opción por defecto, solo se recalculan cuando cambian las referencias de entrada, mientras que los impuros se ejecutan en cada ciclo de detección de cambios. Elegir correctamente entre ambos y seguir las buenas prácticas (inmutabilidad, validación de entrada, no realizar operaciones asíncronas) garantiza aplicaciones eficientes y libres de errores.

El encadenamiento de pipes permite combinar transformaciones de forma compositiva, mientras que la parametrización les otorga flexibilidad para adaptarse a distintos contextos de uso sin duplicar código.

## Recursos adicionales

- [Documentación oficial de Angular: Pipes](https://angular.dev/guide/pipes)
- [Documentación oficial: AsyncPipe](https://angular.dev/api/common/AsyncPipe)
- [Documentación oficial: DatePipe](https://angular.dev/api/common/DatePipe)
- [Documentación oficial: CurrencyPipe](https://angular.dev/api/common/CurrencyPipe)
- [Angular CLI: Comando `ng generate pipe`](https://angular.dev/cli/generate/pipe)
- [Guía de internacionalización (i18n) en Angular](https://angular.dev/guide/i18n)
- [CLDR (Unicode Common Locale Data Repository)](https://cldr.unicode.org/) para códigos de moneda ISO 4217
- [Repositorio de ejemplos de Angular en GitHub](https://github.com/angular/angular/tree/main/packages/common/src/pipes)
