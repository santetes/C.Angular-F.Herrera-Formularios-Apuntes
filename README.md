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

  - Si observamos el codigo superior, podemos observar que el objeto que se itera es `favoritosArr`. Este objeto se crea mediante un `get` en el controlador para facilitira el acceso e iteración del array:
    ```javascript
    get favoritosArr() {
    return this.miFormulario.get('favoritos') as FormArray;
    }
    ```
