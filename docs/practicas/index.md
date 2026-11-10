---
icon: lucide/folder-kanban
title: Prácticas y Retos Autónomos
---

# 🛠️ Prácticas y Retos de Consolidación

¡Bienvenido al espacio de **Prácticas y Retos Autónomos** de Angular!

Este apartado reúne proyectos integradores diseñados para trabajar de forma autónoma en casa. Su propósito es asimilar y consolidar en profundidad los conocimientos adquiridos en el aula, enfrentándote a retos arquitectónicos reales con el stack y estándares de la industria.

---

## 🎯 Metodología de las Prácticas: El Modelo Híbrido

En el desarrollo profesional de software, los requisitos técnicos son innegociables, pero la creatividad en la solución aporta valor y motivación. Por eso, nuestras prácticas siguen un **modelo híbrido**:

1. **Rigor Arquitectónico Estricto:** Cada práctica define un *contrato técnico obligatorio* (patrones de diseño, separación Smart/Dumb, reactividad con Signals, inmutabilidad y servicios singleton).
2. **Libertad Temática Guiada:** Para evitar el bloqueo de la página en blanco o el copia-pega automático, te ofrecemos un catálogo de opciones temáticas inspiradoras (videojuegos, deportes, finanzas, tareas...) o la posibilidad de proponer tu propia temática bajo el mismo contrato de datos.

---

## 📚 Catálogo de Prácticas del Curso

A lo largo del curso se irán desbloqueando las siguientes prácticas globales:

| Práctica | Unidades Evaluadas | Stack y Conceptos Principales | Estado |
| :--- | :---: | :--- | :---: |
| **[01. Tracker Reactivo SPA](01-tracker-spa.md)** | **04 y 05** | Standalone Components, Signals (`signal`, `computed`, `effect`, `linkedSignal`), Smart/Dumb (`input.required`, `output`), Inmutabilidad y LocalStorage. | :white_check_mark: **Disponible** |
| **02. Buscador y Dashboard con APIs** | **06, 07 y 08** | Consumo HTTP con `HttpClient`, Mappers, Debounce en búsquedas, Scroll Infinito y Masonry Grid. | ⏳ Próximamente |
| **03. Country Explorer Avanzado** | **09, 10 y 11** | Angular Router avanzado con parámetros, `rxResource` / `resource`, Caché de peticiones y DaisyUI. | ⏳ Próximamente |
| **04. Proyecto Integrador Final** | **Bloque Completo** | Formularios Reactivos con validaciones complejas, Guards, SSR y Testing unitario con Vitest. | ⏳ Próximamente |

---

## 🏆 Criterios Generales de Éxito

Para obtener la máxima calificación en cualquier entrega:

* **Arquitectura Limpia:** Separación estricta entre capa de presentación (UI tonta) y capa de datos/estado (servicios y signals).
* **Inmutabilidad por Defecto:** Nunca mutes arrays u objetos directamente (`.push()`, `.splice()`). Usa siempre operadores inmutables (`[...prev]`, `.map()`, `.filter()`).
* **Consola Impecable:** Tu aplicación no debe mostrar errores en tiempo de ejecución ni advertencias en las herramientas de desarrollo (++f12++).
* **Control de Versiones:** Desarrolla tus prácticas realizando *commits* semánticos atómicos que expliquen el avance del proyecto.
