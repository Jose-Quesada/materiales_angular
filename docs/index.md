# Introducción a Angular

## Objetivos de aprendizaje

Al finalizar esta unidad, el alumnado será capaz de:

1. Identificar qué es Angular y su posición dentro del ecosistema de desarrollo web actual.
2. Diferenciar entre framework y biblioteca, comprendiendo las implicaciones arquitectónicas de cada enfoque.
3. Conocer la historia y evolución de Angular desde AngularJS hasta las versiones modernas.
4. Comprender la arquitectura SPA y sus diferencias fundamentales con las aplicaciones MPA tradicionales.
5. Comparar Angular con otros frameworks y bibliotecas populares como React y Vue.
6. Identificar los casos de uso más apropiados para desarrollar con Angular.
7. Conocer las herramientas oficiales que componen el ecosistema Angular.
8. Identificar las tendencias actuales del framework: Standalone Components, Signals y SSR.

## Resultados de aprendizaje

Tras completar esta unidad, el estudiante será capaz de:

- Explicar con sus propias palabras qué es Angular y por qué se considera un framework estructural.
- Instalar y configurar un entorno de desarrollo completo para trabajar con Angular.
- Enumerar las versiones principales de Angular y las novedades introducidas en cada una.
- Argumentar en qué situaciones es recomendable usar Angular frente a otras alternativas.
- Navegar por la documentación oficial de Angular para resolver dudas técnicas.
- Reconocer la estructura básica de un proyecto Angular generado con Angular CLI.

## Introducción

Imagina que entras en una biblioteca. Hace veinte años, las bibliotecas web eran estáticas: cada vez que querías leer un libro diferente, tenías que volver al mostrador, pedirlo, esperar a que el bibliotecario fuera al depósito y te lo trajera. Esto es exactamente cómo funcionaban las aplicaciones web tradicionales (Multi-Page Applications o MPA): cada vez que el usuario hacía clic en un enlace, el servidor generaba una página completamente nueva, la enviaba por la red y el navegador la renderizaba desde cero. El resultado: parpadeos constantes, tiempos de carga largos y una experiencia de usuario mediocre.

Luego llegaron las Single-Page Applications (SPA). Siguiendo con nuestra analogía, ahora entras en una biblioteca moderna donde todos los libros están disponibles instantáneamente en una gran mesa interactiva. No hay que volver al mostrador: simplemente deslizas, tocas y la información aparece. La página se carga una sola vez y, a partir de ahí, todo ocurre dinámicamente mediante JavaScript, sin recargar la página completa. Esta revolución cambió para siempre la web.

En 2010, Google presentó AngularJS, un framework que facilitaba enormemente la creación de estas SPAs mediante data binding bidireccional, inyección de dependencias y directivas. Fue un éxito rotundo... hasta que la web siguió evolucionando. En 2016, Google reescribió el framework desde cero y nació Angular (a secas, también conocido como Angular 2). No fue una actualización: fue un nuevo framework, incompatible con AngularJS, pero construido sobre las lecciones aprendidas.

Hoy, Angular es mucho más que un framework para SPAs. Con la llegada de Angular 17 y 18, los Standalone Components, las Signals y el Server-Side Rendering (SSR) nativo, Angular se ha transformado en una plataforma de desarrollo completa que abarca desde aplicaciones web progresivas (PWA) hasta aplicaciones renderizadas en el servidor con hidratación parcial. Es, sin exagerar, uno de los frameworks más completos y mejor mantenidos del ecosistema JavaScript.

En esta unidad, sentaremos las bases conceptuales necesarias antes de escribir nuestra primera línea de código. Entender de dónde viene Angular, qué problemas resuelve y cómo encaja en el panorama actual es fundamental para valorar adecuadamente las herramientas que vamos a utilizar durante todo el curso.

## Desarrollo teórico

### ¿Qué es Angular?

Angular es un **framework estructural de código abierto** para construir aplicaciones web dinámicas, mantenido por Google y una comunidad activa de desarrolladores. Escrito en TypeScript, Angular proporciona una arquitectura completa y opinada (opinionated) que abarca desde la interfaz de usuario hasta la lógica de negocio, la gestión de estado, el enrutamiento, la comunicación con servidores, la validación de formularios y las animaciones.

La palabra "framework" no es casual. A diferencia de una biblioteca (library) como React, que se limita a la capa de vista (la V en MVC), Angular proporciona una solución integral y estructurada. Vamos a desglosar esta diferencia fundamental:

#### Framework vs Biblioteca

| Característica | Framework (Angular) | Biblioteca (React) |
|---|---|---|
| **Control del flujo** | El framework dicta cómo se estructura la aplicación. "No me llames tú, yo te llamo a ti" (IoC - Inversión de Control). | La biblioteca es llamada por tu código cuando la necesitas. Tú controlas el flujo. |
| **Opinión sobre arquitectura** | Opinado: propone una forma concreta de organizar el código (módulos/componentes, servicios, pipes, directivas). | No opinado: te deja decidir cómo organizar todo. Necesitas elegir librerías complementarias. |
| **Baterías incluidas** | Incluye router, cliente HTTP, validación de formularios, animaciones, i18n, testing, SSR. Todo integrado y coherente. | Solo la capa de UI. Necesitas instalar y configurar React Router, React Query/Axios, React Hook Form, etc. |
| **Curva de aprendizaje** | Alta: hay que aprender TypeScript, decoradores, inyección de dependencias, observables, módulos, etc. | Media-baja: JSX, hooks, estado. Lo básico se aprende rápido. Lo avanzado se complica. |
| **Consistencia entre proyectos** | Muy alta: la estructura opinada hace que proyectos de diferentes equipos sean muy similares. | Baja: cada proyecto puede ser muy diferente. Más libertad, menos homogeneidad. |
| **Rendimiento** | Muy bueno con las técnicas modernas (OnPush, Signals, compilación AOT). Detección de cambios basada en Zone.js o Signals. | Bueno con Virtual DOM y reconciliación. React 18 añade Concurrent Mode. |
| **TypeScript** | Obligatorio y profundamente integrado. El ecosistema está diseñado para TypeScript. | Opcional. Se puede usar con JavaScript plano o TypeScript. La integración no es tan profunda. |

Angular, al ser un framework, te dice: "así es como se hacen las cosas aquí". Esto puede parecer restrictivo, pero en equipos grandes y proyectos empresariales donde trabajan decenas o cientos de desarrolladores simultáneamente, esa homogeneidad es una ventaja competitiva enorme. Cualquier desarrollador Angular puede incorporarse a un proyecto Angular existente y ser productivo en horas.

### Historia y evolución

La historia de Angular es fascinante porque ilustra cómo Google aprendió de sus propios errores para crear algo mejor. Recorramos el viaje:

#### AngularJS (2010) - La revolución

AngularJS fue presentado por Miško Hevery, un ingeniero de Google, en 2010. Su propuesta era radical: data binding bidireccional (two-way data binding) en el navegador. Cualquier cambio en el modelo de datos se reflejaba automáticamente en la vista, y viceversa. Además introducía:

- **Directivas**: atributos HTML personalizados que extendían el comportamiento del DOM.
- **Inyección de dependencias**: un contenedor de servicios integrado en el framework.
- **Filtros**: para formatear datos en las plantillas (el precursor de los pipes actuales).
- **Scope**: un mecanismo para conectar controladores y vistas.
- **$digest cycle**: un ciclo de "dirty checking" que recorría todos los scopes buscando cambios.

AngularJS fue un éxito masivo. Empresas, startups y desarrolladores lo adoptaron rápidamente. Sin embargo, a medida que las aplicaciones crecían en complejidad, surgían problemas de rendimiento. El ciclo `$digest` podía volverse extremadamente costoso en aplicaciones grandes porque comprobaba cada binding en cada ciclo. Las aplicaciones con cientos o miles de watchers se volvían lentas.

#### Angular 2 (septiembre 2016) - La reinvención

Google decidió que no podía simplemente "arreglar" AngularJS. Los problemas eran arquitectónicos y requerían una reescritura completa. Angular 2 fue un framework completamente nuevo:

- **TypeScript** como lenguaje principal (AngularJS usaba JavaScript).
- **Arquitectura basada en componentes** en lugar de controladores y scopes.
- **Detección de cambios unidireccional** en lugar de two-way binding por defecto.
- **Compilación AOT (Ahead-of-Time)**: las plantillas se compilaban durante el build, no en el navegador.
- **Sistema de módulos (NgModule)**: para organizar la aplicación.
- **Renderizado multiplataforma**: el mismo código podía ejecutarse en web, móvil (NativeScript) y escritorio.
- **RxJS y Observables**: como núcleo de la programación reactiva.

Esta reinvención causó división en la comunidad. Muchos proyectos estaban en AngularJS y la migración no era automática. Google creó `ngUpgrade` para permitir la migración gradual, pero el daño reputacional estaba hecho. Algunos desarrolladores migraron a React.

#### Angular 4 (marzo 2017) - La normalización

Nota: Angular 3 nunca existió públicamente. Se saltó la versión 3 debido a un desajuste interno en los paquetes de Google.

Angular 4 introdujo mejoras incrementales: directiva `*ngIf` con `else`, pipes `titlecase`, animaciones separadas en `@angular/animations`, y un paquete AOT más rápido. Angular empezó a adoptar el versionado semántico y se comprometió a lanzar una versión mayor cada 6 meses aproximadamente.

#### De Angular 5 a Angular 16 - Madurez incremental

- **Angular 5** (noviembre 2017): `HttpClient` como reemplazo de `@angular/http`, build optimizer, internationalization con i18n.
- **Angular 6** (mayo 2018): Angular Elements (web components con Angular), `ng update` para migraciones automáticas, CLI workspace, schematic workflows, RxJS 6.
- **Angular 7** (octubre 2018): CLI prompts, Virtual Scrolling, Drag and Drop, Actualizaciones de rendimiento.
- **Angular 8** (mayo 2019): Ivy como compilador experimental, differential loading (ES2015 y ES5), Web Workers, TypeScript 3.4.
- **Angular 9** (febrero 2020): IVY se convierte en el motor de renderizado por defecto. Mejoras en el tamaño de bundles, testabilidad mejora drásticamente.
- **Angular 10** (junio 2020): Angular Material con rangos de fecha, strict mode opcional, TypeScript 3.9.
- **Angular 11** (noviembre 2020): HMR (Hot Module Replacement), webpack 5 experimental, stricter types.
- **Angular 12** (mayo 2021): Migración de i18n, eliminación de View Engine, migración a Sass moderno de Angular Material.
- **Angular 13** (noviembre 2021): View Engine completamente eliminado, Ivy en todas partes, componentes dinámicos, RxJS 7, TypeScript 4.4.
- **Angular 14** (junio 2022): Standalone Components (developer preview), Typed Forms, inject() funcional, Angular DevTools con profiling.
- **Angular 15** (noviembre 2022): Standalone Components estables, `provideHttpClient`, `provideRouter`, `withInterceptorsFromDi`, Directiva composition API, imágenes NgOptimizedImage.
- **Angular 16** (mayo 2023): Signals (developer preview), SSR con hydration progresiva, esbuild como builder experimental, Required Inputs, `takeUntilDestroyed()`.

#### Angular 17 y 18 - La nueva era

**Angular 17** (noviembre 2023) marcó un antes y un después, apodado "Angular Renaissance":

- **Nueva sintaxis de control de flujo** (`@if`, `@for`, `@switch`): reemplaza las directivas `*ngIf`, `*ngFor`, `*ngSwitch` con una sintaxis más limpia y tipada.
- **Deferrable Views** (`@defer`): carga diferida de componentes basada en triggers (interacción, viewport, timer).
- **esbuild y Vite como builders por defecto**: los tiempos de build se redujeron hasta un 87%.
- **SSR con hidratación (developer preview)**: renderizado en el servidor sin perder interactividad.
- **Signals estables**: fuera de developer preview, Signals se convirtieron en el sistema de reactividad recomendado.

**Angular 18** (mayo 2024) continuó la transformación:

- **Zoneless Angular (experimental)**: permite ejecutar Angular sin Zone.js, utilizando exclusivamente Signals para la detección de cambios. Las aplicaciones pueden ser hasta un 40% más pequeñas.
- **SSR mejorado**: i18n en SSR, mejor hidratación, event replay.
- **Signal APIs ampliadas**: `linkedSignal()`, `resource()`, mejor integración con formularios.
- **Angular Material 18**: nuevos componentes, mejor accesibilidad.
- **Fallback content en @defer**: contenido mientras se carga el componente diferido.

**Angular 19** (noviembre 2024) - La versión más reciente:

- **Incremental Hydration**: hidratación progresiva de componentes bajo demanda.
- **linkedSignal** y **resource()** estables.
- **Zoneless estable**: se puede construir aplicaciones completas sin Zone.js.
- **Standalone Components por defecto**: al usar `ng new`, los proyectos son standalone por defecto.
- **Reactivity con Signals integrada en todo el framework**: formularios, router, todo usa Signals.
- **@let** en templates: nueva sintaxis para variables locales en plantillas.

### Angular moderno

El Angular de hoy es radicalmente diferente al Angular de 2016. Los cambios más significativos que definen el Angular moderno son:

#### Standalone Components

Hasta Angular 14, todo componente debía declararse en un NgModule. Esto creaba fricción: para crear un simple componente necesitabas crear o modificar un módulo, entender el sistema de imports/exports de módulos, y lidiar con una capa adicional de burocracia.

Los Standalone Components eliminan esta complejidad. Un componente standalone se declara a sí mismo, indicando directamente qué otros componentes, directivas y pipes necesita:

```typescript
// Antes (con NgModules)
@NgModule({
  declarations: [MiComponente],
  imports: [CommonModule, FormsModule],
  exports: [MiComponente]
})
export class MiModulo {}

// Ahora (Standalone)
@Component({
  selector: 'app-mi-componente',
  standalone: true,
  imports: [CommonModule, FormsModule, OtroComponente],
  templateUrl: './mi-componente.component.html'
})
export class MiComponente {}
```

Los módulos no desaparecen (siguen siendo útiles para organizar servicios con NgModule.providers o para lazy loading basado en módulos), pero ya no son obligatorios para la mayoría de los casos de uso.

#### Signals

Las Signals representan el cambio más profundo en la reactividad de Angular desde su creación. Hasta Angular 16, la detección de cambios se basaba en Zone.js: una biblioteca que "parchea" (monkey-patches) todas las APIs asíncronas del navegador (setTimeout, requestAnimationFrame, eventos, Promises, etc.) para detectar cuándo algo ha cambiado y ejecutar la detección de cambios desde la raíz del árbol de componentes.

Este enfoque funciona, pero tiene desventajas:
- Zone.js añade overhead y tamaño al bundle.
- La detección de cambios recorre el árbol completo (aunque OnPush optimiza esto).
- Las ExpressionChangedAfterItHasBeenCheckedError son difíciles de entender y depurar.

Las Signals introducen un nuevo modelo de reactividad "fina" (fine-grained reactivity): solo los componentes que dependen de una Signal que ha cambiado se re-renderizan. No hay zone.js, no hay recorrido del árbol completo, no hay ExpressionChangedAfterItHasBeenCheckedError.

```typescript
// Con Signals
contador = signal(0);

incrementar() {
  this.contador.update(n => n + 1); // Solo este componente y los que dependan de contador se actualizan
}
```

#### Control Flow Syntax

La nueva sintaxis de control de flujo (`@if`, `@for`, `@switch`) reemplaza las antiguas directivas `*ngIf`, `*ngFor`, `*ngSwitch`. La nueva sintaxis es más legible, está integrada en el compilador (no necesita CommonModule), tiene mejor soporte de tipos, y permite el seguimiento de track más intuitivo en bucles:

```html
<!-- Antes -->
<div *ngIf="usuario; else noAuth">
  <p *ngFor="let item of items; trackBy: trackById">{{ item.nombre }}</p>
</div>
<ng-template #noAuth><p>No autenticado</p></ng-template>

<!-- Ahora -->
@if (usuario) {
  @for (item of items; track item.id) {
    <p>{{ item.nombre }}</p>
  }
} @else {
  <p>No autenticado</p>
}
```

#### Server-Side Rendering (SSR) nativo

Angular siempre ha tenido SSR mediante Angular Universal, pero era complejo de configurar y mantener. A partir de Angular 17, el SSR es una opción nativa en `ng new` (con el flag `--ssr`). El SSR mejora el SEO, el Core Web Vitals y reduce el Time to First Byte (TTFB). Con Angular 19, la hidratación incremental permite que los componentes se hidraten (se vuelvan interactivos) bajo demanda, mejorando aún más el rendimiento percibido.

### Arquitectura SPA

Una **Single-Page Application (SPA)** es una aplicación web que se ejecuta completamente en el navegador del usuario, cargando una única página HTML inicialmente. A partir de ahí, la navegación y la interacción del usuario se gestionan mediante JavaScript, que manipula el DOM y se comunica con el servidor mediante APIs (normalmente REST o GraphQL) para obtener o enviar datos.

#### Cómo funciona una SPA

1. El usuario solicita la URL de la aplicación.
2. El servidor devuelve un archivo `index.html` casi vacío, con referencias a los bundles de JavaScript y CSS.
3. El navegador descarga y ejecuta el JavaScript.
4. El framework (Angular) arranca, lee la URL actual, y renderiza la vista correspondiente mediante su router interno.
5. Cuando el usuario navega a otra sección, el router intercepta el clic, modifica la URL mediante la History API del navegador (sin recargar la página), y reemplaza el contenido del DOM con la nueva vista.
6. Los datos se obtienen del servidor mediante peticiones AJAX (fetch, HttpClient).

#### Ventajas de las SPAs

- **Experiencia de usuario fluida**: sin parpadeos ni pantallas en blanco entre navegaciones. Las transiciones son instantáneas.
- **Menor carga del servidor**: el servidor solo sirve datos (JSON, XML) y assets estáticos. La lógica de renderizado se traslada al cliente.
- **Desarrollo desacoplado**: el frontend y el backend pueden desarrollarse de forma independiente por equipos diferentes.
- **Offline y PWA**: las SPAs pueden cachearse en el navegador para funcionar sin conexión (usando Service Workers).
- **Reutilización de código**: con frameworks como Ionic, el mismo código Angular puede compilarse para iOS y Android.

#### Desventajas de las SPAs

- **SEO tradicional limitado**: el contenido renderizado con JavaScript puede no ser indexado correctamente por los motores de búsqueda (aunque Googlebot ha mejorado y el SSR de Angular aborda este problema).
- **Tiempo de carga inicial**: descargar todo el JavaScript necesario puede ser lento en conexiones pobres. Las técnicas de lazy loading y SSR mitigan esto.
- **Complejidad del estado**: el estado se mantiene en el navegador y debe gestionarse correctamente (con bibliotecas de gestión de estado, Signals, etc.).
- **Seguridad**: al ser el frontend el que renderiza, se debe prestar especial atención a XSS, CSRF y exposición de lógica sensible.
- **Accesibilidad**: las SPAs deben gestionar manualmente el foco, los anuncios de lectores de pantalla y los cambios de título de página.

#### SPA vs MPA (Multi-Page Application)

