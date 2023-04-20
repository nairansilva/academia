import { UsuarioTreinosFormComponent } from './usuario-treinos-form/usuario-treinos-form.component';
import { UsuarioTreinosCardComponent } from './usuario-treinos-card/usuario-treinos-card.component';
import { UsuarioTreinosComponent } from './usuario-treinos/usuario-treinos.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { UsuarioTreinosRoutingModule } from './usuario-treinos-routing.module';
import { UsuarioTreinosExerciciosComponent } from './usuario-treinos-exercicios/usuario-treinos-exercicios.component';
import { UsuarioTreinosExerciciosFormComponent } from './usuario-treinos-exercicios-form/usuario-treinos-exercicios-form.component';
import { UsuarioTreinosExerciciosCardComponent } from './usuario-treinos-exercicios-card/usuario-treinos-exercicios-card.component';

@NgModule({
  declarations: [
    UsuarioTreinosComponent,
    UsuarioTreinosCardComponent,
    UsuarioTreinosFormComponent,
    UsuarioTreinosExerciciosFormComponent,
    UsuarioTreinosExerciciosComponent,
    UsuarioTreinosExerciciosCardComponent
  ],
  imports: [CommonModule, SharedModule, UsuarioTreinosRoutingModule],
})
export class UsuarioTreinosModule {}
