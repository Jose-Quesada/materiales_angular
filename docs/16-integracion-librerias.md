# Integración de Librerías en Angular

## Objetivos de aprendizaje

Al finalizar esta unidad, el alumnado será capaz de:

- Integrar librerías externas de terceros en proyectos Angular modernos con standalone components.
- Configurar correctamente SweetAlert2 para mostrar notificaciones, alertas de confirmación y toasts.
- Incluir Font Awesome en un proyecto Angular mediante dos enfoques distintos (CSS y componente Angular).
- Utilizar ngBootstrap como conjunto de componentes UI accesibles sin dependencia de jQuery.
- Implementar autenticación mediante proveedores externos como Google y Facebook usando OAuth 2.0.
- Manejar mapas interactivos con la biblioteca OpenLayers dentro del ciclo de vida de componentes Angular.
- Convertir una aplicación Angular en una app móvil nativa mediante Capacitor.
- Evaluar y seleccionar la librería adecuada según los requisitos del proyecto.

## Resultados de aprendizaje

Según el currículo de Desarrollo de Aplicaciones Web (DAW) y Desarrollo de Aplicaciones Multiplataforma (DAM):

- **RA3.** Integra librerías y frameworks de terceros en aplicaciones web, justificando su elección y configurando su uso adecuadamente.
- **RA5.** Implementa mecanismos de autenticación y autorización en aplicaciones web utilizando servicios de terceros.
- **RA6.** Desarrolla aplicaciones web híbridas utilizando frameworks que permitan la compilación a código nativo.
- **RA7.** Integra componentes multimedia y de geolocalización en aplicaciones web interactivas.

## Introducción

Una de las mayores ventajas del ecosistema Angular es su capacidad para integrar librerías y frameworks externos de forma limpia y mantenible. En el desarrollo profesional real, raramente se construye todo desde cero: aprovechamos el trabajo de la comunidad para acelerar el desarrollo, mejorar la experiencia de usuario y añadir funcionalidades complejas sin reinventar la rueda.

En esta unidad exploraremos siete categorías fundamentales de integración con librerías externas: notificaciones y alertas (SweetAlert2), iconografía (Font Awesome), componentes UI avanzados (ngBootstrap), autenticación con proveedores OAuth (Google y Facebook), visualización geoespacial (OpenLayers) y conversión a aplicaciones móviles nativas (Capacitor).

Cada sección incluye el proceso completo desde la instalación hasta la implementación en servicios y componentes Angular con standalone components, siguiendo las mejores prácticas del ecosistema Angular moderno. Aprenderemos no solo a usar estas librerías, sino también a encapsularlas correctamente en servicios Angular para mantener nuestro código desacoplado, testeable y mantenible.

El módulo de Desarrollo Web en Entorno Cliente exige que el alumnado sea capaz de integrar soluciones de terceros de forma profesional. Esta unidad proporciona las bases para hacerlo con confianza y criterio técnico.

---

## Desarrollo teórico

### SECCIÓN 1 - SweetAlert2

SweetAlert2 es una biblioteca JavaScript que reemplaza los cuadros de diálogo nativos del navegador (`alert`, `confirm`, `prompt`) por ventanas modales atractivas, personalizables y responsive. Es ampliamente utilizada en aplicaciones profesionales por su facilidad de uso y su aspecto moderno.

#### Instalación

```bash
npm install sweetalert2
```

No requiere ningún tipado adicional ni configuración especial en Angular. La librería es tree-shakeable, por lo que solo se incluirá en el bundle final el código que realmente uses.

#### Uso básico: Swal.fire()

El método principal es `Swal.fire()`, que acepta un objeto de configuración con las propiedades de la alerta:

```typescript
// Importación en un componente standalone
import Swal from 'sweetalert2';

// Alerta simple
Swal.fire({
  title: '¡Operación completada!',
  text: 'El registro se ha guardado correctamente.',
  icon: 'success',
  confirmButtonText: 'Aceptar'
});
```

Los iconos disponibles son: `'success'`, `'error'`, `'warning'`, `'info'` y `'question'`. Cada uno muestra un icono animado y un color de acento diferente.

#### Alertas de éxito, error y advertencia

```typescript
// Alerta de éxito - típica tras guardar datos
Swal.fire({
  title: '¡Guardado!',
  text: 'Los cambios se han guardado correctamente.',
  icon: 'success',
  timer: 2000,           // Se cierra automáticamente a los 2 segundos
  showConfirmButton: false
});

// Alerta de error - cuando algo falla
Swal.fire({
  title: 'Error',
  text: 'No se ha podido conectar con el servidor. Inténtelo de nuevo.',
  icon: 'error',
  confirmButtonColor: '#d33'
});

// Alerta de advertencia - para avisar sin bloquear
Swal.fire({
  title: 'Atención',
  text: 'Su sesión expirará en 5 minutos.',
  icon: 'warning',
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 5000
});
```

#### Confirmaciones (Promesas y async/await)

SweetAlert2 devuelve una Promesa que se resuelve cuando el usuario interactúa con el modal. Podemos usar `.then()` o `async/await`:

```typescript
// Usando .then() con callback
Swal.fire({
  title: '¿Eliminar producto?',
  text: 'Esta acción no se puede deshacer.',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Sí, eliminar',
  cancelButtonText: 'Cancelar',
  confirmButtonColor: '#d33',
  cancelButtonColor: '#3085d6'
}).then((resultado) => {
  if (resultado.isConfirmed) {
    // El usuario confirmó la eliminación
    this.eliminarProducto(id);
    Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success');
  }
});

// Usando async/await (recomendado)
async confirmarEliminacion(id: number): Promise<void> {
  const resultado = await Swal.fire({
    title: '¿Eliminar producto?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (resultado.isConfirmed) {
    await this.productoService.eliminar(id);
    await Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success');
  }
}
```

#### Personalización avanzada

```typescript
// Personalización con clases CSS propias
Swal.fire({
  title: 'Confirmación',
  html: '<strong>¿Está seguro?</strong><br>Esta acción es irreversible.',
  icon: 'question',
  customClass: {
    container: 'mi-contenedor-swal',
    popup: 'mi-popup-personalizado',
    title: 'mi-titulo-swal',
    confirmButton: 'btn btn-danger',
    cancelButton: 'btn btn-secondary'
  },
  // Tiempo de animación en milisegundos
  showClass: {
    popup: 'animate__animated animate__fadeInDown'
  },
  hideClass: {
    popup: 'animate__animated animate__fadeOutUp'
  },
  // Permitir cierre al hacer clic fuera
  allowOutsideClick: false,
  // Mostrar loader en el botón de confirmación
  showLoaderOnConfirm: true,
  preConfirm: async () => {
    // Lógica asíncrona antes de cerrar
    return await this.servicio.procesarAccion();
  }
});
```

#### Integración en servicios Angular (AlertService)

La buena práctica en Angular es encapsular SweetAlert2 en un servicio inyectable. Esto centraliza la configuración, facilita el testing y permite cambiar de librería en el futuro sin modificar componentes:

```typescript
// Archivo: src/app/core/services/alert.service.ts
import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root'  // Singleton en toda la aplicación
})
export class AlertService {

  /**
   * Muestra una alerta simple de éxito
   * @param mensaje - Texto descriptivo del éxito
   * @param titulo - Título de la alerta (por defecto: '¡Éxito!')
   */
  exito(mensaje: string, titulo: string = '¡Éxito!'): void {
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: 'success',
      timer: 2500,
      showConfirmButton: false,
      toast: false
    });
  }

  /**
   * Muestra una alerta de error
   */
  error(mensaje: string, titulo: string = 'Error'): void {
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: 'error',
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#d33'
    });
  }

  /**
   * Muestra una alerta de advertencia
   */
  advertencia(mensaje: string, titulo: string = 'Atención'): void {
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: 'warning',
      confirmButtonText: 'Entendido'
    });
  }

  /**
   * Muestra un diálogo de confirmación y devuelve una Promesa
   * @returns Promise<boolean> - true si el usuario confirmó
   */
  async confirmar(
    mensaje: string,
    titulo: string = '¿Está seguro?',
    textoConfirmar: string = 'Sí',
    textoCancelar: string = 'Cancelar'
  ): Promise<boolean> {
    const resultado: SweetAlertResult = await Swal.fire({
      title: titulo,
      text: mensaje,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: textoConfirmar,
      cancelButtonText: textoCancelar,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#6c757d',
      reverseButtons: true  // Pone cancelar a la izquierda
    });

    return resultado.isConfirmed;
  }

  /**
   * Muestra un toast (notificación no bloqueante) en la esquina superior derecha
   */
  toast(mensaje: string, icono: SweetAlertIcon = 'success'): void {
    // Mezclamos mixin de toast con fire
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      // Al hacer hover, pausa el temporizador
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });

    Toast.fire({
      icon: icono,
      title: mensaje
    });
  }
}
```

Uso del servicio desde un componente:

```typescript
// Archivo: src/app/features/products/producto-lista.component.ts
import { Component, inject } from '@angular/core';
import { AlertService } from '../../core/services/alert.service';
import { ProductoService } from '../../core/services/producto.service';

@Component({
  selector: 'app-producto-lista',
  standalone: true,
  templateUrl: './producto-lista.component.html'
})
export class ProductoListaComponent {
  // Inyección de dependencias moderna con inject()
  private readonly alertService = inject(AlertService);
  private readonly productoService = inject(ProductoService);

  async eliminarProducto(id: number): Promise<void> {
    const confirmado = await this.alertService.confirmar(
      '¿Está seguro de que desea eliminar este producto? Esta acción no se puede deshacer.',
      'Eliminar producto',
      'Sí, eliminar'
    );

    if (confirmado) {
      try {
        await this.productoService.eliminar(id);
        this.alertService.toast('Producto eliminado correctamente');
      } catch (error) {
        this.alertService.error('No se pudo eliminar el producto. Inténtelo de nuevo.');
      }
    }
  }

  async guardarCambios(): Promise<void> {
    try {
      await this.productoService.guardar();
      this.alertService.exito('Los cambios se han guardado correctamente.');
    } catch (error) {
      this.alertService.error('Error al guardar los cambios.');
    }
  }
}
```

---

### SECCIÓN 2 - Font Awesome

Font Awesome es la biblioteca de iconos vectoriales más popular del mundo. Ofrece más de 2000 iconos gratuitos escalables que pueden personalizarse con CSS (tamaño, color, sombra, rotación).

#### Instalación: dos enfoques

**Opción A: fontawesome-free (CSS clásico)**

Es la forma más sencilla. Incluye los estilos CSS y las fuentes. Los iconos se usan con etiquetas `<i>` y clases CSS.

```bash
npm install @fortawesome/fontawesome-free
```

Luego, en `angular.json`, añadir los estilos:

```json
"styles": [
  "src/styles.scss",
  "node_modules/@fortawesome/fontawesome-free/css/all.min.css"
]
```

Uso en plantillas:

```html
<!-- Icono con clase CSS -->
<i class="fas fa-user"></i>
<i class="fas fa-shopping-cart"></i>
<i class="fas fa-trash-alt text-danger"></i>
<i class="fas fa-check-circle fa-2x text-success"></i>

<!-- Botón con icono -->
<button class="btn btn-primary">
  <i class="fas fa-save me-2"></i> Guardar
</button>
```

Ventajas: simplicidad, no requiere configuración adicional.
Desventajas: carga todos los iconos (incluso los no usados), mayor peso del bundle.

**Opción B: angular-fontawesome (componente Angular, recomendado)**

Este paquete oficial proporciona un componente `<fa-icon>` específico para Angular con soporte para tree-shaking.

```bash
npm install @fortawesome/angular-fontawesome @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/free-regular-svg-icons @fortawesome/free-brands-svg-icons
```

Configuración en el fichero de configuración de la aplicación (`app.config.ts` para standalone):

```typescript
// Archivo: src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

// Si se quiere cargar todos los iconos (no recomendado para producción)
export function inicializarFontAwesome(library: FaIconLibrary): void {
  // NOTA: En producción, es mejor importar solo los iconos necesarios
  // library.addIconPacks(fas, far, fab);  // Esto carga TODOS los iconos
}

// Configuración con tree-shaking: solo iconos específicos
import { faUser, faCartShopping, faTrash, faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';

export function inicializarIconosEspecificos(library: FaIconLibrary): void {
  library.addIcons(
    faUser,
    faCartShopping,
    faTrash,
    faPlus,
    faEdit
  );
}
```

Uso en componente standalone:

```typescript
// Archivo: src/app/shared/components/icono-boton.component.ts
import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-icono-boton',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    <button class="btn" [ngClass]="claseBoton" (click)="onClick.emit()">
      <fa-icon [icon]="icono" *ngIf="icono" class="me-1"></fa-icon>
      {{ texto }}
    </button>
  `
})
export class IconoBotonComponent {
  @Input() icono!: IconDefinition;
  @Input() texto: string = '';
  @Input() claseBoton: string = 'btn-primary';
  @Output() onClick = new EventEmitter<void>();
}
```

Uso en la plantilla:

```html
<fa-icon [icon]="['fas', 'user']" size="2x" class="text-primary"></fa-icon>
<fa-icon [icon]="['fas', 'check-circle']" [styles]="{ color: 'green' }"></fa-icon>
<fa-icon [icon]="['fab', 'angular']" size="3x"></fa-icon>
```

**Tree-shaking correcto:** en lugar de importar paquetes completos (`fas`, `far`, `fab`), importamos icono por icono para que el compilador elimine los no usados del bundle final:

```typescript
import { faHouse, faUser, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

export function configurarIconos(library: FaIconLibrary): void {
  library.addIcons(faHouse, faUser, faMagnifyingGlass, farHeart, faGoogle);
}
```

#### Iconos más utilizados en aplicaciones web

| Icono | Nombre de importación | Uso común |
|-------|----------------------|-----------|
| Casa | `faHouse` | Navegación a inicio |
| Usuario | `faUser` | Perfil, login |
| Carrito | `faCartShopping` | Carrito de compras |
| Papelera | `faTrash` | Eliminar |
| Lápiz | `faPenToSquare` | Editar |
| Más | `faPlus` | Añadir |
| Lupa | `faMagnifyingGlass` | Buscar |
| Corazón | `faHeart` | Favoritos |
| Configuración | `faGear` | Ajustes |
| Cerrar | `faXmark` | Cerrar modales |
| Check | `faCheck` | Confirmar |
| Flecha izquierda | `faArrowLeft` | Volver atrás |
| Cargando | `faSpinner` | Estado de carga |
| Estrella | `faStar` | Valoraciones |
| Reloj | `faClock` | Historial, tiempo |

#### Buenas prácticas

1. **No cargar toda la librería.** Usar siempre tree-shaking importando iconos individualmente.
2. **Centralizar la configuración** en `app.config.ts` o un fichero dedicado.
3. **Usar el componente `<fa-icon>`** para iconos dinámicos (que cambian según estado).
4. **Usar clases CSS** (`<i class="fas fa-icon">`) para iconos estáticos en la maquetación si se optó por el enfoque CSS.
5. **Evitar mezclar ambas aproximaciones** en el mismo proyecto. Elegir una y mantenerla.
6. **Aplicar `aria-hidden="true"`** o `aria-label` en iconos decorativos para mejorar la accesibilidad.

---

### SECCIÓN 3 - ngBootstrap

ngBootstrap es la implementación oficial de Bootstrap para Angular, construida desde cero sin dependencia de jQuery ni Bootstrap JS. Proporciona componentes Angular nativos con soporte para accesibilidad (ARIA) y standalone components.

#### ng-bootstrap vs ngx-bootstrap

| Característica | ng-bootstrap | ngx-bootstrap |
|----------------|-------------|---------------|
| Mantenedor | Equipo oficial Angular/Bootstrap | Comunidad (Valor Software) |
| Dependencia jQuery | No | No |
| Soporte Bootstrap 5 | Sí | Sí |
| Actualizaciones | Más frecuentes | Menos frecuentes |
| Documentación | Excelente | Buena |
| Bundle size | Menor | Mayor |
| Standalone | Soporte nativo | Parcial |

**Recomendación para FP Superior:** usar **ng-bootstrap** por su respaldo oficial, mejor documentación y soporte nativo de standalone components.

#### Instalación

```bash
ng add @ng-bootstrap/ng-bootstrap
```

Este comando instala automáticamente `@ng-bootstrap/ng-bootstrap` y `bootstrap`, y configura los estilos en `angular.json`. A partir de la versión 15+, todos los componentes de ng-bootstrap son standalone, por lo que se importan individualmente en cada componente que los use.

#### Componentes principales

##### NgbModal

El modal es uno de los componentes más utilizados. Permite abrir ventanas modales con paso de datos bidireccional:

```typescript
// Servicio de modal reutilizable
// Archivo: src/app/core/services/modal.service.ts
import { Injectable, inject } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private readonly modalService = inject(NgbModal);

  /**
   * Abre un modal con un componente como contenido
   * @param componente - El componente a renderizar dentro del modal
   * @param datos - Datos opcionales a pasar al componente
   * @param opciones - Configuración del modal (tamaño, backdrop, etc.)
   * @returns NgbModalRef para manejar el resultado
   */
  abrir(
    componente: any,
    datos?: Record<string, any>,
    opciones?: { size?: 'sm' | 'lg' | 'xl'; centered?: boolean; scrollable?: boolean }
  ): NgbModalRef {
    const modalRef = this.modalService.open(componente, {
      size: opciones?.size || 'lg',
      centered: opciones?.centered ?? true,
      scrollable: opciones?.scrollable ?? false,
      backdrop: 'static',  // Evita cerrar al hacer clic fuera
      keyboard: false      // Evita cerrar con tecla Escape
    });

    // Pasamos datos al componente hijo si los hay
    if (datos && modalRef.componentInstance) {
      Object.assign(modalRef.componentInstance, datos);
    }

    return modalRef;
  }
}
```

Ejemplo de componente para contenido del modal (standalone):

```typescript
// Archivo: src/app/shared/components/confirmacion-modal.component.ts
import { Component, Input, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmacion-modal',
  standalone: true,
  imports: [],  // No necesita imports adicionales
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{ titulo }}</h4>
      <button type="button" class="btn-close" (click)="cancelar()"></button>
    </div>
    <div class="modal-body">
      <p>{{ mensaje }}</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="cancelar()">
        Cancelar
      </button>
      <button type="button" class="btn btn-danger" (click)="confirmar()">
        {{ textoConfirmar }}
      </button>
    </div>
  `
})
export class ConfirmacionModalComponent {
  // Inyectamos la referencia al modal activo para controlarlo
  readonly activeModal = inject(NgbActiveModal);

  @Input() titulo: string = 'Confirmar acción';
  @Input() mensaje: string = '¿Está seguro?';
  @Input() textoConfirmar: string = 'Confirmar';

  confirmar(): void {
    this.activeModal.close(true);  // Resuelve la promesa con true
  }

  cancelar(): void {
    this.activeModal.dismiss('cancel');  // Rechaza la promesa
  }
}
```

Uso desde un componente padre:

```typescript
// Archivo: src/app/features/products/producto-lista.component.ts
import { Component, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmacionModalComponent } from '../../shared/components/confirmacion-modal.component';

@Component({
  selector: 'app-producto-lista',
  standalone: true,
  imports: [NgbModal],  // Importamos el módulo standalone
  templateUrl: './producto-lista.component.html'
})
export class ProductoListaComponent {
  private readonly modalService = inject(NgbModal);

  async eliminarProducto(id: number): Promise<void> {
    const modalRef = this.modalService.open(ConfirmacionModalComponent, {
      centered: true
    });

    // Pasamos inputs al componente del modal
    modalRef.componentInstance.titulo = 'Eliminar producto';
    modalRef.componentInstance.mensaje = '¿Está seguro de eliminar este producto?';
    modalRef.componentInstance.textoConfirmar = 'Eliminar';

    try {
      const resultado = await modalRef.result;  // Espera close() o dismiss()
      if (resultado) {
        // El usuario confirmó
        console.log('Eliminando producto:', id);
      }
    } catch (error) {
      // El usuario canceló (dismiss)
      console.log('Eliminación cancelada');
    }
  }
}
```

##### NgbDropdown

```typescript
// Componente standalone con dropdown
import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-menu-usuario',
  standalone: true,
  imports: [NgbDropdownModule],
  template: `
    <div ngbDropdown class="d-inline-block">
      <button class="btn btn-outline-primary" ngbDropdownToggle>
        <i class="fas fa-user me-2"></i>
        {{ nombreUsuario }}
      </button>
      <div ngbDropdownMenu>
        <button ngbDropdownItem (click)="irAPerfil()">
          <i class="fas fa-user-circle me-2"></i> Mi perfil
        </button>
        <button ngbDropdownItem (click)="irAPedidos()">
          <i class="fas fa-box me-2"></i> Mis pedidos
        </button>
        <div class="dropdown-divider"></div>
        <button ngbDropdownItem (click)="cerrarSesion()" class="text-danger">
          <i class="fas fa-sign-out-alt me-2"></i> Cerrar sesión
        </button>
      </div>
    </div>
  `
})
export class MenuUsuarioComponent {
  nombreUsuario = 'María García';
  // Métodos irAPerfil, irAPedidos, cerrarSesion...
}
```

##### NgbPagination

```typescript
@Component({
  selector: 'app-producto-lista',
  standalone: true,
  imports: [NgbPagination],
  template: `
    <!-- ... lista de productos ... -->

    <div class="d-flex justify-content-center mt-4">
      <ngb-pagination
        [collectionSize]="totalProductos"
        [(page)]="paginaActual"
        [pageSize]="productosPorPagina"
        [maxSize]="5"
        [rotate]="true"
        [boundaryLinks]="true"
        (pageChange)="cambiarPagina($event)">
      </ngb-pagination>
    </div>
  `
})
export class ProductoListaComponent {
  paginaActual = 1;
  productosPorPagina = 12;
  totalProductos = 150;

  cambiarPagina(pagina: number): void {
    this.paginaActual = pagina;
    // Llamar al servicio para cargar productos de la nueva página
  }
}
```

##### NgbTypeahead (búsqueda con autocompletado desde API)

```typescript
import { Component, inject } from '@angular/core';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { Observable, OperatorFunction, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { FormsModule } from '@angular/forms';

interface Producto {
  id: number;
  title: string;
}

@Component({
  selector: 'app-buscador-productos',
  standalone: true,
  imports: [NgbTypeaheadModule, FormsModule],
  template: `
    <div class="mb-3">
      <label for="busqueda" class="form-label">Buscar producto</label>
      <input
        id="busqueda"
        type="text"
        class="form-control"
        [(ngModel)]="terminoBusqueda"
        [ngbTypeahead]="buscar"
        [inputFormatter]="formatearResultado"
        [resultTemplate]="plantillaResultado"
        placeholder="Escribe para buscar..."
      />
    </div>

    <!-- Plantilla personalizada para cada resultado -->
    <ng-template #plantillaResultado let-resultado="result" let-termino="term">
      <div class="d-flex align-items-center">
        <img [src]="resultado.image" width="32" class="me-2" alt="" />
        <span>{{ resultado.title }}</span>
      </div>
    </ng-template>
  `
})
export class BuscadorProductosComponent {
  private readonly http = inject(HttpClient);
  terminoBusqueda = '';

  /**
   * Función de búsqueda que devuelve un Observable con sugerencias
   * Usa RxJS para debounce (esperar 300ms tras dejar de escribir),
   * distinctUntilChanged (no repetir búsquedas iguales)
   * y switchMap (cancelar peticiones anteriores)
   */
  buscar: OperatorFunction<string, readonly Producto[]> = (texto$: Observable<string>) =>
    texto$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((termino: string) => {
        if (termino.length < 2) {
          return [];  // No buscar con menos de 2 caracteres
        }
        return this.http.get<Producto[]>(
          `https://fakestoreapi.com/products?title=${termino}`
        );
      })
    );

  /**
   * Formatea el resultado seleccionado para mostrarlo en el input
   */
  formatearResultado(resultado: Producto): string {
    return resultado.title;
  }
}
```

##### NgbTooltip, NgbAccordion, NgbCollapse, NgbToast

Estos componentes siguen el mismo patrón: se importa el módulo standalone correspondiente y se usa la directiva o componente en la plantilla.

```html
<!-- Tooltip -->
<button class="btn btn-sm btn-info"
        ngbTooltip="Editar este producto"
        placement="top">
  <i class="fas fa-edit"></i>
</button>

<!-- Accordion -->
<div ngbAccordion>
  <div ngbAccordionItem>
    <h2 ngbAccordionHeader>
      <button ngbAccordionButton>Detalles del producto</button>
    </h2>
    <div ngbAccordionCollapse>
      <div ngbAccordionBody>
        <p>Aquí van los detalles...</p>
      </div>
    </div>
  </div>
</div>

<!-- Collapse -->
<button class="btn btn-primary" (click)="colapsado = !colapsado">
  Mostrar/Ocultar filtros
</button>
<div [(ngbCollapse)]="colapsado">
  <!-- Contenido colapsable -->
</div>

<!-- Toast (notificación) -->
<ngb-toast
  header="Notificación"
  [delay]="5000"
  [autohide]="true"
  (hidden)="onToastOculto()">
  Producto añadido al carrito
</ngb-toast>
```

---

### SECCIÓN 4 - Google Auth / OAuth 2.0

La autenticación con Google permite a los usuarios iniciar sesión en nuestra aplicación usando su cuenta de Google, sin necesidad de crear una contraseña nueva. Esto mejora la experiencia de usuario y la seguridad.

#### Conceptos básicos de OAuth 2.0

OAuth 2.0 es un protocolo de autorización que permite a aplicaciones de terceros obtener acceso limitado a recursos del usuario sin exponer sus credenciales.

**Flujo implícito (deprecado):** El token de acceso se devuelve directamente en la URL de redirección. Menos seguro.

**Flujo de código de autorización (Authorization Code Flow con PKCE):** El estándar actual recomendado. La aplicación recibe un código de autorización que intercambia por un token en el backend. Google Identity Services utiliza este flujo internamente.

#### Google Identity Services (GIS)

Google Identity Services es la nueva biblioteca de Google para autenticación, que reemplaza a la antigua Google Sign-In. Ofrece dos funcionalidades principales:
- **One Tap:** muestra un diálogo flotante si el usuario ya ha iniciado sesión en Google.
- **Botón de inicio de sesión:** botón personalizable para login explícito.

#### Configuración en Google Cloud Console

1. Ir a [Google Cloud Console](https://console.cloud.google.com/).
2. Crear un proyecto o seleccionar uno existente.
3. Navegar a **APIs & Services > Credentials**.
4. Configurar la pantalla de consentimiento OAuth (OAuth consent screen).
5. Crear credenciales de tipo **OAuth 2.0 Client ID** para aplicación web.
6. Añadir los orígenes autorizados (ej: `http://localhost:4200`) y URIs de redirección.
7. Copiar el **Client ID** generado.

#### Implementación en Angular

Creamos un servicio que gestione la carga del script de Google y la autenticación:

```typescript
// Archivo: src/app/core/services/google-auth.service.ts
import { Injectable, inject, signal, computed } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';  // npm install jwt-decode

// Interfaz que representa la respuesta de Google
export interface GoogleUser {
  nombre: string;
  email: string;
  fotoUrl: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {

  // Signal que almacena el usuario autenticado (null si no hay sesión)
  readonly usuarioActual = signal<GoogleUser | null>(null);

  // Computed: ¿está autenticado?
  readonly estaAutenticado = computed(() => this.usuarioActual() !== null);

  // Computed: nombre del usuario
  readonly nombreUsuario = computed(() => this.usuarioActual()?.nombre ?? '');

  // ID del cliente OAuth de Google (debe guardarse en environment)
  private readonly clientId = 'TU_CLIENT_ID_DE_GOOGLE.apps.googleusercontent.com';

  constructor() {
    this.cargarScriptGoogle();
  }

  /**
   * Carga el script de Google Identity Services de forma dinámica
   * y configura el callback de inicialización.
   */
  private cargarScriptGoogle(): void {
    // Evitamos duplicar el script
    if (document.getElementById('google-gsi-script')) {
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-gsi-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => this.inicializarGoogle();
    document.head.appendChild(script);
  }

  /**
   * Inicializa el cliente de Google Identity Services.
   * Se llama automáticamente cuando el script se ha cargado.
   */
  private inicializarGoogle(): void {
    // Verificamos que la API de Google esté disponible
    if (typeof window === 'undefined' || !(window as any).google) {
      console.warn('Google Identity Services no está disponible');
      return;
    }

    const google = (window as any).google;

    google.accounts.id.initialize({
      client_id: this.clientId,
      callback: (respuesta: any) => this.manejarRespuestaGoogle(respuesta),
      auto_select: false,
      cancel_on_tap_outside: true
    });
  }

  /**
   * Procesa la respuesta de Google tras el login exitoso.
   * Decodifica el JWT para extraer los datos del usuario.
   */
  private manejarRespuestaGoogle(respuesta: any): void {
    try {
      // La respuesta contiene un JWT (credential)
      const token: string = respuesta.credential;

      // Decodificamos el JWT para obtener los datos del usuario
      const datosDecodificados: any = jwtDecode(token);

      const usuario: GoogleUser = {
        nombre: datosDecodificados.name,
        email: datosDecodificados.email,
        fotoUrl: datosDecodificados.picture,
        token: token
      };

      this.usuarioActual.set(usuario);

      // Guardamos el token en localStorage para persistencia
      localStorage.setItem('google_token', token);

      console.log('Usuario autenticado con Google:', usuario);
    } catch (error) {
      console.error('Error al procesar la respuesta de Google:', error);
    }
  }

  /**
   * Muestra el diálogo de One Tap (inicio de sesión rápido)
   */
  mostrarOneTap(): void {
    const google = (window as any).google;
    if (google) {
      google.accounts.id.prompt();
    }
  }

  /**
   * Renderiza un botón de login de Google en el elemento indicado
   */
  renderizarBoton(idElemento: string): void {
    const google = (window as any).google;
    if (google) {
      google.accounts.id.renderButton(
        document.getElementById(idElemento),
        {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          shape: 'rectangular',
          text: 'signin_with',
          locale: 'es'
        }
      );
    }
  }

  /**
   * Cierra la sesión de Google y limpia el estado local
   */
  cerrarSesion(): void {
    const google = (window as any).google;
    if (google) {
      google.accounts.id.disableAutoSelect();
    }

    this.usuarioActual.set(null);
    localStorage.removeItem('google_token');
  }

  /**
   * Verifica si hay una sesión guardada en localStorage al iniciar la app
   */
  restaurarSesion(): boolean {
    const token = localStorage.getItem('google_token');
    if (!token) {
      return false;
    }

    try {
      const datosDecodificados: any = jwtDecode(token);

      // Verificamos que el token no haya expirado
      const ahora = Math.floor(Date.now() / 1000);
      if (datosDecodificados.exp < ahora) {
        localStorage.removeItem('google_token');
        return false;
      }

      const usuario: GoogleUser = {
        nombre: datosDecodificados.name,
        email: datosDecodificados.email,
        fotoUrl: datosDecodificados.picture,
        token: token
      };

      this.usuarioActual.set(usuario);
      return true;
    } catch (error) {
      localStorage.removeItem('google_token');
      return false;
    }
  }
}
```

Componente de login con Google (standalone):

```typescript
// Archivo: src/app/features/auth/google-login.component.ts
import { Component, AfterViewInit, inject } from '@angular/core';
import { GoogleAuthService } from '../../core/services/google-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-google-login',
  standalone: true,
  template: `
    <div class="google-login-container text-center">
      <p class="text-muted mb-3">Inicia sesión con tu cuenta de Google</p>
      <!-- Este div será reemplazado por el botón de Google -->
      <div id="google-btn" class="d-flex justify-content-center"></div>
    </div>
  `
})
export class GoogleLoginComponent implements AfterViewInit {
  private readonly googleAuth = inject(GoogleAuthService);
  private readonly router = inject(Router);

  ngAfterViewInit(): void {
    // Renderizamos el botón después de que la vista esté lista
    this.googleAuth.renderizarBoton('google-btn');

    // Redirigimos al home cuando el usuario se autentica
    // Usando effect sería más idiomático, pero para simplificar:
    const subscription = this.googleAuth.usuarioActual;
    // NOTA: en un caso real usaríamos un effect() con Signals
  }
}
```

---

### SECCIÓN 5 - Facebook Auth

La autenticación con Facebook sigue un patrón similar a Google, pero requiere el SDK de Facebook for JavaScript.

#### Configuración en Meta for Developers

1. Ir a [Meta for Developers](https://developers.facebook.com/).
2. Crear una aplicación de tipo **Consumer** (o **Business**).
3. Añadir el producto **Facebook Login** a la app.
4. Configurar **Facebook Login > Settings**:
   - Valid OAuth Redirect URIs: `http://localhost:4200/`
   - Añadir el dominio de la aplicación.
5. Copiar el **App ID**.

#### Implementación manual (sin librerías de terceros)

```typescript
// Archivo: src/app/core/services/facebook-auth.service.ts
import { Injectable, signal, computed } from '@angular/core';

export interface FacebookUser {
  nombre: string;
  email: string;
  fotoUrl: string;
  token: string;
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class FacebookAuthService {

  readonly usuarioActual = signal<FacebookUser | null>(null);
  readonly estaAutenticado = computed(() => this.usuarioActual() !== null);

  private readonly appId = 'TU_FACEBOOK_APP_ID';

  constructor() {
    this.cargarSdkFacebook();
  }

  /**
   * Carga el SDK de Facebook de forma asíncrona
   */
  private cargarSdkFacebook(): void {
    if (document.getElementById('facebook-jssdk')) {
      return;
    }

    // Inicializamos el objeto global fbAsyncInit antes de cargar el script
    (window as any).fbAsyncInit = () => {
      (window as any).FB.init({
        appId: this.appId,
        cookie: true,
        xfbml: true,
        version: 'v19.0'
      });
    };

    const script = document.createElement('script');
    script.id = 'facebook-jssdk';
    script.src = 'https://connect.facebook.net/es_ES/sdk.js';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }

  /**
   * Inicia el flujo de login con Facebook
   * @returns Promesa con el perfil del usuario de Facebook
   */
  async login(): Promise<FacebookUser> {
    return new Promise((resolve, reject) => {
      (window as any).FB.login((respuesta: any) => {
        if (respuesta.authResponse) {
          const token = respuesta.authResponse.accessToken;
          this.obtenerPerfilUsuario(token)
            .then((usuario) => resolve(usuario))
            .catch((error) => reject(error));
        } else {
          reject(new Error('El usuario canceló el inicio de sesión'));
        }
      }, {
        scope: 'public_profile,email'
      });
    });
  }

  /**
   * Obtiene el perfil del usuario de Facebook usando Graph API
   */
  private obtenerPerfilUsuario(token: string): Promise<FacebookUser> {
    return new Promise((resolve, reject) => {
      (window as any).FB.api(
        '/me',
        { fields: 'id,name,email,picture' },
        (respuesta: any) => {
          if (!respuesta || respuesta.error) {
            reject(respuesta?.error || new Error('Error al obtener el perfil'));
            return;
          }

          const usuario: FacebookUser = {
            nombre: respuesta.name,
            email: respuesta.email,
            fotoUrl: respuesta.picture?.data?.url ?? '',
            token: token,
            id: respuesta.id
          };

          this.usuarioActual.set(usuario);
          localStorage.setItem('facebook_token', token);
          resolve(usuario);
        }
      );
    });
  }

  /**
   * Cierra la sesión de Facebook
   */
  cerrarSesion(): void {
    (window as any).FB.logout(() => {
      this.usuarioActual.set(null);
      localStorage.removeItem('facebook_token');
    });
  }
}
```

#### Comparación Google Auth vs Facebook Auth

| Aspecto | Google | Facebook |
|---------|--------|----------|
| Complejidad de configuración | Media (Google Cloud Console) | Media (Meta for Developers) |
| Documentación | Excelente | Buena |
| Adopción en España | Muy alta | Alta |
| One Tap / Login rápido | Sí | No nativo |
| JWT decodificable | Sí | No (requiere API extra) |
| Permisos granulares | Sí | Sí |

**Recomendación:** implementar ambos proveedores para dar opciones al usuario. Usar una interfaz común que abstraiga ambos servicios.

```typescript
// Interfaz común para cualquier proveedor de autenticación
export interface ProveedorAuth {
  login(): Promise<UsuarioAutenticado>;
  cerrarSesion(): void;
  obtenerUsuario(): UsuarioAutenticado | null;
}
```

---

### SECCIÓN 6 - OpenLayers

OpenLayers es una biblioteca JavaScript open source de alto rendimiento para crear mapas interactivos en la web. Soporta múltiples capas de teselas (OSM, Bing, Google Maps), capas vectoriales, marcadores, popups y una amplia gama de controles e interacciones.

#### Instalación

```bash
npm install ol
```

TypeScript reconoce los tipos directamente porque `ol` incluye sus definiciones de tipo.

#### Uso en componentes standalone Angular

Para integrar OpenLayers en Angular, necesitamos acceder a un elemento del DOM donde se renderizará el mapa. Usamos `viewChild` y el ciclo de vida del componente.

```typescript
// Archivo: src/app/features/mapas/mapa-productos.component.ts
import {
  Component,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  inject,
  signal
} from '@angular/core';

// Importaciones de OpenLayers
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Circle, Fill, Stroke, Text, Icon } from 'ol/style';
import Overlay from 'ol/Overlay';

// Interfaz para los datos del marcador
interface MarcadorTienda {
  id: number;
  nombre: string;
  direccion: string;
  latitud: number;
  longitud: number;
  horario: string;
}

@Component({
  selector: 'app-mapa-productos',
  standalone: true,
  template: `
    <div class="mapa-container">
      <h3>Nuestras tiendas</h3>

      <!-- Contenedor del mapa -->
      <div #mapaElemento class="mapa"></div>

      <!-- Popup overlay (se posiciona sobre el mapa) -->
      <div #popupElemento class="ol-popup" [class.visible]="popupVisible()">
        <button class="btn-close-popup" (click)="cerrarPopup()">&times;</button>
        <div class="popup-contenido">
          <h5>{{ popupTitulo() }}</h5>
          <p>{{ popupContenido() }}</p>
        </div>
      </div>

      <!-- Leyenda de tiendas -->
      <div class="listado-tiendas mt-3">
        @for (tienda of tiendas(); track tienda.id) {
          <div class="tienda-item" (click)="centrarEnTienda(tienda)">
            <strong>{{ tienda.nombre }}</strong><br>
            <small>{{ tienda.direccion }}</small>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .mapa {
      width: 100%;
      height: 400px;
      border-radius: 8px;
      border: 2px solid #dee2e6;
    }
    .ol-popup {
      display: none;
      position: absolute;
      background: white;
      border-radius: 8px;
      padding: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      min-width: 200px;
      z-index: 1000;
    }
    .ol-popup.visible {
      display: block;
    }
    .btn-close-popup {
      position: absolute;
      top: 4px;
      right: 4px;
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
    }
    .tienda-item {
      cursor: pointer;
      padding: 8px;
      border-bottom: 1px solid #eee;
    }
    .tienda-item:hover {
      background-color: #f8f9fa;
    }
  `]
})
export class MapaProductosComponent implements AfterViewInit, OnDestroy {

  // Referencia al elemento DOM donde se dibuja el mapa
  @ViewChild('mapaElemento') mapaElementoRef!: ElementRef<HTMLDivElement>;

  // Referencia al popup
  @ViewChild('popupElemento') popupElementoRef!: ElementRef<HTMLDivElement>;

  // Instancia del mapa de OpenLayers
  private mapa!: Map;

  // Signals para el popup
  popupVisible = signal(false);
  popupTitulo = signal('');
  popupContenido = signal('');

  // Datos de ejemplo de tiendas
  tiendas = signal<MarcadorTienda[]>([
    {
      id: 1,
      nombre: 'Tienda Centro Sevilla',
      direccion: 'Calle Sierpes, 15, Sevilla',
      latitud: 37.3891,
      longitud: -5.9845,
      horario: 'L-V: 10:00-20:00'
    },
    {
      id: 2,
      nombre: 'Tienda Nervión',
      direccion: 'Av. Eduardo Dato, 30, Sevilla',
      latitud: 37.3826,
      longitud: -5.9723,
      horario: 'L-S: 10:00-21:00'
    },
    {
      id: 3,
      nombre: 'Tienda Triana',
      direccion: 'Calle San Jacinto, 45, Sevilla',
      latitud: 37.3833,
      longitud: -6.0050,
      horario: 'L-V: 09:30-20:00'
    }
  ]);

  ngAfterViewInit(): void {
    this.inicializarMapa();
  }

  /**
   * Inicializa el mapa de OpenLayers con capa base OSM
   * y añade las tiendas como marcadores interactivos
   */
  private inicializarMapa(): void {
    // --- Capa base: OpenStreetMap ---
    const capaOSM = new TileLayer({
      source: new OSM()
    });

    // --- Capa vectorial para los marcadores ---
    const fuenteMarcadores = new VectorSource();

    // Añadimos las tiendas a la capa vectorial
    this.tiendas().forEach((tienda) => {
      const marcador = this.crearMarcador(tienda);
      fuenteMarcadores.addFeature(marcador);
    });

    const capaMarcadores = new VectorLayer({
      source: fuenteMarcadores,
      style: this.estiloMarcador
    });

    // --- Overlay para el popup ---
    const popupOverlay = new Overlay({
      element: this.popupElementoRef.nativeElement,
      autoPan: {
        animation: {
          duration: 250
        }
      },
      offset: [0, -20]
    });

    // --- Creación del mapa ---
    this.mapa = new Map({
      target: this.mapaElementoRef.nativeElement,
      layers: [capaOSM, capaMarcadores],
      overlays: [popupOverlay],
      view: new View({
        // Centro de Sevilla
        center: fromLonLat([-5.9845, 37.3891]),
        zoom: 13,
        minZoom: 10,
        maxZoom: 19
      }),
      controls: []  // Sin controles por defecto, podemos añadir los nuestros
    });

    // --- Interacción: click en marcador ---
    this.mapa.on('click', (evento) => {
      this.mapa.forEachFeatureAtPixel(evento.pixel, (feature) => {
        const tienda = feature.get('tienda') as MarcadorTienda;
        if (tienda) {
          this.mostrarPopup(tienda, evento.coordinate);
        }
        return true;
      });
    });

    // --- Cambiar cursor al pasar sobre un marcador ---
    this.mapa.on('pointermove', (evento) => {
      const tieneFeature = this.mapa.hasFeatureAtPixel(evento.pixel);
      this.mapa.getTargetElement().style.cursor = tieneFeature ? 'pointer' : '';
    });
  }

  /**
   * Crea una Feature de OpenLayers (marcador) a partir de los datos de una tienda
   */
  private crearMarcador(tienda: MarcadorTienda): Feature {
    const coordenadas = fromLonLat([tienda.longitud, tienda.latitud]);
    const marcador = new Feature({
      geometry: new Point(coordenadas)
    });

    // Almacenamos los datos de la tienda en las propiedades del Feature
    marcador.set('tienda', tienda);

    return marcador;
  }

  /**
   * Estilo para los marcadores de tiendas
   */
  private estiloMarcador = new Style({
    image: new Circle({
      radius: 8,
      fill: new Fill({ color: '#e63946' }),
      stroke: new Stroke({ color: '#ffffff', width: 2 })
    }),
    text: new Text({
      text: '',
      offsetY: -16,
      font: 'bold 12px sans-serif',
      fill: new Fill({ color: '#333' })
    })
  });

  /**
   * Muestra el popup en las coordenadas indicadas
   */
  private mostrarPopup(tienda: MarcadorTienda, coordenadas: number[]): void {
    this.popupTitulo.set(tienda.nombre);
    this.popupContenido.set(
      `${tienda.direccion}<br><strong>Horario:</strong> ${tienda.horario}`
    );
    this.popupVisible.set(true);

    const overlay = this.mapa.getOverlays().getArray()[0];
    overlay.setPosition(coordenadas);
  }

  /**
   * Cierra el popup abierto
   */
  cerrarPopup(): void {
    this.popupVisible.set(false);
  }

  /**
   * Centra el mapa en una tienda y abre su popup
   */
  centrarEnTienda(tienda: MarcadorTienda): void {
    const coordenadas = fromLonLat([tienda.longitud, tienda.latitud]);
    const view = this.mapa.getView();

    view.animate({
      center: coordenadas,
      zoom: 16,
      duration: 1000
    });

    // Buscamos el feature correspondiente para mostrar el popup
    setTimeout(() => {
      this.mostrarPopup(tienda, coordenadas);
    }, 1100);
  }

  /**
   * Limpieza al destruir el componente
   */
  ngOnDestroy(): void {
    if (this.mapa) {
      this.mapa.setTarget(undefined);  // Desvincula el mapa del DOM
      this.mapa.dispose();             // Libera recursos
    }
  }
}
```

#### Capas adicionales: Bing Maps y Google Maps

Para usar Bing Maps se necesita una clave de API:

```bash
npm install ol-ext
```

```typescript
import BingMaps from 'ol/source/BingMaps';

const capaBing = new TileLayer({
  source: new BingMaps({
    key: 'TU_BING_MAPS_API_KEY',
    imagerySet: 'AerialWithLabels'
  }),
  visible: false  // Capa desactivada por defecto
});
```

#### Ciclo de vida del mapa en Angular

| Fase | Acción |
|------|--------|
| `constructor()` | No acceder al DOM |
| `ngAfterViewInit()` | Inicializar el mapa (target disponible) |
| `ngOnDestroy()` | Desvincular (`setTarget(undefined)`) y `dispose()` |

---

### SECCIÓN 7 - Capacitor

Capacitor es un runtime de aplicaciones nativas creado por el equipo de Ionic. Permite ejecutar aplicaciones web (HTML, CSS, JavaScript) como aplicaciones nativas en iOS, Android y Web, accediendo a las APIs nativas del dispositivo mediante plugins.

#### Qué es Capacitor

- Es un puente entre el código web y el código nativo.
- Gestiona el ciclo de vida de la WebView nativa.
- Proporciona una API unificada para acceder a funcionalidades del dispositivo (cámara, GPS, almacenamiento, etc.).
- Permite escribir plugins personalizados en código nativo (Java/Kotlin para Android, Swift para iOS).

#### Diferencia con Cordova

| Aspecto | Capacitor | Cordova |
|---------|-----------|---------|
| Mantenimiento | Activo (Ionic team) | Comunidad (Apache) |
| Configuración nativa | Control total del proyecto nativo | Menor control |
| Plugins | TypeScript-first, modernos | Amplio catálogo pero algunos obsoletos |
| PWA | Primera clase | Segundo plano |
| Integración Angular | Excelente (CLI oficial) | Buena |
| Rendimiento | Superior | Bueno |

**Recomendación:** usar Capacitor para proyectos nuevos. Es el estándar actual.

#### Instalación y configuración

```bash
# Instalar Capacitor CLI y core
npm install @capacitor/core @capacitor/cli

# Inicializar Capacitor en el proyecto Angular
npx cap init

# Añadir plataformas
npm install @capacitor/android @capacitor/ios
npx cap add android
npx cap add ios
```

En `capacitor.config.ts` se configura el comportamiento:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.daw.marketplace',
  appName: 'Marketplace DAW',
  webDir: 'dist/marketplace/browser',  // Directorio de build de Angular
  server: {
    androidScheme: 'https',
    // Para desarrollo local con hot-reload:
    // url: 'http://192.168.1.10:4200',
    // cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1976d2'
    }
  }
};

