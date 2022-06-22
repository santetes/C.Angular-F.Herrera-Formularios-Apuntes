import { Component } from '@angular/core';

interface Menu {
  texto: string;
  ruta: string;
}

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styles: [
    `
      li {
        cursor: pointer;
      }
      li:hover {
        background-color: #0d6efd;
      }
    `,
  ],
})
export class SidemenuComponent {
  templateMenu: Menu[] = [
    {
      texto: 'Básico',
      ruta: 'template/basicos',
    },
    {
      texto: 'Dinámicos',
      ruta: 'template/dinamicos',
    },
    {
      texto: 'Switches',
      ruta: 'template/switches',
    },
  ];
  reactiveMenu: Menu[] = [
    {
      texto: 'Básico',
      ruta: 'reactive/basicos',
    },
    {
      texto: 'Dinámicos',
      ruta: 'reactive/dinamicos',
    },
    {
      texto: 'Switches',
      ruta: 'reactive/switches',
    },
  ];

  authMenu: Menu[] = [
    {
      texto: 'Registro',
      ruta: 'auth/registro',
    },
    {
      texto: 'Login',
      ruta: 'auth/login',
    },
  ];

  constructor() {}
}
