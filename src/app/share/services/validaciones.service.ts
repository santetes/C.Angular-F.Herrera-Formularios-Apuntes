import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidacionesService {
  public patronNombre: string = '([a-zA-Z]+) ([a-zA-Z]+)';
  public patronEmail: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

  constructor() {}

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
}
