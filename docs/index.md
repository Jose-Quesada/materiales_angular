---
icon: lucide/book-open-check
---

# Curso Angular 

Bienvenido al portal de documentación interactiva y material didáctico para el aula de **Angular**.

Este portal ha sido diseñado bajo los estándares de desarrollo de **F3 Martos**, estructurado en dos grandes bloques complementarios:

1. **📹 Guías de Clase:** Material paso a paso con código incremental, explicaciones detalladas y retos rápidos para el proyector y el aula.
2. **📖 Manual de Referencia:** Documentación técnica exhaustiva con fundamentos de ingeniería, buenas prácticas, errores frecuentes y actividades de nivel profesional.

---

## 🎯 Filosofía y Metodología Pedagógica

El material sigue un enfoque riguroso de **ingeniería de software moderna**, combinando la agilidad de desarrollo con una arquitectura limpia y sólida:

``` mermaid
flowchart TD
    subgraph Bloque1 ["Bloque 1 · Fundamentos y Lenguaje"]
        A["<b>1. Conceptos Generales</b><br/>Arquitectura SPA, TypeScript vs JS y Ecosistema"] --> B["<b>2. Bases de TypeScript</b><br/>Tipado estricto, interfaces, POO y genéricos"]
    end

    subgraph Bloque2 ["Bloque 2 · Angular 19 Core"]
        C["<b>3. Bases de Angular</b><br/>Componentes Standalone, Directivas y Signals"] --> D["<b>4. Expandir Bases</b><br/>Signal Inputs/Outputs, Smart/Dumb y Servicios"]
    end

    subgraph Bloque3 ["Bloque 3 · Proyecto Integrador Enterprise"]
        E["<b>5. GifsApp Profesional</b><br/>Layout modular, HttpClient, Mappers y Scroll Infinito"]
    end

    Bloque1 ==> Bloque2 ==> Bloque3
```

### Principios de Arquitectura Aplicados

1. **Separación Estricta de Responsabilidades (SoC):** La interfaz (`HTML/CSS`) es declarativa y desacoplada de la lógica de negocio (`TypeScript/Signals`).
2. **Reactividad Fina Nativa:** Adopción total del nuevo paradigma reactivo de Angular basado en **Señales** (`Signals`), preparando el camino hacia aplicaciones **Zoneless** ultraeficientes.
3. **Componentes Standalone por Defecto:** Eliminación de la sobrecarga de los módulos tradicionales (`NgModule`), aprovechando las capacidades nativas de Angular 19.
4. **Clean Code & Inmutabilidad:** Código auto-documentado, tipado estricto y funciones atómicas.

---

## 📹 Guías de Clase (Seguimiento de Vídeos)

Diseñadas para el proyector del aula y el seguimiento continuo de cada sesión de laboratorio:

| Sección | Guía de Clase | Enfoque Principal | Enlace al Material |
| :--- | :--- | :--- | :--- |
| **02** | **Conceptos Generales** | TypeScript vs JavaScript, ventajas arquitectónicas y los 10 mitos de Angular. | [**Ver Guía de Clase**](02-conceptos-generales.md) |
| **03** | **Bases de TypeScript** | Tipado estricto, interfaces, POO moderna, composición sobre herencia y decoradores. | [**Ver Guía de Clase**](03-bases-typescript.md) |
| **04** | **Bases de Angular** | Creación con CLI, componentes standalone, reactividad con `signal()` y `computed()`. | [**Ver Guía de Clase**](04-angular-bases.md) |
| **05** | **Expandir Bases** | Navegación `RouterLink`, nuevo Control Flow (`@for`, `@if`), inputs/outputs y servicios. | [**Ver Guía de Clase**](05-expandir-bases.md) |
| **06** | **GifsApp: Componentes** | Tailwind CSS 3/4, rutas hijas con *lazy loading* y descomposición atómica de vistas. | [**Ver Guía de Clase**](06-gifs-componentes.md) |
| **07** | **GifsApp: Servicios y HTTP** | Cliente HTTP moderno, variables de entorno, patrón Mapper y conversión con `toSignal()`. | [**Ver Guía de Clase**](07-gifs-servicio-http.md) |
| **08** | **GifsApp: Avanzado** | Cuadrícula Masonry, consultas DOM con `viewChild()`, infinite scroll y DevTools. | [**Ver Guía de Clase**](08-gifs-intermedio-avanzado.md) |

---

## 📖 Manual de Referencia de Angular

Guía técnica completa y detallada de cada concepto del framework para consulta, profundización y estándares de desarrollo:

| Cap. | Tema de Referencia | Conceptos Clave Tratados | Enlace al Manual |
| :---: | :--- | :--- | :--- |
| **01** | **Introducción a Angular** | SPA vs MPA, arquitectura opinada, Framework vs Biblioteca y "Angular Renaissance". | [**01. Introducción**](manual/01-introduccion.md) |
| **02** | **Crear un Proyecto Angular** | Angular CLI, Vite/esbuild, anatomía de archivos, `angular.json` y Zoneless. | [**02. Crear Proyecto**](manual/02-crear-proyecto.md) |
| **03** | **Componentes Standalone** | Decorador `@Component`, ciclo de vida, ViewEncapsulation y separación de vistas. | [**03. Componentes**](manual/03-componentes.md) |
| **04** | **Plantillas y Control Flow** | Data binding, nuevo Control Flow (`@if`, `@for`, `@switch`) y vistas diferidas (`@defer`). | [**04. Plantillas**](manual/04-plantillas.md) |
| **05** | **Signals y Reactividad** | Writable signals, computadas, `effect()`, comparativa con RxJS y OnPush. | [**05. Signals**](manual/05-signals.md) |
| **06** | **Pipes Nativos y Custom** | Pipes puros e impuros, inyección de dependencias en pipes y pipes asíncronos. | [**06. Pipes**](manual/06-pipes.md) |
| **07** | **Anidar Componentes** | Jerarquía padre-hijo, `input()`, `output()`, dos vías con `model()` y Smart/Dumb. | [**07. Anidar Componentes**](manual/07-anidar-componentes.md) |
| **08** | **Directivas** | Directivas de atributo y estructurales, `HostListener`, `HostBinding` y `hostDirectives`. | [**08. Directivas**](manual/08-directivas.md) |
| **09** | **Servicios e Inyección** | Sistema jerárquico de DI, `providedIn: 'root'`, función `inject()` y estado reactivo. | [**09. Servicios**](manual/09-servicios.md) |
| **10** | **Cliente HTTP, APIs e Interceptores** | `provideHttpClient()`, peticiones tipadas, `HttpContext`, interceptores funcionales y manejo de errores. | [**10. Cliente HTTP e Interceptores**](manual/10-http.md) |
| **11** | **Angular Router** | Configuración de rutas, rutas hijas, Lazy Loading, guards funcionales y resolvers. | [**11. Router**](manual/11-router.md) |
| **12** | **Formularios Reactivos** | `FormControl`, `FormGroup`, validaciones síncronas y asíncronas y estado del formulario. | [**12. Formularios**](manual/12-formularios.md) |
| **13** | **Proyección de Contenido** | Slots con `<ng-content>`, proyección múltiple (`select`) y encapsulación dinámica. | [**13. Proyección**](manual/13-proyeccion-contenido.md) |
| **14** | **Queries del DOM** | Signal Queries (`viewChild()`, `viewChildren()`, `contentChild()`) frente a decoradores. | [**14. Queries**](manual/14-queries.md) |
| **15** | **Server-Side Rendering (SSR)** | Angular SSR, hidratación en cliente y consideraciones de arquitectura servidora. | [**15. SSR**](manual/15-ssr.md) |
| **16** | **Integración de Librerías** | Tailwind CSS, Bootstrap, componentes UI de terceros y utilidades JavaScript. | [**16. Integración Librerías**](manual/16-integracion-librerias.md) |
| **17** | **Proyecto Final Integrador** | Aplicación profesional completa integrando todos los bloques de la plataforma. | [**17. Proyecto Final**](manual/17-proyecto-final.md) |

---

## 🚀 Cómo Utilizar este Material en Clase

!!! tip "Para el Docente"
    En cada sección encontrarás bloques especiales identificados con:
    
    * 🎓 **Guía Didáctica:** Analogías y preguntas detonantes para plantear a los alumnos.
    * ⚠️ **Atención / Errores Típicos:** Advertencias sobre los errores sintácticos o conceptuales más comunes.
    * 💻 **Código Incremental:** Bloques de código con tabs comparativos (`TypeScript`, `HTML`, `Styles`) para seguir la construcción en vivo sin saltos bruscos.
    * 🧪 **Retos de Aula:** Micro-ejercicios prácticos con solución desplegable para evaluar el aprendizaje en tiempo real.
    * 📖 **Conexión con el Manual:** Enlaces contextuales en cada guía de vídeo para abrir directamente el capítulo de referencia correspondiente.

!!! note "Para el Alumno"
    Puedes seguir la guía de vídeo paso a paso desde tu portátil. Cuando tengas dudas teóricas o quieras ver ejemplos avanzados, pulsa sobre los enlaces del **Manual de Referencia** para consultar la explicación técnica completa de cada concepto.