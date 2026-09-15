# Introducción a Angular

## Objetivos de aprendizaje

- Conocer qué es Angular y sus principales características.
- Entender la historia y evolución de Angular.
- Comparar Single Page Applications (SPA) con aplicaciones tradicionales.
- Instalar y configurar el entorno de desarrollo para Angular.
- Crear y entender la estructura de un proyecto Angular inicial.

## Resultados de aprendizaje

Al finalizar esta unidad, el estudiante será capaz de:
- Explicar qué es Angular y sus ventajas.
- Describir la historia y evolución de Angular.
- Comparar SPA con aplicaciones tradicionales.
- Configurar su entorno de desarrollo para trabajar con Angular.
- Crear un proyecto Angular básico y comprender su estructura.

## Contenidos

1. ¿Qué es Angular?
2. Historia y evolución.
3. SPA vs aplicaciones tradicionales.
4. Instalación del entorno.
   - Node.js.
   - Angular CLI.
5. Creación del primer proyecto.
6. Estructura de carpetas.

## Desarrollo teórico

### ¿Qué es Angular?

Angular es un framework de desarrollo web mantenido por Google y la comunidad. Proporciona una plataforma robusta para construir aplicaciones web dinámicas y de alto rendimiento. Angular utiliza TypeScript, un superconjunto de JavaScript, lo que permite escribir código más seguro y mantenible.

### Historia y evolución

Angular se originó en 2010 como AngularJS, una biblioteca de JavaScript para crear aplicaciones web interactivas. En 2016, se lanzó Angular 2, que marcó un cambio significativo hacia un framework más potente y modular. Desde entonces, Angular ha continuado evolucionando, lanzando nuevas versiones con mejoras y nuevas características.

### SPA vs aplicaciones tradicionales

Las aplicaciones tradicionales recargan toda la página web cada vez que el usuario interactúa con ella. Por otro lado, las Single Page Applications (SPA) solo actualizan partes específicas de la página, lo que resulta en una experiencia de usuario más fluida y rápida.

### Instalación del entorno

#### Node.js

Node.js es un entorno de tiempo de ejecución de JavaScript que permite ejecutar código JavaScript fuera del navegador. Angular requiere Node.js para instalar y ejecutar herramientas de desarrollo.

Para instalar Node.js, puedes descargarlo desde [nodejs.org](https://nodejs.org/) y seguir las instrucciones de instalación.

#### Angular CLI

Angular CLI es una interfaz de línea de comandos que facilita la creación y gestión de proyectos Angular. Para instalar Angular CLI, abre tu terminal y ejecuta el siguiente comando:

```bash
npm install -g @angular/cli
```

### Creación del primer proyecto

Para crear un nuevo proyecto Angular, usa el siguiente comando:

```bash
ng new my-angular-app
```

Este comando crea una nueva carpeta llamada `my-angular-app` con la estructura básica de un proyecto Angular.

### Estructura de carpetas

La estructura de carpetas de un proyecto Angular típico es la siguiente:

```
my-angular-app/
├── e2e/
├── src/
│   ├── app/
│   │   ├── app.component.css
│   │   ├── app.component.html
│   │   ├── app.component.spec.ts
│   │   ├── app.component.ts
│   │   └── app.module.ts
│   ├── assets/
│   ├── environments/
│   ├── index.html
│   ├── main.ts
│   ├── polyfills.ts
│   ├── styles.css
│   └── test.ts
├── angular.json
├── package.json
├── tsconfig.app.json
├── tsconfig.json
└── tsconfig.spec.json
```

## Ejemplos prácticos

### Crear un proyecto Angular

1. Abre tu terminal y ejecuta el siguiente comando:

   ```bash
   ng new my-angular-app
   ```

2. Navega a la carpeta del proyecto:

   ```bash
   cd my-angular-app
   ```

3. Inicia el servidor de desarrollo:

   ```bash
   ng serve
   ```

4. Abre tu navegador y ve a [http://localhost:4200](http://localhost:4200) para ver tu aplicación Angular en acción.

## Actividades propuestas

### Actividad 1

**Objetivo**

Crear un proyecto Angular básico y familiarizarse con su estructura.

**Enunciado**

Crea un nuevo proyecto Angular llamado `mi-primer-proyecto` y explora su estructura de carpetas.

**Requisitos**

- Tener Node.js y Angular CLI instalados.

**Pistas**

- Usa el comando `ng new` para crear el proyecto.
- Usa el comando `cd` para navegar a la carpeta del proyecto.
- Usa el comando `ng serve` para iniciar el servidor de desarrollo.

**Criterios de evaluación**

- El proyecto se crea correctamente.
- Se puede acceder a la aplicación en [http://localhost:4200](http://localhost:4200).
- Se explica la estructura de carpetas del proyecto.

### Actividad 2

**Objetivo**

Modificar el componente raíz de la aplicación.

**Enunciado**

Modifica el componente raíz (`app.component.html`) para que muestre un mensaje personalizado.

**Requisitos**

- Tener un proyecto Angular creado.

**Pistas**

- Edita el archivo `src/app/app.component.html`.
- Usa interpolación para mostrar un mensaje personalizado.

**Criterios de evaluación**

- El mensaje personalizado se muestra correctamente en la aplicación.
- El código está bien formateado y comentado.

## Actividades de ampliación

### Actividad 3

**Objetivo**

Crear un componente adicional.

**Enunciado**

Crea un nuevo componente llamado `about` y añádelo al proyecto.

**Requisitos**

- Tener un proyecto Angular creado.

**Pistas**

- Usa el comando `ng generate component about` para crear el componente.
- Añade el componente al módulo principal (`app.module.ts`).

**Criterios de evaluación**

- El componente se crea correctamente.
- El componente se añade al módulo principal.
- El componente se muestra en la aplicación.

## Resumen

En esta unidad hemos aprendido qué es Angular, su historia y evolución, y cómo compararlo con aplicaciones tradicionales. También hemos configurado nuestro entorno de desarrollo y creado nuestro primer proyecto Angular.

## Recursos adicionales

- [Documentación oficial de Angular](https://angular.io/docs)
- [Angular CLI](https://cli.angular.io/)
- [Node.js](https://nodejs.org/)
