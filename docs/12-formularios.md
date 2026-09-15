# Formularios en Angular

## Objetivos de aprendizaje

Al finalizar este capítulo, el alumnado será capaz de:

- Diferenciar entre los dos enfoques principales de formularios en Angular: Template Driven Forms y Reactive Forms.
- Construir formularios reactivos utilizando `FormControl`, `FormGroup` y `FormArray`.
- Aplicar validaciones integradas y crear validadores personalizados síncronos y asíncronos.
- Gestionar el estado de los formularios y proporcionar retroalimentación visual al usuario.
- Implementar formularios dinámicos que permitan añadir y eliminar campos.
- Comprender la nueva API de Signal Forms y sus diferencias con Reactive Forms.

## Resultados de aprendizaje

1. Construye formularios reactivos completos con validaciones y manejo de errores.
2. Crea validadores personalizados adaptados a necesidades específicas del negocio (DNI, IBAN, etc.).
3. Implementa formularios dinámicos con `FormArray` para casos de uso reales.
4. Aplica buenas prácticas de UX en formularios (estados de carga, deshabilitar botones, mensajes de error).
5. Evalúa cuándo usar Template Driven Forms, Reactive Forms o Signal Forms según el caso de uso.

## Introducción

Los formularios son el principal mecanismo de interacción entre el usuario y la aplicación. Desde un simple formulario de contacto hasta complejos procesos de registro con múltiples pasos y validaciones, los formularios están presentes en prácticamente todas las aplicaciones web empresariales.

Angular ofrece dos enfoques principales para trabajar con formularios: **Template Driven Forms** (formularios dirigidos por plantilla) y **Reactive Forms** (formularios reactivos). Además, desde Angular 17, ha comenzado a introducirse una tercera opción experimental: los **Signal Forms**, que integran el sistema de señales con la gestión de formularios.

Cada enfoque tiene sus ventajas y desventajas, y la elección depende de la complejidad del formulario y de las necesidades del proyecto. En este capítulo exploraremos los tres enfoques, aunque dedicaremos especial atención a Reactive Forms por ser el más utilizado en aplicaciones empresariales y el que ofrece mayor control y testabilidad.

La gestión de formularios va mucho más allá de capturar datos: implica validaciones síncronas y asíncronas, retroalimentación visual al usuario, gestión de estados (cargando, enviado, error), protección contra envíos duplicados, y una experiencia de usuario que guíe al usuario hacia la cumplimentación correcta de los datos.

---

## Desarrollo teórico

### SECCIÓN 1 - Template Driven Forms

#### Configuración (FormsModule, standalone imports)

Los Template Driven Forms son la forma más sencilla de crear formularios en Angular. La lógica se define principalmente en la plantilla HTML mediante directivas como `ngModel`, `ngForm` y `ngModelGroup`. Para utilizarlos, necesitamos importar `FormsModule`.

```typescript
// En un componente standalone
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h1>Formulario de Contacto</h1>
    <form #formulario="ngForm" (ngSubmit)="enviar(formulario)">
      <input
        name="nombre"
        [(ngModel)]="datos.nombre"
        required
        minlength="3"
        #nombre="ngModel"
      />
      @if (nombre.invalid && nombre.touched) {
        <small class="error">El nombre es obligatorio y debe tener al menos 3 caracteres.</small>
      }

      <button type="submit" [disabled]="formulario.invalid">Enviar</button>
    </form>
  `
})
export class ContactoComponent {
  datos = { nombre: '', email: '' };

  enviar(formulario: any): void {
    if (formulario.valid) {
      console.log('Datos enviados:', this.datos);
    }
  }
}
```

#### NgModel en formularios (standalone vs dentro de form)

`ngModel` se puede usar de dos formas:

1. **Standalone (fuera de un `<form>`):** El control no pertenece a ningún grupo. Útil para campos aislados como barras de búsqueda.

```html
<!-- NgModel standalone: no está dentro de un form -->
<input [(ngModel)]="terminoBusqueda" (ngModelChange)="buscar()" />
```

2. **Dentro de un `<form>`:** El control se registra automáticamente en el `ngForm` padre. Requiere el atributo `name`.

```html
<!-- NgModel dentro de un form: DEBE tener atributo name -->
<form #miForm="ngForm">
  <input name="email" [(ngModel)]="usuario.email" required />
</form>
```

**Importante:** Cuando `ngModel` se usa dentro de un formulario, el atributo `name` es obligatorio. Angular lo usa como clave para registrar el control dentro del grupo. Si se omite, Angular lanzará un error.

#### ngForm y referencias de plantilla

`ngForm` es una directiva que se aplica automáticamente a todas las etiquetas `<form>`. Podemos acceder a ella mediante una variable de plantilla (`#miForm="ngForm"`) para utilizar sus propiedades y métodos:

- `miForm.value`: objeto con los valores de todos los campos.
- `miForm.valid`: `true` si todos los controles son válidos.
- `miForm.invalid`: `true` si algún control es inválido.
- `miForm.submitted`: `true` si el formulario se ha intentado enviar.
- `miForm.reset()`: restablece el formulario a su estado inicial.

#### Estados de validación (ngModel.invalid, .untouched, .pristine, .errors)

Cada control `ngModel` expone propiedades que permiten reaccionar a su estado:

- `pristine` / `dirty`: El control no ha sido modificado / ha sido modificado.
- `untouched` / `touched`: El control no ha recibido foco / ha recibido y perdido el foco.
- `valid` / `invalid`: El control cumple / no cumple las validaciones.
- `pending`: El control está pendiente de una validación asíncrona.
- `errors`: Objeto con los errores de validación detectados (ej. `{ required: true, minlength: { actualLength: 2, requiredLength: 3 } }`).

#### CSS classes automáticas

Angular añade y elimina automáticamente clases CSS en los controles según su estado:

- `ng-valid` / `ng-invalid`: según la validez del control.
- `ng-touched` / `ng-untouched`: según si ha recibido foco.
- `ng-dirty` / `ng-pristine`: según si ha sido modificado.
- `ng-pending`: durante validaciones asíncronas.

Podemos usar estas clases para estilizar los campos sin necesidad de lógica adicional:

```css
/* Campo inválido que ya ha sido tocado: mostrar borde rojo */
input.ng-invalid.ng-touched {
  border: 2px solid #e74c3c;
}

/* Campo válido que ha sido modificado: mostrar borde verde */
input.ng-valid.ng-dirty {
  border: 2px solid #27ae60;
}
```

#### Validaciones HTML5 básicas

Angular integra las validaciones HTML5 estándar, que se aplican como atributos en la plantilla:

- `required`: el campo es obligatorio.
- `minlength="N"`: longitud mínima de N caracteres.
- `maxlength="N"`: longitud máxima de N caracteres.
- `pattern="regex"`: el valor debe coincidir con la expresión regular.
- `email`: el valor debe ser un email válido.
- `min="N"` / `max="N"`: valor numérico mínimo / máximo.

```html
<input
  name="nombre"
  [(ngModel)]="usuario.nombre"
  required
  minlength="3"
  maxlength="50"
  pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+"
/>
```

#### ngModelGroup (agrupar campos)

`ngModelGroup` permite agrupar campos relacionados dentro de un formulario. Esto es útil para direcciones, datos de facturación, etc.

```html
<form #formulario="ngForm">
  <fieldset ngModelGroup="direccion">
    <legend>Dirección</legend>
    <input name="calle" [(ngModel)]="usuario.direccion.calle" required />
    <input name="ciudad" [(ngModel)]="usuario.direccion.ciudad" required />
    <input name="cp" [(ngModel)]="usuario.direccion.cp" required />
  </fieldset>
</form>

<!-- El valor resultante tendrá estructura anidada -->
<!-- { direccion: { calle: '...', ciudad: '...', cp: '...' } } -->
```

#### Validaciones con template variables (#nombre="ngModel")

Para mostrar mensajes de error específicos por campo, asignamos una variable de plantilla al `ngModel` de cada control:

```html
<input
  name="email"
  [(ngModel)]="usuario.email"
  required
  email
  #email="ngModel"
/>

<!-- Mensajes de error condicionales -->
@if (email.invalid && (email.touched || formulario.submitted)) {
  <div class="errores">
    @if (email.errors?.['required']) {
      <small>El email es obligatorio.</small>
    }
    @if (email.errors?.['email']) {
      <small>El formato del email no es válido.</small>
    }
  </div>
}
```

#### Mostrar mensajes de error condicionales

La clave para una buena UX en formularios es mostrar los mensajes de error en el momento adecuado: no antes de que el usuario haya interactuado con el campo, pero sí en cuanto cometa un error.

```html
<!-- Patrón recomendado: mostrar errores después de tocar el campo o al enviar -->
@if (campo.invalid && (campo.touched || formulario.submitted)) {
  <div class="errores">
    @if (campo.errors?.['required']) {
      <p>Este campo es obligatorio.</p>
    }
  </div>
}
```

---

### SECCIÓN 2 - Reactive Forms (enfoque principal)

Los Reactive Forms son el enfoque recomendado para formularios complejos. La lógica del formulario se define en el componente (TypeScript), no en la plantilla, lo que facilita el testing unitario y proporciona un control más preciso sobre el estado del formulario.

#### Configuración (ReactiveFormsModule, imports en standalone)

```typescript
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `...`
})
export class RegistroComponent { }
```

#### FormControl

`FormControl` es la unidad mínima de un formulario reactivo. Representa un único campo de entrada y gestiona su valor, estado de validación y eventos.

```typescript
import { FormControl, Validators } from '@angular/forms';

// Creación de un FormControl
const nombre = new FormControl(
  'Valor inicial',          // Valor inicial (puede ser string, number, null, etc.)
  [                         // Validadores síncronos (array)
    Validators.required,
    Validators.minLength(3)
  ],
  [                         // Validadores asíncronos (array) - opcional
    miValidadorAsincrono
  ]
);
```

**Métodos principales de FormControl:**

```typescript
const email = new FormControl('', [Validators.required, Validators.email]);

// Establecer el valor (sobrescribe completamente)
email.setValue('nuevo@email.com');

// Actualizar parcialmente (útil cuando el control tiene propiedades anidadas)
email.patchValue('parcial@email.com');

// Restablecer al valor inicial (o a un nuevo valor)
email.reset();           // Vuelve a '' (valor inicial)
email.reset('default@email.com'); // Vuelve a un valor específico

// Obtener el valor, incluso si el control está deshabilitado
email.value;             // Valor actual
email.getRawValue();     // Valor incluso si está disabled
```

**Propiedades de estado de FormControl:**

```typescript
const email = new FormControl('', [Validators.required, Validators.email]);

email.value;        // string — valor actual
email.valid;        // boolean — true si todas las validaciones pasan
email.invalid;      // boolean — true si alguna validación falla
email.touched;      // boolean — true si el usuario ha tenido y perdido el foco
email.untouched;    // boolean — true si el usuario nunca ha interactuado
email.dirty;        // boolean — true si el valor ha cambiado respecto al inicial
email.pristine;     // boolean — true si el valor no ha cambiado
email.pending;      // boolean — true durante validaciones asíncronas
email.disabled;     // boolean — true si está deshabilitado
email.enabled;      // boolean — true si está habilitado
email.errors;       // ValidationErrors | null — objeto con los errores
email.status;       // 'VALID' | 'INVALID' | 'PENDING' | 'DISABLED'
```

**Observables de FormControl:**

```typescript
// Emite el valor cada vez que cambia
email.valueChanges.subscribe(valor => {
  console.log('Nuevo valor:', valor);
});

// Emite el estado cada vez que cambia (VALID, INVALID, PENDING, DISABLED)
email.statusChanges.subscribe(estado => {
  console.log('Nuevo estado:', estado);
});
```

**Habilitar / deshabilitar controles:**

```typescript
email.disable();            // Deshabilita el control (no se incluye en form.value)
email.enable();             // Habilita el control
email.disable({ emitEvent: false }); // Deshabilita sin emitir valueChanges
```

#### FormGroup

`FormGroup` agrupa múltiples `FormControl` en un objeto coherente. Representa un formulario completo o una sección del mismo. Puede contener tanto `FormControl` como `FormGroup` anidados.

```typescript
import { FormGroup, FormControl, Validators } from '@angular/forms';

const formulario = new FormGroup({
  nombre: new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ]),
  email: new FormControl('', [
    Validators.required,
    Validators.email
  ]),
  edad: new FormControl(null, [
    Validators.min(0),
    Validators.max(120)
  ])
});

// Acceso a controles hijos
formulario.get('nombre');        // AbstractControl | null
formulario.controls['nombre'];   // Acceso directo
formulario.controls.nombre;      // Acceso con notación de punto (TypeScript)

// Métodos del FormGroup
formulario.value;                // { nombre: '', email: '', edad: null }
formulario.valid;                // boolean
formulario.setValue({ nombre: 'Juan', email: 'juan@email.com', edad: 25 });
formulario.patchValue({ nombre: 'Solo cambio el nombre' });
formulario.reset();              // Restablece todos los controles a su valor inicial
```

**FormGroup anidados:**

```typescript
const formulario = new FormGroup({
  datosPersonales: new FormGroup({
    nombre: new FormControl('', Validators.required),
    apellidos: new FormControl('', Validators.required)
  }),
  direccion: new FormGroup({
    calle: new FormControl('', Validators.required),
    ciudad: new FormControl('', Validators.required),
    cp: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{5}$/)
    ])
  })
});

// Acceso a controles anidados
formulario.get('direccion.calle'); // Acceso con notación de punto
formulario.get(['direccion', 'calle']); // Acceso con array
```

**setValue() vs patchValue():**

| Método | Comportamiento |
|--------|---------------|
| `setValue(obj)` | Requiere que el objeto contenga TODOS los controles del grupo. Si falta alguno, lanza error. |
| `patchValue(obj)` | Permite actualizar solo un subconjunto de controles. Los no mencionados mantienen su valor. |

```typescript
// setValue - DEBE incluir todos los campos
formulario.setValue({
  nombre: 'Juan',
  email: 'juan@email.com',
  edad: 25
});

// patchValue - puede incluir solo algunos campos
formulario.patchValue({
  nombre: 'Juan' // Solo actualiza el nombre
});

// patchValue es muy útil para formularios de edición donde recibimos datos parciales
this.api.obtenerUsuario(id).subscribe(usuario => {
  formulario.patchValue(usuario); // No fallará si algún campo no viene en la respuesta
});
```

**Validación a nivel de grupo:**

Podemos añadir validadores que comparen múltiples campos del formulario:

```typescript
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Validador de grupo: verifica que dos contraseñas coincidan
function contrasenasCoinciden: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const password = group.get('password')?.value;
  const confirmar = group.get('confirmarPassword')?.value;
  return password === confirmar ? null : { coinciden: true };
};

const formulario = new FormGroup({
  password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  confirmarPassword: new FormControl('', Validators.required)
}, {
  validators: contrasenasCoinciden // Validador a nivel de grupo
});

// En la plantilla:
// @if (formulario.errors?.['coinciden'] && formulario.get('confirmarPassword')?.touched) {
//   <p>Las contraseñas no coinciden</p>
// }
```

#### FormArray

`FormArray` es un array de controles (`FormControl`, `FormGroup` o `FormArray`) que permite crear formularios dinámicos donde el usuario puede añadir o eliminar elementos.

```typescript
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

// Creación de un FormArray
const telefonos = new FormArray([
  new FormControl('', [Validators.required, Validators.pattern(/^\d{9}$/)])
]);

// Métodos principales
telefonos.push(new FormControl('', Validators.required)); // Añadir al final
telefonos.removeAt(0);           // Eliminar por índice
telefonos.insert(0, new FormControl('')); // Insertar en posición específica
telefonos.at(0);                 // Obtener control en un índice
telefonos.length;                // Número de controles
telefonos.controls;              // Array de AbstractControl
telefonos.clear();               // Eliminar todos los controles (Angular 14+)
```

**Caso de uso: formulario de líneas de pedido con FormArray de FormGroup:**

```typescript
@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <h1>Nuevo Pedido</h1>
    <form [formGroup]="formulario" (ngSubmit)="enviar()">
      <input formControlName="cliente" placeholder="Nombre del cliente" />

      <h2>Líneas de pedido</h2>

      <!-- Iteramos sobre el FormArray usando @for de Angular 17+ -->
      @for (linea of lineas.controls; track i; let i = $index) {
        <div [formGroupName]="i" class="linea-pedido">
          <input formControlName="producto" placeholder="Producto" />
          <input formControlName="cantidad" type="number" placeholder="Cantidad" min="1" />
          <input formControlName="precio" type="number" placeholder="Precio unitario" step="0.01" />
          <button type="button" (click)="eliminarLinea(i)">🗑 Eliminar</button>
        </div>
      }

      <button type="button" (click)="agregarLinea()">+ Añadir línea</button>
      <button type="submit" [disabled]="formulario.invalid">Enviar pedido</button>

      <h3>Total: {{ calcularTotal() | currency:'EUR' }}</h3>
    </form>
  `
})
export class PedidoComponent {
  private fb = inject(FormBuilder);

  formulario = this.fb.group({
    cliente: ['', Validators.required],
    lineas: this.fb.array([this.crearLinea()]) // Iniciamos con una línea vacía
  });

  // Getter para acceder cómodamente al FormArray
  get lineas(): FormArray {
    return this.formulario.get('lineas') as FormArray;
  }

  private crearLinea(): FormGroup {
    return this.fb.group({
      producto: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precio: [0, [Validators.required, Validators.min(0)]]
    });
  }

  agregarLinea(): void {
    this.lineas.push(this.crearLinea());
  }

  eliminarLinea(indice: number): void {
    if (this.lineas.length > 1) {
      this.lineas.removeAt(indice);
    }
  }

  calcularTotal(): number {
    return this.lineas.controls.reduce((total, linea) => {
      const cantidad = linea.get('cantidad')?.value || 0;
      const precio = linea.get('precio')?.value || 0;
      return total + (cantidad * precio);
    }, 0);
  }

  enviar(): void {
    if (this.formulario.valid) {
      console.log('Pedido enviado:', this.formulario.value);
    }
  }
}
```

#### FormBuilder (sugar syntax para crear controles más limpio)

`FormBuilder` es un servicio que proporciona atajos sintácticos para crear `FormGroup`, `FormArray` y `FormControl` de forma más concisa.

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({...})
export class RegistroComponent {
  private fb = inject(FormBuilder);

  // Con FormBuilder: más limpio y legible
  formulario = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    direccion: this.fb.group({
      calle: ['', Validators.required],
      ciudad: ['', Validators.required],
      cp: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]]
    }),
    telefonos: this.fb.array([
      this.fb.control('', [Validators.required, Validators.pattern(/^\d{9}$/)])
    ])
  });

  // Equivalente con new FormGroup/FormControl/FormArray (más verboso)
  formularioVerboso = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    // ... etc
  });
}
```

**Uso de fb.control():**

```typescript
// Formula corta con FormBuilder
this.fb.control('valor inicial', { validators: Validators.required });

// Equivalente con new FormControl
new FormControl('valor inicial', [Validators.required]);
```

#### Validadores integrados

Angular proporciona una clase `Validators` con los validadores más comunes:

| Validador | Descripción |
|-----------|-------------|
| `Validators.required` | El campo no puede estar vacío |
| `Validators.requiredTrue` | El valor debe ser `true` (útil para checkboxes de aceptación de términos) |
| `Validators.email` | Validación básica de formato de email |
| `Validators.minLength(n)` | Longitud mínima de n caracteres |
| `Validators.maxLength(n)` | Longitud máxima de n caracteres |
| `Validators.min(n)` | Valor numérico mínimo |
| `Validators.max(n)` | Valor numérico máximo |
| `Validators.pattern(regex)` | El valor debe coincidir con la expresión regular |
| `Validators.nullValidator` | Validador nulo (no hace nada) |

**Composición de validadores:**

```typescript
// Varios validadores en un campo
const nombre = new FormControl('', [
  Validators.required,
  Validators.minLength(3),
  Validators.maxLength(50),
  Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/)
]);

// Usando Validators.compose()
const validadoresCompuestos = Validators.compose([
  Validators.required,
  Validators.minLength(3)
]);
const nombre = new FormControl('', validadoresCompuestos);
```

#### Validadores personalizados

Cuando los validadores integrados no son suficientes, podemos crear nuestros propios validadores. Un validador personalizado es una función que recibe un `AbstractControl` y devuelve `ValidationErrors | null`.

**Validador síncrono (ValidatorFn):**

```typescript
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Validador de DNI español
// Formato: 8 dígitos + 1 letra (12345678Z)
export function dniValido(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;

    // Si el campo está vacío, dejamos que required se encargue
    if (!valor) {
      return null;
    }

    const dniRegex = /^(\d{8})([A-Za-z])$/;
    const match = valor.match(dniRegex);

    if (!match) {
      return { dni: 'El formato del DNI no es válido. Debe ser 8 dígitos + 1 letra.' };
    }

    const numero = parseInt(match[1], 10);
    const letra = match[2].toUpperCase();

    // Algoritmo de validación del DNI español
    const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
    const letraCalculada = letras[numero % 23];

    if (letraCalculada !== letra) {
      return { dni: 'La letra del DNI no es correcta.' };
    }

    return null; // DNI válido
  };
}

// Uso del validador personalizado
this.fb.group({
  documento: ['', [Validators.required, dniValido()]]
});
```

**Validador de contraseñas coincidentes (nivel de FormGroup):**

```typescript
export function contrasenasCoinciden(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmar = group.get('confirmarPassword')?.value;

    if (!password || !confirmar) {
      return null;
    }

    return password === confirmar ? null : { coinciden: 'Las contraseñas no coinciden.' };
  };
}

// Uso
this.fb.group({
  password: ['', [Validators.required, Validators.minLength(8)]],
  confirmarPassword: ['', Validators.required]
}, {
  validators: contrasenasCoinciden()
});
```

**Validador de IBAN español:**

```typescript
export function ibanValido(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;

    if (!valor) {
      return null;
    }

    // Formato IBAN español: ES + 22 dígitos
    const ibanRegex = /^ES\d{22}$/;

    if (!ibanRegex.test(valor.toUpperCase())) {
      return { iban: 'El IBAN debe tener formato ES + 22 dígitos.' };
    }

    // Validación matemática del IBAN (algoritmo módulo 97)
    const ibanReorganizado = valor.substring(4) + valor.substring(0, 4);
    const ibanNumerico = ibanReorganizado
      .split('')
      .map(char => {
        if (char >= 'A' && char <= 'Z') {
          return (char.charCodeAt(0) - 55).toString();
        }
        return char;
      })
      .join('');

    // Verificar módulo 97
    const mod97 = BigInt(ibanNumerico) % 97n;
    if (mod97 !== 1n) {
      return { iban: 'El IBAN no es válido.' };
    }

    return null;
  };
}
```

**Validador asíncrono (AsyncValidatorFn):**

Los validadores asíncronos se utilizan cuando la validación requiere una llamada al servidor, como verificar si un email o nombre de usuario ya está registrado.

```typescript
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, map, catchError, switchMap } from 'rxjs/operators';

export function emailUnico(usuarioService: UsuarioService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const email = control.value;

    if (!email) {
      return of(null);
    }

    return of(email).pipe(
      debounceTime(500), // Esperar 500ms antes de hacer la petición (evita muchas llamadas)
      switchMap(valor =>
        usuarioService.verificarEmailUnico(valor).pipe(
          map(existe => existe ? { emailDuplicado: 'Este email ya está registrado.' } : null),
          catchError(() => of(null))
        )
      )
    );
  };
}

// Uso: los validadores asíncronos van en el tercer parámetro
this.fb.group({
  email: [
    '',
    [Validators.required, Validators.email],       // Validadores síncronos
    [emailUnico(this.usuarioService)]               // Validadores asíncronos
  ]
});
```

#### Errores personalizados (cómo mostrar mensajes según el tipo de error)

Una buena práctica es centralizar los mensajes de error en funciones auxiliares para mantener las plantillas limpias:

```typescript
// Archivo: validadores-mensajes.ts
import { ValidationErrors } from '@angular/forms';

export function obtenerMensajeError(errores: ValidationErrors | null): string {
  if (!errores) return '';

  if (errores['required']) return 'Este campo es obligatorio.';
  if (errores['email']) return 'El formato del email no es válido.';
  if (errores['minlength']) return `Mínimo ${errores['minlength'].requiredLength} caracteres.`;
  if (errores['maxlength']) return `Máximo ${errores['maxlength'].requiredLength} caracteres.`;
  if (errores['min']) return `El valor mínimo es ${errores['min'].min}.`;
  if (errores['max']) return `El valor máximo es ${errores['max'].max}.`;
  if (errores['pattern']) return 'El formato no es válido.';
  if (errores['dni']) return errores['dni'];
  if (errores['iban']) return errores['iban'];
  if (errores['emailDuplicado']) return errores['emailDuplicado'];
  if (errores['coinciden']) return errores['coinciden'];

  return 'Campo inválido.';
}
```

**Uso en plantilla (enfoque tipado con getter):**

```typescript
// En el componente
export class RegistroComponent {
  formulario = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  // Getter que devuelve el mensaje de error para un campo
  mensajeError(campo: string): string {
    const control = this.formulario.get(campo);
    if (control?.touched && control?.errors) {
      return obtenerMensajeError(control.errors);
    }
    return '';
  }
}
```

```html
<!-- En la plantilla -->
<input formControlName="email" placeholder="Email" />
@if (mensajeError('email')) {
  <small class="error">{{ mensajeError('email') }}</small>
}
```

#### updateOn: 'change' | 'blur' | 'submit'

Por defecto, los validadores se ejecutan en cada cambio (`'change'`). Podemos cambiar este comportamiento con la opción `updateOn`:

```typescript
// Validar al perder el foco (blur): útil cuando la validación es costosa
this.fb.group({
  email: ['', {
    validators: [Validators.required, Validators.email],
    asyncValidators: [emailUnico(usuarioService)],
    updateOn: 'blur' // Solo valida cuando el usuario sale del campo
  }]
});

// Validar al enviar el formulario
this.fb.group({
  nombre: ['', Validators.required],
  email: ['', Validators.required]
}, {
  updateOn: 'submit' // Solo valida cuando se llama a submit
});
```

#### Formularios con cross-field validation

La validación cruzada (cross-field) ocurre cuando la validez de un campo depende del valor de otro. El ejemplo clásico es "contraseña y confirmar contraseña", pero hay muchos otros:

```typescript
// Validador: la fecha de fin debe ser posterior a la fecha de inicio
export function fechaFinPosterior(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const fechaInicio = group.get('fechaInicio')?.value;
    const fechaFin = group.get('fechaFin')?.value;

    if (!fechaInicio || !fechaFin) {
      return null;
    }

    return new Date(fechaInicio) < new Date(fechaFin) ? null : {
      fechaFinPosterior: 'La fecha de fin debe ser posterior a la fecha de inicio.'
    };
  };
}

// Validador: al menos uno de dos campos debe estar relleno (teléfono o email)
export function algunoRequerido(campo1: string, campo2: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const valor1 = group.get(campo1)?.value;
    const valor2 = group.get(campo2)?.value;

    if (valor1 || valor2) {
      return null;
    }

    return { algunoRequerido: `Debe rellenar al menos ${campo1} o ${campo2}.` };
  };
}
```

#### Envío de formularios (FormGroup.valid, ngSubmit, valores a API)

El patrón recomendado para el envío de formularios es:

```typescript
@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="formulario" (ngSubmit)="enviar()">
      <!-- campos del formulario -->
      <button
        type="submit"
        [disabled]="formulario.invalid || enviando()">
        @if (enviando()) {
          <span class="spinner"></span> Enviando...
        } @else {
          Registrarse
        }
      </button>
    </form>

    @if (exito()) {
      <p class="exito">Registro completado con éxito. Revisa tu email para confirmar.</p>
    }

    @if (error()) {
      <p class="error">{{ error() }}</p>
    }
  `,
})
export class RegistroComponent {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);

  formulario = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    aceptarTerminos: [false, Validators.requiredTrue]
  });

  enviando = signal(false);
  exito = signal(false);
  error = signal<string | null>(null);

  async enviar(): Promise<void> {
    // Marcar todos los controles como tocados para mostrar errores
    this.formulario.markAllAsTouched();

    if (this.formulario.invalid) {
      return; // El formulario no es válido, mostramos los errores
    }

    this.enviando.set(true);
    this.error.set(null);
    this.exito.set(false);

    try {
      await this.usuarioService.registrar(this.formulario.value);
      this.exito.set(true);
      this.formulario.reset();
    } catch (err: any) {
      this.error.set(err.message || 'Error al registrar. Inténtalo de nuevo.');
    } finally {
      this.enviando.set(false);
    }
  }
}
```

**Marcar todos los campos como tocados antes de validar:**

```typescript
// Función auxiliar para marcar todo un FormGroup como tocado
function marcarTodoComoSucio(formGroup: FormGroup): void {
  Object.values(formGroup.controls).forEach(control => {
    control.markAsTouched();
    control.markAsDirty();

    if (control instanceof FormGroup) {
      marcarTodoComoSucio(control);
    }
  });
}
```

#### Estados del formulario y UX

Un formulario bien diseñado comunica su estado al usuario en cada momento:

| Estado | Acción visual |
|--------|--------------|
| `pristine + valid` | Sin indicadores visuales |
| `dirty + invalid` | Bordes rojos en campos inválidos, mensajes de error específicos |
| `dirty + valid` | Bordes verdes en campos válidos |
| `pending` | Indicador de carga (spinner) en el campo con validación asíncrona |
| `submitting` | Botón deshabilitado con spinner, prevenir doble envío |
| `success` | Mensaje de confirmación, redirección |
| `error` | Mensaje de error del servidor, mantener datos del formulario |

---

### SECCIÓN 3 - Signal Forms (novedad)

A partir de Angular 17+, se ha introducido experimentalmente el concepto de Signal Forms, que integra el sistema reactivo de señales con la gestión de formularios. Esta API está en evolución y puede cambiar en versiones futuras.

#### Arquitectura de Signal Forms

Signal Forms se basa en el uso de señales (`signal()`, `computed()`) para gestionar el estado del formulario en lugar de los observables de RxJS utilizados por Reactive Forms. La idea es simplificar la reactividad y hacerla más intuitiva para desarrolladores familiarizados con las señales de Angular.

```typescript
// Signal Forms (API experimental, Angular 17+)
import { signalForms } from '@angular/forms'; // API en desarrollo