| Aspecto | SPA (Angular) | MPA (tradicional) |
|---|---|---|
| **Carga inicial** | Más lenta (descarga JS) | Rápida (HTML desde servidor) |
| **Navegación** | Instantánea | Recarga completa de página |
| **SEO** | Difícil sin SSR | Excelente por defecto |
| **Desarrollo** | Complejo pero productivo | Simple |
| **Interactividad** | Muy alta | Limitada |
| **Uso de recursos** | Más CPU en cliente | Más CPU en servidor |
| **Offline** | Posible | Muy limitado |
| **Ejemplos** | Gmail, Google Maps, Trello | Blogs, sitios de noticias, e-commerce tradicional |

### Angular frente a React y Vue

La eterna pregunta del estudiante: ¿cuál debería aprender? La respuesta honesta es: los tres, pero empezando por el que mejor se alinee con tus objetivos profesionales y el mercado laboral de tu zona. Vamos a una comparativa detallada:

| Dimensión | Angular | React | Vue |
|---|---|---|---|
| **Creador / Mantenedor** | Google | Meta (Facebook) | Evan You (ex-Google, comunidad) |
| **Tipo** | Framework completo | Biblioteca (UI) + ecosistema | Framework progresivo |
| **Lenguaje principal** | TypeScript (obligatorio) | JavaScript / JSX (TypeScript opcional) | JavaScript (TypeScript opcional) |
| **Filosofía** | Opinado, estructura predefinida, "baterías incluidas" | Flexible, solo la vista, "elige tu propia aventura" | Equilibrado: opinionado en lo importante, flexible en lo accesorio |
| **Curva de aprendizaje** | Alta (TypeScript, DI, RxJS, Decoradores, NgModule/Standalone) | Media (JSX, hooks, elegir librerías complementarias) | Baja (HTML, CSS, JS estándar, API simple) |
| **Arquitectura** | Componentes + Servicios + Inyección de dependencias + Módulos | Componentes + Hooks | Componentes (Options API o Composition API) |
| **Renderizado** | Incremental DOM + Compilación AOT | Virtual DOM + Reconciliación | Virtual DOM + Compilación de plantillas |
| **Detección de cambios** | Zone.js (legacy) / Signals (moderno) | Virtual DOM diff | Reactividad basada en Proxy |
| **Estado global** | RxJS, Signals, NgRx, Akita | Redux, Zustand, Context API, Jotai | Pinia, Vuex |
| **Enrutamiento** | Angular Router (nativo) | React Router, TanStack Router | Vue Router (nativo) |
| **Formularios** | Template-driven + Reactive Forms (nativo) | Sin solución nativa (Formik, React Hook Form) | Vue Form, VeeValidate |
| **Animaciones** | Angular Animations (nativo, potente) | React Transition Group, Framer Motion | Vue Transitions (nativo) |
| **SSR** | Angular Universal / SSR nativo | Next.js (líder), Remix | Nuxt.js |
| **Mobile** | Ionic, NativeScript | React Native | NativeScript, Capacitor |
| **Testing** | Jasmine/Karma (nativo), Jest, Cypress, Playwright | Jest + React Testing Library | Vitest + Vue Test Utils |
| **Ecosistema** | Completo y oficial (Material, CDK, CLI, DevTools) | Masivo pero fragmentado (muchas librerías de terceros) | Creciente, librerías oficiales y comunitarias |
| **Mercado laboral (España)** | Muy fuerte en sector empresarial y banca | Alta demanda generalizada | Creciente, especialmente en startups |
| **Salario medio (España 2024)** | 32.000€ - 50.000€ | 30.000€ - 48.000€ | 28.000€ - 42.000€ |
| **Versión estable actual** | Angular 19 | React 19 | Vue 3.5 |

**¿Cuándo elegir Angular?**
- Proyectos empresariales grandes y de larga duración.
- Equipos grandes donde la consistencia es crítica.
- Aplicaciones complejas con formularios avanzados y lógica de negocio densa.
- Necesidad de un ecosistema completo sin depender de muchas librerías de terceros.
- Empresas que ya tienen experiencia con TypeScript.

**¿Cuándo elegir React?**
- Necesidad de máxima flexibilidad arquitectónica.
- Proyectos que requieren React Native para móvil.
- Equipos que prefieren elegir cada herramienta.
- Proyectos con mucho contenido dinámico donde el Virtual DOM brilla.

**¿Cuándo elegir Vue?**
- Proyectos pequeños o medianos con plazos ajustados.
- Migración gradual de aplicaciones jQuery o vanilla JS.
- Equipos con menos experiencia en TypeScript.
- Startups que necesitan moverse rápido.

### Casos de uso

Angular brilla en los siguientes escenarios:

#### Aplicaciones empresariales (Enterprise)

Angular fue diseñado pensando en las necesidades de Google: aplicaciones enormes mantenidas por cientos de ingenieros durante años. La estructura opinada, TypeScript, la inyección de dependencias y la arquitectura basada en servicios hacen que Angular sea ideal para aplicaciones empresariales complejas como ERPs, CRMs, sistemas de gestión de inventario, plataformas de banca online, y software administrativo.

#### Dashboards y paneles de control

Los paneles de administración con tablas, gráficos, formularios complejos y múltiples widgets se benefician enormemente de las capacidades de Angular: lazy loading para cargar solo lo necesario, formularios reactivos para validación compleja, y un ecosistema de librerías de UI como Angular Material, PrimeNG o DevExtreme.

#### Progressive Web Apps (PWA)

Angular tiene soporte nativo para PWAs mediante `@angular/pwa`. Con un solo comando (`ng add @angular/pwa`), tu aplicación se convierte en una Progressive Web App con Service Worker, manifiesto, instalabilidad y soporte offline. Empresas como Twitter Lite, Forbes y Alibaba han usado técnicas similares.

#### Aplicaciones multiplataforma con Ionic

Ionic Framework, construido sobre Angular (y también compatible con React y Vue), permite compilar la misma base de código para web, iOS y Android. Es una opción excelente para empresas que necesitan presencia tanto web como móvil sin duplicar el desarrollo.

#### Sitios con SSR para SEO óptimo

Con el SSR nativo de Angular 17+, es posible crear sitios web que necesitan SEO (tiendas online, blogs corporativos, portales de noticias) combinando la interactividad de una SPA con el SEO de una MPA.

#### Micro-frontends

Angular, combinado con herramientas como Module Federation de webpack, es una elección sólida para implementar arquitecturas de micro-frontends, donde equipos independientes desarrollan y despliegan partes de una aplicación mayor de forma autónoma.

### Ecosistema Angular

El ecosistema de Angular es rico y está bien mantenido. Estas son las herramientas y bibliotecas fundamentales:

#### Angular CLI

La interfaz de línea de comandos oficial para crear, desarrollar, probar y desplegar aplicaciones Angular. Permite generar proyectos, componentes, servicios, directivas, pipes, módulos y más con comandos simples. Incluye un servidor de desarrollo con hot reload, builders para compilación, y schematics para automatizar tareas.

