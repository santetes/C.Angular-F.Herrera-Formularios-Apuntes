# FORMULARIOS

---

Existen dos tipos de enfoque a la hora de crear formularios; enfoque por template (**Template Driven**) y enfoque por controlador (**Reactive Driven**).

La diferencia entre uno y otro se encuentra en que el enfoque por template carga la lógica de su funcionamiento en el archivo **.HTML**, mientras que el enfoque por controlador lo hace en el archivo **.ts**

## Template Driven

Template Driven nos permite manejar formularios sencillos, donde podremos tener acceso a los campos y configurarles validaciones sencillas(Se pueden realizar otras más complejas, pero no es la naturaleza de este formulario)

- Importamos el FormsModules en el módulo donde se encuentre nuestro componente
  ```javascript
  import { FormsModule } from "@angular/forms";
  ```
  En el momento que importamos el módulo, angular ya toma el control del formulario. Esto evita que se realice un "envío" cuando se haga click en el botón _submit_
- Creamos la directiva ngSubmit en el formulario para ejecutar el método correspondiente para postear el formulario
  ```html
  <form (ngSubmit)="guardar()"></form>
  ```
- Asignamos un nombre al formulario y lo enlazamos con ngForm.  
  Tambien Podemos enviarlo en el evento al hacer submit para tener acceso a todo el formulario desde la parte del controlador
  ```html
  <form (ngSubmit)="guardar(miFormulario)" #miFormulario="ngForm"></form>
  ```
- Ahora, para poder acceder a cada campo del formulario tenemos que indicar en el campo input la directiva ngModel y un nombre para este campo de la siguiente manera:

  ```html
  <input type="text" ngModel name="nombreCampo" />
  ```

- Para poder ver ese campo (junto con el resto de los campos del formulario si se han configurado correctamente). Sólo tendremos que imprimirlo por consola de la siguiente manera
  ```javascript
  guardar(miFormulario: NgForm){
      console.log(miFormulario.value)
  }
  ```
- Tambien podremos ver el estado del formulario desde el própio html de la siguiente forma:
  ```html
  <span>valid</span>
  <pre>{{ miFormulario.valid }}</pre>
  <span>valores</span>
  <pre>{{ miFormulario.value }}</pre>
  ```

### Validaciones

Las validaciones, como se ha comentado anteriormente, son bastante sencillas en este tipo de formularios.
Podemos Indicar si un imput es requerido, tiene que tener un valor máximo o mínimo y poco más.  
Se pueden ejecutar validaciones mas complejas pero no es el cometido de este tipo de formularios

```html
<input type="number" required min="10" />
<br />
<input type="text" required minLenght="3" />
```

Podemos utilizar mensajes de error para mostrar indicaciones de fallos en los campos

```html
<span
  *ngIf="miFormulario.controls.['nombre'].invalid && miFormulario.controls.['nombre'].touched"
  class="form-text text-danger"
  >Debe de ser de 3 letras</span
>
```