// Ejemplo conceptual (sujeto a cambios según la versión final de la API)
const nombre = signal('');
const email = signal('');
const errores = computed(() => {
  const errs: string[] = [];
  if (!nombre()) errs.push('El nombre es obligatorio.');
  if (!email().includes('@')) errs.push('El email no es válido.');
  return errs;
});
const formularioValido = computed(() => errores().length === 0);
```

#### Comparación con ReactiveForms: ventajas e inconvenientes

| Característica | Reactive Forms | Signal Forms |
|---------------|----------------|--------------|
| Madurez | API estable y probada en producción | Experimental, en desarrollo |
| Reactividad | Basada en RxJS (Observables) | Basada en Signals (nativo de Angular) |
| Tipado | Bueno a través de genéricos | Potencialmente mejor (señales tipadas) |
| Validación | Sistema de validadores robusto | En desarrollo |
| FormArrays | Soporte completo | Por definir |
| Ecosistema | Librerías de terceros disponibles | Limitado |
| Curva de aprendizaje | Media (requiere entender RxJS) | Baja (señales son más intuitivas) |
| Performance | Buena con OnPush | Potencialmente mejor |

#### Estado actual de la API

En la versión actual de Angular (19+), Signal Forms es una API en fase de diseño y experimentación. No se recomienda su uso en producción todavía. Se espera que en futuras versiones de Angular, Signal Forms se convierta en el estándar para formularios, reemplazando progresivamente a Reactive Forms.

Es importante que el alumnado esté al tanto de esta evolución, pero debe centrar su aprendizaje en Reactive Forms, que seguirá siendo el estándar durante un tiempo y es ampliamente utilizado en la industria.

---

## Ejemplos guiados

### Ejemplo 1: Formulario de registro completo con Reactive Forms

```typescript
// registro.component.ts
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Validador de contraseña segura
function passwordSegura(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;
    if (!valor) return null;

    const tieneMayuscula = /[A-Z]/.test(valor);
    const tieneMinuscula = /[a-z]/.test(valor);
    const tieneNumero = /[0-9]/.test(valor);
    const tieneEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(valor);

    const cumple = tieneMayuscula && tieneMinuscula && tieneNumero && tieneEspecial;
    return cumple ? null : { passwordSegura: true };
  };
}

// Validador de contraseñas coincidentes
function contrasenasCoinciden(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmarPassword')?.value;
    return pass && confirm && pass !== confirm ? { coinciden: true } : null;
  };
}

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registro.component.html'
})
export class RegistroComponent {
  private fb = inject(FormBuilder);

  formulario = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    fechaNacimiento: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8), passwordSegura()]],
    confirmarPassword: ['', Validators.required],
    aceptarTerminos: [false, Validators.requiredTrue]
  }, { validators: contrasenasCoinciden() });

  enviando = signal(false);
  registrado = signal(false);

  mensajeError(campo: string): string {
    const control = this.formulario.get(campo);
    if (!control?.touched || !control?.errors) return '';

    if (control.errors['required']) return 'Campo obligatorio.';
    if (control.errors['email']) return 'Email inválido.';
    if (control.errors['minlength']) return `Mínimo ${control.errors['minlength'].requiredLength} caracteres.`;
    if (control.errors['passwordSegura']) return 'Debe contener mayúscula, minúscula, número y carácter especial.';
    if (control.errors['requiredTrue']) return 'Debes aceptar los términos.';

    return 'Campo inválido.';
  }

  async enviar(): Promise<void> {
    this.formulario.markAllAsTouched();
    if (this.formulario.invalid) return;

    this.enviando.set(true);
    // Simulación de envío a API
    await new Promise(r => setTimeout(r, 2000));
    this.enviando.set(false);
    this.registrado.set(true);
    this.formulario.reset();
  }
}
```

```html
<!-- registro.component.html -->
<form [formGroup]="formulario" (ngSubmit)="enviar()" class="formulario-registro">

  <!-- Nombre -->
  <div class="campo">
    <label for="nombre">Nombre completo</label>
    <input id="nombre" formControlName="nombre" placeholder="Tu nombre" />
    @if (mensajeError('nombre')) {
      <small class="error">{{ mensajeError('nombre') }}</small>
    }
  </div>

  <!-- Email -->
  <div class="campo">
    <label for="email">Correo electrónico</label>
    <input id="email" type="email" formControlName="email" placeholder="tu@email.com" />
    @if (mensajeError('email')) {
      <small class="error">{{ mensajeError('email') }}</small>
    }
  </div>

  <!-- Fecha de nacimiento -->
  <div class="campo">
    <label for="fechaNacimiento">Fecha de nacimiento</label>
    <input id="fechaNacimiento" type="date" formControlName="fechaNacimiento" />
    @if (mensajeError('fechaNacimiento')) {
      <small class="error">{{ mensajeError('fechaNacimiento') }}</small>
    }
  </div>

  <!-- Contraseña -->
  <div class="campo">
    <label for="password">Contraseña</label>
    <input id="password" type="password" formControlName="password" placeholder="Mínimo 8 caracteres" />
    @if (mensajeError('password')) {
      <small class="error">{{ mensajeError('password') }}</small>
    }
  </div>

  <!-- Confirmar contraseña -->
  <div class="campo">
    <label for="confirmarPassword">Confirmar contraseña</label>
    <input id="confirmarPassword" type="password" formControlName="confirmarPassword" />
    @if (formulario.errors?.['coinciden'] && formulario.get('confirmarPassword')?.touched) {
      <small class="error">Las contraseñas no coinciden.</small>
    }
  </div>

  <!-- Checkbox de términos -->
  <div class="campo checkbox">
    <label>
      <input type="checkbox" formControlName="aceptarTerminos" />
      Acepto los términos y condiciones
    </label>
    @if (mensajeError('aceptarTerminos')) {
      <small class="error">{{ mensajeError('aceptarTerminos') }}</small>
    }
  </div>

  <!-- Botón de envío -->
  <button type="submit" [disabled]="formulario.invalid || enviando()">
    @if (enviando()) {
      <span class="spinner"></span> Registrando...
    } @else {
      Crear cuenta
    }
  </button>

  @if (registrado()) {
    <div class="exito">¡Cuenta creada correctamente! Revisa tu email para verificarla.</div>
  }
