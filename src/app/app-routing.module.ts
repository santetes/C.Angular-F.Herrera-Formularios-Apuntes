import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplateModule } from './template/template.module';
import { ReactiveModule } from './reactive/reactive.module';

const routes: Routes = [
  {
    path: 'template',
    loadChildren: () =>
      import('../app/template/template.module').then((m) => m.TemplateModule),
  },
  {
    path: 'reactive',
    loadChildren: () =>
      import('../app/reactive/reactive.module').then((m) => m.ReactiveModule),
  },
  {
    path: '**',
    redirectTo: 'template',
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