Se pueden crear directivas personalizadas para el manejo de errores en el formulario. En el [video del curso 239](https://www.udemy.com/course/angular-fernando-herrera/learn/lecture/24065188#questions) se puede ver un ejemplo de su creación. Más adelante se trabajaran las directivas personalizadas en profundidad

### ViewChild

- A la hora de manejar el formulario y poder "alijerar" la carga en el template, podemos enlazar el formulario a un atributo del controlador utilizando el decorador **ViewChild**

```javascript
@ViewChild('miFormulario') miFormulario!: NgForm
```

- Ahora ya podemos acceder al formulario, por ejemplo al guardar, sin la necesidad de que se mande implicitamente en el evento del submit

```javascript
guardar(){
    console.log(this.miFormulario.value)
}
```

- Entonces, el NgIf de la validación anterior se puede resumir mediante un método

```html
<span *ngIf="nombreValido()" class="form-text text-danger">Debe de ser de 3 letras</span>
```

```javascript
nombreValido(): boolean {
    return (
      this.miFormulario?.controls['producto']?.invalid &&
      this.miFormulario?.controls['producto']?.touched
    );
  }

```

### Reset de formulario y/o carga de valores por defecto en los inputs

Es posible establecer valores por defecto en el formulario, bien cuando pulsamos en el botón de guardar (submit), o bien simplemente a la carga del formulario.
Existen varias formas de hacer esto:

- Reseteando el formulario al pulsar guardar
  ```javascript
    guardar() {
    console.log('Posteo Correcto');
    this.miFormulario.resetForm();
    }
  ```
- Reseteo y carga de valores iniciales al guardar
  ```javascript
    guardar() {
    console.log('Posteo Correcto');
    this.miFormulario.resetForm({
      producto: 'valor inicial',
      precio: 0,
      existencias: 0
    });
    }
  ```
- Utilizando el ngModel en el Template
  - Creamos en controlador un objeto con los valores iniciales
    ```javascript
    valorInicial = {
      producto: "valor por defecto",
      precio: 0,
      existencias: 0,
    };
    ```
  - Indicamos en el template mediante [ngModel] el valor inicial
    ```html
    <input type="text" [ngModel]="valorInicial.producto" name="producto" />
    ```

### Input's dinámicos y switches

- Ejemplo de creación de inputs dinámicos en el [curso de angular 242](https://www.udemy.com/course/angular-fernando-herrera/learn/lecture/24066590#questions)
- Ejemplo de manejo de switches en el [curso de angular 245](https://www.udemy.com/course/angular-fernando-herrera/learn/lecture/24079036#questions)

---

## Formularios Reactivos

Este enfoque de formularios nos brindan una forma más robusta de creación y gestión de los formularios.

### FormGroup

- Importamos el Modulo **reactiveFormsModule** en el modulo correspondiente

  ```javascript
  import { ReactiveFormsModule } from "@angular/forms";
  ```

- Indicamos en el html, en la etiqueta form, que vamos a trabajar con formularios reactivos
  ```html
  <form (ngSubmit)="guardar()" autocomplete="off" [formGroup]="miFormulario"></form>
  ```
- Inyectamos el servicio **formBuilder** en el constructor. Este nos facilitará el trabajo de crear el formGroup

  ```javascript
  constructor(private fb: FormBuilder) {}
  ```

- Creamos el objeto _miFormulario_ de la siguiente manera:
  ```javascript
  miFormulario: FormGroup = this.fb.group({
    nombre: ["", [Validators.required, Validators.minLength(3)]],
    precio: [, [Validators.required, Validators.min(0)]],
    existencias: [0, [Validators.required, Validators.min(0)]],
  });
  ```
  - Si observamos la estructura de cada **FormControl**, se puede observar la siguiente configuración:
    - Primer espacio está reservado para el **valor por defecto**.
    - Segundo espacio se reserva para las validacioines **síncronas**. Si existen varias, estas iran dentro del un array
    - El tercer espacio se utilizará para las validaciones **asíncronas**
- Luego en cada Input del formulario tenemos que relacionarlo con su **formControl** correspondiente mediante la directiva **formControlName**

  ```html
  <input
    type="number"
    formControlName="precio"
    class="form-control"
    placeholder="Precio del producto"
  />
  ```

- A la hora de realizar validaciones, la clase **Validator** nos proporciona muchos métodos para poder efectuarlas:

  ```javascript
  class Validators {
  static min(min: number): ValidatorFn
  static max(max: number): ValidatorFn
  static required(control: AbstractControl<any, any>): ValidationErrors | null
  static requiredTrue(control: AbstractControl<any, any>): ValidationErrors | null
  static email(control: AbstractControl<any, any>): ValidationErrors | null
  static minLength(minLength: number): ValidatorFn
  static maxLength(maxLength: number): ValidatorFn
  static pattern(pattern: string | RegExp): ValidatorFn
  static nullValidator(control: AbstractControl<any, any>): ValidationErrors | null
  static compose(validators: ValidatorFn[]): ValidatorFn | null
  static composeAsync(validators: AsyncValidatorFn[]): AsyncValidatorFn | null
  }
  ```

- Para Crear una etiqueta Html que muestre un mensaje de error si en el campo (FormControl) existe algún error, se puede hacer de la siguiente manera:

  ```html
  <span *ngIf="campoEsValido('nombre')" class="form-text text-danger"
    >Debe de ser mayor de 3 letras</span
  >
  ```

  Y en la parte del javascript, creamos el método que realiza esta comprobación el cual devolverá `true` si el formControl tiene algún error

  ```javascript
  campoEsValido(campo: string) {
  return this.miFormulario.controls[campo].errors && this.miFormulario.controls[campo].touched;
  }
  ```

### Tips

- `miFormulario.value` nos mostrará un objeto con todos los campos del formulario y su valor actual
- Según la documentación de Angular, el sítio adecuado para crear el FormGroup es al inicio de la clase que lo implemente, por encima del contructor.

- El mecanismo normal de los formularios web, es que sin la necesidad de tocar ningún input, si clickamos directamente en _submit_, nos tiene que mostrar los erroes propios de cada campo. Para esto hay un sencillo tip que habilita este comportamiento

  ```javascript
    guardar() {
    if (this.miFormulario.invalid) {
      this.miFormulario.markAllAsTouched();
      return;
    }

    console.log(this.miFormulario.value);
    this.miFormulario.reset();
  }

  ```

- Tambien es conveniente la utilización de `miFormulario.reset()` en lugar de `miFormulario.set()` si queremos cargar valores en el formulario. Se haría de la siguiente manera:
  ```javascript
  this.miFormulario.reset({
      nombre: 'nombre por defecto',
      precio: 0,
      existencias: 0
    });
  }
  ```
  La ventanja de hacerlo de este modo respecto al de `set()`, es que `set()` obliga a pasarle todos los atributos del objeto mientras que `reset()` no.

### FormArray

- Dentro de un **FormGroup**, puede haber un **FormArray**. Esto no es mas que un array de **FormGroup**'s

```javascript
miFormulario: FormGroup = this.fb.group({
  nombre: [, [Validators.required, Validators.minLength(3)]],
  favoritos: this.fb.array(
    [
      ["MetalGear", Validators.minLength(3)],
      ["CrashBandiCot", Validators.minLength(3)],
    ],
    Validators.required
  ),
});
```

- Luego en el Html, debemos indicar que bloque es el que va a contener la información de este formArray mediante `formArrayName="favoritos"` y luego dentro de este el bloque que se va a repetir de la siguiente manera:

  ```html
  <div class="col-sm-9" formArrayName="favoritos">
    <div *ngFor="let favorito of favoritosArr.controls; let i = index" class="input-group mb-1">
      <input [formControlName]="i" type="text" class="form-control" />
      <button type="button" (click)="eliminar(i)" class="btn btn-outline-danger">Eliminar</button>
    </div>
  </div>
  ```

  - Si observamos el codigo superior, podemos observar que el objeto que se itera es `favoritosArr`. Este objeto se crea mediante un `getter` en el controlador para facilitira el acceso e iteración del array:
    ```javascript
    get favoritosArr() {
    return this.miFormulario.get('favoritos') as FormArray;
    }
    ```

### Agregar/Eliminar un nuevo FormControl a un FormArray

- En este punto se mostrará como agregar el contenido de un input (FormControl) a un FormArray.
- Para ello tenemos que tener en nuestro controlador un objeto formControl

  ```javascript
  nuevoFavorito: FormControl = this.fb.control("", Validators.required);
  ```

- A continuación tenemos que tener en nuestro html un input referenciado a este FormControl
  ```html
  <input
    type="text"
    [formControl]="nuevoFavorito"
    class="form-control"
    (keyup.enter)="agregarFavorito()"
    placeholder="Agregar favorito"
  />
  ```
- Luego deberemos tener un método en el controlador que realice la inserción

  ```javascript
  agregarFavorito() {
    if (this.nuevoFavorito.invalid) {
      return;
    }
    this.favoritosArr.push(this.fb.control(this.nuevoFavorito.value, [Validators.required]));

    this.nuevoFavorito.reset();
  }
  ```

  - Si se observa el código anterior, se puede ver que no se incluye el própio "nuevoFavorito", sino que se inserta un nuevo FormControl con los datos del nuevoFavorito. Esto es porque sino lo hacemos así, el nuevoFavorito, al **pasarlo por referencia**, si se modifica tambien lo hará el que se encuentre dentro del array

- Los FormArray disponen de un metodo `removeAt(index)` que nos permiten eliminiar FormControls de los FormArray
  ```javascript
  eliminar(indice: number) {
    this.favoritosArr.removeAt(indice);
  }
  ```

### Manejo de switches

- Creamos en la parte del controlador el formulario con los switchs implicados.

  - **Genero** será de tipo **radio**.
  - **Notificaciones** será de tipo **switch**
  - **condiciones** será de tipo **check**

  ```javascript
  miFormulario: FormGroup = this.fb.group({
    genero: ["M", Validators.required],
    notificaciones: [true],
    condiciones: [false, Validators.requiredTrue],
  });
  ```

- Luego en el Html configuraremos los imputs con su **FormControlName** correspondiente
  - Hay que observar que los **radioButton** de genero tienen los dos el mismo **FormControlName** para que **angular** detecte que pertenecen al mismo grupo y permita la selección de uno u otro.
  - En el ejemplo utilizado se ha hecho uso de **Bootstrap** con su configuración y clases. Hay que tener la precaución de sustituir `name` por `FormControlName`
- **Tip:** Observemos el **validator de condiciones**. Este está puesto en **requiredTrue**. Esto quiere decir que no es que tenga que tener obligatoriamente un valor, sino que este tiene que ser **true**.

### Manejo de errores y estados en Formulario y en FormControl

- A la hora de ver que es lo que está ocurriendo en el formulario, Angular nos brinda una serie propiedades para comprobar su estado.
- Revisar la [documentación de Angular](https://angular.io/api/forms/AbstractControl) para ver toda la información. Un ejemplo de propiedades más usadas son: `valid, invalid, pristine, touched`
- Luego, además podemos ver los errores que existen tanto a nivel de formulario completo como a niver de formControl en concreto

  ```javascript
  miFormulario.errors;
  miFormulario.controls["condiciones"]?.errors;
  ```

---

## Validaciones Formularios Reactivos - Síncronas

### Validaciones contra expresiones regulares

- Validators dispone de un método llamado `Validators.pattern(patronNombre)`
- Para el caso que nos ocupa (nombre espacio y apellido) con este patrón es suficiente:
  ` public patronNombre: string = '([a-zA-Z]+) ([a-zA-Z]+)'`
- Tambien podemos validar un **email** con el siguiente patrón:
  `public patronEmail: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';`

### Validaciones personalizadas

#### Validación a nivel de FormControl

- En lugar de `Validators.validacion`, se puede pasar una función personalizada para hacer la comprobación.
- Hay que mandar la referencia a la función (sin paréntesis)
  `username: ['', [Validators.required, this.validacionService.noPuedeSerStrider]],`
  - Observemos tambien que en este ejemplo se ha creado un **validationService** para centralizar todas la validaciones
- Lo que hace angular es mandar el própio **FormControl** a la función y a partir de ahí podemos hacer la validación que queramos utilizando el propio **value** del FormControl
  ```javascript
  noPuedeSerStrider(control: FormControl): ValidationErrors | null {
      const value: string = control.value?.trim().toLowerCase();
      if (value === 'strider') {
        return {
          noStrider: true,
        };
      } else {
        return null;
      }
    }
  ```
- Hay que observar que la validación personalizada devuelve o u **validationError** o **null**
- ValidationErrorn no es mas que un **objeto de tipo clave-valor**

#### Validaciones a nivel de Formulario

- Este tipo de validaciones son a nivel de formulario completo. Uno de sus usos puede ser validar un campo en relación a otro. Por ejemplo a la hora de validar que dos contraseñas sean iguales.
- Para ello, en el objeto **miFormulario**, a la hora de crearlo utilizando el **FormBuilder** hay que pasar la validación como objeto **opciones** a continuación del objeto con los **formControls**:
  ```javascript
  miFormulario: FormGroup = this.fb.group(
    {
      password: ["", [Validators.required, Validators.minLenght(6)]],
      password2: ["", Validators.required],
    },
    {
      validators: [this.validacionService.camposIguales("password", "password2")],
    }
  );
  ```
- Observemos que una furnción validadora se le pasa como referencia y en este caso le estamos pasando argumentos a la función. Esto lo veremos mejor en el siguiente bloque de código. Ahí se puede observar que **esta función devuelve otra función** la cual recibirá como argumento el **Formulario completo** (AbstractControl) y devolverá a su vez un `validatioError` o `null`

  ```javascript
  camposIguales(campo1: string, campo2: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      let pass1 = formGroup.get(campo1)?.value;
      let pass2 = formGroup.get(campo2)?.value;

      if (pass1 === pass2) {
        formGroup.get(campo2)?.setErrors(null);
        return null;
      } else {
        formGroup.get(campo2)?.setErrors({
          sonIguales: false,
        });
        return { sonIguales: false };
      }
    };
  }
  ```

- También podemos ver que en el código de arriba se está estableciendo error tanto a nivel de formulario completo como a nivel del campo del password2 en el caso de que no sean iguales `formGroup.get(campo2)?.setErrors({ sonIguales: false, });`

## Validaciones Formularios Reactivos - Asíncronas

- Es una validación normal y corriente pero en lugar de devolver un valor directamente, devuelve un observable o una promesa
- En el caso de que esa validación asíncrona tenga que hacer uso de una petición http contra un backend, la cosa se complica algo. Pero básicamente seria crear un servicio para que a este se le inyecte el HttpClient y este servicio es el que realizará la validación (**Importante** acordarse de inyectar `import { HttpClientModule } from '@angular/common/http';` en el módulo principal)

  ```javascript
  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
  import { delay, map, Observable } from 'rxjs';

  @Injectable({
    providedIn: 'root',
  })
  export class EmailValidatorService implements AsyncValidator {
    constructor(private http: HttpClient) {}
    validate(control: AbstractControl<any, any>): Observable<ValidationErrors | null> {
      const email = control.value;
      console.log(email);
      return this.http.get<any[]>(`http://localhost:3000/usuarios?q=${email}`).pipe(
        map((resp) => {
          return resp.length === 0 ? null : { emailTomado: true };
        }),
        delay(1000)
      );
    }
  }
  ```

#### Estado del formulario

- A la hora de realizar validaciones asíncronas, angular nos proporciona una característica para ver el estatus del formulario. Esto se consigue mediante `miFormulario.status`.
- Sus estados serán **VALID, INVALID, PENDING**

#### Errores Personalizados

- En los casos de que puedan suceder vários errores distintos en un mismo input, se puede gestionar el mensaje de error que aparecerá. Para ello a la hora de mostrar el mensaje si el formControl tiene algún error, lo que hay que hacer es vincular ese mensaje de error a un getter que nos maneje esa información

  ```javascript
  get emailErrorMsg(): string {
    const error = this.miFormulario.get('email')?.errors;
    if (error?.['required']) {
      return 'el email es obligatorio';
    } else if (error?.['pattern']) {
      return 'el email no tiene el formato correcto';
    } else if (error?.['emailTomado']) {
      return 'el correo seleccionado ya se encuentra en uso';
    }

    return '';
  }
  ```