</form>
```

### Ejemplo 2: Formulario dinámico con FormArray (añadir/eliminar direcciones)

```typescript
// direcciones.component.ts
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormArray, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-direcciones',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <h1>Mis Direcciones</h1>
    <form [formGroup]="formulario" (ngSubmit)="guardar()">
      @for (direccion of direcciones.controls; track i; let i = $index) {
        <fieldset [formGroupName]="i" class="direccion">
          <legend>Dirección {{ i + 1 }}</legend>

          <input formControlName="calle" placeholder="Calle y número" />
          <input formControlName="ciudad" placeholder="Ciudad" />
          <input formControlName="codigoPostal" placeholder="C.P." maxlength="5" />
          <label>
            <input type="checkbox" formControlName="principal" />
            Dirección principal
          </label>

          <!-- Solo permitir eliminar si quedará al menos una -->
          @if (direcciones.length > 1) {
            <button type="button" (click)="eliminarDireccion(i)">Eliminar</button>
          }
        </fieldset>
      }

      <button type="button" (click)="agregarDireccion()">+ Añadir dirección</button>
      <button type="submit" [disabled]="formulario.invalid">Guardar direcciones</button>
    </form>
  `
})
export class DireccionesComponent {
  private fb = inject(FormBuilder);

  formulario = this.fb.group({
    direcciones: this.fb.array([this.crearDireccion()])
  });

  get direcciones(): FormArray {
    return this.formulario.get('direcciones') as FormArray;
  }

  private crearDireccion(): FormGroup {
    return this.fb.group({
      calle: ['', Validators.required],
      ciudad: ['', Validators.required],
      codigoPostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      principal: [false]
    });
  }

  agregarDireccion(): void {
    this.direcciones.push(this.crearDireccion());
  }

  eliminarDireccion(indice: number): void {
    this.direcciones.removeAt(indice);
  }

  guardar(): void {
    if (this.formulario.valid) {
      console.log('Direcciones:', this.formulario.value);
    }
  }
}
```

### Ejemplo 3: Validador personalizado de DNI español

```typescript
// dni.validador.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const LETRAS_DNI = 'TRWAGMYFPDXBNJZSQVHLCKE';

export function dniEspanolValido(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;

    // No validar si está vacío (dejar que required se encargue)
    if (!valor || valor.length === 0) {
      return null;
    }

    // Comprobar formato: 8 dígitos + 1 letra
    const regex = /^(\d{8})([A-Za-z])$/;
    const match = valor.trim().match(regex);

    if (!match) {
      return {
        dni: {
          mensaje: 'Formato inválido. Debe ser 8 dígitos seguidos de una letra (ej: 12345678Z).'
        }
      };
    }

    const numero = parseInt(match[1], 10);
    const letraIntroducida = match[2].toUpperCase();
    const letraCalculada = LETRAS_DNI[numero % 23];

    if (letraIntroducida !== letraCalculada) {
      return {
        dni: {
          mensaje: `La letra del DNI no es correcta. La letra esperada es "${letraCalculada}".`
        }
      };
    }

    return null; // DNI válido
  };
}

// Uso del validador
this.fb.group({
  dni: ['', [Validators.required, dniEspanolValido()]]
});
```

### Ejemplo 4: Formulario con Signal Forms (API experimental)

```typescript
// Ejemplo conceptual de Signal Forms (API en desarrollo)
// NOTA: Esta API es experimental y puede cambiar en versiones futuras

import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contacto-signal',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h1>Contacto (Signal Forms)</h1>
    <form (ngSubmit)="enviar()">
      <input [ngModel]="nombre()" (ngModelChange)="nombre.set($event)" placeholder="Nombre" />
      @if (erroresNombre()) {
        <small class="error">{{ erroresNombre() }}</small>
      }

      <input [ngModel]="email()" (ngModelChange)="email.set($event)" placeholder="Email" />
      @if (erroresEmail()) {
        <small class="error">{{ erroresEmail() }}</small>
      }

      <textarea [ngModel]="mensaje()" (ngModelChange)="mensaje.set($event)" placeholder="Mensaje"></textarea>
      @if (erroresMensaje()) {
        <small class="error">{{ erroresMensaje() }}</small>
      }

      <button type="submit" [disabled]="!formularioValido() || enviando()">
        @if (enviando()) { Enviando... } @else { Enviar }
      </button>
    </form>
  `
})
export class ContactoSignalComponent {
  // Estado del formulario con señales
  nombre = signal('');
  email = signal('');
  mensaje = signal('');
  enviando = signal(false);

  // Validaciones como señales computadas
  erroresNombre = computed(() => {
    const valor = this.nombre();
    if (!valor && this.enviando()) return 'El nombre es obligatorio.';
    if (valor && valor.length < 3) return 'Mínimo 3 caracteres.';
    return '';
  });

  erroresEmail = computed(() => {
    const valor = this.email();
    if (!valor && this.enviando()) return 'El email es obligatorio.';
    if (valor && !valor.includes('@')) return 'El email no es válido.';
    return '';
  });

  erroresMensaje = computed(() => {
    const valor = this.mensaje();
    if (!valor && this.enviando()) return 'El mensaje es obligatorio.';
    return '';
  });

  // Validez general del formulario
  formularioValido = computed(() => {
    return (
      this.nombre().length >= 3 &&
      this.email().includes('@') &&
      this.mensaje().length > 0
    );
  });

  enviar(): void {
    this.enviando.set(true);

    if (!this.formularioValido()) {
      this.enviando.set(false);
      return;
    }

    // Lógica de envío...
    console.log({
      nombre: this.nombre(),
      email: this.email(),
      mensaje: this.mensaje()
    });
  }
}
```

---

## Ejercicios resueltos

### Ejercicio 1: Formulario de pedido con FormArray de líneas de pedido

**Enunciado:** Construye un formulario de pedido que permita añadir múltiples líneas de producto con cantidad y precio. Cada línea debe tener validaciones: producto obligatorio, cantidad mínima 1, precio mínimo 0. El formulario debe calcular el total automáticamente.

```typescript
// pedido.component.ts
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormArray, FormGroup } from '@angular/forms';
import { AsyncPipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe],
  template: `
    <h1>Nuevo Pedido</h1>
    <form [formGroup]="formulario" (ngSubmit)="enviarPedido()">

      <div class="campo">
        <label>Cliente:</label>
        <input formControlName="cliente" placeholder="Nombre del cliente" />
      </div>

      <h2>Líneas de pedido</h2>

      @for (linea of lineas.controls; track i; let i = $index) {
        <div [formGroupName]="i" class="linea">
          <input formControlName="producto" placeholder="Producto" />
          <input formControlName="cantidad" type="number" min="1" placeholder="Cantidad" />
          <input formControlName="precio" type="number" step="0.01" min="0" placeholder="Precio" />
          <span class="subtotal-linea">
            Subtotal: {{ calcularSubtotal(i) | currency:'EUR' }}
          </span>
          @if (lineas.length > 1) {
            <button type="button" (click)="eliminarLinea(i)">Eliminar</button>
          }
        </div>
      }

      <div class="acciones">
        <button type="button" (click)="agregarLinea()">+ Añadir línea</button>
      </div>

      <div class="total">
        <h3>Total del pedido: {{ calcularTotal() | currency:'EUR' }}</h3>
      </div>

      <button type="submit" [disabled]="formulario.invalid">Enviar pedido</button>
    </form>
  `,
  styles: [`
    .linea { display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem; }
    .subtotal-linea { font-weight: bold; white-space: nowrap; }
    .total { margin: 1rem 0; padding: 1rem; background: #f0f0f0; border-radius: 4px; }
    .acciones { margin: 1rem 0; }
    input { padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }
    button { padding: 0.5rem 1rem; cursor: pointer; }
  `]
})
export class PedidoComponent {
  private fb = inject(FormBuilder);

  formulario = this.fb.group({
    cliente: ['', Validators.required],
    lineas: this.fb.array([this.crearLinea()])
  });

  get lineas(): FormArray {
    return this.formulario.get('lineas') as FormArray;
  }

  private crearLinea(): FormGroup {
    return this.fb.group({
      producto: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precio: [0, [Validators.required, Validators.min(0)]]
    });
  }

  agregarLinea(): void {
    this.lineas.push(this.crearLinea());
  }

  eliminarLinea(indice: number): void {
    this.lineas.removeAt(indice);
  }

  calcularSubtotal(indice: number): number {
    const linea = this.lineas.at(indice);
    const cantidad = linea.get('cantidad')?.value || 0;
    const precio = linea.get('precio')?.value || 0;
    return cantidad * precio;
  }

  calcularTotal(): number {
    return this.lineas.controls.reduce((total, _, i) => total + this.calcularSubtotal(i), 0);
  }

  enviarPedido(): void {
    this.formulario.markAllAsTouched();
    if (this.formulario.valid) {
      console.log('Pedido:', this.formulario.value);
      console.log('Total:', this.calcularTotal());
    }
  }
}
```

### Ejercicio 2: Formulario de registro con validación cross-field

**Enunciado:** Implementa un formulario de registro que incluya validación de contraseñas coincidentes, fecha de nacimiento que demuestre mayoría de edad (18 años), y que al menos uno de los campos "teléfono" o "email" esté relleno.

```typescript
// registro-avanzado.component.ts
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Validador: usuario debe ser mayor de 18 años
function mayorDeEdad(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    const fechaNacimiento = new Date(control.value);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();

    // Ajustar si aún no ha cumplido años este año
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }

    return edad >= 18 ? null : { mayorDeEdad: 'Debes ser mayor de 18 años.' };
  };
}

// Validador de grupo: contraseñas coincidentes
function contrasenasCoinciden(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmarPassword')?.value;
    return pass && confirm && pass !== confirm ? { coinciden: true } : null;
  };
}

// Validador de grupo: al menos uno de los campos de contacto
function alMenosUnContacto(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const email = group.get('email')?.value;
    const telefono = group.get('telefono')?.value;
    return email || telefono ? null : { alMenosUnContacto: true };
  };
}

@Component({
  selector: 'app-registro-avanzado',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <h1>Registro de Usuario</h1>
    <form [formGroup]="formulario" (ngSubmit)="registrar()">

      <input formControlName="nombreUsuario" placeholder="Nombre de usuario" />
      @if (errorCampo('nombreUsuario')) {
        <small class="error">{{ errorCampo('nombreUsuario') }}</small>
      }

      <fieldset>
        <legend>Información de contacto (al menos uno obligatorio)</legend>
        <input formControlName="email" placeholder="Email" />
        <input formControlName="telefono" placeholder="Teléfono" />
        @if (formulario.errors?.['alMenosUnContacto'] && (formulario.get('email')?.touched || formulario.get('telefono')?.touched)) {
          <small class="error">Debes proporcionar al menos un email o teléfono.</small>
        }
      </fieldset>

      <input formControlName="fechaNacimiento" type="date" />
      @if (errorCampo('fechaNacimiento')) {
        <small class="error">{{ errorCampo('fechaNacimiento') }}</small>
      }

      <input formControlName="password" type="password" placeholder="Contraseña" />
      @if (errorCampo('password')) {
        <small class="error">{{ errorCampo('password') }}</small>
      }

      <input formControlName="confirmarPassword" type="password" placeholder="Confirmar contraseña" />
      @if (formulario.errors?.['coinciden'] && formulario.get('confirmarPassword')?.touched) {
        <small class="error">Las contraseñas no coinciden.</small>
      }

      <button type="submit" [disabled]="formulario.invalid">Registrarse</button>
    </form>
  `
})
export class RegistroAvanzadoComponent {
  private fb = inject(FormBuilder);

  formulario = this.fb.group({
    nombreUsuario: ['', [Validators.required, Validators.minLength(4)]],
    email: ['', Validators.email],
    telefono: ['', Validators.pattern(/^\d{9}$/)],
    fechaNacimiento: ['', [Validators.required, mayorDeEdad()]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmarPassword: ['', Validators.required]
  }, {
    validators: [contrasenasCoinciden(), alMenosUnContacto()]
  });

  errorCampo(campo: string): string {
    const control = this.formulario.get(campo);
    if (!control?.touched || !control?.errors) return '';
    if (control.errors['required']) return 'Campo obligatorio.';
    if (control.errors['minlength']) return `Mínimo ${control.errors['minlength'].requiredLength} caracteres.`;
    if (control.errors['email']) return 'Email inválido.';
    if (control.errors['pattern']) return 'Formato inválido.';
    if (control.errors['mayorDeEdad']) return control.errors['mayorDeEdad'];
    return 'Inválido.';
  }

  registrar(): void {
    this.formulario.markAllAsTouched();
    if (this.formulario.valid) {
      console.log('Registro:', this.formulario.value);
    }
  }
}
```

---

## Actividades propuestas

1. **Formulario de inscripción a un curso:** Crea un formulario de inscripción con campos personales (nombre, apellidos, DNI con validación personalizada, fecha de nacimiento, email, teléfono) y selección de curso (desplegable con opciones). Implementa validaciones síncronas para todos los campos, mensajes de error específicos por campo, y un botón de envío que solo se active cuando el formulario es válido.

2. **Encuesta dinámica con FormArray:** Diseña un formulario de encuesta donde el usuario pueda añadir preguntas con sus opciones de respuesta. Cada pregunta tiene un texto (obligatorio) y un FormArray de opciones. Cada opción tiene un texto (obligatorio). Implementa botones para añadir/eliminar preguntas y opciones. El formulario debe mostrar el total de preguntas y opciones en tiempo real.

3. **Validador asíncrono de nombre de usuario disponible:** Crea un formulario de registro con un campo de nombre de usuario que valide de forma asíncrona (simulada con un `setTimeout` de 1 segundo) si el nombre está disponible. Muestra un indicador de carga mientras se verifica. Implementa `debounceTime` para no realizar peticiones en cada pulsación.

4. **Formulario multi-paso con Reactive Forms:** Implementa un formulario de checkout en 3 pasos (datos personales, dirección de envío, datos de pago) usando un único `FormGroup` con `FormGroup` anidados para cada paso. Muestra una barra de progreso e implementa botones "Anterior" y "Siguiente" con validación del paso actual antes de avanzar.

5. **Comparativa de enfoques:** Implementa el mismo formulario de "solicitud de presupuesto" usando Template Driven Forms, Reactive Forms y Signal Forms. Compara la cantidad de código, legibilidad y funcionalidades de cada enfoque en un breve informe.

## Actividades de ampliación

1. **Sistema reutilizable de validadores:** Crea una librería de validadores personalizados para el contexto español: DNI, NIE, CIF, IBAN, código postal, número de la seguridad social, matrícula de vehículo. Empaqueta los validadores como funciones exportables y crea un módulo de demostración que pruebe cada uno de ellos con casos válidos e inválidos.

2. **Formulario con arrastrar y soltar (drag & drop) en FormArray:** Utiliza la librería Angular CDK Drag & Drop para permitir reordenar elementos dentro de un FormArray. Implementa un editor de pasos de una receta donde el usuario pueda añadir, eliminar y reordenar pasos arrastrándolos.

3. **Integración de formularios con NgRx SignalStore:** Combina Reactive Forms con el estado global de la aplicación usando NgRx SignalStore. Implementa un formulario cuyos valores iniciales se carguen desde el store y cuyos cambios se sincronicen con el store mediante `valueChanges` y señales.

## Buenas prácticas profesionales

1. **Usar Reactive Forms para formularios complejos:** Si tu formulario tiene validaciones dinámicas, cross-field, lógica condicional o arrays de datos, Reactive Forms es la opción correcta. Template Driven Forms es adecuado solo para formularios muy simples.

2. **Centralizar los mensajes de error en funciones auxiliares:** No repitas la lógica de mensajes `@if (errors.required)` en cada plantilla. Extrae una función `getErrorMessage(control)` que devuelva el mensaje adecuado según los errores presentes. Esto facilita la consistencia y el mantenimiento.

3. **Marcar controles como `touched` antes de mostrar errores:** No muestres errores de validación en un campo hasta que el usuario haya interactuado con él (`touched`) o haya intentado enviar el formulario (`submitted`). Esto evita abrumar al usuario con mensajes de error antes de empezar a rellenar.

4. **Deshabilitar el botón de envío mientras se procesa:** Usa un flag booleano (idealmente un `signal`) para deshabilitar el botón durante el envío y evitar peticiones duplicadas. Muestra un spinner o texto indicativo mientras se procesa.

5. **Tipar los formularios correctamente:** Usa `FormGroup<{ campo1: FormControl<string> }>` (formularios fuertemente tipados disponibles desde Angular 14) para obtener autocompletado y detección de errores en tiempo de compilación.

6. **No abusar de validaciones asíncronas:** Las validaciones asíncronas añaden latencia y complejidad. Úsalas solo cuando sea estrictamente necesario (comprobaciones contra el servidor). Implementa `debounceTime` para evitar saturar la API.

7. **Usar `updateOn: 'blur'` para validaciones costosas:** Si tienes validadores personalizados complejos o asíncronos, configura `updateOn: 'blur'` para que solo se ejecuten cuando el usuario abandone el campo, no en cada pulsación.

8. **Prevenir envío de formularios con Enter accidental:** En formularios largos, el usuario puede pulsar Enter accidentalmente. Asegúrate de que el botón de envío esté deshabilitado si el formulario es inválido y considera usar `(keydown.enter)="$event.preventDefault()"` en campos que no deberían desencadenar el envío.

## Errores frecuentes

1. **Olvidar `formControlName` o usar `[(ngModel)]` en Reactive Forms:** En Reactive Forms, el binding se hace con `formControlName="nombreCampo"`. Usar `[(ngModel)]` en un formulario reactivo genera una advertencia y puede causar comportamientos inesperados.

2. **Importar `FormsModule` en lugar de `ReactiveFormsModule`:** Si necesitas Reactive Forms, debes importar `ReactiveFormsModule`. Importar solo `FormsModule` hará que `formGroup`, `formControlName` y otras directivas reactivas no funcionen, lanzando errores en consola.

3. **No añadir `name` en Template Driven Forms dentro de un form:** Cuando `ngModel` se usa dentro de una etiqueta `<form>`, Angular requiere el atributo `name`. Sin él, el control no se registra en el `ngForm` y se produce un error.

4. **Confundir `setValue()` con `patchValue()` en FormGroup:** `setValue()` requiere un objeto con todos los controles del grupo. Si falta alguno, lanza un error. `patchValue()` acepta objetos parciales. En formularios de edición donde los datos vienen de una API, prefiere `patchValue()`.

5. **Olvidar la suscripción a `valueChanges` causa memory leaks:** Las suscripciones a `form.valueChanges` o `control.valueChanges` sin cancelar pueden provocar memory leaks. Usa `takeUntilDestroyed()` o el operador `takeUntil()` con un `Subject` que emita en `ngOnDestroy`.

6. **Validar controles deshabilitados:** Los controles `disabled` no se incluyen en `formGroup.value` y sus validadores no se ejecutan. Si necesitas validar un campo que ocasionalmente está deshabilitado, usa `control.getRawValue()` para obtener su valor.

7. **No llamar a `markAllAsTouched()` antes de validar en el submit:** Si el usuario pulsa "Enviar" sin haber tocado algunos campos, los errores no serán visibles. Llama a `formulario.markAllAsTouched()` al inicio del método de envío para forzar la visualización de todos los errores.

8. **Anidar `FormGroup` incorrectamente y acceder mal a los controles:** Para controles dentro de un `FormGroup` anidado, la ruta de acceso debe incluir el nombre del grupo padre: `formulario.get('datosPersonales.nombre')`. Usar solo `'nombre'` no encontrará el control.

## Resumen

En este extenso capítulo hemos cubierto los tres enfoques de formularios disponibles en Angular:

- **Template Driven Forms:** Ideal para formularios simples. La lógica reside en la plantilla HTML usando directivas como `ngModel`, `ngForm` y `ngModelGroup`. Angular gestiona automáticamente el estado del formulario y añade clases CSS reactivas.

- **Reactive Forms:** El enfoque principal para aplicaciones empresariales. La lógica del formulario se define en TypeScript mediante `FormControl`, `FormGroup`, `FormArray` y `FormBuilder`. Ofrece mayor control, testabilidad y soporte para validaciones complejas. Los validadores integrados (`Validators.required`, `.email`, `.min`, `.max`, `.pattern`, etc.) cubren la mayoría de necesidades, y podemos extenderlos con validadores personalizados síncronos y asíncronos.

- **Signal Forms:** API experimental que integra el sistema reactivo de señales con formularios. Promete simplificar la reactividad eliminando la dependencia de RxJS, pero aún está en fase de desarrollo.

Los formularios dinámicos con `FormArray` permiten crear interfaces donde el usuario puede añadir y eliminar campos. La validación cross-field permite comprobar relaciones entre campos (contraseñas coincidentes, fechas coherentes). Y una correcta gestión del estado del formulario (cargando, error, éxito) es fundamental para una buena experiencia de usuario.

## Recursos adicionales

- [Documentación oficial de Reactive Forms](https://angular.dev/guide/forms/reactive-forms)
- [Documentación oficial de Template Driven Forms](https://angular.dev/guide/forms/template-driven-forms)
- [Angular Validators API](https://angular.dev/api/forms/Validators)
- [Custom Form Validators en Angular](https://angular.dev/guide/forms/form-validation)
- [Typed Forms en Angular 14+](https://angular.dev/guide/forms/typed-forms)
- [Signal Forms RFC en GitHub de Angular](https://github.com/angular/angular/discussions/49681)