#### Angular Material

La biblioteca de componentes de interfaz de usuario oficial de Angular, basada en Material Design de Google. Incluye decenas de componentes accesibles, temáticos y bien documentados: botones, formularios, tablas, diálogos, menús, navegación, tarjetas, etc.

#### Angular CDK (Component Dev Kit)

El CDK es el núcleo sobre el que se construye Angular Material. Proporciona primitivas de comportamiento sin estilos impuestos: virtual scrolling, drag and drop, overlay (modales, tooltips), a11y, layout, testing harnesses, etc. Puedes usar el CDK para construir tu propia biblioteca de componentes con comportamientos complejos.

#### Angular Universal / SSR

El sistema de Server-Side Rendering de Angular, ahora integrado nativamente en el CLI (`ng new --ssr`). Permite renderizar la aplicación en el servidor (Node.js), enviando HTML completo al navegador y luego hidratando la aplicación para hacerla interactiva. Mejora SEO, Core Web Vitals y rendimiento percibido.

#### Angular DevTools

Una extensión para Chrome y Firefox que permite inspeccionar y depurar aplicaciones Angular. Características:
- **Árbol de componentes**: ver la jerarquía completa de componentes, sus propiedades y estado.
- **Profiler**: medir tiempos de renderizado e identificar cuellos de botella.
- **Injector Tree**: visualizar el árbol de inyectores y dependencias.
- **Signal Debugging**: inspeccionar el valor de las Signals en tiempo real.

#### RxJS

Reactive Extensions for JavaScript. Aunque no es exclusivo de Angular, RxJS está profundamente integrado. El `HttpClient` devuelve Observables, los formularios reactivos exponen Observables de valores y estados, y el router expone Observables de parámetros y eventos de navegación. Con la llegada de Signals, RxJS sigue siendo la herramienta principal para flujos asíncronos complejos, mientras Signals manejan el estado sincrónico.

#### TypeScript

TypeScript es el lenguaje en el que está escrito Angular y el lenguaje recomendado para desarrollar aplicaciones. Añade tipado estático opcional, interfaces, genéricos, decoradores, enums y otras características a JavaScript. La integración con el IDE (especialmente VS Code) es excelente: autocompletado, refactorización, navegación y detección de errores en tiempo real.

#### Nx

Nx (de Nrwl) es un conjunto de herramientas para monorepositorios. Aunque no es exclusivo de Angular, es muy popular en el ecosistema. Nx permite gestionar múltiples aplicaciones y bibliotecas en un mismo repositorio, con caché de builds, gráficos de dependencias, generadores personalizados y ejecución de tareas optimizada. Grandes empresas como Google, Microsoft y Cisco usan Nx con Angular.

#### Ionic Framework

Ionic es un framework para construir aplicaciones móviles híbridas usando tecnologías web. Aunque ahora soporta React y Vue, su integración original y más madura es con Angular. Permite acceder a funcionalidades nativas (cámara, GPS, notificaciones) mediante Capacitor o Cordova.

### Herramientas oficiales

#### Angular CLI

Ya mencionada, es la herramienta fundamental. Comandos esenciales:

```bash
ng new mi-proyecto      # Crear nuevo proyecto
ng serve                # Iniciar servidor de desarrollo
ng generate component x # Generar un componente
ng build                # Compilar para producción
ng test                 # Ejecutar tests unitarios
ng lint                 # Ejecutar linter
ng update               # Actualizar dependencias de Angular
ng add @angular/material # Añadir Angular Material
```

#### Angular DevTools

Como se mencionó anteriormente, es la extensión de navegador para depuración. Es indispensable para el desarrollo diario. Permite:
- Ver el estado de los componentes (inputs, outputs, propiedades).
- Medir el rendimiento de la detección de cambios.
- Inspeccionar el árbol de inyección de dependencias.
- Depurar Signals.

#### Angular Language Service

Un plugin para editores de código (VS Code, WebStorm, Sublime Text) que proporciona:
- Autocompletado en plantillas HTML.
- Información de tipos y validación inline en expresiones de plantilla.
- Navegación a definiciones desde la plantilla.
- Detección de errores en tiempo real.
- Soporte para la nueva sintaxis de control de flujo.

#### Angular Material CDK

Ya mencionado en el ecosistema, el CDK merece una mención especial como herramienta de desarrollo. Sus primitivas de accesibilidad (`a11y`), gestión de foco, overlay, drag and drop y virtual scrolling son reutilizables incluso si no usas Angular Material.

## Ejemplos guiados

### Ejemplo 1: Instalación del entorno de desarrollo

**Explicación**: Antes de crear cualquier proyecto Angular, necesitamos instalar Node.js y el Angular CLI. Node.js es el runtime de JavaScript para el servidor, y npm es su gestor de paquetes. El Angular CLI es una herramienta de línea de comandos que facilita la creación, desarrollo y mantenimiento de proyectos Angular.

**Paso 1: Instalar Node.js**

```bash
# Verificar si Node.js ya está instalado
node --version
npm --version

# Si no está instalado, descargar desde https://nodejs.org/
# RECOMENDACIÓN: usar nvm (Node Version Manager) para gestionar múltiples versiones

# Instalar nvm (Linux / macOS)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Cerrar y reabrir la terminal, o recargar el perfil
source ~/.bashrc

# Instalar la versión LTS de Node.js (recomendada para Angular)
nvm install --lts
nvm use --lts

# Instalar la versión actual (más reciente)
nvm install node

# Verificar versiones
node --version  # Debería mostrar v20.x.x o v22.x.x
npm --version   # Debería mostrar 10.x.x
```

**Paso 2: Instalar Angular CLI globalmente**

```bash
# Instalar el CLI de Angular de forma global
npm install -g @angular/cli

# Verificar la instalación
ng version

# La salida debería ser similar a:
# 
#      _                      _                 ____ _     ___
#     / \   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
#    / △ \ | '_ \ / _` | | | | |/ _` | '__|   | |   | |    | |
#   / ___ \| | | | (_| | |_| | | (_| | |      | |___| |___ | |
#  /_/   \_\_| |_|\__, |\__,_|_|\__,_|_|       \____|_____|___|
#                 |___/
# 
# Angular CLI: 18.x.x
# Node: 20.x.x
# Package Manager: npm 10.x.x
# OS: linux x64 (o win32, darwin)
```

### Ejemplo 2: Verificación del entorno

**Explicación**: Vamos a crear un proyecto mínimo "hola-mundo" para verificar que todo el entorno funciona correctamente. No profundizaremos en la estructura del proyecto todavía (lo haremos en la siguiente unidad), solo verificaremos que podemos crear, compilar y servir una aplicación Angular.

```bash
# Crear un proyecto de prueba (sin routing, sin SSR, CSS simple, standalone)
ng new hola-mundo --standalone --routing=false --style=css --ssr=false --strict

# Durante la instalación, Angular CLI preguntará si queremos usar Strict Mode.
# Responderemos "Yes" para este ejemplo.

# Navegar al directorio del proyecto
cd hola-mundo

# Iniciar el servidor de desarrollo
ng serve --open
# El flag --open abre automáticamente el navegador en http://localhost:4200

# Deberías ver en el navegador una página con:
# - Un texto que dice "hola-mundo app is running!"
# - Enlaces a recursos de aprendizaje de Angular
```

El comando `ng serve` inicia un servidor de desarrollo local en `http://localhost:4200`. Cualquier cambio que hagamos en los archivos del proyecto se reflejará automáticamente en el navegador gracias al Hot Module Replacement (HMR).

Para detener el servidor, presionamos `Ctrl + C` en la terminal.

### Ejemplo 3: Explorar Angular DevTools

**Explicación**: Angular DevTools es una extensión de navegador que nos permite inspeccionar y depurar aplicaciones Angular en tiempo real.

**Pasos:**

1. Abrir Google Chrome o Microsoft Edge.
2. Ir a la Chrome Web Store y buscar "Angular DevTools".
3. Instalar la extensión oficial de Google.
4. Volver a nuestra aplicación en `http://localhost:4200`.
5. Abrir las DevTools del navegador (`F12` o `Ctrl + Shift + I`).
6. Buscar la pestaña "Angular" en la barra superior de las DevTools.

En la pestaña Angular podrás ver:
- El árbol de componentes de la aplicación.
- Seleccionar un componente para ver sus propiedades, inputs y outputs.
- La pestaña "Profiler" para medir el rendimiento.
- La pestaña "Injector Tree" para ver el árbol de inyección de dependencias.

Esta herramienta será fundamental durante todo el curso para depurar nuestras aplicaciones.

## Ejercicios resueltos

### Ejercicio 1: Instalar Node.js mediante nvm y Angular CLI

**Objetivo**: Configurar un entorno de desarrollo Angular profesional utilizando Node Version Manager para gestionar las versiones de Node.js de forma flexible.

**Solución paso a paso:**

```bash
# === PASO 1: Instalar nvm (Node Version Manager) ===
# nvm permite instalar y cambiar entre múltiples versiones de Node.js

# Descargar e instalar nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Recargar el perfil de la terminal
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Verificar que nvm se instaló correctamente
nvm --version
# Salida esperada: 0.39.7

# === PASO 2: Instalar la versión LTS de Node.js ===
# La versión LTS (Long Term Support) es la recomendada para producción

# Listar versiones LTS disponibles
nvm ls-remote --lts

# Instalar la versión LTS más reciente
nvm install --lts

# Establecerla como versión por defecto
nvm alias default 'lts/*'

# Verificar instalación
node --version   # Ejemplo: v20.15.0
npm --version    # Ejemplo: 10.8.0

# === PASO 3: Instalar Angular CLI ===
# Angular CLI se instala globalmente con npm

npm install -g @angular/cli

# Verificar la instalación completa
ng version
# La salida muestra las versiones de Angular CLI, Node, npm y SO

# === PASO 4: Verificación final del entorno ===
# Comprobar que podemos crear un proyecto

ng new test-env --create-application=false --standalone
# Esto crea un workspace sin aplicación, solo para verificar que funciona

cd test-env
ng generate application test-app --standalone --style=css
# Genera una aplicación dentro del workspace

ng build test-app
# Compila la aplicación. Si no hay errores, todo está correctamente configurado.
```

**Verificación**: El entorno está correctamente configurado si:
- `node --version` muestra una versión >= 18.13.0
- `npm --version` muestra una versión >= 9.0.0
- `ng version` muestra Angular CLI >= 17.0.0
- `ng build` completa sin errores

### Ejercicio 2: Configurar VS Code con las extensiones recomendadas para Angular

**Objetivo**: Preparar Visual Studio Code como editor principal para desarrollo Angular, instalando las extensiones que maximizan la productividad.

**Solución paso a paso:**

1. **Instalar VS Code**
   - Descargar desde https://code.visualstudio.com/
   - Instalar siguiendo las instrucciones del sistema operativo.

2. **Extensiones esenciales para Angular:**

| Extensión | Propósito | ID |
|---|---|---|
| **Angular Language Service** | Autocompletado en plantillas, diagnóstico de errores | `angular.ng-template` |
| **ESLint** | Linting de JavaScript/TypeScript | `dbaeumer.vscode-eslint` |
| **Prettier** | Formateo de código automático | `esbenp.prettier-vscode` |
| **TypeScript God** | Mejores tooltips y navegación en TypeScript | (buscar en marketplace) |
| **Path Intellisense** | Autocompletado de rutas de archivo | `christian-kohler.path-intellisense` |
| **Material Icon Theme** | Iconos para archivos y carpetas (mejora la navegación visual) | `pkief.material-icon-theme` |
| **GitLens** | Información de Git en el editor (blame, historial) | `eamodio.gitlens` |
| **Angular Snippets** | Snippets para componentes, servicios, directivas | `johnpapa.angular2` |

3. **Configuración recomendada de VS Code** (añadir a `settings.json`):

```json
{
  // Formateo al guardar
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  
  // Configuración específica para TypeScript
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
      "source.organizeImports": "explicit"
    }
  },
  
  // Configuración para plantillas HTML de Angular
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  
  // Angular Language Service
  "angular.experimental-ivy": true,
  
  // TypeScript
  "typescript.updateImportsOnFileMove.enabled": "always",
  "typescript.preferences.importModuleSpecifier": "relative",
  
  // Prettier
  "prettier.singleQuote": true,
  "prettier.trailingComma": "all",
  "prettier.printWidth": 100,
  
  // ESLint
  "eslint.validate": [
    "javascript",
    "typescript",
    "html"
  ],
  
  // Explorador de archivos
  "explorer.compactFolders": false,
  "explorer.sortOrder": "type",
  
  // Editor
  "editor.tabSize": 2,
  "editor.rulers": [100],
  "editor.bracketPairColorization.enabled": true,
  "editor.guides.bracketPairs": true
}
```

4. **Atajos de teclado recomendados:**

| Atajo | Acción |
|---|---|
| `Ctrl + Shift + P` | Paleta de comandos (buscar cualquier acción) |
| `Ctrl + P` | Abrir archivo rápidamente |
| `Ctrl + \`` | Abrir terminal integrada |
| `Ctrl + B` | Mostrar/ocultar barra lateral |
| `Ctrl + Shift + F` | Buscar en todos los archivos |
| `Ctrl + D` | Seleccionar siguiente ocurrencia |
| `F2` | Renombrar símbolo (refactorización) |
| `F12` | Ir a definición |
| `Alt + F12` | Ver definición (peek) |

## Actividades propuestas

### Actividad 1: Investigar la hoja de ruta oficial de Angular

**Descripción**: Visita el repositorio oficial de Angular en GitHub y explora la sección de proyectos y milestones. Escribe un resumen de 500 palabras sobre las funcionalidades planificadas para las próximas versiones de Angular.

**Objetivos**:
- Familiarizarse con el desarrollo abierto de Angular.
- Comprender la dirección futura del framework.
- Desarrollar el hábito de seguir las novedades técnicas.

**Entregable**: Documento PDF con el resumen, incluyendo capturas de pantalla del roadmap y comentarios personales sobre qué funcionalidades te parecen más relevantes.

### Actividad 2: Instalar y configurar el entorno de desarrollo completo

**Descripción**: Siguiendo los ejercicios resueltos, instala Node.js mediante nvm, Angular CLI, VS Code y las extensiones recomendadas. Documenta el proceso con capturas de pantalla de cada paso.

**Objetivos**:
- Configurar correctamente el entorno de desarrollo.
- Familiarizarse con la terminal y la línea de comandos.
- Aprender a gestionar versiones de Node.js.

**Entregable**: Documento con capturas de pantalla mostrando las versiones instaladas de cada herramienta.

### Actividad 3: Comparar la sintaxis de un componente simple en Angular, React y Vue

**Descripción**: Investiga cómo se escribe un mismo componente simple (por ejemplo, un contador con botones de incrementar y decrementar) en Angular, React y Vue. Escribe los tres componentes y un análisis comparativo.

**Objetivos**:
- Comprender las diferencias sintácticas y filosóficas entre los tres frameworks.
- Desarrollar criterio para elegir herramientas según el contexto.
- Practicar la lectura de código ajeno.

**Entregable**: Documento con el código de los tres componentes y un análisis de 300-500 palabras.

### Actividad 4: Crear una cuenta en GitHub y configurar git

**Descripción**: Si aún no tienes cuenta en GitHub, créala. Instala git en tu equipo, configura tu nombre de usuario y correo electrónico, y crea un repositorio para el curso. Sube un archivo README.md con tus expectativas del curso.

```bash
# Configuración básica de git
git config --global user.name "Tu Nombre"
git config --global user.email "tu.email@ejemplo.com"

# Crear repositorio local
mkdir curso-angular
cd curso-angular
git init
echo "# Curso de Angular - DAW" > README.md
git add README.md
git commit -m "Commit inicial"
```

**Objetivos**:
- Aprender control de versiones.
- Crear un portfolio profesional en GitHub.
- Preparar el entorno para entregar las actividades del curso.

### Actividad 5: Explorar la documentación oficial de Angular

