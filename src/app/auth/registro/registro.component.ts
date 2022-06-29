import { Component, OnInit } from '@angular/core';
import { ValidacionesService } from '../../share/services/validaciones.service';
import { EmailValidatorService } from '../../share/services/email-validator.service';
import { FormGroup, FormBuilder, Validators, FormControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styles: [],
})
export class RegistroComponent implements OnInit {
  miFormulario: FormGroup = this.fb.group(
    {
      nombre: [
        '',
        [Validators.required, Validators.pattern(this.validacionService.patronNombre)],
        ,
      ],
      email: [
        '',
        [Validators.required, Validators.pattern(this.validacionService.patronEmail)],
        [this.emailValidator],
      ],
      username: ['', [Validators.required, this.validacionService.noPuedeSerStrider]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', [Validators.required]],
    },
    {
      validators: [this.validacionService.camposIguales('password', 'password2')],
    }
  );

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

  constructor(
    private fb: FormBuilder,
    private validacionService: ValidacionesService,
    private emailValidator: EmailValidatorService
  ) {}

  ngOnInit(): void {
    this.miFormulario.reset({
      nombre: 'Santos Martinez',
      email: 'test1@test.com',
      username: 'santetes',
      password: '123456',
      password2: '123456',
    });
  }

  campoNoValido(campo: string) {
    return this.miFormulario.get(campo)?.invalid && this.miFormulario.get(campo)?.touched;
  }

  submitForm() {
    console.log(this.miFormulario.value);
    this.miFormulario.markAllAsTouched();
  }
}
