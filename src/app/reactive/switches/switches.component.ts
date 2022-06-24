import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-switches',
  templateUrl: './switches.component.html',
  styles: [],
})
export class SwitchesComponent implements OnInit {
  miFormulario: FormGroup = this.fb.group({
    genero: [, Validators.required],
    notificaciones: [true],
    condiciones: [false, Validators.requiredTrue],
  });

  persona = {
    genero: '',
    notificaciones: true,
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.miFormulario.reset({
      genero: this.persona.genero,
      notificaciones: this.persona.notificaciones,
    });
  }

  guardar() {
    this.persona.genero = this.miFormulario.controls['genero'].value;
    this.persona.notificaciones = this.miFormulario.controls['notificaciones'].value;
    console.log(this.persona);
  }
}
