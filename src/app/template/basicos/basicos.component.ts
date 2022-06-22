import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-basicos',
  templateUrl: './basicos.component.html',
  styles: [
    `
      pre {
        color: #0d6efd;
      }
    `,
  ],
})
export class BasicosComponent implements OnInit {
  @ViewChild('miFormulario') miFormulario!: NgForm;

  valorInicial = {
    producto: 'valor por defecto',
    precio: 0,
    existencias: 0,
  };

  constructor() {}

  ngOnInit(): void {}

  guardar() {
    console.log('Posteo Correcto');
    this.miFormulario.resetForm();
  }

  compruebaForm(): boolean {
    return this.miFormulario?.form.status === 'INVALID';
  }

  nombreValido(): boolean {
    return (
      this.miFormulario?.controls['producto']?.invalid &&
      this.miFormulario?.controls['producto']?.touched
    );
  }

  precioValido(): boolean {
    // console.log(this.miFormulario?.controls['precio']?.value>0);

    return (
      this.miFormulario?.controls['precio']?.value <= 0 &&
      this.miFormulario?.controls['precio']?.touched
    );
  }
}