**Descripción**: Navega por la documentación oficial de Angular (https://angular.dev) e identifica las siguientes secciones: Getting Started, Tutorial: Tour of Heroes, In-Depth Guides, y API Reference. Escribe un breve resumen de qué información se encuentra en cada sección.

**Objetivos**:
- Aprender a navegar la documentación técnica en inglés.
- Familiarizarse con los recursos oficiales.
- Desarrollar autonomía para resolver dudas.

## Actividades de ampliación

### Actividad de ampliación 1: Investigar empresas en Andalucía y España que usen Angular

**Descripción**: Investiga en LinkedIn, InfoJobs, Tecnoempleo y otras plataformas de empleo qué empresas en Andalucía y España demandan desarrolladores Angular. Crea un listado con al menos 10 empresas, incluyendo ubicación, sector y tipo de proyectos que desarrollan con Angular.

**Objetivos**:
- Conectar el aprendizaje con el mercado laboral real.
- Conocer el ecosistema empresarial tecnológico local.
- Identificar posibles empresas para realizar las prácticas de FP.

**Entregable**: Tabla con el listado de empresas y una breve reflexión sobre el mercado laboral Angular en tu zona.

### Actividad de ampliación 2: Configurar ESLint y Prettier en un proyecto Angular

**Descripción**: Añade ESLint y Prettier al proyecto `hola-mundo` creado en el Ejemplo 2. Configura reglas de estilo adaptadas a un entorno profesional. Documenta el proceso.

```bash
# Añadir ESLint al proyecto
ng add @angular-eslint/schematics

# Instalar Prettier y su integración con ESLint
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier

# Verificar la configuración
ng lint
```

**Objetivos**:
- Aprender a configurar herramientas de calidad de código.
- Entender la importancia del linting en proyectos profesionales.
- Familiarizarse con las reglas de ESLint.

### Actividad de ampliación 3: Crear una presentación sobre la evolución de Angular

**Descripción**: Prepara una presentación de 10 diapositivas sobre la evolución de Angular desde 2010 hasta la actualidad. Incluye las versiones principales, las novedades más relevantes y tu opinión sobre hacia dónde va el framework.

**Objetivos**:
- Profundizar en la historia del framework.
- Practicar habilidades de comunicación técnica.
- Sintetizar información compleja.

## Buenas prácticas profesionales

1. **Mantener el entorno actualizado**: Revisa periódicamente si hay nuevas versiones de Node.js (con `nvm ls-remote`), Angular CLI (`npm outdated -g @angular/cli`) y las extensiones de VS Code. Un entorno actualizado evita incompatibilidades y vulnerabilidades de seguridad.

2. **Leer el changelog antes de actualizar**: Antes de ejecutar `ng update`, lee las notas de versión (release notes) en el blog oficial de Angular (https://blog.angular.dev). Así conocerás los breaking changes y podrás planificar la migración.

3. **Usar siempre TypeScript en modo estricto**: Al crear un proyecto Angular, activa el modo estricto (`--strict` o responder "Yes" cuando el CLI pregunte). El modo estricto activa comprobaciones de tipos más rigurosas, evitando muchos errores comunes.

4. **Seguir el estilo de código oficial de Angular**: Consulta la guía de estilo oficial de Angular (https://angular.dev/style-guide). Cubre desde la nomenclatura de archivos hasta la organización de carpetas y las mejores prácticas para componentes.

5. **Documentar las decisiones de arquitectura**: En proyectos profesionales, documenta por qué elegiste Angular frente a otras opciones. Esto es útil cuando nuevos miembros se unen al equipo o cuando se revisa la viabilidad técnica del proyecto.

6. **Separar el entorno personal del profesional**: Usa nvm para gestionar versiones de Node.js. Así puedes tener una versión LTS para trabajo y probar versiones experimentales sin afectar tus proyectos.

7. **Automatizar las comprobaciones de calidad**: Configura ESLint, Prettier y tests unitarios para que se ejecuten automáticamente antes de cada commit (usando husky y lint-staged). Esto evita que código de baja calidad llegue al repositorio.

8. **Participar en la comunidad**: Angular tiene una comunidad muy activa. Participa en foros (Stack Overflow con la etiqueta `[angular]`), grupos de Telegram/Discord, y eventos como Angular Madrid, NgSpain o Angular Community Meetups. La comunidad es una fuente inagotable de aprendizaje.

## Errores frecuentes

1. **Confundir Angular con AngularJS**: Son frameworks completamente diferentes. Si buscas información en internet, asegúrate de que los artículos se refieran a Angular (versión 2 en adelante), no a AngularJS (versión 1.x). Los artículos, blogs y tutoriales de AngularJS NO son aplicables a Angular moderno.

2. **Instalar Angular CLI sin permisos adecuados**: En Linux y macOS, instalar paquetes globales con `sudo npm install -g` puede causar problemas de permisos. La solución recomendada es usar nvm, que instala Node.js y npm en el directorio del usuario sin necesidad de permisos de administrador.

3. **No verificar los requisitos de versión de Node.js**: Cada versión de Angular requiere una versión mínima de Node.js. Usar una versión demasiado antigua o demasiado nueva puede causar errores. Consulta la tabla de compatibilidad en https://angular.dev/reference/versions.

4. **Asumir que Angular CLI funciona sin Node.js instalado**: Angular CLI es una herramienta de Node.js. Necesita Node.js instalado para funcionar. El comando `ng` ejecuta scripts de Node.js internamente.

5. **Ignorar los avisos de seguridad de npm**: Cuando ejecutas `npm install`, npm puede mostrar avisos de vulnerabilidades. No los ignores. Ejecuta `npm audit` para ver los detalles y `npm audit fix` para corregir las vulnerabilidades que tengan solución automática.

6. **No usar control de versiones desde el principio**: Inicializa git (`git init`) justo después de crear el proyecto. Haz commits frecuentes con mensajes descriptivos. Si algo sale mal, siempre podrás volver atrás.

7. **Crear proyectos sin --standalone en Angular moderno**: A partir de Angular 19, los componentes standalone son el comportamiento por defecto, pero en versiones anteriores debes especificarlo explícitamente. Crear proyectos con NgModules en 2025 es técnicamente posible pero no recomendado para nuevos proyectos.

8. **Aprender Angular sin aprender TypeScript**: Angular está profundamente integrado con TypeScript. Intentar aprender Angular sin conocimientos previos de TypeScript es como intentar aprender a escribir sin conocer el alfabeto. Dedica tiempo a dominar los fundamentos de TypeScript: tipos básicos, interfaces, genéricos, decoradores y utility types.

## Resumen

En esta unidad introductoria hemos cubierto los fundamentos conceptuales necesarios para abordar el estudio de Angular con una base sólida. Los puntos clave son:

- **Angular es un framework estructural completo** (no una simple biblioteca), mantenido por Google y construido sobre TypeScript. Proporciona una solución "llave en mano" para el desarrollo web moderno: enrutamiento, formularios, cliente HTTP, animaciones, testing y SSR, todo integrado y coherente.

- **La evolución de Angular refleja la madurez del ecosistema web**: desde el revolucionario AngularJS (2010), pasando por la reescritura total de Angular 2 (2016), hasta la era moderna de Signals, Standalone Components y SSR nativo (2023-2024). Cada versión ha aportado mejoras incrementales manteniendo la estabilidad del framework.

- **Las SPA representan un cambio de paradigma** en cómo se construyen aplicaciones web: la carga inicial es más pesada, pero la experiencia de navegación es mucho más fluida y cercana a la de una aplicación nativa. Angular fue diseñado específicamente para este modelo.

- **La elección entre Angular, React y Vue depende del contexto**: Angular destaca en proyectos empresariales grandes y equipos que valoran la consistencia; React ofrece máxima flexibilidad; Vue combina facilidad de aprendizaje con potencia. Ninguno es inherentemente "mejor", cada uno resuelve problemas diferentes.

- **El ecosistema Angular es rico y oficial**: Angular CLI, Angular Material, Angular DevTools y Angular Language Service forman un toolkit completo respaldado por Google.

Con estos conceptos claros, estamos listos para comenzar a crear nuestro primer proyecto Angular en la siguiente unidad.

## Recursos adicionales

### Documentación oficial
- **Angular.dev** (documentación oficial moderna): https://angular.dev
- **Angular Blog**: https://blog.angular.dev
- **Angular Style Guide**: https://angular.dev/style-guide
- **Angular CLI Reference**: https://angular.dev/cli
- **Angular Version Compatibility**: https://angular.dev/reference/versions

### Cursos y tutoriales
- **Tour of Heroes** (tutorial oficial): https://angular.dev/tutorials
- **Angular University** (blog y cursos avanzados): https://blog.angular-university.io
- **Codecademy - Learn AngularJS / Angular**: https://www.codecademy.com
- **Udemy - Angular: De cero a experto (Fernando Herrera)** - Muy recomendado en español.

### Libros
- "Angular: Up and Running" - Shyam Seshadri (O'Reilly)
- "Pro Angular" - Adam Freeman (Apress)
- "Learning Angular" - Aristeidis Bampakos (Packt Publishing)
- "Angular for Enterprise Applications" - Doguhan Uluca (Packt Publishing)

### Comunidades
- **Stack Overflow** (etiqueta `[angular]`): https://stackoverflow.com/questions/tagged/angular
- **Angular Discord**: https://discord.com/invite/angular
- **Reddit r/angular**: https://reddit.com/r/angular
- **Angular Madrid Meetup**: https://www.meetup.com/es/angular-madrid/
- **NgSpain** (conferencia anual en España): https://ngspain.com
- **Angular Community**: https://angular.dev/community

### Herramientas
- **VS Code**: https://code.visualstudio.com
- **Node.js**: https://nodejs.org
- **nvm (Windows)**: https://github.com/coreybutler/nvm-windows
- **Angular DevTools (Chrome)**: https://chromewebstore.google.com/detail/angular-devtools
- **Git**: https://git-scm.com
- **GitHub**: https://github.com
