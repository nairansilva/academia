import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuarioAvaliacaoComponent } from './usuarios-avaliacao/usuario-avaliacao.component';
import { UsuarioAvaliacaoFormComponent } from './usuario-avaliacao-form/usuario-avaliacao-form.component';

const routes: Routes = [
  {
    path: '',
    component: UsuarioAvaliacaoComponent,
  },
  { path: ':idUsuario/form', component: UsuarioAvaliacaoFormComponent },
  { path: ':idUsuario/form/:id', component: UsuarioAvaliacaoFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuarioAvaliacaoRoutingModule {}
