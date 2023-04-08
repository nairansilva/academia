import { UsuarioTreinosFormComponent } from './usuario-treinos-form/usuario-treinos-form.component';
import { UsuarioTreinosComponent } from './usuario-treinos/usuario-treinos.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: ':idUsuario',
    component: UsuarioTreinosComponent,
  },
  { path: ':idUsuario/form', component: UsuarioTreinosFormComponent },
  { path: ':idUsuario/form/:idTreino', component: UsuarioTreinosFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuarioTreinosRoutingModule {}
