import { UsuarioTreinosExerciciosFormComponent } from './usuario-treinos-exercicios-form/usuario-treinos-exercicios-form.component';
import { UsuarioTreinosExerciciosCardComponent } from './usuario-treinos-exercicios-card/usuario-treinos-exercicios-card.component';
import { UsuarioTreinosExerciciosComponent } from './usuario-treinos-exercicios/usuario-treinos-exercicios.component';
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
  { path: ':idUsuario/form/:idTreino/exercicios', component: UsuarioTreinosExerciciosComponent },
  { path: ':idUsuario/form/:idTreino/exercicio/list', component: UsuarioTreinosExerciciosCardComponent },
  { path: ':idUsuario/form/:idTreino/exercicio/list/form', component: UsuarioTreinosExerciciosFormComponent },
  { path: ':idUsuario/form/:idTreino/exercicio/list/form/:id', component: UsuarioTreinosExerciciosFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuarioTreinosRoutingModule {}
