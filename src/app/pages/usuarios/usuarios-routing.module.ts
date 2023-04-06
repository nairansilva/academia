import { UsuariosFormComponent } from './usuarios-form/usuarios-form.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: UsuariosComponent,
  },
  { path: 'form', component: UsuariosFormComponent },
  { path: 'form/:id', component: UsuariosFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuariosRoutingModule {}