export default config;
```

#### Plugins de Capacitor

##### Cámara

```bash
npm install @capacitor/camera
npx cap sync
```

```typescript
// Archivo: src/app/core/services/camara.service.ts
import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';

@Injectable({ providedIn: 'root' })
export class CamaraService {

  /**
   * Toma una foto usando la cámara del dispositivo
   * @returns Foto en formato base64 con su ruta de archivo
   */
  async tomarFoto(): Promise<Photo | null> {
    // Verificamos si estamos en plataforma nativa
    if (!Capacitor.isNativePlatform()) {
      console.warn('La cámara solo funciona en plataformas nativas (Android/iOS)');
      // En web, podríamos usar un input file como fallback
      return null;
    }

    try {
      const foto = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        quality: 90,
        allowEditing: false,
        saveToGallery: true,
        width: 800,
        height: 800
      });

      return foto;
    } catch (error) {
      console.error('Error al tomar la foto:', error);
      return null;
    }
  }

  /**
   * Selecciona una foto de la galería
   */
  async seleccionarDeGaleria(): Promise<Photo | null> {
    try {
      const foto = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
        quality: 90,
        width: 800,
        height: 800
      });

      return foto;
    } catch (error) {
      console.error('Error al seleccionar foto:', error);
      return null;
    }
  }
}
```

Componente para usar la cámara:

```typescript
// Archivo: src/app/features/user/foto-perfil.component.ts
import { Component, inject, signal } from '@angular/core';
import { CamaraService } from '../../core/services/camara.service';
import { AlertService } from '../../core/services/alert.service';

@Component({
  selector: 'app-foto-perfil',
  standalone: true,
  template: `
    <div class="text-center">
      <div class="foto-perfil-container mb-3">
        @if (fotoUrl()) {
          <img [src]="fotoUrl()" alt="Foto de perfil" class="foto-perfil" />
        } @else {
          <div class="placeholder-foto">
            <i class="fas fa-user fa-3x text-muted"></i>
          </div>
        }
      </div>

      <button class="btn btn-primary me-2" (click)="tomarFoto()">
        <i class="fas fa-camera me-1"></i> Tomar foto
      </button>
      <button class="btn btn-outline-secondary" (click)="seleccionarFoto()">
        <i class="fas fa-images me-1"></i> Galería
      </button>
    </div>
  `,
  styles: [`
    .foto-perfil-container { width: 150px; height: 150px; margin: 0 auto; }
    .foto-perfil { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
    .placeholder-foto {
      width: 100%; height: 100%;
      border-radius: 50%;
      background: #e9ecef;
      display: flex; align-items: center; justify-content: center;
    }
  `]
})
export class FotoPerfilComponent {
  private readonly camaraService = inject(CamaraService);
  private readonly alertService = inject(AlertService);

  fotoUrl = signal<string | null>(null);

  async tomarFoto(): Promise<void> {
    const foto = await this.camaraService.tomarFoto();
    if (foto?.dataUrl) {
      this.fotoUrl.set(foto.dataUrl);
      this.alertService.toast('Foto de perfil actualizada');
    }
  }

  async seleccionarFoto(): Promise<void> {
    const foto = await this.camaraService.seleccionarDeGaleria();
    if (foto?.dataUrl) {
      this.fotoUrl.set(foto.dataUrl);
      this.alertService.toast('Foto de perfil actualizada');
    }
  }
}
```

##### Geolocalización

```bash
npm install @capacitor/geolocation
npx cap sync
```

```typescript
import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({ providedIn: 'root' })
export class GeolocalizacionService {

  async obtenerPosicionActual(): Promise<{ lat: number; lng: number } | null> {
    try {
      const posicion = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });

      return {
        lat: posicion.coords.latitude,
        lng: posicion.coords.longitude
      };
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
      return null;
    }
  }

  /**
   * Observa cambios en la posición (útil para seguimiento en tiempo real)
   */
  observarPosicion(callback: (pos: { lat: number; lng: number }) => void): string {
    return Geolocation.watchPosition({}, (posicion, error) => {
      if (error) {
        console.error(error);
        return;
      }
      callback({
        lat: posicion!.coords.latitude,
        lng: posicion!.coords.longitude
      });
    });
  }
}
```

##### Almacenamiento (Preferences)

```bash
npm install @capacitor/preferences
npx cap sync
```

```typescript
import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({ providedIn: 'root' })
export class AlmacenamientoService {

  async guardar(clave: string, valor: string): Promise<void> {
    await Preferences.set({ key: clave, value: valor });
  }

  async obtener(clave: string): Promise<string | null> {
    const resultado = await Preferences.get({ key: clave });
    return resultado.value;
  }

  async eliminar(clave: string): Promise<void> {
    await Preferences.remove({ key: clave });
  }

