import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

interface Persona {
  nombre: string;
  favoritos: Favorito[];
}

interface Favorito {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-dinamicos',
  templateUrl: './dinamicos.component.html',
  styles: [],
})
export class DinamicosComponent implements OnInit {
  @ViewChild('miFormulario') miFormulario!: NgForm;

  persona: Persona = {
    nombre: 'santos',
    favoritos: [
      {
        id: 1,
        nombre: 'metal gear',
      },
      {
        id: 2,
        nombre: 'soul skalibur',
      },
    ],
  };

  constructor() {}

  ngOnInit(): void {}

  guardar() {
    console.log(this.miFormulario);
  }

  compruebaNombre(): boolean {
    return (
      this.miFormulario?.controls['nombre']?.touched &&
      this.miFormulario?.controls['nombre']?.status === 'INVALID'
    );
  }

  agregar(): void {
    let favorito: Favorito = {
      id: this.persona.favoritos.length + 1,
      nombre: this.miFormulario?.controls['agregar']?.value,
    };
    this.miFormulario.controls['agregar'].reset();

    this.persona.favoritos.push(favorito);
  }

  eliminar(id: number) {
    this.persona.favoritos.splice(id, 1);
  }
}
