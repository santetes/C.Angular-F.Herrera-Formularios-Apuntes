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