  async limpiarTodo(): Promise<void> {
    await Preferences.clear();
  }
}
```

##### Notificaciones Push

```bash
npm install @capacitor/push-notifications
npx cap sync
```

La configuración es más compleja: requiere Firebase Cloud Messaging (FCM) para Android y APNs para iOS. Se configura en `capacitor.config.ts` y requiere claves de cada plataforma.

#### Detección de plataforma

```typescript
import { Capacitor } from '@capacitor/core';

// Verificar si estamos en app nativa
if (Capacitor.isNativePlatform()) {
  // Estamos en Android o iOS
  console.log('Plataforma:', Capacitor.getPlatform());
} else {
  // Estamos en web (navegador)
}
```

#### Build de producción para móvil

```bash
# 1. Construir la aplicación Angular en modo producción
ng build --configuration=production

# 2. Sincronizar el build con las plataformas nativas
npx cap sync

# 3. Abrir en el IDE nativo
npx cap open android  # Abre en Android Studio
npx cap open ios      # Abre en Xcode (solo macOS)

# 4. En Android Studio: Build > Generate Signed Bundle/APK
# 5. En Xcode: Product > Archive
```

#### Publicación en Google Play y App Store

**Google Play Store:**
1. Crear cuenta de desarrollador (pago único de 25 USD).
2. Generar un APK/AAB firmado desde Android Studio.
3. Completar la ficha de la aplicación (descripción, capturas, categoría).
4. Subir el archivo y publicar.

**Apple App Store:**
1. Crear cuenta de desarrollador Apple (99 USD/año).
2. Configurar certificados y perfiles de provisión en Apple Developer.
3. Archivar la app desde Xcode.
4. Subir mediante Transporter o Xcode.
5. Completar la revisión de Apple.

#### Buenas prácticas con Capacitor

1. **Diseño responsive:** la app debe verse bien en múltiples tamaños de pantalla.
2. **Offline first:** usar almacenamiento local y sincronización cuando haya red.
3. **Preferir plugins de Capacitor sobre APIs web:** los plugins tienen mejor soporte nativo.
4. **Manejar permisos:** Android e iOS requieren permisos explícitos para cámara, ubicación, etc.
5. **Probar en dispositivos reales:** el emulador no siempre refleja el comportamiento real.
6. **Gestionar el botón back de Android:** Capacitor proporciona el evento `backButton`.
7. **Configurar Splash Screen e icono:** para una experiencia nativa profesional.

---

## Ejemplos guiados

### Ejemplo 1: Integrar SweetAlert2 en un servicio de notificaciones

Vamos a construir paso a paso un `NotificationService` completo que encapsule SweetAlert2:

**Paso 1:** Instalar la dependencia.
```bash
npm install sweetalert2
```

**Paso 2:** Crear el servicio.
```bash
ng generate service core/services/notification
```

**Paso 3:** Implementar los métodos (código ya visto en la Sección 1). El servicio incluye métodos para `exito()`, `error()`, `advertencia()`, `confirmar()` y `toast()`.

**Paso 4:** Usar desde cualquier componente mediante inyección:
```typescript
private readonly notificaciones = inject(NotificationService);

this.notificaciones.exito('Producto guardado correctamente');
```

### Ejemplo 2: Modal reutilizable con ngBootstrap

**Paso 1:** Instalar ng-bootstrap:
```bash
ng add @ng-bootstrap/ng-bootstrap
```

**Paso 2:** Crear el componente modal (código en Sección 3).

**Paso 3:** Usar en un componente padre:
```typescript
const modalRef = this.modalService.open(ConfirmacionModalComponent, { centered: true });
modalRef.componentInstance.titulo = 'Eliminar registro';
modalRef.componentInstance.mensaje = '¿Confirma la eliminación?';
const resultado = await modalRef.result;
if (resultado) { /* eliminar */ }
```

### Ejemplo 3: Login con Google y gestión de sesión

**Paso 1:** Configurar Google Cloud Console (Sección 4).

**Paso 2:** Instalar `jwt-decode`:
```bash
npm install jwt-decode
```

**Paso 3:** Crear `GoogleAuthService` e implementar carga de script y manejo de credencial.

**Paso 4:** En el componente de login, renderizar el botón en `ngAfterViewInit`.

**Paso 5:** Configurar guard de autenticación usando Signals.

### Ejemplo 4: Mapa con OpenLayers y marcador en ubicación actual

Combinamos OpenLayers con el plugin de Geolocalización de Capacitor para mostrar la ubicación del usuario:

```typescript
// En el componente del mapa, después de inicializar:
const posicion = await this.geoService.obtenerPosicionActual();
if (posicion) {
  const coordenadas = fromLonLat([posicion.lng, posicion.lat]);
  const marcadorUsuario = new Feature({
    geometry: new Point(coordenadas)
  });
  marcadorUsuario.setStyle(new Style({
    image: new Circle({
      radius: 10,
      fill: new Fill({ color: '#007bff' }),
      stroke: new Stroke({ color: '#fff', width: 3 })
    })
  }));
  fuenteMarcadores.addFeature(marcadorUsuario);

  // Centrar en el usuario
  this.mapa.getView().animate({ center: coordenadas, zoom: 16 });
}
```

### Ejemplo 5: Añadir Capacitor y acceder a la cámara

**Paso 1:** Instalar y configurar Capacitor (Sección 7).

**Paso 2:** Añadir plugin de cámara.

**Paso 3:** Crear servicio de cámara.

**Paso 4:** Crear componente que use el servicio y muestre la foto tomada.

---

## Ejercicios resueltos

### Ejercicio 1: Servicio de alertas con SweetAlert2

**Enunciado:** Crear un `AlertService` completo con métodos para éxito, error, advertencia, confirmación (con async/await) y toast. Incluir personalización de colores y tiempos.

**Solución:** Ver código completo del `AlertService` en la Sección 1 de esta unidad. El servicio incluye:
- Método `exito()` con timer de 2.5 segundos y sin botón de confirmación.
- Método `error()` con botón rojo.
- Método `advertencia()` con icono warning.
- Método `confirmar()` que devuelve `Promise<boolean>` usando async/await.
- Método `toast()` con `Swal.mixin()` para notificaciones no bloqueantes.
- Personalización de clases, animaciones con animate.css, y loader en preConfirm.

### Ejercicio 2: Página de login con Google y Facebook

**Enunciado:** Crear una página de login que ofrezca autenticación con Google y Facebook, usando standalone components y servicios inyectables. La página debe mostrar el nombre del usuario tras el login exitoso.

**Solución:**

```typescript
// Archivo: src/app/features/auth/login.page.ts
import { Component, inject } from '@angular/core';
import { GoogleAuthService } from '../../core/services/google-auth.service';
import { FacebookAuthService } from '../../core/services/facebook-auth.service';
import { AlertService } from '../../core/services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  template: `
    <div class="login-page container py-5">
      <div class="row justify-content-center">
        <div class="col-md-5">
          <div class="card shadow">
            <div class="card-body text-center p-4">
              <h2 class="mb-4">Iniciar sesión</h2>
              <p class="text-muted mb-4">Accede a tu cuenta para comprar y vender productos</p>

              <!-- Botón Google -->
              <button class="btn btn-outline-danger w-100 mb-3"
                      (click)="loginConGoogle()">
                <i class="fab fa-google me-2"></i> Continuar con Google
              </button>

              <!-- Botón Facebook -->
              <button class="btn btn-primary w-100 mb-3"
                      (click)="loginConFacebook()">
                <i class="fab fa-facebook-f me-2"></i> Continuar con Facebook
              </button>

              <div class="text-muted mt-3">
                <small>Al iniciar sesión aceptas nuestros términos y condiciones</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginPage {
  private readonly googleAuth = inject(GoogleAuthService);
  private readonly facebookAuth = inject(FacebookAuthService);
  private readonly alertService = inject(AlertService);
  private readonly router = inject(Router);

  async loginConGoogle(): Promise<void> {
    try {
      this.googleAuth.mostrarOneTap();
      // La respuesta se maneja en el callback del servicio
      // Redirigimos tras autenticación exitosa
      this.alertService.exito('Has iniciado sesión con Google');
      this.router.navigate(['/']);
    } catch (error) {
      this.alertService.error('Error al iniciar sesión con Google');
    }
  }

  async loginConFacebook(): Promise<void> {
    try {
      const usuario = await this.facebookAuth.login();
      this.alertService.exito(`Bienvenido/a, ${usuario.nombre}`);
      this.router.navigate(['/']);
    } catch (error: any) {
      if (error.message !== 'El usuario canceló el inicio de sesión') {
        this.alertService.error('Error al iniciar sesión con Facebook');
      }
    }
  }
}
```

---

## Actividades propuestas

### Actividad 1: Servicio de notificaciones personalizado

Crea un `NotificationService` que encapsule SweetAlert2 con los siguientes requisitos:
- Métodos: `exito()`, `error()`, `info()`, `advertencia()`, `confirmar()`, `toast()`.
- Todos los métodos deben aceptar parámetros de título y mensaje.
- El método `confirmar()` debe devolver una Promesa que se resuelva a `true` o `false`.
- Incluye personalización de colores, tiempos y animaciones.
- Crea un componente de prueba que demuestre cada uno de los métodos.

### Actividad 2: Modal de confirmación genérico

Crea un componente de modal reutilizable con ngBootstrap que pueda usarse para:
- Confirmar eliminación de cualquier entidad.
- Mostrar mensajes informativos.
- Solicitar confirmación con botones personalizables.
El componente debe recibir `@Input()` para título, mensaje, texto de botones y color.

### Actividad 3: Dashboard con OpenLayers

Desarrolla un componente de dashboard que muestre:
- Un mapa con OpenLayers centrado en tu ciudad.
- Al menos 5 marcadores de puntos de interés con popups informativos.
- Un listado lateral de los puntos que al hacer clic centre el mapa.
- Un botón para mostrar la ubicación actual del usuario (si está disponible).

### Actividad 4: App híbrida con Capacitor

Toma un proyecto Angular existente (puede ser de unidades anteriores) y:
- Añade Capacitor siguiendo los pasos de la Sección 7.
- Implementa acceso a la cámara y galería.
- Implementa almacenamiento con Preferences.
- Detecta si la app se ejecuta en web o en nativo y adapta la UI.

### Actividad 5: Iconografía profesional

Configura Font Awesome con el enfoque de componente Angular (`angular-fontawesome`) con tree-shaking:
- Identifica los 15 iconos que tu aplicación necesitaría.
- Configura el `FaIconLibrary` solo con esos iconos.
- Crea un componente de botón que acepte un icono como `@Input`.

---

## Actividades de ampliación

### Ampliación 1: Red social login con micro-frontends

Investiga cómo implementar autenticación federada en una arquitectura de micro-frontends usando Module Federation. Diseña un prototipo conceptual donde el login con Google/Facebook se gestione en un shell que comparta el estado de autenticación con los micro-frontends hijos.

### Ampliación 2: Mapas avanzados con GeoJSON y clustering

Amplía el ejemplo de OpenLayers para:
- Cargar datos desde un archivo GeoJSON externo.
- Implementar clustering de marcadores cuando hay muchos puntos cercanos.
- Añadir una capa de calor (heatmap) basada en densidad de datos.
- Integrar búsqueda de direcciones con Nominatim (OpenStreetMap).

### Ampliación 3: Plugin nativo personalizado con Capacitor

Crea un plugin personalizado de Capacitor que acceda a una funcionalidad nativa no cubierta por los plugins oficiales (por ejemplo, vibración del dispositivo, lectura de contactos o acceso al calendario). Sigue el tutorial oficial de Capacitor para crear plugins.

---

## Buenas prácticas profesionales

1. **Encapsular librerías de terceros en servicios Angular.** Esto permite cambiar la librería subyacente sin modificar los componentes que la consumen. Si mañana SweetAlert2 dejara de mantenerse, solo modificaríamos un servicio.

2. **Usar tree-shaking siempre que sea posible.** Importar solo lo necesario (SweetAlert2 individual, Font Awesome iconos específicos, componentes ngBootstrap individuales) reduce drásticamente el tamaño del bundle.

3. **Gestionar el ciclo de vida de recursos externos.** Librerías como OpenLayers o los SDK de Google/Facebook asignan recursos que deben liberarse en `ngOnDestroy()` para evitar memory leaks.

4. **No exponer claves de API en el código fuente.** Usar environment files (`environment.ts` / `environment.prod.ts`) y, en producción, variables de entorno del servidor. Nunca comitear claves reales al repositorio.

5. **Configurar Content Security Policy (CSP).** Al integrar scripts externos (Google GIS, Facebook SDK), configurar correctamente las políticas CSP para permitir solo los orígenes necesarios.

6. **Proporcionar fallbacks para plataformas no soportadas.** Capacitor solo funciona en Android/iOS. En web, ofrecer alternativas o mostrar mensajes informativos.

7. **Verificar la licencia de las librerías.** Asegurarse de que las librerías usadas tienen licencias compatibles con el proyecto (MIT, Apache 2.0, etc.).

8. **Mantener las dependencias actualizadas.** Usar `npm outdated` regularmente y revisar las notas de versión antes de actualizar (breaking changes). SweetAlert2, ngBootstrap y Capacitor evolucionan rápidamente.

---

## Errores frecuentes

1. **Cargar toda la librería en lugar de usar tree-shaking.**
   ```typescript
   // MAL: importa todos los iconos (añade ~2MB al bundle)
   import { fas } from '@fortawesome/free-solid-svg-icons';
   library.addIconPacks(fas);

   // BIEN: solo los iconos necesarios
   import { faUser, faCartShopping } from '@fortawesome/free-solid-svg-icons';
   library.addIcons(faUser, faCartShopping);
   ```

2. **No desvincular el mapa de OpenLayers en `ngOnDestroy`.**
   ```typescript
   // MAL: no se libera el mapa → memory leak
   ngOnDestroy() { }

   // BIEN
   ngOnDestroy() {
     this.mapa.setTarget(undefined);
     this.mapa.dispose();
   }
   ```

3. **Usar `document.getElementById` en lugar de `@ViewChild`.**
   ```typescript
   // MAL: no es idiomático en Angular
   const mapaDiv = document.getElementById('mapa');

   // BIEN
   @ViewChild('mapaElemento') mapaRef!: ElementRef;
   // Usar this.mapaRef.nativeElement en ngAfterViewInit
   ```

4. **Olvidar configurar los dominios autorizados en Google Cloud Console.** El login con Google fallará silenciosamente si `localhost:4200` no está en los orígenes autorizados.

5. **No hacer `npx cap sync` después de instalar un plugin de Capacitor.** Los plugins requieren sincronización con el proyecto nativo para funcionar.

6. **Usar APIs web en lugar de plugins de Capacitor en apps nativas.** Por ejemplo, `navigator.geolocation` puede no funcionar correctamente en WebView. Usar siempre `@capacitor/geolocation`.

7. **Confundir los estilos de SweetAlert2 con los de Angular Material/Bootstrap.** SweetAlert2 tiene sus propios estilos. Si se mezclan sin cuidado, pueden producirse conflictos visuales. Usar `customClass` para armonizar.

8. **No manejar el estado de carga de los SDK externos.** Los scripts de Google y Facebook se cargan asíncronamente. Intentar llamar a `google.accounts.id` antes de que el script esté listo produce errores. Verificar disponibilidad antes de usar.

---

## Resumen

En esta unidad hemos aprendido a integrar siete categorías fundamentales de librerías externas en proyectos Angular modernos con standalone components:

- **SweetAlert2** proporciona alertas y modales atractivos que mejoran la UX frente a los diálogos nativos del navegador. Su uso mediante async/await facilita el manejo de flujos asíncronos.
- **Font Awesome** ofrece iconografía vectorial de calidad profesional. La aproximación con `angular-fontawesome` permite tree-shaking para optimizar el bundle.
- **ngBootstrap** es el puente oficial entre Bootstrap y Angular, proporcionando componentes accesibles y bien documentados como modales, dropdowns, paginación y typeahead.
- **Google Auth** y **Facebook Auth** permiten autenticación federada mediante OAuth 2.0, eliminando la necesidad de gestionar contraseñas.
- **OpenLayers** permite integrar mapas interactivos con múltiples capas, marcadores, popups e interacciones, todo ello respetando el ciclo de vida de Angular.
- **Capacitor** convierte aplicaciones web en aplicaciones móviles nativas, proporcionando acceso a APIs del dispositivo mediante plugins oficiales y personalizados.

Todas estas integraciones comparten un patrón común: encapsular la librería en un servicio Angular, usar standalone components con imports individuales, respetar el ciclo de vida de los componentes (especialmente `ngOnDestroy` para liberar recursos) y aplicar tree-shaking para optimizar el rendimiento.

---

## Recursos adicionales

- [Documentación oficial de SweetAlert2](https://sweetalert2.github.io/)
- [Documentación de angular-fontawesome](https://github.com/FortAwesome/angular-fontawesome)
- [Documentación oficial de ng-bootstrap](https://ng-bootstrap.github.io/)
- [Google Identity Services - Documentación](https://developers.google.com/identity/gsi/web/guides/overview)
- [Meta for Developers - Facebook Login](https://developers.facebook.com/docs/facebook-login/web)
- [Documentación oficial de OpenLayers](https://openlayers.org/en/latest/doc/)
- [Documentación oficial de Capacitor](https://capacitorjs.com/docs)
- [Guía de publicación en Google Play](https://developer.android.com/studio/publish)
- [Guía de publicación en App Store](https://developer.apple.com/app-store/submissions/)
- [Curso de OpenLayers en Angular (YouTube)](https://www.youtube.com/results?search_query=openlayers+angular+tutorial)
- [Ejemplos de Capacitor con Angular](https://capacitorjs.com/solution/angular)
