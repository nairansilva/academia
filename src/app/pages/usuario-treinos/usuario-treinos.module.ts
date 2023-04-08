import { UsuarioTreinosFormComponent } from './usuario-treinos-form/usuario-treinos-form.component';
import { UsuarioTreinosCardComponent } from './usuario-treinos-card/usuario-treinos-card.component';
import { UsuarioTreinosComponent } from './usuario-treinos/usuario-treinos.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { UsuarioTreinosRoutingModule } from './usuario-treinos-routing.module';

@NgModule({
  declarations: [
    UsuarioTreinosComponent,
    UsuarioTreinosCardComponent,
    UsuarioTreinosFormComponent,
  ],
  imports: [CommonModule, SharedModule, UsuarioTreinosRoutingModule],
})
export class UsuarioTreinosModule {}
